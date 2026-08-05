import type { Metadata } from "next"
import Link from "next/link"
import { X } from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { RetryPaymentButton } from "@/features/bookings/components/retry-payment-button"

export const metadata: Metadata = {
  title: "Payment unsuccessful | Patrick Dreadlocks & Beauty",
  robots: { index: false, follow: false },
}

/**
 * The booking is NOT cancelled when payment fails — it is still sitting at
 * PENDING_PAYMENT with the slot held, which is what makes "Try again" mean
 * something. The copy below says so, because the thing a customer whose card
 * just declined most wants to know is whether they lost the appointment.
 */
export default async function PaymentFailedPage(
  props: PageProps<"/book/payment/failed">
) {
  const { booking } = await props.searchParams
  const bookingId = typeof booking === "string" ? booking : undefined

  return (
    <div className="flex flex-1 flex-col bg-rose-ground text-rose-ink selection:bg-rose-accent selection:text-rose-surface">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="w-full max-w-md rounded-[28px] bg-rose-surface p-10 text-center shadow-[0_24px_70px_-34px_rgba(39,33,42,0.45)]">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-rose-mid text-rose-accent">
            <X className="size-10" strokeWidth={3} aria-hidden />
          </span>

          <h1 className="mt-7 font-display text-2xl font-semibold text-rose-ink">
            Payment didn&rsquo;t go through
          </h1>

          <p className="mt-3 font-ui text-sm leading-[1.7] text-rose-muted">
            Nothing was charged, and{" "}
            <strong className="font-semibold text-rose-ink">
              your appointment slot is still held
            </strong>
            . You can try the payment again, or pay in person when you arrive.
          </p>

          {bookingId && <RetryPaymentButton bookingId={bookingId} />}

          <Link
            href="/book"
            className="mt-3 block w-full rounded-full border border-rose-mid px-8 py-3.5 font-ui text-sm font-semibold text-rose-ink transition-colors duration-300 hover:border-rose-accent hover:text-rose-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-accent"
          >
            Back to booking
          </Link>

          <p className="mt-6 font-ui text-xs leading-[1.6] text-rose-muted">
            Still stuck?{" "}
            <Link href="/#contact" className="font-semibold text-rose-accent underline">
              Get in touch
            </Link>{" "}
            and we&rsquo;ll sort it out.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
