import { unstable_cache } from "next/cache"
import { connectDB } from "@/lib/db"
import { salonToday } from "@/lib/date"
import { BookingModel } from "@/lib/models/Booking"
import { StylistModel } from "@/lib/models/Stylist"
import type { DashboardData } from "@/types"

interface PopulatedService {
  _id: unknown
  name: string
  price: number
}

interface PopulatedBooking {
  _id: unknown
  customer: { name: string } | null
  stylist: { name: string } | null
  services: PopulatedService[]
  bookingDate: string
  bookingTime: string
  status: string
  createdAt: Date
  updatedAt: Date
}

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7)
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number)
  return new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short" })
}

/**
 * Aggregates all dashboard data in a single pass. Shared by the server-rendered
 * dashboard page (direct call, no HTTP hop) and the /api/dashboard route.
 */
async function fetchDashboardData(): Promise<DashboardData> {
  await connectDB()

  const [bookings, stylistCount] = await Promise.all([
    BookingModel.find()
      .populate("customer", "name")
      .populate("stylist", "name")
      .populate("services", "name price")
      .sort({ createdAt: -1 })
      .lean<PopulatedBooking[]>(),
    StylistModel.countDocuments({ active: true }),
  ])

  const todayStr = salonToday()

  const totalRevenue = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.services.reduce((s, svc) => s + svc.price, 0), 0)

  const totalAppointments = bookings.length
  const todaysAppointments = bookings.filter(
    (b) => b.bookingDate === todayStr && b.status !== "CANCELLED"
  ).length
  const pendingAppointments = bookings.filter((b) => b.status === "PENDING").length

  // Monthly bookings for the last 6 months, oldest first.
  const monthKeys: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`)
  }
  const monthlyCounts = new Map(monthKeys.map((key) => [key, 0]))
  for (const booking of bookings) {
    const key = monthKey(booking.bookingDate)
    if (monthlyCounts.has(key)) {
      monthlyCounts.set(key, (monthlyCounts.get(key) ?? 0) + 1)
    }
  }
  const monthlyBookings = monthKeys.map((key) => ({
    month: monthLabel(key),
    count: monthlyCounts.get(key) ?? 0,
  }))

  // Services performance: booking count per service, excluding cancelled bookings.
  const serviceCounts = new Map<string, number>()
  for (const booking of bookings) {
    if (booking.status === "CANCELLED") continue
    for (const service of booking.services) {
      serviceCounts.set(service.name, (serviceCounts.get(service.name) ?? 0) + 1)
    }
  }
  const servicesPerformance = Array.from(serviceCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const upcomingAppointments = bookings
    .filter((b) => ["PENDING", "CONFIRMED"].includes(b.status) && b.bookingDate >= todayStr)
    .sort((a, b) =>
      `${a.bookingDate}${a.bookingTime}`.localeCompare(`${b.bookingDate}${b.bookingTime}`)
    )
    .slice(0, 10)
    .map((b) => ({
      id: String(b._id),
      customerName: b.customer?.name ?? "Unknown",
      stylistName: b.stylist?.name ?? "Unknown",
      serviceNames: b.services.map((s) => s.name),
      bookingDate: b.bookingDate,
      bookingTime: b.bookingTime,
      status: b.status as DashboardData["upcomingAppointments"][number]["status"],
    }))

  const recentActivity = [...bookings]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8)
    .map((b) => ({
      id: String(b._id),
      description: `${b.customer?.name ?? "A customer"} — ${b.services
        .map((s) => s.name)
        .join(", ")} with ${b.stylist?.name ?? "a stylist"} (${b.status})`,
      updatedAt: String(b.updatedAt),
    }))

  return {
    stats: {
      totalRevenue,
      totalAppointments,
      todaysAppointments,
      pendingAppointments,
      stylistCount,
    },
    monthlyBookings,
    servicesPerformance,
    upcomingAppointments,
    recentActivity,
  }
}

/**
 * Cached dashboard aggregation. The DB scan is reused across requests until it
 * expires (60s — short enough that "today's appointments" stays correct across
 * a day boundary) or a booking/service mutation calls `revalidateTag("dashboard")`.
 */
export const getDashboardData = unstable_cache(
  fetchDashboardData,
  ["dashboard-data"],
  { tags: ["dashboard"], revalidate: 60 }
)
