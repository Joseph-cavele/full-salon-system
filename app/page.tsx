import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  Gem,
  HeartHandshake,
  Play,
  Award,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Clock,
  Leaf,
  Wand2,
} from "lucide-react"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { stockPhotos, serviceThumb } from "@/lib/stock-photos"

const heroFeatures = [
  { icon: Gem, title: "Premium Services", text: "High-quality products and services for the best results." },
  { icon: Users, title: "Expert Stylists", text: "Our certified professionals ensure you look your best." },
  { icon: ShieldCheck, title: "Hygiene & Safety", text: "Top-notch hygiene standards for your safety and comfort." },
  { icon: Clock, title: "Flexible Booking", text: "Book your appointment anytime, anywhere." },
]

const services = [
  { title: "Haircut & Styling", text: "Trendy cuts and styling tailored just for you.", img: serviceThumb("Hair", 1) },
  { title: "Hair Coloring", text: "Vibrant colors that enhance your look.", img: serviceThumb("Hair", 0) },
  { title: "Skin Care", text: "Rejuvenate your skin with advanced treatments.", img: serviceThumb("Skin", 0) },
  { title: "Brows & Lashes", text: "Perfect brows and lashes that define you.", img: serviceThumb("Beauty", 0) },
  { title: "Nail Care", text: "Beautiful nails for every occasion.", img: serviceThumb("Nail", 0) },
]

const valueProps = [
  { icon: Gem, title: "Premium Products", text: "We use only high-quality, trusted products." },
  { icon: HeartHandshake, title: "Personalized Care", text: "Customized treatments for your unique needs." },
  { icon: Leaf, title: "Relaxing Ambience", text: "A luxurious space to relax and unwind." },
  { icon: Award, title: "100% Satisfaction", text: "Your satisfaction is our top priority." },
]

const aboutChips = [
  { icon: Users, label: "Experienced Team" },
  { icon: Wand2, label: "Modern Techniques" },
  { icon: Sparkles, label: "Luxury Experience" },
]

const stats = [
  { icon: Users, value: "5K+", label: "Happy Customers" },
  { icon: Star, value: "4.9", label: "Average Rating", star: true },
  { icon: Award, value: "10+", label: "Years of Experience" },
  { icon: Gem, value: "50+", label: "Services Offered" },
]

const testimonials = [
  { quote: "The best salon experience I've ever had! The staff is so professional and friendly. I love my new look!", name: "Sarah J." },
  { quote: "Amazing service and such a relaxing ambience. My hair has never looked better. Highly recommend!", name: "Priya M." },
  { quote: "From hair to skin, everything is perfect here. Glow & Grace is my go-to salon!", name: "Anjali K." },
]

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold tracking-[0.28em] text-[#c9a24b]">
        {children}
      </span>
      <span className="h-px w-12 bg-[#c9a24b]/50" />
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[#f5f2ec]">
      <SiteHeader active="Home" logoHref="/login" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0e0e0e] text-white">
        <div className="absolute inset-y-0 right-0 w-full sm:w-[56%]">
          <Image
            src={stockPhotos.hero}
            alt="Glamorous salon client with styled hair"
            fill
            priority
            sizes="(min-width: 640px) 56vw, 100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0e0e0e] via-[#0e0e0e]/80 to-[#0e0e0e]/10 sm:via-[#0e0e0e]/50" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-36 pb-24 sm:pb-32">
          <div className="max-w-xl">
            <Eyebrow>BE CONFIDENT. BE BEAUTIFUL.</Eyebrow>
            <h1 className="mt-6 font-lux text-5xl leading-[1.08] font-semibold sm:text-6xl">
              Enhance Your Beauty,
              <br />
              Elevate Your{" "}
              <span className="relative italic text-[#c9a24b]">
                Confidence
                <span className="absolute -bottom-2 left-0 h-px w-full bg-linear-to-r from-[#c9a24b] to-transparent" />
              </span>
              <Sparkles className="ml-2 inline size-6 text-[#c9a24b]" />
            </h1>
            <p className="mt-6 max-w-md text-sm text-white/70">
              Experience premium salon services tailored to bring out the most
              beautiful version of you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-linear-to-r from-[#d9bd85] to-[#c9a24b] px-6 text-sm font-semibold text-[#1a1408] shadow-lg shadow-black/20 transition-opacity hover:opacity-90"
              >
                <CalendarCheck className="size-4" />
                Book Appointment
              </Link>
              <a
                href="#about"
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Play className="size-4" />
                Watch Video
              </a>
            </div>
          </div>
        </div>

        {/* Feature bar */}
        <div className="relative mx-auto max-w-7xl px-6 pb-10">
          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {heroFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-3 bg-[#151515] p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c9a24b]/40 text-[#c9a24b]">
                  <f.icon className="size-4.5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="mt-0.5 text-xs text-white/50">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>WHAT WE OFFER</Eyebrow>
            <h2 className="mt-3 font-lux text-4xl font-semibold text-[#1a1a1a]">
              Our Services
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              From hair care to beauty treatments, we offer a wide range of
              services to pamper you from head to toe.
            </p>
          </div>
          <Link
            href="/book"
            className="inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-[#1a1a1a] px-5 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            View All Services
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((s) => (
            <div key={s.title} className="group flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 font-medium text-[#1a1a1a]">{s.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{s.text}</p>
              <Link
                href="/book"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#c9a24b] hover:gap-2.5"
              >
                Explore <ArrowRight className="size-3.5 transition-all" />
              </Link>
            </div>
          ))}
        </div>

        {/* Value props */}
        <div className="mt-14 grid gap-6 border-t border-black/5 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((v) => (
            <div key={v.title} className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#c9a24b]/12 text-[#c9a24b]">
                <v.icon className="size-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#1a1a1a]">{v.title}</h3>
                <p className="mt-0.5 text-xs text-neutral-500">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-[#0e0e0e] text-white">
        <div className="mx-auto grid max-w-7xl items-stretch gap-0 lg:grid-cols-2">
          <div className="relative min-h-72 lg:min-h-[520px]">
            <Image
              src={stockPhotos.salonInterior}
              alt="Luxurious Glow & Grace salon interior"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-5 px-6 py-14 lg:px-14">
            <Eyebrow>ABOUT US</Eyebrow>
            <h2 className="font-lux text-4xl font-semibold leading-tight">
              Where Beauty
              <br />
              Meets <span className="italic text-[#c9a24b]">Excellence</span>
            </h2>
            <p className="max-w-md text-sm text-white/60">
              At Glow &amp; Grace Salon, we believe beauty is more than just looks
              — it&apos;s about confidence, self-care, and feeling your absolute
              best.
            </p>
            <p className="max-w-md text-sm text-white/60">
              Our team of expert stylists and beauty professionals are passionate
              about delivering exceptional results in a luxurious and welcoming
              environment.
            </p>
            <div className="flex flex-wrap gap-5 pt-1">
              {aboutChips.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-sm text-white/80">
                  <c.icon className="size-4 text-[#c9a24b]" />
                  {c.label}
                </div>
              ))}
            </div>
            <Link
              href="/book"
              className="mt-2 inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-linear-to-r from-[#d9bd85] to-[#c9a24b] px-5 text-sm font-semibold text-[#1a1408] hover:opacity-90"
            >
              Learn More About Us
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <s.icon className="size-6 text-[#c9a24b]" />
              <div className="mt-3 flex items-center gap-1 font-lux text-3xl font-semibold text-[#1a1a1a]">
                {s.value}
                {s.star && <Star className="size-5 fill-[#c9a24b] text-[#c9a24b]" />}
              </div>
              <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="mx-auto w-full max-w-7xl px-6 pb-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>WHAT OUR CLIENTS SAY</Eyebrow>
            <h2 className="mt-3 font-lux text-4xl font-semibold text-[#1a1a1a]">
              Trusted by Thousands
            </h2>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#c9a24b] hover:gap-2.5"
          >
            View All Reviews <ArrowRight className="size-4 transition-all" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <span className="font-lux text-4xl leading-none text-[#c9a24b]">&ldquo;</span>
              <p className="text-sm text-neutral-600">{t.quote}</p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#c9a24b]/15 text-sm font-semibold text-[#c9a24b]">
                    {t.name.slice(0, 1)}
                  </span>
                  <span className="text-sm font-medium text-[#1a1a1a]">— {t.name}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-[#c9a24b] text-[#c9a24b]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#0e0e0e] text-white">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] sm:block">
          <Image
            src={serviceThumb("Hair", 2)}
            alt=""
            aria-hidden
            fill
            sizes="42vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0e0e0e] via-[#0e0e0e]/70 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-lg">
            <h2 className="font-lux text-3xl font-semibold sm:text-4xl">
              Ready to Glow &amp; Grace?
            </h2>
            <p className="mt-2 max-w-sm text-sm text-white/60">
              Book your appointment today and let our experts bring out the best
              version of you.
            </p>
            <Link
              href="/book"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-linear-to-r from-[#d9bd85] to-[#c9a24b] px-6 text-sm font-semibold text-[#1a1408] hover:opacity-90"
            >
              <CalendarCheck className="size-4" />
              Book Appointment Now
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
