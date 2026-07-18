import Image from "next/image"
import {
  CalendarCheck,
  ChevronRight,
  Clock,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { BookingWizard } from "@/features/bookings/components/booking-wizard"
import { stockPhotos } from "@/lib/stock-photos"

const heroSteps = [
  { n: "1", label: "Choose Service", icon: Sparkles },
  { n: "2", label: "Select Time", icon: Clock },
  { n: "3", label: "Confirm Booking", icon: CalendarCheck },
]

const features = [
  { icon: CalendarCheck, title: "Easy Booking", text: "Book your appointment in just a few clicks." },
  { icon: Users, title: "Expert Stylists", text: "Our professionals are here to make you look your best." },
  { icon: ShieldCheck, title: "Hygiene & Safety", text: "We follow top-notch hygiene standards for your safety." },
  { icon: Sparkles, title: "Best Experience", text: "Relax and enjoy a premium salon experience." },
]

export default function BookPage() {
  return (
    <div className="flex flex-1 flex-col bg-[#fcf9f5] text-[#1c1c1a]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[58%]">
          <Image
            src={stockPhotos.hero}
            alt="Salon client with beautifully styled hair"
            fill
            priority
            sizes="(min-width: 640px) 58vw, 100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#fcf9f5] via-[#fcf9f5]/70 to-[#fcf9f5]/20 sm:bg-linear-to-r sm:from-[#fcf9f5] sm:via-[#fcf9f5]/40 sm:to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-16 sm:pt-36 sm:pb-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-[0.3em] text-[#775a19]">
                BOOK YOUR APPOINTMENT
              </span>
              <span className="h-px w-12 bg-[#775a19]/40" />
            </div>

            <h1 className="mt-5 font-lux text-5xl leading-[1.05] font-bold sm:text-6xl">
              We Can&apos;t Wait
              <br />
              To <span className="italic text-[#775a19]">Pamper</span> You
              <Sparkles className="ml-2 inline size-7 text-[#775a19]" />
            </h1>

            <p className="mt-5 max-w-md text-sm text-[#444748]">
              Choose your preferred service, stylist, and time. We&apos;ll take
              care of the rest.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {heroSteps.map((s, i) => (
                <div key={s.n} className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full border border-[#775a19]/30 bg-[#fcf9f5]/70 text-[#775a19] backdrop-blur">
                      <s.icon className="size-5" />
                    </span>
                    <span className="text-xs font-medium text-[#1c1c1a]/80">
                      {s.n}. {s.label}
                    </span>
                  </div>
                  {i < heroSteps.length - 1 && (
                    <ChevronRight className="size-4 text-[#1c1c1a]/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wizard */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <BookingWizard />
        </div>
      </section>

      {/* Features strip */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fed488]/50 text-[#785a1a]">
                  <f.icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#1c1c1a]">{f.title}</h3>
                  <p className="mt-0.5 text-xs text-neutral-500">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
