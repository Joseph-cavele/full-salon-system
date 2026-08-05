"use client"

import { useCallback, useEffect, useState } from "react"
import NextImage from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { EASE_OUT } from "@/lib/motion"

/* The reference's hero carousel: a rounded pink panel with the model bleeding
   off the left edge, the headline and copy centred beside her, arrows on the
   outer edges and dots beneath.

   Slides use the salon's own photographs and speak to its own services. Two
   things from the reference are deliberately absent: its skincare claims
   ("radiant, healthy skin"), which this salon does not offer, and its floral
   line-art background, which is someone else's artwork. The soft radial wash
   stands in for the latter. */
const slides = [
  {
    headline: "The secret to beautiful locs is in our hands",
    body: "From the first install to years of retwists, your locs are sectioned, tended and grown by people who do this every day.",
    cta: { label: "See our services", href: "#services-list" },
    image: "/Assets/1e60d50b163af6c4acf12122730c6865.jpg",
    alt: "Stylist installing locs for a client in the chair",
  },
  {
    headline: "Braids that sit light and last",
    body: "Knotless braids parted and installed with even tension, so nothing pulls at your edges and the set holds for weeks.",
    cta: { label: "Book a set", href: "/book" },
    image: "/Assets/e58c67cde794d63ac80d12159571bfcd.jpg",
    alt: "Feed-in braids gathered into a long braided bun",
  },
  {
    headline: "A cut shaped to you",
    body: "Cuts, wig installs and colour finished in the chair — you leave styled, not holding a mirror wondering.",
    cta: { label: "See prices", href: "#services-list" },
    image: "/Assets/76b98164c809735eb05baded97d88d9a.jpg",
    alt: "Finished natural short cut",
  },
]

const AUTOPLAY_MS = 6000

export function SiteServicesHero() {
  const reduce = !!useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    []
  )

  /* Autoplay stops on hover, on focus inside the panel, and entirely under
     prefers-reduced-motion — a carousel that keeps moving while someone is
     reading it or tabbing through its links is the usual accessibility
     failure of this pattern. */
  useEffect(() => {
    if (reduce || paused) return

    const timer = setInterval(() => go(index + 1), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [go, index, paused, reduce])

  const slide = slides[index]

  return (
    <section className="px-4 pt-6 sm:px-6 md:px-10 xl:px-16">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[28px] bg-[radial-gradient(ellipse_120%_100%_at_15%_50%,#fbe4ee_0%,#fdf2f5_55%,#fdf7f9_100%)] shadow-[0_24px_70px_-34px_rgba(39,33,42,0.4)]"
      >
        {/* One grid cell holds both columns so the panel keeps its height when
            a slide's copy is shorter than the photograph. */}
        <div className="col-start-1 row-start-1 grid items-center gap-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="relative h-56 sm:h-[22rem] md:h-[24rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.image}
                initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT }}
                className="absolute inset-0"
              >
                <NextImage
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 640px) 40vw, 100vw"
                  className="object-cover object-top"
                />
                {/* Feathers the photo into the panel instead of ending it on a
                    hard edge, which is what the reference does with its model. */}
                <div className="absolute inset-0 bg-linear-to-t from-[#fdf2f5] via-transparent to-transparent sm:bg-linear-to-r sm:from-transparent sm:via-transparent sm:to-[#fdf2f5]" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-6 pb-10 text-center sm:px-8 sm:pb-0 md:px-12">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.headline}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, y: -12 }}
                transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
              >
                <h1 className="font-display text-[clamp(1.5rem,3.4vw,2.4rem)] leading-[1.25] font-medium tracking-[-0.01em] text-rose-ink">
                  {slide.headline}
                </h1>

                <p className="mx-auto mt-4 max-w-md font-ui text-xs leading-[1.8] text-rose-muted sm:text-sm">
                  {slide.body}
                </p>

                <Link
                  href={slide.cta.href}
                  className="mt-7 inline-flex items-center rounded-full bg-rose-accent px-7 py-3 font-ui text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(236,72,153,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-accent active:translate-y-0 sm:text-sm"
                >
                  {slide.cta.label}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="absolute top-1/2 left-2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full text-rose-ink/50 transition-colors hover:bg-rose-surface hover:text-rose-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-accent sm:left-3"
        >
          <ChevronLeft className="size-5" />
        </button>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="absolute top-1/2 right-2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full text-rose-ink/50 transition-colors hover:bg-rose-surface hover:text-rose-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-accent sm:right-3"
        >
          <ChevronRight className="size-5" />
        </button>

        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
          {slides.map((entry, i) => (
            <button
              key={entry.headline}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-accent ${
                i === index ? "w-5 bg-rose-accent" : "w-2 bg-rose-accent/30 hover:bg-rose-accent/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
