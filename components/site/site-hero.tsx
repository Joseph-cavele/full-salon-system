"use client"

import NextImage from "next/image"
import Link from "next/link"
import { MapPin, Sparkles, Star, Users } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { BackgroundPaths } from "@/components/ui/modern-background-paths"
import { fadeUp, lineReveal, springUp, stagger } from "@/lib/motion"

/* ══════════════════════════════════════════════════════════════════════
   IMAGE SLOTS — the salon interior, WebP (0.18 MB / 0.11 MB). The wide
   frame keeps its centre calm so the glass card has somewhere to sit;
   the tall crop exists because the wide one loses that calm centre once
   a phone crops it.
   ══════════════════════════════════════════════════════════════════════ */
const BACKDROP_WIDE = "/Assets/salon-interior-wide.webp"
const BACKDROP_TALL = "/Assets/salon-interior-tall.webp"

/** Breaks on meaning: the offer, who it's for. */
const HEADLINE = ["Premium Loc &", "Beauty Care For", "Modern Women"]

const stats = [
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Users, value: "500+", label: "Happy clients" },
  { icon: MapPin, value: "Kempton Park", label: "Johannesburg" },
]

export function SiteHero() {
  const reduce = !!useReducedMotion()

  return (
    <section className="relative isolate flex min-h-[92svh] w-full items-center justify-center overflow-hidden bg-rose-glass">
      {/* ── Backdrop ───────────────────────────────────────────────────
          Desaturated and darkened so the fuchsia stays the only saturated
          thing on the page — the same move the reference makes. */}
      <NextImage
        src={BACKDROP_WIDE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center brightness-[0.55] saturate-[0.45] sm:block"
      />
      <NextImage
        src={BACKDROP_TALL}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center brightness-[0.55] saturate-[0.45] sm:hidden"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(43,34,40,0.72)_0%,rgba(43,34,40,0.5)_45%,rgba(43,34,40,0.85)_100%)]"
      />

      {/* Animated path filaments, drawn over the scrim and under the glass
          card. Tinted with the brand fuchsia rather than the component's stock
          slate, and held to the two organic patterns — the geometric grid and
          neural mesh read as data-viz over a salon photograph. */}
      <BackgroundPaths
        patterns={["flow", "spiral"]}
        className="text-rose-accent/60"
      />

      {/* ── Glass card ─────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger(0.15, 0.12)}
        /* Cool slate glass, per spec. Note this is deliberately NOT the warm
           --color-rose-glass token — it reads cooler and bluer against the
           backdrop, which is what pulls the card forward off the photo. */
        className="relative z-10 mx-5 my-28 w-full max-w-2xl rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(95,105,120,0.30)_0%,rgba(70,78,90,0.45)_50%,rgba(45,50,60,0.60)_100%)] p-8 text-center shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] backdrop-blur-[20px] sm:p-12"
      >
        <motion.p
          variants={fadeUp(reduce, 0, 14)}
          className="flex items-center justify-center gap-2 font-ui text-[10px] font-semibold tracking-[0.22em] text-rose-accent uppercase sm:text-[11px]"
        >
          <Sparkles className="size-3" aria-hidden />
          Because you deserve to shine
          <Sparkles className="size-3" aria-hidden />
        </motion.p>

        <motion.h1
          variants={stagger(0.3, 0.12)}
          className="mt-6 font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[1.1] font-medium tracking-[-0.01em] text-white"
        >
          {HEADLINE.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block" variants={lineReveal(reduce)}>
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          variants={fadeUp(reduce, 0, 20)}
          className="mx-auto mt-6 max-w-lg font-ui text-sm leading-[1.75] text-white/70 sm:text-base"
        >
          Installation, retwists and crochet maintenance by specialists who
          treat your hair like it has to last years — plus nails, brows and
          skin, under one roof.
        </motion.p>

        <motion.div
          variants={springUp(reduce, 0)}
          className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-accent px-8 py-3.5 font-ui text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(236,72,153,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-accent active:translate-y-0"
          >
            Book appointment
            <Sparkles className="size-4" aria-hidden />
          </Link>
          {/* Goes to the full catalogue page, not the homepage teaser section
              below it. The teaser shows six services; someone who clicks
              "Explore services" is asking for all of them. Link rather than
              <a> so it's a client transition and gets prefetched. */}
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-3.5 font-ui text-sm font-semibold text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-accent"
          >
            Explore services
          </Link>
        </motion.div>

        {/* Stats sit inside the card, as in the reference — they read as part
            of the claim rather than as a separate band. */}
        <motion.dl
          variants={fadeUp(reduce, 0, 16)}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 border-t border-white/12 pt-7"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2.5">
              <stat.icon className="size-4 shrink-0 text-rose-accent" aria-hidden />
              <div className="text-left">
                <dd className="font-ui text-sm font-bold text-white">{stat.value}</dd>
                <dt className="font-ui text-[11px] text-white/55">{stat.label}</dt>
              </div>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* ── Wave divider ───────────────────────────────────────────────
          Curves the hero into the pale body below. preserveAspectRatio is
          off so the curve stretches to any width instead of clipping. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 z-10 h-[70px] w-full sm:h-[110px]"
      >
        <path d="M0,96 C360,16 1080,16 1440,96 L1440,160 L0,160 Z" fill="#fdf2f5" />
      </svg>
    </section>
  )
}
