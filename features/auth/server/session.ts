import { cache } from "react"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/db"
import { UserModel } from "@/lib/models/User"
import type { OwnerAccount } from "@/features/auth/server/login-code"

/**
 * Data Access Layer for the owner session — the one place that decides
 * whether a request may touch private salon data.
 *
 * A valid session cookie isn't enough on its own: the account is re-read so
 * a disabled (or deleted) owner loses access straight away, not when the
 * 12-hour token runs out. Memoized with React `cache`, so a page and the
 * layout around it share one database read per request.
 *
 * proxy.ts redirects signed-out visitors early, but it is a convenience, not
 * the protection — every page, route handler and server action that serves
 * private data must call one of the guards below.
 */
export const getOwner = cache(async (): Promise<OwnerAccount | null> => {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "owner") return null

  await connectDB()
  const user = await UserModel.findOne({
    _id: session.user.id,
    role: "owner",
    status: { $ne: "disabled" },
  }).lean<{ _id: unknown; name: string; email: string }>()

  return user ? { id: String(user._id), name: user.name, email: user.email } : null
})

/** For pages and server actions: the owner, or a redirect to /login. */
export async function requireOwner(): Promise<OwnerAccount> {
  const owner = await getOwner()
  if (!owner) redirect("/login")
  return owner
}

/**
 * For route handlers: a 401 response to return, or null to carry on.
 *
 *   const denied = await denyUnlessOwner()
 *   if (denied) return denied
 */
export async function denyUnlessOwner(): Promise<NextResponse | null> {
  const owner = await getOwner()
  return owner ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
