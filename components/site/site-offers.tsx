"use client"

import NextImage from "next/image"
import Link from "next/link"
import { Tag } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { fadeUp } from "@/lib/motion"
import {
  OFFER_DISCOUNT_PERCENT,
  OFFER_TERMS,
  OFFER_VALID_UNTIL,
  offers,
} from "@/lib/salon-offers"

/**
 * The promotional cards. Both prices shown are real: `price` is the salon's
 * published rate and `salePrice` is that rate with the discount applied, so
 * the saving a customer reads is the saving they get.
 *
 * The validity line renders only when the salon has set an end date — see
 * the note at the top of lib/salon-offers.ts.
 */
export function SiteOffers() {
  const reduce = !!useReducedMotion()

  if (offers.length === 0) return null

  return (
    <section
      id="offers"
      className="scroll-mt-24 bg-rose-ground py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp(reduce, 0, 18)}
          className="text-center"
        >
          <p className="flex items-center justify-center gap-2 font-ui text-[10px] font-semibold tracking-[0.22em] text-rose-accent uppercase sm:text-[11px]">
            <Tag className="size-3" aria-hidden />
            Limited offer
          </p>

          <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.15] font-medium tracking-[-0.01em] text-rose-ink">
            {OFFER_DISCOUNT_PERCENT}% off selected services
          </h2>

          {OFFER_VALID_UNTIL && (
            <p className="mt-3 font-ui text-sm font-semibold text-rose-accent">
              Book before {OFFER_VALID_UNTIL}
            </p>
          )}
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, i) => (
            <motion.article
              key={offer.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp(reduce, (i % 3) * 0.1, 24)}
              className="group flex flex-col overflow-hidden rounded-[22px] bg-rose-surface shadow-[0_18px_50px_-24px_rgba(39,33,42,0.28)] transition-shadow duration-300 hover:shadow-[0_26px_64px_-22px_rgba(39,33,42,0.34)]"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <NextImage
                  src={offer.image}
                  alt={offer.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />

                {/* The badge is the whole point of the card, so it sits on the
                    image rather than under it — and carries a solid ground so
                    it stays legible over whatever the photo happens to be. */}
                <span className="absolute top-4 left-4 rounded-full bg-rose-accent px-4 py-1.5 font-ui text-xs font-bold tracking-[0.04em] text-white shadow-[0_10px_24px_-8px_rgba(236,72,153,0.9)]">
                  {OFFER_DISCOUNT_PERCENT}% OFF
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-medium text-rose-ink">
                  {offer.name}
                </h3>

                <p className="mt-2 flex-1 font-ui text-sm leading-[1.65] text-rose-muted">
                  {offer.description}
                </p>

                {/* `line-through` alone reads as decoration to a screen reader,
                    which would announce two prices with no relationship between
                    them. <s> plus the visually-hidden labels say which is which. */}
                <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <s className="font-ui text-sm text-rose-muted/70">
                    <span className="sr-only">Usual price: </span>
                    {offer.price}
                  </s>
                  <span className="font-ui text-lg font-bold text-rose-accent">
                    <span className="sr-only">Offer price: </span>
                    {offer.salePrice}
                  </span>
                </p>

                <Link
                  href="/book"
                  className="mt-5 w-full rounded-full bg-rose-accent px-5 py-3 text-center font-ui text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-10px_rgba(236,72,153,0.9)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-accent active:translate-y-0"
                >
                  Book {offer.name}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {OFFER_TERMS && (
          <p className="mx-auto mt-8 max-w-2xl text-center font-ui text-xs leading-[1.7] text-rose-muted">
            {OFFER_TERMS}
          </p>
        )}
      </div>
    </section>
  )
}
