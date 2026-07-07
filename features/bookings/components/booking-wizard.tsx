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
import { SERVICE_CATEGORIES } from "@/features/services/schema"
import { useServices } from "@/features/bookings/hooks/use-services"
import { useStylists } from "@/features/bookings/hooks/use-stylists"
import { useCreateBooking } from "@/features/bookings/hooks/use-create-booking"
import { HairstyleUpload } from "@/features/bookings/components/hairstyle-upload"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { stockPhotos, serviceThumb } from "@/lib/stock-photos"
import type { Service, Stylist } from "@/types"

const GOLD = "#c9a24b"

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
  ["customerName", "customerEmail"],
  [],
]

const TIME_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const total = 9 * 60 + i * 30
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
})

function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

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
    useState<(typeof SERVICE_CATEGORIES)[number]>("Hair")
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

  const serviceImage = (service: Service) =>
    service.image ||
    serviceThumb(
      service.category,
      services.findIndex((s) => s.id === service.id)
    )

  const categoryServices = services.filter(
    (s) => (s.category ?? "Hair") === activeCategory
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

  async function onSubmit(data: CreateBookingFormValues) {
    try {
      await createBooking.mutateAsync(data)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-black/5 bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#c9a24b]/15 text-[#c9a24b]">
          <Check className="size-7" />
        </span>
        <h2 className="mt-5 font-lux text-2xl font-semibold text-[#1a1a1a]">
          Your appointment is booked!
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
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
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#1a1a1a] px-6 text-sm font-semibold text-white hover:bg-black"
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
                        "border-transparent bg-[#1a1a1a] text-white",
                      state === "done" &&
                        "border-transparent bg-[#c9a24b] text-white",
                      state === "upcoming" &&
                        "border-black/10 bg-white text-neutral-400"
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
                        i < step ? "bg-[#c9a24b]" : "bg-black/10"
                      )}
                    />
                  )}
                </div>
                <div className="pt-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      state === "upcoming" ? "text-neutral-400" : "text-[#1a1a1a]"
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
      <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
        {/* Mobile step chips */}
        <div className="mb-5 flex items-center gap-1.5 overflow-x-auto lg:hidden">
          {STEPS.map((s, i) => (
            <span
              key={s.key}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
                i === step
                  ? "bg-[#1a1a1a] text-white"
                  : i < step
                    ? "bg-[#c9a24b]/15 text-[#c9a24b]"
                    : "bg-neutral-100 text-neutral-400"
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
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-black/10 px-5 text-sm font-medium text-[#1a1a1a] hover:bg-neutral-50"
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
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1a1a1a] px-6 text-sm font-semibold text-white hover:bg-black"
            >
              Continue
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={createBooking.isPending}
              onClick={handleSubmit(onSubmit)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-linear-to-r from-[#d9bd85] to-[#c9a24b] px-6 text-sm font-semibold text-[#1a1408] hover:opacity-90 disabled:opacity-60"
            >
              {createBooking.isPending && <Loader2 className="size-4 animate-spin" />}
              Confirm Booking
            </button>
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
        />

        <div className="rounded-2xl bg-[#c9a24b]/10 p-5 text-center">
          <h3 className="font-lux text-lg font-semibold text-[#c9a24b]">
            Need Help?
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Call us or message on WhatsApp for any assistance.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm font-medium text-[#1a1a1a]">
            <a href="tel:+15551234567" className="flex items-center justify-center gap-2">
              <Phone className="size-4 text-[#c9a24b]" />
              +1 (555) 123-4567
            </a>
            <a
              href="https://wa.me/15551234567"
              className="flex items-center justify-center gap-2"
            >
              <Sparkles className="size-4 text-[#c9a24b]" />
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
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}) {
  const countByCategory = (category: string) =>
    services.filter((s) => (s.category ?? "Hair") === category).length

  return (
    <div>
      <h2 className="font-lux text-xl font-semibold text-[#1a1a1a]">
        1. Choose Your Service
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
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
                  ? "border-transparent bg-[#1a1a1a] text-white"
                  : "border-black/10 bg-white text-[#1a1a1a] hover:border-[#c9a24b]/50"
              )}
            >
              <span>{category}</span>
              <span
                className={cn(
                  "hidden text-xs sm:inline",
                  activeCategory === category ? "text-white/60" : "text-neutral-400"
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
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-neutral-500">
              <Loader2 className="size-4 animate-spin" />
              Loading services…
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-black/10 py-12 text-center text-sm text-neutral-500">
              Couldn&apos;t load services. Please try again.
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1a1a1a] px-4 text-xs font-semibold text-white hover:bg-black"
              >
                Retry
              </button>
            </div>
          ) : categoryServices.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/10 py-12 text-center text-sm text-neutral-400">
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
                      ? "border-[#c9a24b] bg-[#c9a24b]/5"
                      : "border-black/10 hover:border-[#c9a24b]/50"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-[#1a1a1a]">{service.name}</h3>
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                          active ? "border-[#c9a24b]" : "border-black/20"
                        )}
                      >
                        {active && (
                          <span className="size-2.5 rounded-full bg-[#c9a24b]" />
                        )}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                      {service.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="font-semibold text-[#1a1a1a]">
                        {formatUSD(service.price)}
                      </span>
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Clock className="size-3.5" />
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                  </div>
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={serviceImage(service)}
                      alt={service.name}
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
      <h2 className="font-lux text-xl font-semibold text-[#1a1a1a]">
        2. Choose Your Stylist
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
        Pick the professional you&apos;d like to book with.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-neutral-500">
          <Loader2 className="size-4 animate-spin" />
          Loading stylists…
        </div>
      ) : isError ? (
        <div className="mt-5 flex flex-col items-center gap-3 rounded-xl border border-dashed border-black/10 py-12 text-center text-sm text-neutral-500">
          Couldn&apos;t load stylists. Please try again.
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1a1a1a] px-4 text-xs font-semibold text-white hover:bg-black"
          >
            Retry
          </button>
        </div>
      ) : list.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-black/10 py-12 text-center text-sm text-neutral-400">
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
                  ? "border-[#c9a24b] bg-[#c9a24b]/5"
                  : "border-black/10 hover:border-[#c9a24b]/50"
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
                <h3 className="font-medium text-[#1a1a1a]">{stylist.name}</h3>
                <p className="line-clamp-1 text-xs text-neutral-500">
                  {stylist.services.map((s) => s.name).slice(0, 2).join(", ") ||
                    stylist.bio ||
                    "Salon stylist"}
                </p>
              </div>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  active ? "border-[#c9a24b]" : "border-black/20"
                )}
              >
                {active && <span className="size-2.5 rounded-full bg-[#c9a24b]" />}
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
      <h2 className="font-lux text-xl font-semibold text-[#1a1a1a]">
        3. Select Date &amp; Time
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
        Choose when you&apos;d like your appointment.
      </p>

      <div className="mt-5 max-w-xs">
        <label className="text-sm font-medium text-[#1a1a1a]" htmlFor="booking-date">
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
        <p className="text-sm font-medium text-[#1a1a1a]">Available times</p>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onTime(slot)}
              className={cn(
                "rounded-lg border py-2 text-sm font-medium transition-colors",
                time === slot
                  ? "border-transparent bg-[#1a1a1a] text-white"
                  : "border-black/10 text-[#1a1a1a] hover:border-[#c9a24b]/60"
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
      <h2 className="font-lux text-xl font-semibold text-[#1a1a1a]">
        4. Your Details
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
        Tell us who the appointment is for.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-[#1a1a1a]" htmlFor="name">
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
          <label className="text-sm font-medium text-[#1a1a1a]" htmlFor="email">
            Email
          </label>
          <Input id="email" type="email" className="mt-1.5" {...register("customerEmail")} />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-destructive">
              {errors.customerEmail.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-[#1a1a1a]" htmlFor="notes">
          Notes <span className="text-neutral-400">(optional)</span>
        </label>
        <Textarea
          id="notes"
          className="mt-1.5"
          placeholder="Anything we should know before your visit?"
          {...register("notes")}
        />
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-[#1a1a1a]">
          Reference photos <span className="text-neutral-400">(optional)</span>
        </p>
        <p className="mb-2 text-sm text-neutral-500">
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
      <h2 className="font-lux text-xl font-semibold text-[#1a1a1a]">
        5. Review &amp; Confirm
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
        Please review your appointment details before confirming.
      </p>

      <dl className="mt-5 divide-y divide-black/5 rounded-xl border border-black/5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3 text-sm">
            <dt className="text-neutral-500">{row.label}</dt>
            <dd className="font-medium text-[#1a1a1a]">{row.value ?? "—"}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3.5">
          <dt className="font-lux text-base font-semibold text-[#1a1a1a]">Total</dt>
          <dd className="font-lux text-base font-semibold text-[#c9a24b]">
            {formatUSD(service?.price ?? 0)}
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
}: {
  service?: Service
  stylist?: Stylist
  date: string
  time: string
  serviceImage: (s: Service) => string
}) {
  const rows = [
    { label: "Service", value: service?.name },
    { label: "Staff", value: stylist?.name },
    {
      label: "Date & Time",
      value: date && time ? `${formatDate(date)}, ${formatTime(time)}` : date ? formatDate(date) : undefined,
    },
    { label: "Duration", value: service ? formatDuration(service.duration) : undefined },
    { label: "Amount", value: service ? formatUSD(service.price) : undefined },
  ]

  return (
    <div className="rounded-2xl bg-[#171717] p-5 text-white">
      <h3 className="font-lux text-lg font-semibold" style={{ color: GOLD }}>
        Your Booking Summary
      </h3>

      <div className="mt-4 flex items-center gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-white/10">
          <Image
            src={service ? serviceImage(service) : stockPhotos.salonInterior}
            alt={service?.name ?? "Salon"}
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
        <span className="font-lux text-lg font-semibold">Total</span>
        <span className="font-lux text-lg font-semibold" style={{ color: GOLD }}>
          {formatUSD(service?.price ?? 0)}
        </span>
      </div>
    </div>
  )
}
