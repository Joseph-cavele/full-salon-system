import { Schema, model, models, type InferSchemaType } from "mongoose"

const serviceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    category: { type: String, default: "Hair" },
    image: { type: String },
  },
  { timestamps: true }
)

export type ServiceDoc = InferSchemaType<typeof serviceSchema>
export const ServiceModel = models.Service || model("Service", serviceSchema)
