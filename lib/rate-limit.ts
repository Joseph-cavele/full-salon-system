import { createHash } from "node:crypto"
import { connectDB } from "@/lib/db"
import { RateLimitModel } from "@/lib/models/RateLimit"

export interface RateLimitRule {
  /** Names the limit, e.g. "login-code:ip". */
  bucket: string
  limit: number
  windowMs: number
}

/**
 * Fixed-window counter shared through MongoDB.
 *
 * Each call atomically increments the counter for the current window and
 * reports whether it is still within `limit`. The upsert + $inc is a single
 * server-side operation, so concurrent requests can't both read "under the
 * limit" and slip through. Returns false once the limit is exceeded.
 */
export async function hit(rule: RateLimitRule, subject: string): Promise<boolean> {
  await connectDB()

  const windowStart = Math.floor(Date.now() / rule.windowMs) * rule.windowMs
  const _id = createHash("sha256")
    .update(`${rule.bucket}:${subject}:${windowStart}`)
    .digest("hex")
  const update = {
    $inc: { count: 1 },
    $setOnInsert: { expiresAt: new Date(windowStart + rule.windowMs) },
  }

  let doc: { count: number } | null
  try {
    doc = await RateLimitModel.findOneAndUpdate({ _id }, update, {
      upsert: true,
      returnDocument: "after",
    }).lean<{ count: number }>()
  } catch (err) {
    // Two first-hits racing on the upsert: one inserts, the other gets a
    // duplicate-key error. The document exists now, so a retry just counts.
    if ((err as { code?: number }).code !== 11000) throw err
    doc = await RateLimitModel.findOneAndUpdate({ _id }, update, {
      returnDocument: "after",
    }).lean<{ count: number }>()
  }

  return (doc?.count ?? 0) <= rule.limit
}

/** Runs every rule (so each counter advances) and passes only if all do. */
export async function hitAll(checks: [RateLimitRule, string][]): Promise<boolean> {
  const results = await Promise.all(checks.map(([rule, subject]) => hit(rule, subject)))
  return results.every(Boolean)
}

/**
 * The caller's IP, from the proxy headers. On Vercel `x-forwarded-for` is set
 * by the platform; self-hosted, make sure your proxy overwrites it, or a
 * client can send its own and dodge per-IP limits (per-email ones still hold).
 */
export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown"
  )
}
