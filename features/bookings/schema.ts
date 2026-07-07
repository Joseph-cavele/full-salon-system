import { z } from "zod"

export const createBookingSchema = z.object({
  customerName: z.string().trim().min(2, "Full name is required"),
  customerEmail: z.string().trim().email("Enter a valid email address"),
  serviceIds: z.array(z.string()).min(1, "Select at least one service"),
  stylistId: z.string().min(1, "Select a stylist"),
  bookingDate: z.string().min(1, "Select a date"),
  bookingTime: z.string().min(1, "Select a time"),
  description: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  imageUrls: z
    .array(z.string())
    .max(5, "You can upload up to 5 images")
    .optional(),
})

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
  reason: z.string().trim().optional(),
})

export type UpdateBookingStatusValues = z.infer<typeof updateBookingStatusSchema>
