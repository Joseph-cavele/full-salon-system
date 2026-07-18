import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Flower2 } from "lucide-react"
import { LoginForm } from "@/features/auth/components/login-form"
import { stockPhotos } from "@/lib/stock-photos"

export default function LoginPage() {
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      {/* Brand / image panel */}
      <div className="relative hidden overflow-hidden bg-[#1f1809] lg:block">
        <Image
          src={stockPhotos.salonInterior}
          alt="Glow & Grace salon interior"
          fill
          sizes="50vw"
          className="object-cover opacity-45"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1f1809] via-[#1f1809]/40 to-[#1f1809]/70" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="flex flex-col leading-none">
            <span className="flex items-center gap-2 font-lux text-2xl font-semibold">
              <Flower2 className="size-6 text-[#e9c176]" />
              GLOW &amp; GRACE
            </span>
            <span className="text-[11px] font-medium tracking-[0.35em] text-[#e9c176]">
              SALON
            </span>
          </Link>
          <div>
            <h2 className="font-lux text-3xl font-semibold leading-tight">
              Manage your salon with{" "}
              <span className="italic text-[#e9c176]">grace</span>.
            </h2>
            <p className="mt-3 max-w-sm text-sm text-white/60">
              Sign in to manage bookings, services, stylists, and customers — all
              in one elegant dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-[#fcf9f5] px-6 py-16">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex flex-col items-center leading-none lg:hidden"
          >
            <span className="flex items-center gap-2 font-lux text-xl font-semibold text-[#1c1c1a]">
              <Flower2 className="size-5 text-[#775a19]" />
              GLOW &amp; GRACE
            </span>
            <span className="text-[10px] font-medium tracking-[0.35em] text-[#775a19]">
              SALON
            </span>
          </Link>

          <div className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
            <h1 className="font-lux text-2xl font-semibold text-[#1c1c1a]">
              Welcome back
            </h1>
            <p className="mt-1 mb-6 text-sm text-neutral-500">
              Sign in to your Glow &amp; Grace account.
            </p>
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-500">
            <Link href="/" className="hover:text-[#775a19]">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
