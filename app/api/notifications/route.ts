import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { NotificationModel } from "@/lib/models/Notification"

export async function GET() {
  await connectDB()

  const [notifications, unreadCount] = await Promise.all([
    NotificationModel.find().sort({ createdAt: -1 }).limit(20).lean(),
    NotificationModel.countDocuments({ read: false }),
  ])

  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: String(n._id),
      title: n.title,
      message: n.message,
      bookingId: String(n.bookingId),
      read: n.read,
      createdAt: n.createdAt,
    })),
    unreadCount,
  })
}
