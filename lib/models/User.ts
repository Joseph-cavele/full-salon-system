import { Schema, model, models, type InferSchemaType } from "mongoose"

/* Dashboard sign-in accounts. Sign-in is passwordless (emailed code), and
   only an `active` owner can sign in — "stylist" stays in the enum so older
   records still validate, but no stylist account can get a session.

   Role values stay lowercase ("owner") because existing records and session
   tokens already carry them. */
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    // Stored normalized (trimmed, lowercase) so lookups are exact matches.
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role: { type: String, enum: ["owner", "stylist"], required: true },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
  },
  { timestamps: true }
)

export type UserDoc = InferSchemaType<typeof userSchema>
export const UserModel = models.User || model("User", userSchema)
