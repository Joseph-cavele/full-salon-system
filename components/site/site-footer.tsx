import type { IconType } from "react-icons"
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6"

import { SALON_EMAIL, SALON_SOCIALS } from "@/lib/salon-contact"

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: `mailto:${SALON_EMAIL}` },
]

/* Brand marks come from react-icons: lucide v1 dropped its brand set, so
   Facebook and Instagram resolve to undefined there and TikTok never
   existed. Keyed by the label in SALON_SOCIALS — a platform added there
   without an icon here is skipped rather than rendering an empty box. */
const socialIcons: Record<string, IconType> = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  TikTok: FaTiktok,
}

/* Every platform we have a mark for. Whether it links anywhere is decided
   per-item below, not here. */
const socials = SALON_SOCIALS.filter((s) => socialIcons[s.label])

const socialClass =
  "grid size-9 place-items-center rounded-full border transition-colors duration-300"

/* Deep charcoal-plum, matching the hero's glass card, so the pale pink body has
   something to close against. Single skin — the header dropped its two-tone
   mechanism, and a footer that disagreed with it was the reason that existed. */
/* `#contact` moved to SiteContact once a real contact section existed — two
   elements cannot share the id, and the nav means the form. */
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-rose-glass">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-5 py-16 md:flex-row md:px-16">
        <div className="mb-8 flex flex-col items-center leading-none md:mb-0 md:items-start">
          <span className="font-display text-[24px] font-medium tracking-[0.18em] text-rose-ground">
            PATRICK
          </span>
          <span className="mt-1.5 font-ui text-[10px] font-semibold tracking-[0.3em] text-rose-accent uppercase">
            Dreadlocks &amp; Beauty
          </span>

          {socials.length > 0 && (
            <ul className="mt-6 flex items-center gap-3">
              {socials.map(({ label, url }) => {
                const Icon = socialIcons[label]

                /* No URL yet: the mark still shows so the row reads as
                   finished, but as a span rather than an anchor. An <a> with
                   an empty href resolves to the current page, so clicking it
                   would silently reload the homepage — which looks like a
                   broken site rather than a profile that isn't live. */
                if (!url) {
                  return (
                    <li key={label}>
                      <span
                        role="img"
                        aria-label={`${label} — coming soon`}
                        title={`${label} — coming soon`}
                        className={`${socialClass} cursor-default border-rose-ground/10 text-rose-ground/30`}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                    </li>
                  )
                }

                return (
                  <li key={label}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Patrick Dreadlocks & Beauty on ${label}`}
                      className={`${socialClass} border-rose-ground/20 text-rose-ground/70 hover:border-rose-accent hover:bg-rose-accent hover:text-rose-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-accent`}
                    >
                      <Icon className="size-4" aria-hidden />
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-8 md:mb-0">
          {footerLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-ui text-base leading-[1.6] text-rose-ground/65 transition-colors hover:text-rose-accent"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="text-center md:text-right">
          <p className="font-ui text-base leading-[1.6] text-rose-ground/65">
            &copy; {new Date().getFullYear()} Patrick Dreadlocks &amp; Beauty Salon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
