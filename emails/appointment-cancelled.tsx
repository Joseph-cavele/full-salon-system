import { escapeHtml } from "@/emails/escape-html"

interface AppointmentCancelledEmailProps {
  customerName: string
  stylistName: string
  serviceNames: string[]
  bookingDate: string
  bookingTime: string
  reason?: string
}

export function appointmentCancelledEmailHtml({
  customerName,
  stylistName,
  serviceNames,
  bookingDate,
  bookingTime,
  reason,
}: AppointmentCancelledEmailProps) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Your appointment has been cancelled</h2>
      <p>Hi ${escapeHtml(customerName)}, your appointment has been cancelled. Here were the details:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 4px 0; color: #666;">Services</td><td>${escapeHtml(serviceNames.join(", "))}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Stylist</td><td>${escapeHtml(stylistName)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Date</td><td>${escapeHtml(bookingDate)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Time</td><td>${escapeHtml(bookingTime)}</td></tr>
      </table>
      ${reason ? `<p><strong>Reason:</strong> ${escapeHtml(reason)}</p>` : ""}
      <p>Please contact us if you'd like to book a new appointment.</p>
    </div>
  `
}
