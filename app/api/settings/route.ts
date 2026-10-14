import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { SettingsModel } from "@/lib/models/Settings"
import { StylistModel } from "@/lib/models/Stylist"
import { settingsSchema } from "@/features/settings/schema"
import {
  getSettings,
  serializeSettings,
} from "@/features/settings/server/get-settings"
import { denyUnlessOwner } from "@/features/auth/server/session"

interface SettingsDoc {
  salonName: string
  tagline: string
  email: string
  phone: string
  address: string
  openingHours: string
  notificationEmail: string
  emailNotifications: boolean
  bookingStylist?: unknown
}

export async function GET() {
  const denied = await denyUnlessOwner()
  if (denied) return denied

  const settings = await getSettings()

  if (!settings) {
    return NextResponse.json({ error: "Settings unavailable" }, { status: 500 })
  }

  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const denied = await denyUnlessOwner()
  if (denied) return denied

  const body = await req.json()
  const parsed = settingsSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid settings", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const { bookingStylistId, ...fields } = parsed.data

  await connectDB()
  if (bookingStylistId && !(await StylistModel.exists({ _id: bookingStylistId, active: true }))) {
    return NextResponse.json(
      { error: "That stylist doesn't exist or isn't active" },
      { status: 400 }
    )
  }

  const settings = await SettingsModel.findOneAndUpdate(
    { key: "salon" },
    { ...fields, bookingStylist: bookingStylistId || null, key: "salon" },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  ).lean<SettingsDoc>()

  if (!settings) {
    return NextResponse.json({ error: "Settings unavailable" }, { status: 500 })
  }

  return NextResponse.json(serializeSettings(settings))
}
