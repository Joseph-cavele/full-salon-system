import { z } from "zod"

export const stylistInputSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone is required"),
  bio: z.string().trim().optional(),
  /* Same omission as the service schema had: the Stylist model carries
     `image`, but the routes persist `parsed.data`, so a portrait could not
     be saved until it was declared here. `""` clears it. */
  image: z.string().trim().url("Enter a valid image URL").or(z.literal("")).optional(),
  workingHours: z.string().trim().optional(),
  active: z.boolean(),
  services: z.array(z.string()),
})

export type StylistInputValues = z.infer<typeof stylistInputSchema>
