import { escapeHtml } from "@/emails/escape-html"
import { formatCurrency } from "@/lib/currency"

interface NewBookingOwnerEmailProps {
  customerName: string
  customerEmail: string
  stylistName: string
  serviceNames: string[]
  bookingDate: string
  bookingTime: string
  /**
   * Set for bookings that arrived already paid through Paystack. It switches
   * the copy as well as adding the amount row: an online booking is settled
   * and confirmed, so telling the owner it is "pending your review" and
   * inviting them to "confirm or cancel" would describe a decision they do
   * not actually have.
   */
  paidAmount?: number
}

export function newBookingOwnerEmailHtml({
  customerName,
  customerEmail,
  stylistName,
  serviceNames,
  bookingDate,
  bookingTime,
  paidAmount,
}: NewBookingOwnerEmailProps) {
  const isPaid = typeof paidAmount === "number"

  const row = (label: string, value: string) =>
    `<tr><td style="padding: 4px 0; color: #666;">${label}</td><td>${value}</td></tr>`

  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>${isPaid ? "New Booking — Paid Online" : "New Booking Request"}</h2>
      <p>${
        isPaid
          ? "A new appointment has been paid for online and is already confirmed."
          : "A new appointment has been requested and is pending your review."
      }</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${row("Customer", `${escapeHtml(customerName)} (${escapeHtml(customerEmail)})`)}
        ${row("Stylist", escapeHtml(stylistName))}
        ${row("Services", escapeHtml(serviceNames.join(", ")))}
        ${row("Date", escapeHtml(bookingDate))}
        ${row("Time", escapeHtml(bookingTime))}
        ${isPaid ? row("Paid", escapeHtml(formatCurrency(paidAmount))) : ""}
      </table>
      <p>${
        isPaid
          ? "The slot is confirmed and the money has cleared. Log in to the dashboard to view it."
          : "Log in to the dashboard to confirm or cancel this booking."
      }</p>
    </div>
  `
}
