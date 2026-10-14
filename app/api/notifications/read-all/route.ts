import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { NotificationModel } from "@/lib/models/Notification"
import { denyUnlessOwner } from "@/features/auth/server/session"

export async function POST() {
  const denied = await denyUnlessOwner()
  if (denied) return denied

  await connectDB()
  await NotificationModel.updateMany({ read: false }, { read: true })
  return NextResponse.json({ ok: true })
}
