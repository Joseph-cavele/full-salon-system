import { Schema, model, models, type InferSchemaType } from "mongoose"

const stylistSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    bio: { type: String },
    image: { type: String },
    workingHours: { type: String },
    active: { type: Boolean, default: true },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  },
  { timestamps: true }
)

export type StylistDoc = InferSchemaType<typeof stylistSchema>
export const StylistModel = models.Stylist || model("Stylist", stylistSchema)
