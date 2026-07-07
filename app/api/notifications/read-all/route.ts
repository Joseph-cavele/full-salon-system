import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { NotificationModel } from "@/lib/models/Notification"

export async function POST() {
  await connectDB()
  await NotificationModel.updateMany({ read: false }, { read: true })
  return NextResponse.json({ ok: true })
}
