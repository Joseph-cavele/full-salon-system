import "dotenv/config"
import { parseArgs } from "node:util"
import { z } from "zod"
import { connectDB } from "../lib/db"
import { UserModel } from "../lib/models/User"
import { LoginCodeModel } from "../lib/models/LoginCode"

/**
 * Creates or updates the salon's single owner account — the only way an
 * account comes into existence (there is no public sign-up).
 *
 *   npm run setup-owner                                  # create/update from OWNER_EMAIL
 *   npm run setup-owner -- --email you@x.com --name "Patrick"
 *   npm run setup-owner -- --disable                     # lock the owner out
 *   npm run setup-owner -- --enable                      # let them back in
 *
 * Only touches the users and login-code collections; bookings, services,
 * customers and everything else are left alone.
 */
const { values } = parseArgs({
  options: {
    email: { type: "string" },
    name: { type: "string" },
    disable: { type: "boolean", default: false },
    enable: { type: "boolean", default: false },
  },
})

async function setupOwner() {
  if (values.disable && values.enable) fail("Pass --disable or --enable, not both.")

  const parsedEmail = z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .safeParse(values.email ?? process.env.OWNER_EMAIL)
  if (!parsedEmail.success) fail("Set OWNER_EMAIL in .env or pass --email you@example.com")
  const email = parsedEmail.data

  await connectDB()

  const owners = await UserModel.find({ role: "owner" }).lean<
    { _id: unknown; email: string; name: string; status?: string }[]
  >()
  if (owners.length > 1) {
    fail(`Expected one owner account, found ${owners.length}: ${owners.map((o) => o.email).join(", ")}`)
  }

  const clash = await UserModel.findOne({ email, role: { $ne: "owner" } }).lean()
  if (clash) fail(`${email} already belongs to a non-owner account. Remove it first.`)

  const status = values.disable ? "disabled" : values.enable ? "active" : undefined
  const existing = owners[0]

  if (!existing) {
    await UserModel.create({
      name: values.name ?? "Salon Owner",
      email,
      role: "owner",
      status: status ?? "active",
    })
    console.log(`✅ Created owner account ${email}${status === "disabled" ? " (disabled)" : ""}`)
  } else {
    await UserModel.updateOne(
      { _id: existing._id },
      {
        $set: {
          email,
          ...(values.name ? { name: values.name } : {}),
          // Accounts from before the status field get one now.
          status: status ?? existing.status ?? "active",
        },
      }
    )
    if (existing.email !== email) console.log(`✅ Owner email: ${existing.email} → ${email}`)
    if (values.name) console.log(`✅ Owner name: ${existing.name} → ${values.name}`)
    console.log(`✅ Owner account status: ${status ?? existing.status ?? "active"}`)

    // Pending codes for the old address, or for a now-disabled account, must not work.
    if (existing.email !== email || status === "disabled") {
      await LoginCodeModel.deleteMany({ email: { $in: [existing.email, email] } })
    }
  }

  // Leftover hashes from password sign-in are dead weight — remove them.
  const { modifiedCount } = await UserModel.updateMany(
    { password: { $exists: true } },
    { $unset: { password: 1 } },
    { strict: false }
  )
  if (modifiedCount) console.log(`✅ Removed old passwords from ${modifiedCount} account(s).`)

  process.exit(0)
}

function fail(message: string): never {
  console.error(`❌ ${message}`)
  process.exit(1)
}

setupOwner().catch((err) => {
  console.error("❌ Failed to set up the owner account:", err)
  process.exit(1)
})
