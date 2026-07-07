import { z } from "zod"

export const SERVICE_CATEGORIES = ["Hair", "Beauty", "Skin", "Nail", "Packages"] as const

export const serviceInputSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  duration: z.number().int().positive("Duration must be greater than 0"),
  category: z.enum(SERVICE_CATEGORIES),
})

export type ServiceInputValues = z.infer<typeof serviceInputSchema>
