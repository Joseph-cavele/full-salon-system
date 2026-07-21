// The salon operates on a single local calendar (South Africa / SAST by
// default). Bookings store their date as a plain "YYYY-MM-DD" string taken from
// the customer's local <input type="date">, so "today" must be resolved in that
// same local timezone — not UTC. On a UTC server (or in the early-morning local
// hours) `new Date().toISOString()` rolls over a day too early/late and makes
// the dashboard's "today's appointments" count wrong.
const SALON_TIMEZONE = process.env.SALON_TIMEZONE || "Africa/Johannesburg"

/** Today's date in the salon's timezone as a "YYYY-MM-DD" string. */
export function salonToday(): string {
  // en-CA formats as YYYY-MM-DD, which matches how bookingDate is stored.
  return new Intl.DateTimeFormat("en-CA", { timeZone: SALON_TIMEZONE }).format(
    new Date()
  )
}
