"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Gallery", href: "/#gallery" },
  { label: "About", href: "/#about" },
  { label: "Reviews", href: "/#reviews" },
]

export function SiteHeader({
  active,
  logoHref = "/",
}: {
  active?: string
  logoHref?: string
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#c4c7c7]/30 bg-[#fcf9f5]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-16">
        <Link
          href={logoHref}
          aria-label="Glow & Grace — admin login"
          className="font-lux text-2xl font-bold tracking-tight text-[#181919]"
        >
          GLOW &amp; GRACE
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-semibold tracking-[0.05em] transition-colors duration-300 ${
                active === link.label
                  ? "text-[#775a19]"
                  : "text-[#444748] hover:text-[#775a19]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/book"
            className="bg-[#181919] px-8 py-2 text-sm font-semibold tracking-[0.05em] text-white shadow-[0_4px_20px_-5px_rgba(119,90,25,0.3)] transition-all duration-200 hover:opacity-90 active:scale-95"
          >
            Book Now
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Open menu"
              className="inline-flex size-10 items-center justify-center text-[#1c1c1a] lg:hidden"
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
