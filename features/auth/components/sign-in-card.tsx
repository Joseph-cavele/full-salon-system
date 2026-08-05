"use client"

import { useState } from "react"
import { getSession, signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { SignInCard2 } from "@/components/ui/sign-in-card-2"
import { loginSchema } from "@/features/auth/schema"

/**
 * Auth wiring for the glass sign-in card.
 *
 * Mirrors `login-form.tsx` — same next-auth credentials flow and the same hard
 * navigation on success — but validates with `loginSchema` directly instead of
 * react-hook-form, because the card owns its own field state.
 */
export function SignInCard() {
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit({ email, password }: { email: string; password: string }) {
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Please check your details."
      setFormError(message)
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    let result
    try {
      result = await signIn("credentials", { ...parsed.data, redirect: false })
    } catch (err) {
      // Thrown here means the request itself failed (server/DB unreachable),
      // not just wrong credentials — surface a distinct message.
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong while signing in. Please try again."
      setFormError(message)
      toast.error(message)
      setIsSubmitting(false)
      return
    }

    // next-auth returns { error, ok } for a failed sign-in (invalid creds).
    if (result?.error || result?.ok === false) {
      setFormError("Invalid email or password. Please try again.")
      toast.error("Invalid email or password")
      setIsSubmitting(false)
      return
    }

    // Login succeeded and the session cookie is set. Pick where to land —
    // fetching the session is best-effort and must NOT block the redirect or
    // it would look like a failed login even though the cookie is valid.
    let target = searchParams.get("callbackUrl")
    if (!target) {
      try {
        const session = await getSession()
        target = session?.user?.role === "stylist" ? "/stylist" : "/dashboard"
      } catch {
        target = "/dashboard"
      }
    }

    // Hard navigation so the server sees the freshly-set session cookie.
    // A client-side router.push here can be bounced back to /login because the
    // new cookie isn't yet reflected in the RSC navigation's server context.
    // isSubmitting stays true so the spinner shows through the redirect.
    window.location.assign(target)
  }

  return <SignInCard2 onSubmit={handleSubmit} isLoading={isSubmitting} error={formError} />
}
