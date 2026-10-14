"use client"

import { useEffect, useState } from "react"
import NextImage from "next/image"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type TargetAndTransition,
  type Transition,
} from "motion/react"
import { ArrowRight, KeyRound, Mail } from "lucide-react"

import { BackgroundPaths } from "@/components/ui/modern-background-paths"
import { cn } from "@/lib/utils"

/**
 * Glass sign-in card with a 3D pointer tilt, a light beam that travels the
 * border, and the marketing hero's backdrop behind it.
 *
 * Deliberately reuses SiteHero's recipe rather than inventing a second dark
 * theme: same salon photograph at the same brightness/saturation, same plum
 * scrim, same fuchsia filaments, same cool-slate glass. Signing in should feel
 * like the same building as the homepage, one room further in.
 *
 * Presentational only — it owns the field state, but hands the email and the
 * emailed code up through callbacks so the auth wiring (and which `step` is
 * showing) stays in `features/auth`.
 */

/* The styling station rather than the hero's wide room shot — deliberately a
   different corner of the salon, so signing in doesn't feel like the homepage
   repeating itself. Its ring-lit mirror also sits dead centre, which gives the
   fuchsia bloom behind the card a light source in the photograph to grow out
   of instead of floating over a flat scrim. */
const BACKDROP = "/Assets/salon-station.webp"
const LOGO_MARK = "/images/logo/patrick-mark.png"

/** Literal brand values — the card is always dark, so it never reads theme tokens. */
const ROSE = "#ec4899"

/**
 * The four border beams. Each slides along one edge by animating the offset
 * property it starts pinned to, so `axis` doubles as the animated key.
 */
const BEAMS = [
  { axis: "left", edge: "top-0 left-0 h-[3px] w-1/2 bg-linear-to-r", delay: 0 },
  { axis: "top", edge: "top-0 right-0 h-1/2 w-[3px] bg-linear-to-b", delay: 0.6 },
  { axis: "right", edge: "bottom-0 right-0 h-[3px] w-1/2 bg-linear-to-r", delay: 1.2 },
  { axis: "bottom", edge: "bottom-0 left-0 h-1/2 w-[3px] bg-linear-to-b", delay: 1.8 },
] as const

/** Corner sparks, brightest on the two corners the beams hand off at. */
const CORNERS = [
  { at: "top-0 left-0 size-[5px] blur-[1px]", tint: "bg-rose-mid/50", duration: 2, delay: 0 },
  { at: "top-0 right-0 size-[8px] blur-[2px]", tint: "bg-rose-accent/70", duration: 2.4, delay: 0.5 },
  { at: "bottom-0 right-0 size-[8px] blur-[2px]", tint: "bg-rose-accent/70", duration: 2.2, delay: 1 },
  { at: "bottom-0 left-0 size-[5px] blur-[1px]", tint: "bg-rose-mid/50", duration: 2.3, delay: 1.5 },
] as const

type FocusedInput = "email" | "code" | null

/** Matches RESEND_COOLDOWN_MS on the server, which ignores earlier resends. */
const RESEND_COOLDOWN_S = 60

export type SignInCard2Props = {
  /** "email" asks for the address; "code" asks for the code sent to it. */
  step?: "email" | "code"
  /** The address the code went to, shown on the code step. */
  sentTo?: string | null
  /** When the last code was sent (ms epoch) — drives the resend countdown. */
  codeSentAt?: number | null
  /** Receives the email on the first step, and again on "Resend code". */
  onRequestCode?: (email: string) => void | Promise<void>
  /** Receives the code typed on the second step. */
  onVerifyCode?: (code: string) => void | Promise<void>
  /** Back from the code step to the email step. */
  onChangeEmail?: () => void
  /** Swaps the button label for a spinner and blocks re-submits. */
  isLoading?: boolean
  /** Message shown above the fields, e.g. "That code is wrong or has expired". */
  error?: string | null
}

/** Seconds until another code may be requested; re-renders once a second. */
function useResendCountdown(codeSentAt: number | null | undefined) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!codeSentAt) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [codeSentAt])

  if (!codeSentAt) return 0
  return Math.max(0, RESEND_COOLDOWN_S - Math.floor((now - codeSentAt) / 1000))
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export function SignInCard2({
  step = "email",
  sentTo,
  codeSentAt,
  onRequestCode,
  onVerifyCode,
  onChangeEmail,
  isLoading = false,
  error,
}: SignInCard2Props) {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [focusedInput, setFocusedInput] = useState<FocusedInput>(null)
  const resendIn = useResendCountdown(codeSentAt)

  // `useReducedMotion` is null on the server, so coerce before branching —
  // otherwise the first client render disagrees with the HTML and React
  // throws a hydration mismatch.
  const reduce = useReducedMotion() ?? false

  // Pointer-driven 3D tilt. The raw offset from the card's centre maps to a
  // ±10° rotation; leaving the card springs both values back to rest.
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])

  function handleMouseMove(e: React.MouseEvent) {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isLoading) return
    if (step === "email") onRequestCode?.(email)
    else onVerifyCode?.(code)
  }

  function handleResend() {
    if (isLoading || resendIn > 0 || !sentTo) return
    setCode("")
    onRequestCode?.(sentTo)
  }

  function handleChangeEmail() {
    setCode("")
    onChangeEmail?.()
  }

  return (
    <section className="bg-rose-glass relative isolate flex min-h-svh w-full flex-1 items-center justify-center overflow-hidden px-4 py-8">
      {/* ── Backdrop ───────────────────────────────────────────────────
          Same treatment as the hero: desaturated and darkened so the
          fuchsia stays the only saturated thing on the page. */}
      <NextImage
        src={BACKDROP}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center brightness-[0.62] saturate-[0.45]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(43,34,40,0.74)_0%,rgba(43,34,40,0.54)_45%,rgba(43,34,40,0.88)_100%)]"
      />

      {/* Fuchsia filaments, over the scrim and under the card. */}
      <BackgroundPaths patterns={["flow", "spiral"]} className="text-rose-accent/60" />

      {/* ── Glow stack ─────────────────────────────────────────────────
          Three layers, largest and softest first, so the card sits in a
          pool of light rather than on a flat wash. They breathe out of
          phase with each other, which keeps the pulse from reading as one
          mechanical throb. */}
      <motion.div
        aria-hidden
        className="bg-rose-accent/12 absolute top-1/2 left-1/2 size-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        animate={reduce ? undefined : { opacity: [0.5, 0.8, 0.5], scale: [0.96, 1.05, 0.96] }}
        transition={{ duration: 9, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        aria-hidden
        className="bg-rose-accent/15 absolute top-1/2 left-1/2 size-[34vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        animate={reduce ? undefined : { opacity: [0.3, 0.55, 0.3], scale: [1.04, 0.96, 1.04] }}
        transition={{ duration: 6.5, repeat: Infinity, repeatType: "mirror", delay: 0.8 }}
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={reduce ? undefined : { rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="group relative">
            {/* Ambient halo behind the card. */}
            <motion.div
              className="absolute -inset-px rounded-[28px] opacity-0 transition-opacity duration-700 group-hover:opacity-70"
              animate={
                reduce
                  ? undefined
                  : {
                      boxShadow: [
                        "0 0 10px 2px rgba(236,72,153,0.06)",
                        "0 0 18px 6px rgba(236,72,153,0.12)",
                        "0 0 10px 2px rgba(236,72,153,0.06)",
                      ],
                      opacity: [0.2, 0.45, 0.2],
                    }
              }
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
            />

            {/* Light beams chasing each other around the border. */}
            <div className="absolute -inset-px overflow-hidden rounded-[28px]">
              {BEAMS.map(({ axis, edge, delay }) => (
                <motion.div
                  key={axis}
                  className={cn(
                    "via-rose-mid absolute from-transparent to-transparent opacity-70",
                    edge
                  )}
                  initial={{ filter: "blur(2px)" }}
                  animate={
                    reduce
                      ? undefined
                      : ({
                          [axis]: ["-50%", "100%"],
                          opacity: [0.3, 0.7, 0.3],
                          filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                        } as TargetAndTransition)
                  }
                  transition={
                    {
                      [axis]: {
                        duration: 2.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 1,
                        delay,
                      },
                      opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay },
                      filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay },
                    } as Transition
                  }
                />
              ))}

              {CORNERS.map(({ at, tint, duration, delay }) => (
                <motion.div
                  key={at}
                  className={cn("absolute rounded-full", at, tint)}
                  animate={reduce ? undefined : { opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration, repeat: Infinity, repeatType: "mirror", delay }}
                />
              ))}
            </div>

            {/* Rim light. Always on at 45% so the card reads as lit rather
                than merely outlined, and brightens toward the pointer. */}
            <div className="from-rose-accent/20 via-rose-accent/50 to-rose-accent/20 absolute -inset-[0.5px] rounded-[28px] bg-linear-to-r opacity-45 blur-[2px] transition-opacity duration-500 group-hover:opacity-90" />

            {/* Glass card — the hero's cool-slate gradient, not the warm plum,
                so it lifts off the photograph the same way. */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(95,105,120,0.30)_0%,rgba(70,78,90,0.45)_50%,rgba(45,50,60,0.60)_100%)] p-6 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9),0_0_60px_-15px_rgba(236,72,153,0.45)] backdrop-blur-[20px] sm:p-7">
              {/* Logo and header */}
              <div className="mb-5 text-center">
                <motion.div
                  initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="relative mx-auto size-16"
                >
                  {/* Halo behind the medallion. Sits outside the clipped
                      circle so the glow can bleed past the mark's edge. */}
                  <motion.span
                    aria-hidden
                    className="bg-rose-accent/40 absolute -inset-3 rounded-full blur-xl"
                    animate={reduce ? undefined : { opacity: [0.45, 0.85, 0.45] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatType: "mirror" }}
                  />
                  <span className="ring-rose-accent/40 absolute inset-0 overflow-hidden rounded-full bg-white/95 ring-1 shadow-[0_0_28px_-4px_rgba(236,72,153,0.75)]">
                    <NextImage
                      src={LOGO_MARK}
                      alt="Patrick Dreadlocks &amp; Beauty"
                      fill
                      sizes="64px"
                      priority
                      className="object-contain p-1"
                    />
                  </span>
                </motion.div>

                <motion.h1
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-display mt-3 text-2xl leading-none font-medium tracking-[-0.01em] text-white drop-shadow-[0_2px_18px_rgba(236,72,153,0.45)]"
                >
                  Patrick
                </motion.h1>

                <motion.p
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="font-ui text-rose-accent mt-1.5 text-[10px] font-semibold tracking-[0.22em] uppercase"
                >
                  Dreadlocks &amp; Beauty
                </motion.p>

                <motion.p
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 text-sm text-white/70"
                >
                  {step === "email"
                    ? "Welcome back — enter your email and we'll send you a verification code."
                    : "Enter the 6-digit code we emailed you."}
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-300/30 bg-red-500/15 px-3 py-2 text-xs text-red-100"
                  >
                    {error}
                  </p>
                )}

                <div className="space-y-3">
                  {step === "email" ? (
                    /* Email */
                    <motion.div
                      key="email"
                      className={cn("relative", focusedInput === "email" && "z-10")}
                      whileHover={reduce ? undefined : { scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Mail
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute left-3 size-4 transition-colors duration-300",
                            focusedInput === "email" ? "text-rose-accent" : "text-white/40"
                          )}
                        />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedInput("email")}
                          onBlur={() => setFocusedInput(null)}
                          className="focus:border-rose-accent/50 focus-visible:ring-rose-accent/30 h-10 w-full border-white/10 bg-white/5 pr-3 pl-10 text-white transition-all duration-300 placeholder:text-white/35 focus:bg-white/10"
                        />
                        {focusedInput === "email" && (
                          <motion.div
                            layoutId="input-highlight"
                            className="absolute inset-0 -z-10 bg-white/5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    /* Code */
                    <motion.div
                      key="code"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <p className="text-center text-xs text-white/60">
                        Sent to <span className="font-medium text-white/85">{sentTo}</span>
                      </p>
                      <div
                        className={cn(
                          "relative flex items-center overflow-hidden rounded-lg",
                          focusedInput === "code" && "z-10"
                        )}
                      >
                        <KeyRound
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute left-3 size-4 transition-colors duration-300",
                            focusedInput === "code" ? "text-rose-accent" : "text-white/40"
                          )}
                        />
                        <Input
                          id="code"
                          name="code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          autoFocus
                          required
                          maxLength={6}
                          aria-label="6-digit sign-in code"
                          placeholder="000000"
                          value={code}
                          // Digits only, so a pasted "123 456" still works.
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          onFocus={() => setFocusedInput("code")}
                          onBlur={() => setFocusedInput(null)}
                          className="focus:border-rose-accent/50 focus-visible:ring-rose-accent/30 h-11 w-full border-white/10 bg-white/5 pr-3 pl-10 text-center font-mono text-lg tracking-[0.5em] text-white transition-all duration-300 placeholder:text-white/25 focus:bg-white/10"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Change email / resend — only once a code has gone out. */}
                {step === "code" && (
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={handleChangeEmail}
                      className="hover:text-rose-accent text-white/65 transition-colors duration-200"
                    >
                      ← Use a different email
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading || resendIn > 0}
                      className="hover:text-rose-accent text-white/65 transition-colors duration-200 disabled:cursor-not-allowed disabled:text-white/30 disabled:hover:text-white/30"
                    >
                      {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
                    </button>
                  </div>
                )}

                {/* Submit */}
                <motion.button
                  whileHover={reduce || isLoading ? undefined : { scale: 1.02 }}
                  whileTap={reduce || isLoading ? undefined : { scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="group/button relative mt-4 w-full"
                >
                  <div className="bg-rose-accent/40 absolute inset-0 rounded-full opacity-0 blur-lg transition-opacity duration-300 group-hover/button:opacity-80" />

                  <div
                    className="relative flex h-11 items-center justify-center overflow-hidden rounded-full font-medium text-white shadow-[0_10px_30px_-10px_rgba(236,72,153,0.8)] transition-all duration-300"
                    style={{ backgroundColor: ROSE }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
                      animate={reduce ? undefined : { x: ["-100%", "100%"] }}
                      transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                      style={{ opacity: isLoading ? 1 : 0, transition: "opacity 0.3s ease" }}
                    />

                    <AnimatePresence mode="wait" initial={false}>
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <div className="size-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                          <span className="sr-only">{step === "email" ? "Sending code…" : "Signing in…"}</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1.5 text-sm font-semibold"
                        >
                          {step === "email" ? "Send verification code" : "Verify & sign in"}
                          <ArrowRight
                            aria-hidden
                            className="size-3.5 transition-transform duration-300 group-hover/button:translate-x-1"
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="relative mt-1 mb-4 flex items-center">
                  <div className="grow border-t border-white/10" />
                  <motion.span
                    className="mx-3 text-xs text-white/40"
                    initial={reduce ? false : { opacity: 0.7 }}
                    animate={reduce ? undefined : { opacity: [0.7, 0.9, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    or
                  </motion.span>
                  <div className="grow border-t border-white/10" />
                </div>

                {/* Google — no OAuth provider configured yet, so it stays inert. */}
                <button
                  type="button"
                  disabled
                  title="Google sign-in isn't set up yet."
                  className="relative flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 overflow-hidden rounded-full border border-white/12 bg-white/5 font-medium text-white opacity-45"
                >
                  <span aria-hidden className="flex size-4 items-center justify-center text-white/80">
                    G
                  </span>
                  <span className="text-xs text-white/80">Sign in with Google</span>
                </button>

                <p className="mt-4 text-center text-xs text-white/45">
                  Dashboard access is for the salon owner only.
                </p>

                <p className="text-center text-xs">
                  <Link
                    href="/"
                    className="hover:text-rose-accent text-white/55 transition-colors duration-200"
                  >
                    ← Back to home
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

/** Alias kept so the upstream demo's `import { Component }` still resolves. */
export { SignInCard2 as Component }
