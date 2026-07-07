"use client"

import Link from "next/link"
import { CalendarCheck, Flower2, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "About Us", href: "/#about" },
  { label: "Stylists", href: "/book" },
  { label: "Gallery", href: "/#services" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
]

export function SiteHeader({
  active,
  logoHref = "/",
}: {
  active?: string
  logoHref?: string
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6">
        <Link
          href={logoHref}
          aria-label="Glow & Grace — admin login"
          className="flex flex-col items-center leading-none text-white"
        >
          <span className="flex items-center gap-1.5 font-lux text-xl font-semibold tracking-wide">
            <Flower2 className="size-5 text-[#c9a24b]" />
            GLOW &amp; GRACE
          </span>
          <span className="text-[10px] font-medium tracking-[0.35em] text-[#c9a24b]">
            SALON
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-7 text-sm font-medium lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                active === link.label
                  ? "text-[#c9a24b]"
                  : "text-white/80 transition-colors hover:text-white"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Link
            href="/book"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-linear-to-r from-[#d9bd85] to-[#c9a24b] px-5 text-sm font-semibold text-[#1a1408] shadow-lg shadow-black/20 transition-opacity hover:opacity-90"
          >
            <CalendarCheck className="size-4" />
            Book Appointment
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Open menu"
              className="inline-flex size-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {links.map((link) => (
                <DropdownMenuItem key={link.label} render={<a href={link.href} />}>
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
