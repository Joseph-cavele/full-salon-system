import { after, NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { clientIp, hitAll } from "@/lib/rate-limit"
import { requestCodeSchema } from "@/features/auth/schema"
import {
  REQUEST_CODE_LIMITS,
  discardLoginCode,
  findActiveOwner,
  issueLoginCode,
  normalizeEmail,
} from "@/features/auth/server/login-code"
import { loginCodeEmailHtml } from "@/emails/login-code"

/**
 * Step one of sign-in: email a 6-digit code to the owner.
 *
 * The response is the same — same body, and returned before any account
 * lookup — whether or not the address belongs to an active owner, so neither
 * the answer nor its timing tells a caller who has an account. The lookup,
 * code and email all happen in `after()`, once the response has gone.
 *
 * Step two (checking the code) is the credentials provider in auth.ts.
 */
export async function POST(req: NextRequest) {
  const parsed = requestCodeSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  const email = normalizeEmail(parsed.data.email)

  // Counted for every address, registered or not, so a 429 reveals nothing.
  const allowed = await hitAll([
    [REQUEST_CODE_LIMITS.email, email],
    [REQUEST_CODE_LIMITS.ip, clientIp(req.headers)],
  ])
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 }
    )
  }

  after(async () => {
    try {
      await connectDB()
      const owner = await findActiveOwner(email)
      if (!owner) return

      const code = await issueLoginCode(owner.email)
      // Sent under a minute ago — that code is still valid.
      if (!code) return

      const sent = await sendEmail(
        {
          to: owner.email,
          subject: "Your salon login code",
          html: loginCodeEmailHtml({ name: owner.name, code }),
        },
        "sign-in code"
      )
      // Drop an undelivered code so the cooldown doesn't block a retry.
      if (!sent) await discardLoginCode(owner.email)
    } catch (err) {
      console.error("[login-code] failed:", err instanceof Error ? err.message : err)
    }
  })

  return NextResponse.json({ ok: true })
}
