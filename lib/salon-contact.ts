/* ══════════════════════════════════════════════════════════════════════
   THE SALON'S CONTACT DETAILS — one copy, imported by every public page.

   The phone number and email below are real and were given by the owner
   (2026-08-06). Treat them as such: they are printed on the site, dialled
   from a phone and used to reach the business, so do not substitute a
   placeholder into any of them "for now".

   The street address is real too, given by the owner on the same day. It
   was a bare suburb until then, because the site's own copy only ever
   claimed "Kempton Park" and pointing the map at the area was honest where
   inventing a street number would not have been.

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

/** As printed on the site — the unit number included, so a customer knows
    which shop to walk into once they arrive. */
export const SALON_ADDRESS = "Shop 7, 26 Park St, Kempton Park, Johannesburg"

/**
 * What the map is asked to find. Deliberately not `SALON_ADDRESS`: a leading
 * unit number ("Shop 7") is not part of the street address a geocoder
 * matches on, and feeding it one can drop the pin on the suburb centroid
 * instead of the building. The country is spelled out for the same reason —
 * there is a Park Street in most cities on earth.
 */
export const SALON_MAP_ADDRESS = "26 Park St, Kempton Park, Johannesburg, South Africa"

/** Pre-encoded, because both the map embed and the directions link use it. */
export const SALON_MAP_QUERY = encodeURIComponent(SALON_MAP_ADDRESS)

/**
 * The salon's social profiles.
 *
 * A URL here is a public claim in the same way the phone number is, and a
 * wrong one is worse than a missing one: a guessed handle does not 404, it
 * sends customers to a stranger's page that looks like it could be the
 * salon's. So they start empty and get filled in with real ones.
 *
 * The icons still show while a URL is blank — the footer renders that one as
 * an inert mark rather than a link, so the row looks complete without
 * promising a destination that isn't there. Set `url` to the full profile
 * URL (not the handle) and it becomes a working link with no other change.
 */
export type SalonSocial = {
  /** Used as the accessible name: "Patrick Dreadlocks & Beauty on Facebook". */
  label: string
  /** Full profile URL. Empty means "not set up yet" — the link is not shown. */
  url: string
}

export const SALON_SOCIALS: SalonSocial[] = [
  /* Canonical form of the page URL. The link as supplied was
     `web.facebook.com/patrickdreadlocksa/?_rdc=1&_rdr#`, which is what the
     address bar shows after Facebook's own redirect — `_rdc`/`_rdr` are its
     redirect bookkeeping and `web.` is a regional host. Neither belongs in
     a link we publish: the query string is meaningless to anyone arriving
     fresh, and `www.` resolves everywhere. */
  { label: "Facebook", url: "https://www.facebook.com/patrickdreadlocksa" },
  /* Same treatment: the supplied link carried an `fbclid=IwY2xjawTierxw…`
     tracking token, ~180 characters of Facebook click ID picked up by
     whatever shared the link. It identifies the click that produced the
     copy, not the profile, and publishing it would attach that token to
     every visitor who followed it from the footer. */
  { label: "Instagram", url: "https://www.instagram.com/patrickdreadlocksa" },
  /* A `vt.tiktok.com` share shortener, as supplied (minus a stray space).
     Unlike the two above this could not be reduced to a canonical URL:
     resolving it from the server lands on TikTok's homepage, which is their
     bot handling rather than a dead link, so the destination could not be
     confirmed from here.

     Worth replacing with the profile's own `https://www.tiktok.com/@handle`
     when someone can read it off the app. A shortener is an extra hop that
     can be retired by the platform, and it tells a visitor hovering the
     icon nothing about where they are going. */
  { label: "TikTok", url: "https://vt.tiktok.com/ZS44MHgl6/" },
]

/**
 * Opening lines for the WhatsApp links, written from the customer's side —
 * `?text=` prefills the customer's compose box, so anything here is words
 * they are about to appear to have said. Kept short and easy to type over
 * for that reason: a long scripted message reads as a bot the moment it
 * lands in the salon's inbox, and nobody deletes a paragraph before
 * sending.
 *
 * They differ by where the button was pressed, because that is the one
 * thing the salon cannot see from the message alone.
 */
export const WHATSAPP_MESSAGES = {
  /** Header and contact section — no context beyond being on the site. */
  general: "Hi Patrick Dreadlocks & Beauty! I'd like to ask about your services.",
  /** Someone part-way through the booking flow who needs a hand. */
  booking: "Hi Patrick Dreadlocks & Beauty! I need some help with my booking.",
} as const

/**
 * wa.me link with the compose box prefilled.
 *
 * Always go through this rather than writing the URL inline — the message
 * has to be percent-encoded, and a raw apostrophe or newline in a `?text=`
 * that skipped encoding truncates the message at that character.
 */
export const whatsappLink = (message: string) =>
  `https://wa.me/${SALON_WHATSAPP}?text=${
    /* `encodeURIComponent` leaves apostrophes raw — they are legal in a query
       string, so this is not a bug in it. But WhatsApp is reached through a
       deep link handed to the OS, and some Android link handlers end the URL
       at the first apostrophe, which would deliver a message cut off
       mid-word. Encoding it costs nothing and removes the question. */
    encodeURIComponent(message).replace(/'/g, "%27")
  }`
