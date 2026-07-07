import Link from "next/link"
import { Camera, Flower2, Mail, MapPin, MessageCircle, Music2, Phone, Video } from "lucide-react"

const quickLinks = ["Home", "Services", "About Us", "Stylists", "Gallery", "Reviews", "Contact"]
const serviceLinks = [
  "Haircut & Styling",
  "Hair Coloring",
  "Skin Care",
  "Brows & Lashes",
  "Nail Care",
  "Hair Treatments",
]

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#0e0e0e] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex flex-col leading-none">
            <span className="flex items-center gap-1.5 font-lux text-lg font-semibold">
              <Flower2 className="size-5 text-[#c9a24b]" />
              GLOW &amp; GRACE
            </span>
            <span className="text-[10px] font-medium tracking-[0.35em] text-[#c9a24b]">
              SALON
            </span>
          </Link>
          <p className="max-w-xs text-sm text-white/50">
            Enhancing your natural beauty with expert care and luxury services.
          </p>
          <div className="flex gap-2">
            {[Camera, MessageCircle, Music2, Video].map((Icon, i) => (
              <span
                key={i}
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#c9a24b] hover:text-[#c9a24b]"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 text-sm">
          <h4 className="mb-1 font-medium">Quick Links</h4>
          {quickLinks.map((l) => (
            <Link
              key={l}
              href={l === "Home" ? "/" : l === "Stylists" ? "/book" : "/#" + l.toLowerCase().replace(/\s+/g, "")}
              className="text-white/50 transition-colors hover:text-[#c9a24b]"
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 text-sm">
          <h4 className="mb-1 font-medium">Services</h4>
          {serviceLinks.map((l) => (
            <Link key={l} href="/book" className="text-white/50 transition-colors hover:text-[#c9a24b]">
              {l}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 text-sm">
          <h4 className="mb-1 font-medium">Contact Us</h4>
          <span className="flex items-center gap-2 text-white/50">
            <Phone className="size-3.5 text-[#c9a24b]" /> +1 (555) 123-4567
          </span>
          <span className="flex items-center gap-2 text-white/50">
            <Mail className="size-3.5 text-[#c9a24b]" /> info@glowandgracesalon.com
          </span>
          <span className="flex items-start gap-2 text-white/50">
            <MapPin className="size-3.5 shrink-0 translate-y-0.5 text-[#c9a24b]" /> 123
            Beauty Street, New York, NY 10001
          </span>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-white/40 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Glow &amp; Grace Salon. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
