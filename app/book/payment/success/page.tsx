import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Payment successful | Patrick Dreadlocks & Beauty",
  // Nothing here should ever be indexed or shared — it is a receipt.
  robots: { index: false, follow: false },
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-1 flex-col bg-rose-ground text-rose-ink selection:bg-rose-accent selection:text-rose-surface">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="w-full max-w-md rounded-[28px] bg-rose-surface p-10 text-center shadow-[0_24px_70px_-34px_rgba(39,33,42,0.45)]">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-rose-accent text-white shadow-[0_16px_36px_-12px_rgba(236,72,153,0.9)]">
            <Check className="size-10" strokeWidth={3} aria-hidden />
          </span>

          <h1 className="mt-7 font-display text-2xl font-semibold text-rose-ink">
            Payment Successful!
          </h1>

          <p className="mt-3 font-ui text-sm leading-[1.7] text-rose-muted">
            Your payment was processed and your appointment is confirmed. A
            confirmation email is on its way with the details.
          </p>

          <Link
            href="/"
            className="mt-8 block w-full rounded-full bg-rose-accent px-8 py-3.5 font-ui text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(236,72,153,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-accent active:translate-y-0"
          >
            Back to home
          </Link>

          <Link
            href="/services"
            className="mt-3 block font-ui text-xs font-semibold text-rose-muted transition-colors hover:text-rose-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-accent"
          >
            Browse other services
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
