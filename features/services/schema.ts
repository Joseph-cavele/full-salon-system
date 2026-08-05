import { z } from "zod"

/* The salon's actual departments, not a generic salon template. The previous
   list ("Hair", "Beauty", "Skin", "Nail", "Packages") described a business
   this one isn't: every service Patrick's offers is hair, so four of those
   five tabs were permanently empty and the fifth held everything.

   These five split the real price list into groups a customer picks between.
   Renaming one is a data migration — existing Service documents store the
   category as a plain string, so change a name here and the services filed
   under the old one drop out of the booking wizard's tabs until they are
   re-filed. Add freely; rename deliberately. */
export const SERVICE_CATEGORIES = [
  "Dreadlocks",
  "Braids",
  "Cuts & Styling",
  "Treatments",
  "Wigs",
] as const

/**
 * What a service falls back to when its category is missing or unrecognised.
 * Imported everywhere that needs a default rather than being spelled out at
 * each call site — five copies of the string `"Hair"` is how the old list
 * outlived the redesign in the first place.
 */
export const DEFAULT_SERVICE_CATEGORY: (typeof SERVICE_CATEGORIES)[number] =
  "Dreadlocks"

export const serviceInputSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  duration: z.number().int().positive("Duration must be greater than 0"),
  category: z.enum(SERVICE_CATEGORIES),
})

export type ServiceInputValues = z.infer<typeof serviceInputSchema>
