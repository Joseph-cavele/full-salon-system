"use client"

import NextImage from "next/image"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { fadeUp, stagger } from "@/lib/motion"
import { featuredServices, serviceCategories } from "@/lib/salon-services"

export function SiteServices() {
  const reduce = !!useReducedMotion()

  // `whileInView` with `once` so the reveal fires as the section arrives and
  // never re-runs when the visitor scrolls back up.
  const reveal = {
    initial: "hidden",
    whileInView: "show",
    viewport: { once: true, amount: 0.15 },
  } as const

  return (
    <section id="services" className="scroll-mt-24 bg-rose-ground py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div {...reveal} variants={stagger(0, 0.12)} className="text-center">
          <motion.p
            variants={fadeUp(reduce, 0, 14)}
            className="flex items-center justify-center gap-2 font-ui text-[10px] font-semibold tracking-[0.22em] text-rose-accent uppercase sm:text-[11px]"
          >
            <Sparkles className="size-3" aria-hidden />
            What we offer
            <Sparkles className="size-3" aria-hidden />
          </motion.p>

          <motion.h2
            variants={fadeUp(reduce, 0, 20)}
            className="mt-4 font-display text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.15] font-medium tracking-[-0.01em] text-rose-ink"
          >
            Our Premium Services
          </motion.h2>

          <motion.p
            variants={fadeUp(reduce, 0, 20)}
            className="mx-auto mt-4 max-w-md font-ui text-sm leading-[1.7] text-rose-muted sm:text-base"
          >
            Luxury treatments tailored for you, delivered by skilled
            professionals.
          </motion.p>
        </motion.div>

        {/* ── Featured cards ─────────────────────────────────────────────
            Each card carries its own `whileInView` rather than inheriting from
            a parent group. A single trigger on the grid meant all six were
            driven by one container spanning two rows, and `fadeUp`'s explicit
            `delay: 0` overrode the parent's staggerChildren — so the second
            row could stay stuck at opacity 0. Per-card triggers cannot fail
            that way, and each row reveals as it actually reaches the viewport.
            The index delay keeps the stagger within a row. */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service, i) => (
            <motion.article
              key={service.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp(reduce, (i % 3) * 0.1, 24)}
              className="group flex flex-col rounded-[22px] bg-rose-surface p-3 shadow-[0_18px_50px_-24px_rgba(39,33,42,0.28)] transition-shadow duration-300 hover:shadow-[0_26px_64px_-22px_rgba(39,33,42,0.34)]"
            >
              {/* Desaturated at rest, full colour on hover — keeps the fuchsia
                  the only saturated thing until the visitor engages. */}
              <div className="relative aspect-4/3 overflow-hidden rounded-[16px]">
                <NextImage
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                />
              </div>

              <div className="flex flex-1 flex-col px-2 pt-5 pb-2">
                <h3 className="font-display text-xl font-medium text-rose-ink">
                  {service.name}
                </h3>
                <p className="mt-2 flex-1 font-ui text-sm leading-[1.65] text-rose-muted">
                  {service.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="font-ui text-sm font-bold text-rose-accent">
                    {service.from}
                  </span>
                  <Link
                    href="/book"
                    className="inline-flex items-center rounded-full bg-rose-accent px-5 py-2 font-ui text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-10px_rgba(236,72,153,0.9)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-accent active:translate-y-0"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* These six are a teaser; /services carries all of them as cards
            with prices. Without this link the page is reachable only from the
            nav, which visitors who have already scrolled past it won't go
            back up to. */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center rounded-full border border-rose-mid bg-rose-surface px-8 py-3.5 font-ui text-sm font-semibold text-rose-ink transition-colors duration-300 hover:border-rose-accent hover:text-rose-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-accent"
          >
            View all services &amp; prices
          </Link>
        </div>

        {/* ── Full price list ────────────────────────────────────────────
            Every service and every price, because a salon page that hides
            them makes people phone to ask instead of booking. */}
        <div className="mt-16 grid gap-10 rounded-[22px] bg-rose-surface p-7 shadow-[0_18px_50px_-28px_rgba(39,33,42,0.25)] sm:p-10 md:grid-cols-2 md:gap-14">
          {serviceCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp(reduce, i * 0.1, 22)}
            >
              <h3 className="font-display text-xl font-medium text-rose-ink">
                {category.title}
              </h3>
              <span aria-hidden className="mt-3 block h-px w-12 bg-rose-accent" />

              <dl className="mt-5">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-baseline justify-between gap-4 border-b border-rose-mid py-3 last:border-b-0"
                  >
                    <dt className="font-ui text-sm text-rose-ink">{item.name}</dt>
                    <dd className="font-ui text-sm font-semibold whitespace-nowrap text-rose-accent">
                      {item.price}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
