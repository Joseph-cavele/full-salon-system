import { Schema, model, models } from "mongoose"

/* One counter per (limit key, time window) — see lib/rate-limit.ts. Lives in
   Mongo rather than process memory so every server instance shares the same
   counts, which an in-memory limiter can't do on serverless hosting. */
const rateLimitSchema = new Schema({
  // sha256 of "<bucket>:<subject>:<window start>" — no raw emails or IPs stored.
  _id: { type: String, required: true },
  count: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true },
})

// Mongo's TTL monitor clears finished windows.
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const RateLimitModel = models.RateLimit || model("RateLimit", rateLimitSchema)
