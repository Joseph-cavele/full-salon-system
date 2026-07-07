import "dotenv/config"
import bcrypt from "bcryptjs"
import { connectDB } from "../lib/db"
import { ServiceModel } from "../lib/models/Service"
import { StylistModel } from "../lib/models/Stylist"
import { UserModel } from "../lib/models/User"
import { CustomerModel } from "../lib/models/Customer"
import { BookingModel } from "../lib/models/Booking"
import { NotificationModel } from "../lib/models/Notification"

const DEV_PASSWORD = "password123"

const services = [
  { name: "Haircut & Styling", description: "Expert haircut with a professional blowdry and style.", price: 45, duration: 45, category: "Hair" },
  { name: "Hair Coloring", description: "Full hair color or root touch-up with premium products.", price: 120, duration: 90, category: "Hair" },
  { name: "Highlights / Balayage", description: "Add dimension and brightness with highlights or balayage.", price: 150, duration: 120, category: "Hair" },
  { name: "Keratin Treatment", description: "Smooth, frizz-free hair with a long-lasting keratin treatment.", price: 160, duration: 120, category: "Hair" },
  { name: "Hair Spa", description: "Nourishing spa treatment for healthy and shiny hair.", price: 70, duration: 60, category: "Hair" },
  { name: "Signature Facial", description: "Deep-cleansing facial tailored to your skin type.", price: 90, duration: 60, category: "Skin" },
  { name: "Makeup & Glam", description: "Professional makeup for events and special occasions.", price: 110, duration: 75, category: "Beauty" },
  { name: "Manicure & Pedicure", description: "Complete nail care with polish and cuticle work.", price: 55, duration: 60, category: "Nail" },
  { name: "Bridal Package", description: "Hair, makeup, and nails for your big day.", price: 320, duration: 240, category: "Packages" },
]

const stylists = [
  { name: "Amara Johnson", email: "amara@salon.test", phone: "555-0101", bio: "Braids & natural hair specialist", active: true },
  { name: "Jordan Lee", email: "jordan@salon.test", phone: "555-0102", bio: "Color specialist, 8 years experience", active: true },
  { name: "Taylor Brooks", email: "taylor@salon.test", phone: "555-0103", bio: "Cuts, silk press, and styling", active: true },
]

async function seed() {
  await connectDB()

  await ServiceModel.deleteMany({})
  const createdServices = await ServiceModel.insertMany(services)

  await StylistModel.deleteMany({})
  const createdStylists = await StylistModel.insertMany(
    stylists.map((stylist, i) => ({
      ...stylist,
      services: createdServices.map((s) => s._id).filter((_, idx) => idx !== i),
    }))
  )

  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10)
  await UserModel.findOneAndUpdate(
    { email: "owner@salon.test" },
    { name: "Salon Owner", email: "owner@salon.test", password: passwordHash, role: "owner" },
    { upsert: true }
  )
  await UserModel.findOneAndUpdate(
    { email: "jordan@salon.test" },
    { name: "Jordan Lee", email: "jordan@salon.test", password: passwordHash, role: "stylist" },
    { upsert: true }
  )

  await CustomerModel.deleteMany({})
  const customers = await CustomerModel.insertMany([
    { name: "Priya Nair", email: "priya@example.test" },
    { name: "Marcus Webb", email: "marcus@example.test" },
    { name: "Elena Ruiz", email: "elena@example.test" },
    { name: "Devon Clarke", email: "devon@example.test" },
  ])

  await BookingModel.deleteMany({})
  await NotificationModel.deleteMany({})

  const today = new Date()
  const dateOffset = (days: number) => {
    const d = new Date(today)
    d.setDate(d.getDate() + days)
    return d.toISOString().split("T")[0]
  }
  const monthsAgoDate = (months: number, day: number) => {
    const d = new Date(today.getFullYear(), today.getMonth() - months, day)
    return d.toISOString().split("T")[0]
  }

  const sampleBookings = [
    { customer: 0, stylist: 0, services: [1], bookingDate: monthsAgoDate(4, 5), bookingTime: "10:00", status: "COMPLETED" },
    { customer: 1, stylist: 1, services: [3], bookingDate: monthsAgoDate(3, 12), bookingTime: "13:00", status: "COMPLETED" },
    { customer: 2, stylist: 2, services: [2], bookingDate: monthsAgoDate(3, 20), bookingTime: "15:30", status: "CANCELLED" },
    { customer: 3, stylist: 0, services: [1, 3], bookingDate: monthsAgoDate(2, 8), bookingTime: "09:30", status: "COMPLETED" },
    { customer: 0, stylist: 1, services: [0], bookingDate: monthsAgoDate(1, 15), bookingTime: "11:00", status: "COMPLETED" },
    { customer: 1, stylist: 2, services: [4], bookingDate: monthsAgoDate(1, 22), bookingTime: "16:00", status: "NO_SHOW" },
    { customer: 2, stylist: 0, services: [0], bookingDate: dateOffset(0), bookingTime: "14:00", status: "CONFIRMED" },
    { customer: 3, stylist: 1, services: [3], bookingDate: dateOffset(2), bookingTime: "10:30", status: "PENDING" },
    { customer: 0, stylist: 2, services: [2], bookingDate: dateOffset(5), bookingTime: "12:00", status: "PENDING" },
    { customer: 1, stylist: 0, services: [1], bookingDate: dateOffset(7), bookingTime: "09:00", status: "CONFIRMED" },
  ] as const

  const createdBookings = await BookingModel.insertMany(
    sampleBookings.map((b) => ({
      customer: customers[b.customer]._id,
      stylist: createdStylists[b.stylist]._id,
      services: b.services.map((i) => createdServices[i]._id),
      bookingDate: b.bookingDate,
      bookingTime: b.bookingTime,
      status: b.status,
    }))
  )

  const pendingBookings = createdBookings.filter((b) => b.status === "PENDING")
  await NotificationModel.insertMany(
    pendingBookings.map((b) => {
      const customer = customers.find((c) => c._id.equals(b.customer))
      const stylist = createdStylists.find((s) => s._id.equals(b.stylist))
      return {
        title: "New Booking Request",
        message: `${customer?.name} requested an appointment with ${stylist?.name}`,
        bookingId: b._id,
        read: false,
      }
    })
  )

  console.log(`Seeded ${createdServices.length} services and ${stylists.length} stylists.`)
  console.log(`Seeded ${customers.length} customers and ${createdBookings.length} bookings.`)
  console.log(`Seeded users (dev password: "${DEV_PASSWORD}"):`)
  console.log("  owner@salon.test (role: owner)")
  console.log("  jordan@salon.test (role: stylist)")
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
