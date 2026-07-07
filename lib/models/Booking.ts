import { Schema, model, models, type InferSchemaType } from "mongoose"

const bookingSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    stylist: { type: Schema.Types.ObjectId, ref: "Stylist", required: true },
    services: [{ type: Schema.Types.ObjectId, ref: "Service", required: true }],
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    description: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"],
      default: "PENDING",
    },
  },
  { timestamps: true }
)

// Indexes for the dashboard/reports/bookings queries (filter by status,
// sort by date, and lookups per customer).
bookingSchema.index({ status: 1, bookingDate: 1 })
bookingSchema.index({ bookingDate: -1, bookingTime: -1 })
bookingSchema.index({ createdAt: -1 })
bookingSchema.index({ customer: 1 })

export type BookingDoc = InferSchemaType<typeof bookingSchema>
export const BookingModel = models.Booking || model("Booking", bookingSchema)
