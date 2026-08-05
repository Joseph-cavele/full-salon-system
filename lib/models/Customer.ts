import { Schema, model, models, type InferSchemaType } from "mongoose"

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    /** Optional: existing customers predate this field, and the booking form
        is the only thing that collects it. */
    phone: { type: String, default: "" },
  },
  { timestamps: true }
)

export type CustomerDoc = InferSchemaType<typeof customerSchema>
export const CustomerModel = models.Customer || model("Customer", customerSchema)
