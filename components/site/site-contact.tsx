"use client"

import { useSyncExternalStore } from "react"
import axios from "axios"
import { useForm, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Sparkles,
} from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"
import { fadeUp } from "@/lib/motion"
import {
  SALON_ADDRESS,
  SALON_EMAIL,
  SALON_MAP_QUERY,
  SALON_PHONE,
  SALON_PHONE_DISPLAY,
  WHATSAPP_MESSAGES,
  whatsappLink,
} from "@/lib/salon-contact"
import {
  contactMessageSchema,
  DEFAULT_DIAL_CODE,
  DIAL_CODES,
  type ContactMessageValues,
} from "@/features/contact/schema"

/* ══════════════════════════════════════════════════════════════════════
   REAL-WORLD DETAILS — every value here is a public claim about the
   business. The address drives the map pin and the directions link, so a
   wrong one sends customers to the wrong street.

   All of it is imported, never re-declared. This file used to keep its own
   copies alongside site-header.tsx's, which is how a placeholder number
   survived here after the real one had been set.

   The opening hours below were the last unconfirmed thing here. The salon
   trades around the clock, so every day now reads the same.
   ══════════════════════════════════════════════════════════════════════ */
const PHONE = SALON_PHONE_DISPLAY
const WHATSAPP = whatsappLink(WHATSAPP_MESSAGES.general)
const EMAIL = SALON_EMAIL

/* Open 24/7, so every row reads the same. Kept as seven rows rather than
   collapsed to one line because the list highlights the current day, which
   still tells a visitor the page knows what day it is — and because a day
   that stops being 24-hour then only needs its own row edited.

   Nothing parses these strings except the `=== "Closed"` check that greys a
   row out, so a day can go back to real hours by editing it here. Keep
   lib/models/Settings.ts in step; it carries the same claim for the
   dashboard. */
const openingHours = [
  { day: "Monday", hours: "Open 24 hours" },
  { day: "Tuesday", hours: "Open 24 hours" },
  { day: "Wednesday", hours: "Open 24 hours" },
  { day: "Thursday", hours: "Open 24 hours" },
  { day: "Friday", hours: "Open 24 hours" },
  { day: "Saturday", hours: "Open 24 hours" },
  { day: "Sunday", hours: "Open 24 hours" },
]

/* Hardcoded rather than read from lib/date.ts: SALON_TIMEZONE has no
   NEXT_PUBLIC_ prefix, so it does not reach the browser and would silently
   resolve to undefined here. The literal is the same default. */
const SALON_TIMEZONE = "Africa/Johannesburg"

/* Shared, and built from the geocoder-friendly form rather than the printed
   one — see SALON_MAP_ADDRESS for why the unit number is left out. */
const mapQuery = SALON_MAP_QUERY

/* Which row to highlight is a client-only fact — the server would have to
   guess, and a wrong guess is a hydration mismatch. `useSyncExternalStore`
   is the sanctioned way to say that: the server snapshot is `null` (no row
   highlighted, a perfectly fine first paint) and the client snapshot is the
   real weekday. There is nothing to subscribe to, so `subscribe` returns a
   no-op unsubscribe; the day simply won't change under a visitor who leaves
   the tab open across midnight, which is not worth a timer.

   All three live at module scope because React requires stable references. */
/* The fields below that render their own error message. Anything the schema
   can reject that is NOT in this set has no visible control to attach an
   error to, so a failure on one would leave the button doing nothing at all
   — no toast, no message, no submission. That is exactly how a schema/form
   mismatch hides: silently. `onInvalid` surfaces those as a toast instead. */
const INLINE_ERROR_FIELDS = new Set(["name", "email", "phone", "message"])

const subscribe = () => () => {}
const getServerWeekday = () => null
const getSalonWeekday = () =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: SALON_TIMEZONE,
  }).format(new Date())

export function SiteContact() {
  const reduce = !!useReducedMotion()

  const today = useSyncExternalStore<string | null>(
    subscribe,
    getSalonWeekday,
    getServerWeekday,
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageValues>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      dialCode: DEFAULT_DIAL_CODE,
      phone: "",
      message: "",
      marketingOptIn: false,
      website: "",
    },
  })

  async function onSubmit(values: ContactMessageValues) {
    try {
      await apiClient.post("/contact", values)
      toast.success("Message sent — we'll get back to you shortly.")
      reset()
    } catch (err) {
      /* The API distinguishes "we couldn't deliver this" from "you sent too
         many". Collapsing both into "something went wrong" would leave
         someone retrying a message that is never going to arrive, so the
         undeliverable cases point at the phone instead. */
      const status = axios.isAxiosError(err) ? err.response?.status : undefined

      if (status === 429) {
        toast.error("That's a few messages already — please try again shortly.")
      } else if (status === 503 || status === 502) {
        toast.error(
          `We couldn't deliver that message. Please call us on ${PHONE} or use WhatsApp.`,
          { duration: 8000 },
        )
      } else {
        toast.error("Could not send your message. Please try again.")
      }
    }
  }

  /* Runs when validation blocks the submit. Any error on a field with no
     inline message would otherwise be invisible — see INLINE_ERROR_FIELDS. */
  function onInvalid(formErrors: FieldErrors<ContactMessageValues>) {
    const unsurfaced = Object.entries(formErrors).find(
      ([field]) => !INLINE_ERROR_FIELDS.has(field),
    )

    if (unsurfaced) {
      const [field, error] = unsurfaced
      console.error(`Contact form blocked by an unsurfaced error on "${field}"`, error)
      toast.error(
        typeof error?.message === "string"
          ? error.message
          : "Please check the form and try again.",
      )
    }
  }

  const reveal = (delay: number, distance = 20) => ({
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.15 },
    variants: fadeUp(reduce, delay, distance),
  })

  const inputClass =
    "w-full rounded-[12px] border border-rose-mid bg-rose-surface px-4 py-3 font-ui text-sm text-rose-ink outline-none transition-colors placeholder:text-rose-muted/60 focus:border-rose-accent focus:ring-2 focus:ring-rose-accent/25"

  const labelClass = "block font-ui text-xs font-semibold text-rose-ink"

  return (
    /* Takes over `#contact` from the footer, which held the anchor only
       because there was nothing better to point the nav at. */
    <section
      id="contact"
      className="scroll-mt-24 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,#fbe4ee_0%,#fdf2f5_60%)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          {/* ── Left: the form ───────────────────────────────────────── */}
          <div>
            <motion.p
              {...reveal(0, 14)}
              className="flex items-center gap-2 font-ui text-[10px] font-semibold tracking-[0.22em] text-rose-accent uppercase sm:text-[11px]"
            >
              <Sparkles className="size-3" aria-hidden />
              Contact
            </motion.p>

            <motion.h2
              {...reveal(0.08)}
              className="mt-4 font-display text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.15] font-medium tracking-[-0.01em] text-rose-ink"
            >
              Let&rsquo;s talk
            </motion.h2>

            <motion.p
              {...reveal(0.14)}
              className="mt-4 max-w-md font-ui text-sm leading-[1.7] text-rose-muted sm:text-base"
            >
              Not sure which service you need, or how long your locs will take?
              Send us a note and we&rsquo;ll come back to you with an honest
              answer.
            </motion.p>

            <motion.form
              {...reveal(0.2, 24)}
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              noValidate
              className="mt-9 flex flex-col gap-5"
            >
              {/* Honeypot — off-screen rather than display:none, which is the
                  first thing a bot checks for. Never focusable, never read. */}
              <div className="absolute -left-[9999px]" aria-hidden>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>

              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  Full name <span className="text-rose-accent">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  className={`mt-2 ${inputClass}`}
                  {...register("name")}
                />
                {errors.name && (
                  <p
                    id="contact-name-error"
                    className="mt-1.5 font-ui text-xs text-red-600"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  Email <span className="text-rose-accent">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Type your email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  className={`mt-2 ${inputClass}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p
                    id="contact-email-error"
                    className="mt-1.5 font-ui text-xs text-red-600"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-phone" className={labelClass}>
                  Phone number{" "}
                  <span className="font-normal text-rose-muted">(optional)</span>
                </label>
                {/* The dial code is a separate control because the API stores
                    it separately — the route joins it to the national number.
                    Local customers get "+27" preselected and never touch it. */}
                <div className="mt-2 flex gap-2">
                  <select
                    aria-label="Country dial code"
                    className={`${inputClass} w-auto shrink-0 pr-2`}
                    {...register("dialCode")}
                  >
                    {DIAL_CODES.map((entry) => (
                      <option key={entry.iso} value={entry.code}>
                        {entry.iso} {entry.code}
                      </option>
                    ))}
                  </select>

                  <input
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="00 000 0000"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                    className={inputClass}
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p
                    id="contact-phone-error"
                    className="mt-1.5 font-ui text-xs text-red-600"
                  >
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  How can we help? <span className="text-rose-accent">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell us what you're after — service, hair length, when you'd like to come in."
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  className={`mt-2 resize-y ${inputClass}`}
                  {...register("message")}
                />
                {errors.message && (
                  <p
                    id="contact-message-error"
                    className="mt-1.5 font-ui text-xs text-red-600"
                  >
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* The reference also carries a required "I accept the privacy
                  policy" tick. Left out on purpose: the only privacy-policy
                  link on this site points at "#", and gating a form on
                  consent to a document that does not exist is worse than not
                  asking. Add it back the moment that page does — and add the
                  matching `consent` field back to features/contact/schema.ts
                  in the same change, or the form silently stops submitting. */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 accent-rose-accent"
                  {...register("marketingOptIn")}
                />
                <span className="font-ui text-xs leading-[1.6] text-rose-muted">
                  I&rsquo;d like to hear about new services and offers{" "}
                  <span className="text-rose-muted/70">(optional)</span>
                </span>
              </label>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-accent px-8 py-3.5 font-ui text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(236,72,153,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-accent active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  )}
                  {isSubmitting ? "Sending…" : "Send message"}
                </button>
              </div>
            </motion.form>
          </div>

          {/* ── Right: map, hours, direct lines ──────────────────────── */}
          <div className="flex flex-col gap-6">
            <motion.div
              {...reveal(0.1, 28)}
              className="relative h-[300px] overflow-hidden rounded-[22px] shadow-[0_24px_60px_-28px_rgba(39,33,42,0.45)] sm:h-[340px]"
            >
              {/* The plain /maps?q=…&output=embed form needs no API key and no
                  billing account, unlike the Embed API. Lazy so a map far
                  down the page doesn't cost anything on first paint. */}
              <iframe
                title={`Map showing ${SALON_ADDRESS}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-rose-surface px-4 py-2.5 font-ui text-xs font-semibold text-rose-ink shadow-[0_12px_28px_-10px_rgba(39,33,42,0.6)] transition-colors hover:bg-rose-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-accent"
              >
                <Navigation className="size-3.5" aria-hidden />
                Get directions
              </a>
            </motion.div>

            <motion.div
              {...reveal(0.16, 28)}
              className="rounded-[22px] bg-rose-surface p-7 shadow-[0_24px_60px_-30px_rgba(39,33,42,0.4)] sm:p-8"
            >
              <h3 className="flex items-center gap-2.5 font-display text-lg font-medium text-rose-ink">
                <Clock className="size-4 text-rose-accent" aria-hidden />
                Opening hours
              </h3>

              <dl className="mt-5">
                {openingHours.map((entry) => {
                  const isToday = entry.day === today
                  const closed = entry.hours === "Closed"

                  return (
                    <div
                      key={entry.day}
                      className={`flex items-center justify-between gap-4 border-b border-rose-mid/60 py-2.5 last:border-0 ${
                        isToday ? "-mx-3 rounded-lg bg-rose-mid/35 px-3" : ""
                      }`}
                    >
                      <dt className="font-ui text-sm text-rose-muted">
                        {entry.day}
                        {isToday && (
                          <span className="ml-2 font-semibold text-rose-accent">
                            Today
                          </span>
                        )}
                      </dt>
                      <dd
                        className={`font-ui text-sm font-semibold ${
                          closed ? "text-rose-muted/70" : "text-rose-ink"
                        }`}
                      >
                        {entry.hours}
                      </dd>
                    </div>
                  )
                })}
              </dl>

              <div className="mt-7 flex flex-col gap-4 border-t border-rose-mid pt-6">
                <p className="flex items-start gap-3 font-ui text-sm text-rose-muted">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-rose-accent"
                    aria-hidden
                  />
                  {SALON_ADDRESS}
                </p>

                {/* Dial the international form, print the local one. Stripping
                    spaces off the display string, as this used to, yields a
                    bare 0-prefixed number that fails from abroad. */}
                <a
                  href={`tel:${SALON_PHONE}`}
                  className="flex items-center gap-3 font-ui text-sm text-rose-muted transition-colors hover:text-rose-accent"
                >
                  <Phone className="size-4 shrink-0 text-rose-accent" aria-hidden />
                  {PHONE}
                </a>

                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 font-ui text-sm text-rose-muted transition-colors hover:text-rose-accent"
                >
                  <Mail className="size-4 shrink-0 text-rose-accent" aria-hidden />
                  {EMAIL}
                </a>

                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-ui text-sm text-rose-muted transition-colors hover:text-rose-accent"
                >
                  <MessageCircle
                    className="size-4 shrink-0 text-rose-accent"
                    aria-hidden
                  />
                  Message us on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
