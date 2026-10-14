"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { isAxiosError } from "axios"
import { toast } from "sonner"

import { SignInCard2 } from "@/components/ui/sign-in-card-2"
import { apiClient } from "@/lib/api-client"
import { requestCodeSchema, verifyCodeSchema } from "@/features/auth/schema"

/**
 * Auth wiring for the glass sign-in card — passwordless, in two steps:
 *
 *   1. email → POST /api/login-code emails a 6-digit code
 *   2. code  → next-auth's credentials provider (auth.ts) checks it
 *
 * The card is presentational; this component owns which step is showing and
 * the address the code went to. Messages stay generic on purpose: nothing
 * here says whether an address has an account.
 */

/** Only same-site paths, so a crafted ?callbackUrl= can't bounce the owner off-site. */
function safeCallbackUrl(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")
    ? value
    : "/dashboard"
}
export function SignInCard() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<"email" | "code">("email")
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [codeSentAt, setCodeSentAt] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleRequestCode(rawEmail: string) {
    const parsed = requestCodeSchema.safeParse({ email: rawEmail })
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please check your email address.")
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      await apiClient.post("/login-code", parsed.data)
    } catch (err) {
      const message =
        (isAxiosError(err) && err.response?.data?.error) ||
        "Something went wrong while sending your code. Please try again."
      setFormError(message)
      toast.error(message)
      setIsSubmitting(false)
      return
    }

    // The server answers the same for unknown addresses, so this wording
    // can't promise an account exists.
    setSentTo(parsed.data.email)
    setCodeSentAt(Date.now())
    setStep("code")
    setIsSubmitting(false)
    toast.success("If that email is registered, a 6-digit code is on its way.")
  }

  async function handleVerifyCode(rawCode: string) {
    const parsed = verifyCodeSchema.safeParse({ email: sentTo ?? "", code: rawCode })
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please check the code.")
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    let result
    try {
      result = await signIn("credentials", { ...parsed.data, redirect: false })
    } catch (err) {
      // Thrown here means the request itself failed (server/DB unreachable),
      // not just a wrong code — surface a distinct message.
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong while signing in. Please try again."
      setFormError(message)
      toast.error(message)
      setIsSubmitting(false)
      return
    }

    // next-auth returns { error, code, ok } for a failed sign-in.
    if (result?.error || result?.ok === false) {
      const message =
        result?.code === "rate_limited"
          ? "Too many attempts. Please wait a few minutes and try again."
          : "That code didn't work. Check it, or send a new one."
      setFormError(message)
      toast.error(message)
      setIsSubmitting(false)
      return
    }

    // Signed in — only the owner can be, so the dashboard is the destination.
    const target = safeCallbackUrl(searchParams.get("callbackUrl"))

    // Hard navigation so the server sees the freshly-set session cookie.
    // A client-side router.push here can be bounced back to /login because the
    // new cookie isn't yet reflected in the RSC navigation's server context.
    // isSubmitting stays true so the spinner shows through the redirect.
    window.location.assign(target)
  }

  function handleChangeEmail() {
    setStep("email")
    setFormError(null)
  }

  return (
    <SignInCard2
      step={step}
      sentTo={sentTo}
      codeSentAt={codeSentAt}
      onRequestCode={handleRequestCode}
      onVerifyCode={handleVerifyCode}
      onChangeEmail={handleChangeEmail}
      isLoading={isSubmitting}
      error={formError}
    />
  )
}
