import { Schema, model, models, type InferSchemaType } from "mongoose"

const serviceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    category: { type: String, default: "Dreadlocks" },
    image: { type: String },
  },
  { timestamps: true }
)

/* ── Indexes ──────────────────────────────────────────────────────────
   The collection had none, so every service read was a collection scan
   followed by an in-memory sort — including the one on the booking
   wizard's service picker, which runs on every visit to /book. */

// getServices() — find().sort({ name: 1 }). Lets the sort be served by the
// index walk instead of a SORT stage.
serviceSchema.index({ name: 1 })

// Catalogue and picker, which group by category and order by name within
// it. `name` as the second key means the grouped read is sorted for free.
serviceSchema.index({ category: 1, name: 1 })

export type ServiceDoc = InferSchemaType<typeof serviceSchema>
export const ServiceModel = models.Service || model("Service", serviceSchema)
