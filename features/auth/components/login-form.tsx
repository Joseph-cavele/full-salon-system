"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn, getSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"
import { loginSchema, type LoginFormValues } from "@/features/auth/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

export function LoginForm() {
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true)
    setFormError(null)

    let result
    try {
      result = await signIn("credentials", {
        ...data,
        redirect: false,
      })
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {formError && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {formError}
        </p>
      )}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="pl-8"
              {...register("email")}
            />
          </div>
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="pr-9"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              tabIndex={-1}
              className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </Field>
      </FieldGroup>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  )
}
