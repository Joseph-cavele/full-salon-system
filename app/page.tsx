import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Star } from "lucide-react"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { stockPhotos, photos } from "@/lib/stock-photos"

const proofFaces = [
  { src: photos.definedCurls, alt: "Client" },
  { src: photos.glamMakeup, alt: "Client" },
  { src: photos.naturalGlow, alt: "Client" },
]

const transformations = [
  {
    title: "Signature Hair Design",
    text: "From dull and frizzy to vibrant, sleek perfection.",
    img: photos.silkPress,
  },
  {
    title: "Luxe Skin Revitalization",
    text: "Radiant, glowing results tailored to your unique skin.",
    img: photos.naturalGlow,
  },
]

const signatureServices = [
  {
    title: "Knotless Box Braids",
    text: "Feather-light, tension-free braids installed to protect your edges and turn heads.",
    price: "R950+",
    duration: "4–5 hrs",
    img: photos.boxBraids,
  },
  {
    title: "Silk Press & Style",
    text: "Wash, treat and press — glass-smooth movement without compromising your curl pattern.",
    price: "R450+",
    duration: "90 mins",
    img: photos.sleekBun,
  },
  {
    title: "Artisan Manicure",
    text: "Meticulous nail care and artistic design for a polished finish.",
    price: "R320+",
    duration: "60 mins",
    img: photos.nailArt,
  },
]

const artisans = [
  {
    name: "Thandi M.",
    role: "Master Braid Artist",
    text: "With over a decade of experience in protective styling, Thandi specializes in bespoke braid artistry and precision installs.",
    img: photos.definedCurls,
  },
  {
    name: "Amara J.",
    role: "Senior Aesthetician",
    text: "Amara combines time-honoured techniques with modern science to deliver transformative skincare rituals that restore your natural glow.",
    img: photos.naturalGlow,
  },
]

const testimonials = [
  { quote: "The atmosphere at Glow & Grace is truly a sanctuary. My stylist understood exactly what I wanted, and the results exceeded my expectations.", name: "Lerato M." },
  { quote: "A world-class experience from start to finish. The attention to detail and the personalized care make every visit special.", name: "Priya N." },
  { quote: "I've never felt more radiant. The skin revitalisation treatment is a game-changer. Pure luxury!", name: "Ayesha K." },
]

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-16 text-center">
      <h2 className="mb-2 font-lux text-[36px] leading-[1.2] font-bold text-[#181919] md:text-[48px] md:leading-[1.1] md:tracking-[-0.02em]">
        {title}
      </h2>
      <p className="text-base leading-[1.6] text-[#444748]">{subtitle}</p>
    </div>
  )
}

function FiveStars() {
  return (
    <div className="flex gap-0.5 text-[#775a19]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-current" />
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[#fcf9f5] text-[#1c1c1a] selection:bg-[#fed488] selection:text-[#785a1a]">
      <SiteHeader active="Home" logoHref="/login" />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
        {/* Hero Image Canvas */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full motion-safe:animate-[hero-zoom_10s_ease-out_both]">
            <Image
              src={stockPhotos.hero}
              alt="Client wearing fresh cornrow braids"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[70%_top]"
            />
          </div>
          {/* Overlay for legibility */}
          <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(252,249,245,1)_0%,rgba(252,249,245,0.7)_60%,rgba(252,249,245,0.2)_100%)] md:bg-[linear-gradient(to_right,rgba(252,249,245,0.95)_0%,rgba(252,249,245,0.4)_50%,rgba(252,249,245,0)_100%)]" />
        </div>

        {/* Content Canvas */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-5 md:px-16">
          <div className="flex max-w-[640px] flex-col items-start gap-8 motion-safe:animate-[fade-in-up_0.8s_ease-out_0.3s_both]">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 rounded-[0.75rem] border border-[#c4c7c7]/30 bg-[#f6f3ef] px-3 py-1">
              <span className="size-2 animate-pulse rounded-full bg-[#775a19]" />
              <span className="text-xs font-medium tracking-widest text-[#775a19] uppercase">
                A Sanctuary for the Senses
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-lux text-[36px] leading-[1.2] font-bold text-[#181919] md:text-[48px] md:leading-[1.1] md:tracking-[-0.02em]">
              Elevate Your <br />
              <span className="font-normal italic">Natural Beauty</span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-[500px] text-lg leading-[1.6] text-[#444748]">
              Experience bespoke hair and beauty services in a sanctuary of
              luxury and relaxation. Our artisans craft perfection, tailored to
              your unique essence.
            </p>

            {/* CTA Cluster */}
            <div className="mt-2 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href="/book"
                className="bg-[#181919] px-16 py-4 text-center text-sm font-semibold tracking-[0.05em] text-white shadow-[0_4px_20px_-5px_rgba(119,90,25,0.3)] transition-all duration-300 hover:bg-[#444748] active:scale-95"
              >
                Book Your Transformation
              </Link>
              <a
                href="#services"
                className="border border-[#c4c7c7] bg-transparent px-16 py-4 text-center text-sm font-semibold tracking-[0.05em] text-[#1c1c1a] transition-all duration-300 hover:bg-[#f6f3ef]"
              >
                View Services
              </a>
            </div>

            {/* Social Proof / Atmospheric Detail */}
            <div className="mt-16 flex items-center gap-8 border-t border-[#c4c7c7]/30 pt-16">
              <div className="flex -space-x-3">
                {proofFaces.map((f) => (
                  <div
                    key={f.src}
                    className="relative flex size-10 items-center justify-center overflow-hidden rounded-[0.75rem] border-2 border-[#fcf9f5] bg-[#e5e2de]"
                  >
                    <Image src={f.src} alt={f.alt} fill sizes="40px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium tracking-[0.03em] text-[#444748]">
                  TRUSTED BY 2,000+ CLIENTS
                </p>
                <div className="mt-1">
                  <FiveStars />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Floating Element (Quiet Luxury Touch) */}
        <div className="absolute right-12 bottom-12 z-30 hidden flex-col gap-2 border border-[#c4c7c7]/20 bg-[#fcf9f5]/80 p-8 backdrop-blur-[20px] lg:flex">
          <span className="text-xs font-medium tracking-[0.2em] text-[#775a19] uppercase">
            Opening Hours
          </span>
          <div className="flex justify-between gap-16">
            <span className="text-base leading-[1.6] text-[#444748]">Mon — Sat</span>
            <span className="text-base leading-[1.6] text-[#1c1c1a]">9am — 8pm</span>
          </div>
          <div className="flex justify-between gap-16">
            <span className="text-base leading-[1.6] text-[#444748]">Sunday</span>
            <span className="text-base leading-[1.6] text-[#1c1c1a]">11am — 5pm</span>
          </div>
        </div>
      </section>

      {/* The Art of Transformation */}
      <section id="gallery" className="bg-[#fcf9f5] px-5 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="The Art of Transformation"
            subtitle="Real results from our master artisans."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {transformations.map((t) => (
              <div
                key={t.title}
                className="overflow-hidden rounded-[0.25rem] border border-[#c4c7c7]/20 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={t.img}
                    alt={`${t.title} Transformation`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="mb-2 font-lux text-[24px] leading-[1.4] font-semibold text-[#181919]">
                    {t.title}
                  </h3>
                  <p className="text-base leading-[1.6] text-[#444748]">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Services */}
      <section id="services" className="bg-[#f6f3ef] px-5 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Signature Services"
            subtitle="Curated experiences for the modern individual."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {signatureServices.map((s) => (
              <div
                key={s.title}
                className="flex flex-col overflow-hidden rounded-[0.25rem] border border-[#c4c7c7]/20 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex grow flex-col p-8">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="font-lux text-[24px] leading-[1.4] font-semibold text-[#181919]">
                      {s.title}
                    </h3>
                    <span className="text-sm font-semibold tracking-[0.05em] whitespace-nowrap text-[#775a19]">
                      {s.price}
                    </span>
                  </div>
                  <p className="mb-4 text-base leading-[1.6] text-[#444748]">{s.text}</p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="flex items-center gap-1 text-xs font-medium tracking-[0.03em] text-[#444748]">
                      <Clock className="size-4" /> {s.duration}
                    </span>
                    <Link
                      href="/book"
                      className="bg-[#181919] px-4 py-2 text-xs font-medium tracking-[0.03em] text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="bg-[#fcf9f5] px-5 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="About Us"
            subtitle="Where beauty meets excellence."
          />
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[0.25rem] border border-[#c4c7c7]/20 shadow-sm">
              <Image
                src={stockPhotos.interiorWide}
                alt="Luxurious Glow & Grace salon interior"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-[1.6] text-[#444748]">
                At Glow &amp; Grace Salon, we believe beauty is more than just
                looks — it&apos;s about confidence, self-care, and feeling your
                absolute best.
              </p>
              <p className="text-base leading-[1.6] text-[#444748]">
                Our team of expert stylists and beauty professionals are
                passionate about delivering exceptional results in a luxurious
                and welcoming environment, right in the heart of Johannesburg.
              </p>
              <div className="mt-2 flex flex-wrap gap-x-8 gap-y-2">
                {["Experienced Team", "Modern Techniques", "Luxury Experience"].map((label) => (
                  <span
                    key={label}
                    className="flex items-center gap-2 text-sm font-semibold tracking-[0.05em] text-[#1c1c1a]"
                  >
                    <span className="size-1.5 rounded-full bg-[#775a19]" />
                    {label}
                  </span>
                ))}
              </div>
              <Link
                href="/book"
                className="mt-4 w-fit bg-[#181919] px-16 py-4 text-sm font-semibold tracking-[0.05em] text-white shadow-[0_4px_20px_-5px_rgba(119,90,25,0.3)] transition-all duration-300 hover:bg-[#444748] active:scale-95"
              >
                Book Your Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Artisans */}
      <section id="artisans" className="bg-[#f6f3ef] px-5 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Meet Our Artisans"
            subtitle="The visionaries behind your transformation."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {artisans.map((a) => (
              <div
                key={a.name}
                className="flex flex-col items-center gap-8 rounded-[0.25rem] border border-[#c4c7c7]/20 bg-white p-8 shadow-sm md:flex-row"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[0.25rem] md:w-1/2">
                  <Image
                    src={a.img}
                    alt={a.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 100vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:w-1/2">
                  <h3 className="font-lux text-[24px] leading-[1.4] font-semibold text-[#181919]">
                    {a.name}
                  </h3>
                  <p className="text-xs font-medium tracking-widest text-[#775a19] uppercase">
                    {a.role}
                  </p>
                  <p className="mt-2 text-base leading-[1.6] text-[#444748]">{a.text}</p>
                  <Link
                    href="/book"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.05em] text-[#181919] transition-colors hover:text-[#775a19]"
                  >
                    View Portfolio
                    <ArrowRight className="size-[18px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Experiences */}
      <section id="reviews" className="bg-[#fcf9f5] px-5 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Client Experiences"
            subtitle="Voices of those who have experienced our sanctuary."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col gap-4 rounded-[0.25rem] border border-[#c4c7c7]/20 bg-white p-8 shadow-sm"
              >
                <FiveStars />
                <p className="text-lg leading-[1.6] text-[#1c1c1a] italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto">
                  <p className="text-sm font-semibold tracking-[0.05em] text-[#181919]">
                    {t.name}
                  </p>
                  <p className="text-xs font-medium tracking-widest text-[#444748] uppercase">
                    Verified Client
                  </p>
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
