const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "mailto:info@glowandgracesalon.com" },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#c4c7c7]/20 bg-[#f6f3ef]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-5 py-16 md:flex-row md:px-16">
        <div className="mb-8 md:mb-0">
          <span className="font-lux text-[24px] font-bold text-[#181919]">
            GLOW &amp; GRACE
          </span>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-8 md:mb-0">
          {footerLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-base leading-[1.6] text-[#444748] transition-colors hover:text-[#775a19]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="text-center md:text-right">
          <p className="text-base leading-[1.6] text-[#444748]">
            &copy; {new Date().getFullYear()} Glow &amp; Grace Salon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
