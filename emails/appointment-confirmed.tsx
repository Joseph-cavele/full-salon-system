import { escapeHtml } from "@/emails/escape-html"

interface AppointmentConfirmedEmailProps {
  customerName: string
  stylistName: string
  serviceNames: string[]
  bookingDate: string
  bookingTime: string
}

export function appointmentConfirmedEmailHtml({
  customerName,
  stylistName,
  serviceNames,
  bookingDate,
  bookingTime,
}: AppointmentConfirmedEmailProps) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>You've successfully booked your appointment 🎉</h2>
      <p>Hi ${escapeHtml(customerName)}, great news — your booking is confirmed. Here are the details:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 4px 0; color: #666;">Services</td><td>${escapeHtml(serviceNames.join(", "))}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Stylist</td><td>${escapeHtml(stylistName)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Date</td><td>${escapeHtml(bookingDate)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Time</td><td>${escapeHtml(bookingTime)}</td></tr>
      </table>
      <p>We look forward to seeing you!</p>
    </div>
  `
}
