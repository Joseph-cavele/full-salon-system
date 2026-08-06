/* ══════════════════════════════════════════════════════════════════════
   THE SALON'S CONTACT DETAILS — one copy, imported by every public page.

   The phone number and email below are real and were given by the owner
   (2026-08-06). Treat them as such: they are printed on the site, dialled
   from a phone and used to reach the business, so do not substitute a
   placeholder into any of them "for now".

   `SALON_ADDRESS` remains a suburb rather than a street address, and is
   still unconfirmed. The site's own copy only ever claims "Kempton Park",
   so pointing the directions link at the area is honest where inventing a
   street number would not be. Replace it with the real address when there
   is one — it is the only value here still standing in for something.

   This file used to say it was the single copy while the header, footer and
   contact section each carried their own hardcoded duplicates. They now
   import from here, so changing a number is a one-line edit again.

   lib/models/Settings.ts holds the same details as editable defaults for
   the dashboard. Once a server component reads that document and passes it
   down, delete this file rather than leaving two sources to drift apart.
   ══════════════════════════════════════════════════════════════════════ */

/** Dialable form, for `tel:` links. International so it works from abroad. */
export const SALON_PHONE = "+27747809371"

/** Same number, spaced for reading. Never put this in an href. */
export const SALON_PHONE_DISPLAY = "074 780 9371"

/** wa.me wants the number with no "+", spaces or punctuation. */
export const SALON_WHATSAPP = "27747809371"

/** Mailbox the site links to. Not where the contact form delivers — that
    goes to OWNER_EMAIL, server-side. */
export const SALON_EMAIL = "booking@patrickdreadlocks.co.za"

/** Still a suburb, still unconfirmed — see the note above. */
export const SALON_ADDRESS = "Kempton Park, Johannesburg, South Africa"

/** Pre-encoded, because both the map link and its label use it. */
export const SALON_MAP_QUERY = encodeURIComponent(SALON_ADDRESS)
