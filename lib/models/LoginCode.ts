import { Schema, model, models, type InferSchemaType } from "mongoose"

/* One pending sign-in code per email. Only an HMAC of the code is stored, so
   a leaked collection is no use for signing in. Requesting a new code
   replaces the old one; a successful sign-in deletes it. */
const loginCodeSchema = new Schema({
  email: { type: String, required: true, unique: true },
  codeHash: { type: String, required: true },
  sentAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
})

// Mongo's TTL monitor removes codes once they expire.
loginCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export type LoginCodeDoc = InferSchemaType<typeof loginCodeSchema>
export const LoginCodeModel = models.LoginCode || model("LoginCode", loginCodeSchema)
