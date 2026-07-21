import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { connectDB } from "@/lib/db"
import { CustomerModel } from "@/lib/models/Customer"
import { StylistModel } from "@/lib/models/Stylist"
import { ServiceModel } from "@/lib/models/Service"
import { BookingModel } from "@/lib/models/Booking"
import { BookingImageModel } from "@/lib/models/BookingImage"
import { NotificationModel } from "@/lib/models/Notification"
import { createBookingSchema } from "@/features/bookings/schema"
import { getBookings } from "@/features/bookings/server/get-bookings"
import { resend } from "@/lib/resend"
import { newBookingOwnerEmailHtml } from "@/emails/new-booking-owner"
import type { BookingStatus } from "@/types"

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") as BookingStatus | null
  const bookings = await getBookings(status ?? undefined)
  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = createBookingSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking data", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const {
    customerName,
    customerEmail,
    serviceIds,
    stylistId,
    bookingDate,
    bookingTime,
    description,
    notes,
  } = parsed.data
  const imageUrls = parsed.data.imageUrls ?? []

  await connectDB()

  const stylist = await StylistModel.findById(stylistId)
  if (!stylist) {
    return NextResponse.json({ error: "Stylist not found" }, { status: 404 })
  }

  const services = await ServiceModel.find({ _id: { $in: serviceIds } })
  if (services.length !== serviceIds.length) {
    return NextResponse.json({ error: "One or more services not found" }, { status: 404 })
  }

  const customer = await CustomerModel.findOneAndUpdate(
    { email: customerEmail },
    { name: customerName, email: customerEmail },
    { upsert: true, returnDocument: "after" }
  )

  const booking = await BookingModel.create({
    customer: customer._id,
    stylist: stylist._id,
    services: services.map((s) => s._id),
    bookingDate,
    bookingTime,
    description,
    notes,
    status: "PENDING",
  })

  if (imageUrls.length > 0) {
    await BookingImageModel.insertMany(
      imageUrls.map((imageUrl) => ({ bookingId: booking._id, imageUrl }))
    )
  }

  await NotificationModel.create({
    title: "New Booking Request",
    message: `${customerName} requested an appointment with ${stylist.name}`,
    bookingId: booking._id,
    read: false,
  })

  if (resend && process.env.OWNER_EMAIL) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to: process.env.OWNER_EMAIL,
        subject: "New Booking Request",
        html: newBookingOwnerEmailHtml({
          customerName,
          customerEmail,
          stylistName: stylist.name,
          serviceNames: services.map((s) => s.name),
          bookingDate,
          bookingTime,
        }),
      })
    } catch (err) {
      console.error("Failed to send owner notification email", err)
    }
  }

  // A new booking changes the dashboard's counts, revenue and charts.
  revalidateTag("dashboard", "max")

  return NextResponse.json({ id: String(booking._id) }, { status: 201 })
}
