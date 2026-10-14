import { connectDB } from "@/lib/db"
import { SettingsModel } from "@/lib/models/Settings"
import { StylistModel } from "@/lib/models/Stylist"

/**
 * The stylist every new booking is assigned to. Clients don't choose one.
 *
 * Normally the stylist picked in Dashboard → Settings → "Stylist for new
 * bookings". If that isn't set, or that stylist has since been deactivated
 * or deleted, it falls back to the longest-standing active stylist rather
 * than turning the booking away — a booking with the "wrong" name on it is
 * fixable, a client who couldn't book at all is lost. Null only when there
 * are no active stylists at all.
 */
export async function getBookingStylist() {
  await connectDB()

  const settings = await SettingsModel.findOne({ key: "salon" }, { bookingStylist: 1 }).lean<{
    bookingStylist?: unknown
  }>()

  if (settings?.bookingStylist) {
    const chosen = await StylistModel.findOne({ _id: settings.bookingStylist, active: true })
    if (chosen) return chosen
    console.warn("[booking] Settings stylist is inactive or missing — using fallback")
  }

  return StylistModel.findOne({ active: true }).sort({ createdAt: 1 })
}
