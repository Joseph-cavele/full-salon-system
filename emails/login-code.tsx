import { escapeHtml } from "@/emails/escape-html"

interface LoginCodeEmailProps {
  name: string
  code: string
}

export function loginCodeEmailHtml({ name, code }: LoginCodeEmailProps) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #222;">
      <p style="margin: 0; color: #be185d; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Patrick Dreadlocks &amp; Beauty</p>
      <h2 style="margin: 8px 0 16px;">Salon login</h2>
      <p>Hi ${escapeHtml(name)}, here is your verification code for the salon dashboard:</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0; font-family: monospace;">${escapeHtml(code)}</p>
      <p>This code expires in <strong>10 minutes</strong> and can only be used once.</p>
      <p style="color: #666; font-size: 13px;">If you didn't try to sign in, you can safely ignore this email — no one can access your account without this code.</p>
    </div>
  `
}
