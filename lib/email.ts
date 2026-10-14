import { resend } from "@/lib/resend"

/** Sender for all transactional mail. EMAIL_FROM wins; RESEND_FROM_EMAIL is the older name. */
export function emailFrom() {
  return process.env.EMAIL_FROM ?? process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"
}

/**
 * Sends one email through Resend. Returns whether it was accepted.
 *
 * Never throws and never returns provider details: callers decide what (if
 * anything) the user hears, and the provider's error goes to the server log
 * only. `context` labels that log line — keep it free of secrets and codes.
 */
export async function sendEmail(
  message: { to: string; subject: string; html: string },
  context: string
): Promise<boolean> {
  if (!resend) {
    console.error(`[email] ${context}: RESEND_API_KEY is not set`)
    return false
  }

  try {
    const { error } = await resend.emails.send({ from: emailFrom(), ...message })
    // Resend reports rejections on the result rather than throwing.
    if (error) {
      console.error(`[email] ${context}: rejected by Resend —`, error.name, error.message)
      return false
    }
    return true
  } catch (err) {
    console.error(`[email] ${context}: send failed —`, err instanceof Error ? err.message : err)
    return false
  }
}
