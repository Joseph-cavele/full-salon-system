import { SALON_EMAIL } from "@/lib/salon-contact"

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: `mailto:${SALON_EMAIL}` },
]

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
