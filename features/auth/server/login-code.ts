import { createHmac, randomInt, timingSafeEqual } from "node:crypto"
import { LoginCodeModel } from "@/lib/models/LoginCode"
import { UserModel } from "@/lib/models/User"
import type { RateLimitRule } from "@/lib/rate-limit"

export const CODE_TTL_MS = 10 * 60 * 1000
export const RESEND_COOLDOWN_MS = 60 * 1000
/* Five guesses at a one-in-a-million code. After that the code is dead and a
   new one must be requested — which the limits below slow down too. */
export const MAX_ATTEMPTS = 5

const MINUTE = 60 * 1000

/** Limits on asking for a code — by address (inbox flooding) and by IP (spraying addresses). */
export const REQUEST_CODE_LIMITS = {
  email: { bucket: "login-code:email", limit: 5, windowMs: 60 * MINUTE },
  ip: { bucket: "login-code:ip", limit: 20, windowMs: 15 * MINUTE },
} satisfies Record<string, RateLimitRule>

/** Limits on checking a code, on top of the per-code MAX_ATTEMPTS. */
export const VERIFY_CODE_LIMITS = {
  email: { bucket: "verify-code:email", limit: 15, windowMs: 15 * MINUTE },
  ip: { bucket: "verify-code:ip", limit: 30, windowMs: 15 * MINUTE },
} satisfies Record<string, RateLimitRule>

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export interface OwnerAccount {
  id: string
  name: string
  email: string
}

/**
 * The owner account for `email`, or null if there isn't one or it's disabled.
 *
 * Accounts saved before the `status` field existed have no value, so the
 * filter is "not disabled" rather than "active". Collation makes the match
 * case-insensitive for any record stored before emails were normalized.
 */
export async function findActiveOwner(email: string): Promise<OwnerAccount | null> {
  const user = await UserModel.findOne({
    email: normalizeEmail(email),
    role: "owner",
    status: { $ne: "disabled" },
  })
    .collation({ locale: "en", strength: 2 })
    .lean<{ _id: unknown; name: string; email: string }>()

  if (!user) return null
  return { id: String(user._id), name: user.name, email: normalizeEmail(user.email) }
}

function hashCode(email: string, code: string) {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET is not set")
  return createHmac("sha256", secret).update(`${email}:${code}`).digest("hex")
}

/**
 * Creates a fresh 6-digit code for `email`, replacing (and so invalidating)
 * any earlier one.
 *
 * Returns null when a code was sent less than a minute ago — the earlier code
 * is still valid, and this stops repeated clicks from flooding the inbox.
 */
export async function issueLoginCode(email: string): Promise<string | null> {
  const existing = await LoginCodeModel.findOne({ email }).lean<{ sentAt: Date }>()
  if (existing && Date.now() - existing.sentAt.getTime() < RESEND_COOLDOWN_MS) {
    return null
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0")
  const now = Date.now()

  await LoginCodeModel.replaceOne(
    { email },
    {
      email,
      codeHash: hashCode(email, code),
      sentAt: new Date(now),
      expiresAt: new Date(now + CODE_TTL_MS),
      attempts: 0,
    },
    { upsert: true }
  )

  return code
}

/** Drops a code that never reached the user, so they can ask again at once. */
export async function discardLoginCode(email: string) {
  await LoginCodeModel.deleteOne({ email })
}

/**
 * Checks `code` against the stored one and, if it matches, deletes it so it
 * can't be used twice.
 *
 * Expiry is checked here explicitly — the TTL index only tidies up, and can
 * lag by a minute or more. The attempt counter is bumped in the same query
 * that finds the code, so parallel guesses can't slip past MAX_ATTEMPTS
 * between a read and a write. No transaction is needed: every step is a
 * single-document atomic operation, which works on any MongoDB deployment.
 */
export async function consumeLoginCode(email: string, code: string) {
  const record = await LoginCodeModel.findOneAndUpdate(
    { email, expiresAt: { $gt: new Date() }, attempts: { $lt: MAX_ATTEMPTS } },
    { $inc: { attempts: 1 } },
    { returnDocument: "after" }
  ).lean<{ _id: unknown; codeHash: string }>()
  if (!record) return false

  const expected = Buffer.from(record.codeHash, "hex")
  const actual = Buffer.from(hashCode(email, code), "hex")
  if (!timingSafeEqual(expected, actual)) return false

  // deletedCount 0 means a concurrent request already used this code.
  const { deletedCount } = await LoginCodeModel.deleteOne({ _id: record._id })
  return deletedCount === 1
}
