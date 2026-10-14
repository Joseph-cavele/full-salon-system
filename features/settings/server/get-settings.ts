import { connectDB } from "@/lib/db"
import { SettingsModel } from "@/lib/models/Settings"
import type { SalonSettings } from "@/types"

interface SettingsDoc {
  salonName: string
  tagline: string
  email: string
  phone: string
  address: string
  openingHours: string
  notificationEmail: string
  emailNotifications: boolean
}

export function serializeSettings(doc: SettingsDoc): SalonSettings {
  return {
    salonName: doc.salonName,
    tagline: doc.tagline,
    email: doc.email,
    phone: doc.phone,
    address: doc.address,
    openingHours: doc.openingHours,
    notificationEmail: doc.notificationEmail ?? "",
    emailNotifications: doc.emailNotifications,
  }
}

export async function getSettings(): Promise<SalonSettings | null> {
  await connectDB()
  // Create the singleton with defaults on first read.
  const settings = await SettingsModel.findOneAndUpdate(
    { key: "salon" },
    { $setOnInsert: { key: "salon" } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  ).lean<SettingsDoc>()

  return settings ? serializeSettings(settings) : null
}

/**
 * Where new-booking alerts go: the dashboard's "Booking notification email"
 * if set, otherwise OWNER_EMAIL. Null when the owner has switched email
 * notifications off in Settings, or no address is configured at all.
 */
export async function getBookingAlertEmail(): Promise<string | null> {
  const settings = await getSettings()
  if (settings && !settings.emailNotifications) return null
  return settings?.notificationEmail.trim() || process.env.OWNER_EMAIL?.trim() || null
}
