import { z } from "zod"

const email = z.string().trim().email("Enter a valid email address")

export const requestCodeSchema = z.object({ email })

export const verifyCodeSchema = z.object({
  email,
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
})
