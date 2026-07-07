import { escapeHtml } from "@/emails/escape-html"

interface NewBookingOwnerEmailProps {
  customerName: string
  customerEmail: string
  stylistName: string
  serviceNames: string[]
  bookingDate: string
  bookingTime: string
}

export function newBookingOwnerEmailHtml({
  customerName,
  customerEmail,
  stylistName,
  serviceNames,
  bookingDate,
  bookingTime,
}: NewBookingOwnerEmailProps) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>New Booking Request</h2>
      <p>A new appointment has been requested and is pending your review.</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 4px 0; color: #666;">Customer</td><td>${escapeHtml(customerName)} (${escapeHtml(customerEmail)})</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Stylist</td><td>${escapeHtml(stylistName)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Services</td><td>${escapeHtml(serviceNames.join(", "))}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Date</td><td>${escapeHtml(bookingDate)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Time</td><td>${escapeHtml(bookingTime)}</td></tr>
      </table>
      <p>Log in to the dashboard to confirm or cancel this booking.</p>
    </div>
  `
}
