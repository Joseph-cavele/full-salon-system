"use client"

import NextImage from "next/image"
import { Sparkles } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { fadeUp, stagger } from "@/lib/motion"
import { galleryItems } from "@/lib/salon-services"

export function SiteGallery() {
  const reduce = !!useReducedMotion()

  const reveal = {
    initial: "hidden",
    whileInView: "show",
    viewport: { once: true, amount: 0.12 },
  } as const

  return (
    <section id="gallery" className="scroll-mt-24 bg-rose-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
        <motion.div {...reveal} variants={stagger(0, 0.12)} className="text-center">
          <motion.p
            variants={fadeUp(reduce, 0, 14)}
            className="flex items-center justify-center gap-2 font-ui text-[10px] font-semibold tracking-[0.22em] text-rose-accent uppercase sm:text-[11px]"
          >
            <Sparkles className="size-3" aria-hidden />
            Our work
            <Sparkles className="size-3" aria-hidden />
          </motion.p>

          <motion.h2
            variants={fadeUp(reduce, 0, 20)}
            className="mt-4 font-display text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.15] font-medium tracking-[-0.01em] text-rose-ink"
          >
            Recent Work
          </motion.h2>

          <motion.p
            variants={fadeUp(reduce, 0, 20)}
            className="mx-auto mt-4 max-w-md font-ui text-sm leading-[1.7] text-rose-muted sm:text-base"
          >
            {/* Said "Locs, braids, cuts and nails" while the grid showed no
                locs at all and the salon sells no nail service. */}
            Locs retwisted, styled and maintained — plus cuts, finished in the
            chair and photographed the same day.
          </motion.p>
        </motion.div>

        {/* Per-tile triggers, for the same reason as the service cards: a
            single parent group spanning two rows could leave the lower row
            stuck at opacity 0. */}
        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {galleryItems.map((item, i) => (
            <motion.li
              key={item.src}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp(reduce, (i % 3) * 0.08, 20)}
              className="group relative aspect-square overflow-hidden rounded-[16px]"
            >
              <NextImage
                src={item.src}
                alt={item.label}
                fill
                sizes="(min-width: 768px) 23vw, 45vw"
                className="object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />

              {/* Label rides in on hover; on touch there is no hover state, so
                  the alt text carries the same information to screen readers. */}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 translate-y-full bg-[linear-gradient(to_top,rgba(39,33,42,0.85),transparent)] px-4 pt-8 pb-3 font-ui text-xs font-semibold text-white transition-transform duration-300 group-hover:translate-y-0"
              >
                {item.label}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
