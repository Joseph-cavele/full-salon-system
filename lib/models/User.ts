import { Schema, model, models, type InferSchemaType } from "mongoose"

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["owner", "stylist"], required: true },
  },
  { timestamps: true }
)

export type UserDoc = InferSchemaType<typeof userSchema>
export const UserModel = models.User || model("User", userSchema)
