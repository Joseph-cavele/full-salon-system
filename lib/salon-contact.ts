/* ══════════════════════════════════════════════════════════════════════
   PLACEHOLDER CONTACT DETAILS — one copy, shared by every public page.

   Every value here is a public claim about the business and none of them is
   confirmed. The address in particular drives the directions link, so a
   wrong one sends customers to the wrong part of town.

   `SALON_ADDRESS` is deliberately a suburb rather than a street address: the
   site's own copy only ever claims "Kempton Park", so pointing a map at the
   area is honest where inventing a street number would not be.

   lib/models/Settings.ts already stores the salon's real `phone`, `email`
   and `address`. Once a server component reads that document and passes it
   down, delete this file rather than leaving two sources to drift apart —
   until then, at least they drift together.
   ══════════════════════════════════════════════════════════════════════ */

/** Dialable form, for `tel:` links. */
export const SALON_PHONE = "+27110000000"

/** Same number, spaced for reading. Never put this in an href. */
export const SALON_PHONE_DISPLAY = "+27 11 000 0000"

/** wa.me wants the number with no "+", spaces or punctuation. */
export const SALON_WHATSAPP = "27110000000"

/** Mailbox the footer links to. Not where the contact form delivers — that
    goes to OWNER_EMAIL, server-side. */
export const SALON_EMAIL = "info@patricksalon.com"

export const SALON_ADDRESS = "Kempton Park, Johannesburg, South Africa"

/** Pre-encoded, because both the map link and its label use it. */
export const SALON_MAP_QUERY = encodeURIComponent(SALON_ADDRESS)
