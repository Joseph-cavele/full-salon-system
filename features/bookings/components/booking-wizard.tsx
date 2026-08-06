                                                                                                                                                                                                                                                  "use client"

import { useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Loader2,
  Phone,
  Scissors,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react"
import {
  createBookingSchema,
  type CreateBookingFormValues,
} from "@/features/bookings/schema"
import { DEFAULT_SERVICE_CATEGORY, SERVICE_CATEGORIES } from "@/features/services/schema"
import { useServices } from "@/features/bookings/hooks/use-services"
import { useStylists } from "@/features/bookings/hooks/use-stylists"
import { useCreateBooking } from "@/features/bookings/hooks/use-create-booking"
import { HairstyleUpload } from "@/features/bookings/components/hairstyle-upload"
import { startPayment } from "@/features/bookings/start-payment"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { stockPhotos, serviceThumb } from "@/lib/stock-photos"
import { serviceImageByName } from "@/lib/salon-services"
import {
  SALON_PHONE,
  SALON_PHONE_DISPLAY,
  WHATSAPP_MESSAGES,
  whatsappLink,
} from "@/lib/salon-contact"
import { formatCurrency } from "@/lib/currency"
import type { PaymentMethod, Service, Stylist } from "@/types"


const STEPS = [
  { key: "service", label: "Service", icon: Scissors },
  { key: "staff", label: "Staff", icon: Users },
  { key: "datetime", label: "Date & Time", icon: CalendarDays },
  { key: "details", label: "Your Details", icon: UserRound },
  { key: "review", label: "Review & Confirm", icon: BadgeCheck },
] as const

const STEP_FIELDS: (keyof CreateBookingFormValues)[][] = [
  ["serviceIds"],
  ["stylistId"],
  ["bookingDate", "bookingTime"],
  ["customerName", "customerEmail", "customerPhone"],
  [],
]

const TIME_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const total = 9 * 60 + i * 30
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
})

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} mins`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}m` : `${hours} hr`
}

function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number)
  const ap = h >= 12 ? "PM" : "AM"
  const hr = h % 12 || 12
  return `${hr}:${String(m).padStart(2, "0")} ${ap}`
}

function formatDate(iso: string) {
  if (!iso) return ""
  const [y, mo, d] = iso.split("-").map(Number)
  return new Date(y, mo - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

const todayISO = () => new Date().toISOString().split("T")[0]

export function BookingWizard() {
  const [step, setStep] = useState(0)
  const [activeCategory, setActiveCategory] =
    useState<(typeof SERVICE_CATEGORIES)[number]>(DEFAULT_SERVICE_CATEGORY)
  const [submitted, setSubmitted] = useState(false)

  const {
    data: services = [],
    isLoading: servicesLoading,
    isError: servicesError,
    refetch: refetchServices,
  } = useServices()
  const {
    data: stylists = [],
    isLoading: stylistsLoading,
    isError: stylistsError,
    refetch: refetchStylists,
  } = useStylists()
  const createBooking = useCreateBooking()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<CreateBookingFormValues>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      // Overwritten by whichever finish button is pressed.
      paymentMethod: "IN_PERSON",
      serviceIds: [],
      stylistId: "",
      bookingDate: "",
      bookingTime: "",
      description: "",
      notes: "",
      imageUrls: [],
    },
  })

  const values = watch()
  const selectedService = services.find((s) => s.id === values.serviceIds?.[0])
  const selectedStylist = stylists.find((s) => s.id === values.stylistId)

  /* Resolution order matters. A photo stored on the Service document wins,
     because that is the salon's own upload. Otherwise the curated map keyed
     by service name — every entry there was opened and looked at, so it
     actually shows the service being booked. `serviceThumb` is the last
     resort for a service added to the database but not yet to the catalogue;
     it picks from a small per-category stock pool and will repeat, which is
     precisely why it is no longer the first thing tried. */
  const servicePhoto = (service: Service) => serviceImageByName[service.name]

  const serviceImage = (service: Service) =>
    service.image ||
    servicePhoto(service)?.image ||
    serviceThumb(
      service.category,
      services.findIndex((s) => s.id === service.id)
    )

  /* Describes what is in the frame. Falling back to the service name would
     make the alt text a duplicate of the heading beside it, which a screen
     reader then reads twice. */
  const serviceImageAlt = (service: Service) => servicePhoto(service)?.alt ?? ""

  const categoryServices = services.filter(
    (s) => (s.category ?? DEFAULT_SERVICE_CATEGORY) === activeCategory
  )

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step])
    if (!valid) {
      if (step === 0) toast.error("Please choose a service to continue")
      if (step === 1) toast.error("Please choose a stylist to continue")
      if (step === 2) toast.error("Please pick a date and time")
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  /* Which button is mid-flight, so only that one spins. `busy` disables both,
     because double-submitting creates two bookings for the same slot. */
  const [pendingMethod, setPendingMethod] = useState<PaymentMethod | null>(null)
  const busy = createBooking.isPending || pendingMethod !== null

  /** Stamps the chosen method onto the form, then runs the normal submit. */
  const submitWith = (method: PaymentMethod) => () => {
    setValue("paymentMethod", method)
    return handleSubmit(onSubmit, onInvalid)()
  }

  async function onSubmit(data: CreateBookingFormValues) {
    setPendingMethod(data.paymentMethod)
    try {
      const booking = await createBooking.mutateAsync(data)

      if (data.paymentMethod === "ONLINE") {
        /* Hands off to Paystack. No success screen here — the booking is not
           confirmed yet, and saying so before the money moves is the one thing
           this flow must never do. The callback route decides what the
           customer sees next. */
        await startPayment(booking.id)
        return
      }

      setPendingMethod(null)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setPendingMethod(null)
      // Surface the server's actual reason (e.g. "Stylist not found",
      // "Invalid booking data") instead of a generic message, so failures
      // are diagnosable rather than silent.
      const serverError =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : undefined
      toast.error(serverError || "Something went wrong. Please try again.")
    }
  }

  // Called when the final submit fails client-side validation, so the Confirm
  // button never just does nothing.
  function onInvalid(formErrors: typeof errors) {
    const firstMessage = Object.values(formErrors).find((e) => e?.message)?.message
    toast.error(
      (firstMessage as string) ||
        "Please complete all required fields before confirming."
    )
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-rose-mid/60 bg-rose-surface p-10 text-center shadow-sm">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-accent/15 text-rose-accent">
          <Check className="size-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-rose-ink">
          Your appointment is booked!
        </h2>
        <p className="mt-2 text-sm text-rose-muted">
          We&apos;ve received your request and will confirm your appointment
          shortly by email.
        </p>
        <button
          type="button"
          onClick={() => {
            reset()
            setStep(0)
            setSubmitted(false)
          }}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-rose-accent px-6 text-sm font-semibold text-white hover:bg-rose-accent/90"
        >
          Book another appointment
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
      {/* Vertical stepper */}
      <aside className="hidden lg:block">
        <ol className="flex flex-col">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const state = i < step ? "done" : i === step ? "active" : "upcoming"
            return (
              <li key={s.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full border transition-colors",
                      state === "active" &&
                        "border-transparent bg-rose-accent text-white",
                      state === "done" &&
                        "border-transparent bg-rose-accent text-white",
                      state === "upcoming" &&
                        "border-rose-mid bg-rose-surface text-rose-muted/70"
                    )}
                  >
                    {state === "done" ? (
                      <Check className="size-4" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span
                      className={cn(
                        "my-1 h-8 w-px",
                        i < step ? "bg-rose-accent" : "bg-rose-mid"
                      )}
                    />
                  )}
                </div>
                <div className="pt-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      state === "upcoming" ? "text-rose-muted/70" : "text-rose-ink"
                    )}
                  >
                    {s.label}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </aside>

      {/* Step content */}
      <section className="rounded-3xl border border-rose-mid/60 bg-rose-surface p-5 shadow-sm sm:p-7">
        {/* Mobile step chips */}
        <div className="mb-5 flex items-center gap-1.5 overflow-x-auto lg:hidden">
          {STEPS.map((s, i) => (
            <span
              key={s.key}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
                i === step
                  ? "bg-rose-accent text-white"
                  : i < step
                    ? "bg-rose-accent/15 text-rose-accent"
                    : "bg-rose-mid/40 text-rose-muted/70"
              )}
            >
              {i + 1}. {s.label}
            </span>
          ))}
        </div>

        {step === 0 && (
          <ServiceStep
            services={services}
            categoryServices={categoryServices}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            selectedId={values.serviceIds?.[0]}
            onSelect={(id) =>
              setValue("serviceIds", [id], { shouldValidate: true })
            }
            serviceImage={serviceImage}
            serviceImageAlt={serviceImageAlt}
            isLoading={servicesLoading}
            isError={servicesError}
            onRetry={() => refetchServices()}
          />
        )}

        {step === 1 && (
          <StaffStep
            stylists={stylists}
            selectedService={selectedService}
            selectedId={values.stylistId}
            onSelect={(id) => setValue("stylistId", id, { shouldValidate: true })}
            isLoading={stylistsLoading}
            isError={stylistsError}
            onRetry={() => refetchStylists()}
          />
        )}

        {step === 2 && (
          <DateTimeStep
            date={values.bookingDate}
            time={values.bookingTime}
            onDate={(v) => setValue("bookingDate", v, { shouldValidate: true })}
            onTime={(v) => setValue("bookingTime", v, { shouldValidate: true })}
            errors={{
              date: errors.bookingDate?.message,
              time: errors.bookingTime?.message,
            }}
          />
        )}

        {step === 3 && (
          <DetailsStep
            register={register}
            errors={errors}
            onImages={(urls) =>
              setValue("imageUrls", urls, { shouldValidate: true })
            }
          />
        )}

        {step === 4 && (
          <ReviewStep
            service={selectedService}
            stylist={selectedStylist}
            date={values.bookingDate}
            time={values.bookingTime}
            name={values.customerName}
            email={values.customerEmail}
          />
        )}

        {/* Nav buttons */}
        <div className="mt-7 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-rose-mid px-5 text-sm font-medium text-rose-ink hover:bg-rose-ground"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
          ) : (
            <span />
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-rose-accent px-6 text-sm font-semibold text-white hover:bg-rose-accent/90"
            >
              Continue
              <ArrowRight className="size-4" />
            </button>
          ) : (
            /* Two ways to finish, and the choice is the submit. Both create
               the same booking; only `paymentMethod` differs, which is what
               decides whether the server holds it at PENDING_PAYMENT and
               sends the customer to Paystack. */
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                disabled={busy}
                onClick={submitWith("IN_PERSON")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-rose-mid px-5 text-sm font-semibold text-rose-ink transition-colors hover:border-rose-accent hover:text-rose-accent disabled:opacity-60"
              >
                {pendingMethod === "IN_PERSON" && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Pay in person
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={submitWith("ONLINE")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-rose-accent px-6 text-sm font-semibold text-white shadow-[0_4px_20px_-5px_rgba(236,72,153,0.35)] transition-colors hover:bg-rose-accent/90 disabled:opacity-60"
              >
                {pendingMethod === "ONLINE" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CreditCard className="size-4" aria-hidden />
                )}
                {pendingMethod === "ONLINE" ? "Redirecting…" : "Pay now"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Summary + help */}
      <aside className="flex flex-col gap-5">
        <BookingSummary
          service={selectedService}
          stylist={selectedStylist}
          date={values.bookingDate}
          time={values.bookingTime}
          serviceImage={serviceImage}
          serviceImageAlt={serviceImageAlt}
        />

        <div className="rounded-2xl bg-rose-accent/10 p-5 text-center">
          <h3 className="font-display text-lg font-semibold text-rose-accent">
            Need Help?
          </h3>
          <p className="mt-1 text-xs text-rose-muted">
            Call us or message on WhatsApp for any assistance.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm font-medium text-rose-ink">
            <a href={`tel:${SALON_PHONE}`} className="flex items-center justify-center gap-2">
              <Phone className="size-4 text-rose-accent" />
              {SALON_PHONE_DISPLAY}
            </a>
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.booking)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Sparkles className="size-4 text-rose-accent" />
              WhatsApp us
            </a>
          </div>
        </div>
      </aside>
    </div>
  )
}

/* ---------------- Step 1: Service ---------------- */

function ServiceStep({
  services,
  categoryServices,
  activeCategory,
  setActiveCategory,
  selectedId,
  onSelect,
  serviceImage,
  serviceImageAlt,
  isLoading,
  isError,
  onRetry,
}: {
  services: Service[]
  categoryServices: Service[]
  activeCategory: (typeof SERVICE_CATEGORIES)[number]
  setActiveCategory: (c: (typeof SERVICE_CATEGORIES)[number]) => void
  selectedId?: string
  onSelect: (id: string) => void
  serviceImage: (s: Service) => string
  serviceImageAlt: (s: Service) => string
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}) {
  const countByCategory = (category: string) =>
    services.filter((s) => (s.category ?? DEFAULT_SERVICE_CATEGORY) === category).length

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-rose-ink">
        1. Choose Your Service
      </h2>
      <p className="mt-1 text-sm text-rose-muted">
        Select the service you would like to book.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)]">
        {/* Category rail */}
        <div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
          {SERVICE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "flex shrink-0 items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors sm:w-full",
                activeCategory === category
                  ? "border-transparent bg-rose-accent text-white"
                  : "border-rose-mid bg-rose-surface text-rose-ink hover:border-rose-accent/50"
              )}
            >
              <span>{category}</span>
              <span
                className={cn(
                  "hidden text-xs sm:inline",
                  activeCategory === category ? "text-white/60" : "text-rose-muted/70"
                )}
              >
                {countByCategory(category)}
              </span>
            </button>
          ))}
        </div>

        {/* Service cards */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-rose-muted">
              <Loader2 className="size-4 animate-spin" />
              Loading services…
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-rose-mid py-12 text-center text-sm text-rose-muted">
              Couldn&apos;t load services. Please try again.
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-rose-accent px-4 text-xs font-semibold text-white hover:bg-rose-accent/90"
              >
                Retry
              </button>
            </div>
          ) : categoryServices.length === 0 ? (
            <div className="rounded-xl border border-dashed border-rose-mid py-12 text-center text-sm text-rose-muted/70">
              No services in this category yet.
            </div>
          ) : (
            categoryServices.map((service) => {
              const active = selectedId === service.id
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => onSelect(service.id)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-3 text-left transition-colors",
                    active
                      ? "border-rose-accent bg-rose-accent/5"
                      : "border-rose-mid hover:border-rose-accent/50"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-rose-ink">{service.name}</h3>
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                          active ? "border-rose-accent" : "border-rose-mid"
                        )}
                      >
                        {active && (
                          <span className="size-2.5 rounded-full bg-rose-accent" />
                        )}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-rose-muted">
                      {service.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="font-semibold text-rose-ink">
                        {formatCurrency(service.price)}
                      </span>
                      <span className="flex items-center gap-1 text-rose-muted/70">
                        <Clock className="size-3.5" />
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                  </div>
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={serviceImage(service)}
                      alt={serviceImageAlt(service)}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Step 2: Staff ---------------- */

function StaffStep({
  stylists,
  selectedService,
  selectedId,
  onSelect,
  isLoading,
  isError,
  onRetry,
}: {
  stylists: Stylist[]
  selectedService?: Service
  selectedId?: string
  onSelect: (id: string) => void
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}) {
  const eligible = selectedService
    ? stylists.filter(
        (s) =>
          s.services.length === 0 ||
          s.services.some((svc) => svc.id === selectedService.id)
      )
    : stylists
  const list = eligible.length > 0 ? eligible : stylists

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-rose-ink">
        2. Choose Your Stylist
      </h2>
      <p className="mt-1 text-sm text-rose-muted">
        Pick the professional you&apos;d like to book with.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-rose-muted">
          <Loader2 className="size-4 animate-spin" />
          Loading stylists…
        </div>
      ) : isError ? (
        <div className="mt-5 flex flex-col items-center gap-3 rounded-xl border border-dashed border-rose-mid py-12 text-center text-sm text-rose-muted">
          Couldn&apos;t load stylists. Please try again.
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-rose-accent px-4 text-xs font-semibold text-white hover:bg-rose-accent/90"
          >
            Retry
          </button>
        </div>
      ) : list.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-rose-mid py-12 text-center text-sm text-rose-muted/70">
          No stylists available right now.
        </div>
      ) : (
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {list.map((stylist, i) => {
          const active = selectedId === stylist.id
          return (
            <button
              key={stylist.id}
              type="button"
              onClick={() => onSelect(stylist.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                active
                  ? "border-rose-accent bg-rose-accent/5"
                  : "border-rose-mid hover:border-rose-accent/50"
              )}
            >
              <Avatar size="lg" className="size-12">
                <AvatarImage
                  src={
                    stockPhotos.stylistHeadshots[i % stockPhotos.stylistHeadshots.length]
                  }
                  alt={stylist.name}
                />
                <AvatarFallback>
                  {stylist.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-rose-ink">{stylist.name}</h3>
                <p className="line-clamp-1 text-xs text-rose-muted">
                  {stylist.services.map((s) => s.name).slice(0, 2).join(", ") ||
                    stylist.bio ||
                    "Salon stylist"}
                </p>
              </div>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  active ? "border-rose-accent" : "border-rose-mid"
                )}
              >
                {active && <span className="size-2.5 rounded-full bg-rose-accent" />}
              </span>
            </button>
          )
        })}
      </div>
      )}
    </div>
  )
}

/* ---------------- Step 3: Date & Time ---------------- */

function DateTimeStep({
  date,
  time,
  onDate,
  onTime,
  errors,
}: {
  date: string
  time: string
  onDate: (v: string) => void
  onTime: (v: string) => void
  errors: { date?: string; time?: string }
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-rose-ink">
        3. Select Date &amp; Time
      </h2>
      <p className="mt-1 text-sm text-rose-muted">
        Choose when you&apos;d like your appointment.
      </p>

      <div className="mt-5 max-w-xs">
        <label className="text-sm font-medium text-rose-ink" htmlFor="booking-date">
          Date
        </label>
        <Input
          id="booking-date"
          type="date"
          min={todayISO()}
          value={date}
          onChange={(e) => onDate(e.target.value)}
          className="mt-1.5"
        />
        {errors.date && <p className="mt-1 text-sm text-destructive">{errors.date}</p>}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-rose-ink">Available times</p>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onTime(slot)}
              className={cn(
                "rounded-lg border py-2 text-sm font-medium transition-colors",
                time === slot
                  ? "border-transparent bg-rose-accent text-white"
                  : "border-rose-mid text-rose-ink hover:border-rose-accent/60"
              )}
            >
              {formatTime(slot)}
            </button>
          ))}
        </div>
        {errors.time && <p className="mt-2 text-sm text-destructive">{errors.time}</p>}
      </div>
    </div>
  )
}

/* ---------------- Step 4: Details ---------------- */

function DetailsStep({
  register,
  errors,
  onImages,
}: {
  register: ReturnType<typeof useForm<CreateBookingFormValues>>["register"]
  errors: ReturnType<
    typeof useForm<CreateBookingFormValues>
  >["formState"]["errors"]
  onImages: (urls: string[]) => void
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-rose-ink">
        4. Your Details
      </h2>
      <p className="mt-1 text-sm text-rose-muted">
        Tell us who the appointment is for.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-rose-ink" htmlFor="name">
            Full name
          </label>
          <Input id="name" className="mt-1.5" {...register("customerName")} />
          {errors.customerName && (
            <p className="mt-1 text-sm text-destructive">
              {errors.customerName.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-rose-ink" htmlFor="email">
            Email
          </label>
          <Input id="email" type="email" className="mt-1.5" {...register("customerEmail")} />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-destructive">
              {errors.customerEmail.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-rose-ink" htmlFor="phone">
            Phone number
          </label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+27 82 123 4567"
            className="mt-1.5"
            {...register("customerPhone")}
          />
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-destructive">
              {errors.customerPhone.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-rose-ink" htmlFor="notes">
          Notes <span className="text-rose-muted/70">(optional)</span>
        </label>
        <Textarea
          id="notes"
          className="mt-1.5"
          placeholder="Anything we should know before your visit?"
          {...register("notes")}
        />
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-rose-ink">
          Reference photos <span className="text-rose-muted/70">(optional)</span>
        </p>
        <p className="mb-2 text-sm text-rose-muted">
          Share inspiration for the look you want.
        </p>
        <HairstyleUpload onChange={onImages} error={errors.imageUrls?.message} />
      </div>
    </div>
  )
}

/* ---------------- Step 5: Review ---------------- */

function ReviewStep({
  service,
  stylist,
  date,
  time,
  name,
  email,
}: {
  service?: Service
  stylist?: Stylist
  date: string
  time: string
  name: string
  email: string
}) {
  const rows = [
    { label: "Service", value: service?.name },
    { label: "Stylist", value: stylist?.name },
    { label: "Date", value: date ? formatDate(date) : undefined },
    { label: "Time", value: time ? formatTime(time) : undefined },
    { label: "Duration", value: service ? formatDuration(service.duration) : undefined },
    { label: "Name", value: name },
    { label: "Email", value: email },
  ]

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-rose-ink">
        5. Review &amp; Confirm
      </h2>
      <p className="mt-1 text-sm text-rose-muted">
        Please review your appointment details before confirming.
      </p>

      <dl className="mt-5 divide-y divide-rose-mid rounded-xl border border-rose-mid/60">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3 text-sm">
            <dt className="text-rose-muted">{row.label}</dt>
            <dd className="font-medium text-rose-ink">{row.value ?? "—"}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3.5">
          <dt className="font-display text-base font-semibold text-rose-ink">Total</dt>
          <dd className="font-display text-base font-semibold text-rose-accent">
            {formatCurrency(service?.price ?? 0)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

/* ---------------- Booking summary sidebar ---------------- */

function BookingSummary({
  service,
  stylist,
  date,
  time,
  serviceImage,
  serviceImageAlt,
}: {
  service?: Service
  stylist?: Stylist
  date: string
  time: string
  serviceImage: (s: Service) => string
  serviceImageAlt: (s: Service) => string
}) {
  const rows = [
    { label: "Service", value: service?.name },
    { label: "Staff", value: stylist?.name },
    {
      label: "Date & Time",
      value: date && time ? `${formatDate(date)}, ${formatTime(time)}` : date ? formatDate(date) : undefined,
    },
    { label: "Duration", value: service ? formatDuration(service.duration) : undefined },
    { label: "Amount", value: service ? formatCurrency(service.price) : undefined },
  ]

  return (
    <div className="rounded-2xl bg-rose-glass p-5 text-white">
      <h3 className="font-display text-lg font-semibold text-rose-accent">
        Your Booking Summary
      </h3>

      <div className="mt-4 flex items-center gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-rose-surface/10">
          <Image
            src={service ? serviceImage(service) : stockPhotos.salonInterior}
            alt={service ? serviceImageAlt(service) : ""}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <p className="text-xs text-white/50">
          {service
            ? "Your selected service is shown here."
            : "No service selected yet. Please select a service to see the details here."}
        </p>
      </div>

      <dl className="mt-5 flex flex-col">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-white/10 py-2.5 text-sm"
          >
            <dt className="text-white/50">{row.label}</dt>
            <dd className="max-w-[55%] truncate text-right font-medium text-white/90">
              {row.value ?? "—"}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-display text-lg font-semibold">Total</span>
        <span className="font-display text-lg font-semibold text-rose-accent">
          {formatCurrency(service?.price ?? 0)}
        </span>
      </div>
    </div>
  )
}
