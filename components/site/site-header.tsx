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
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-6 sm:h-20 sm:gap-6">
        <Link
          href={logoHref}
          aria-label="Glow & Grace — admin login"
          className="flex flex-col items-center leading-none text-white"
        >
          <span className="flex items-center gap-1.5 font-lux text-base font-semibold tracking-wide sm:text-xl">
            <Flower2 className="size-4 text-[#c9a24b] sm:size-5" />
            GLOW &amp; GRACE
          </span>
          <span className="text-[9px] font-medium tracking-[0.3em] text-[#c9a24b] sm:text-[10px] sm:tracking-[0.35em]">
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
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-linear-to-r from-[#d9bd85] to-[#c9a24b] px-3 text-xs font-semibold text-[#1a1408] shadow-lg shadow-black/20 transition-opacity hover:opacity-90 sm:h-11 sm:gap-2 sm:px-5 sm:text-sm"
          >
            <CalendarCheck className="size-3.5 sm:size-4" />
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
