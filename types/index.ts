export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW"

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category?: string
  image?: string
}

export interface Stylist {
  id: string
  name: string
  email: string
  phone: string
  bio?: string
  image?: string
  workingHours?: string
  active: boolean
  services: { id: string; name: string }[]
}

export interface Customer {
  id: string
  name: string
  email: string
}

export interface BookingImage {
  id: string
  bookingId: string
  imageUrl: string
}

export interface Booking {
  id: string
  customer: Customer
  stylist: Stylist
  services: Service[]
  bookingDate: string
  bookingTime: string
  description?: string
  notes?: string
  status: BookingStatus
  images: BookingImage[]
  createdAt: string
  updatedAt: string
}

export interface CreateBookingInput {
  customerName: string
  customerEmail: string
  serviceIds: string[]
  stylistId: string
  bookingDate: string
  bookingTime: string
  description?: string
  notes?: string
  imageUrls: string[]
}

export interface DashboardStats {
  totalRevenue: number
  totalAppointments: number
  todaysAppointments: number
  pendingAppointments: number
  stylistCount: number
}

export interface MonthlyBookingPoint {
  month: string
  count: number
}

export interface ServicePerformancePoint {
  name: string
  count: number
}

export interface UpcomingAppointment {
  id: string
  customerName: string
  stylistName: string
  serviceNames: string[]
  bookingDate: string
  bookingTime: string
  status: BookingStatus
}

export interface RecentActivityItem {
  id: string
  description: string
  updatedAt: string
}

export interface DashboardData {
  stats: DashboardStats
  monthlyBookings: MonthlyBookingPoint[]
  servicesPerformance: ServicePerformancePoint[]
  upcomingAppointments: UpcomingAppointment[]
  recentActivity: RecentActivityItem[]
}

export interface BookingListItem {
  id: string
  customerName: string
  customerEmail: string
  stylistName: string
  serviceNames: string[]
  total: number
  bookingDate: string
  bookingTime: string
  status: BookingStatus
}

export interface CustomerWithStats {
  id: string
  name: string
  email: string
  totalBookings: number
}

export interface ReportsData {
  summary: {
    totalRevenue: number
    completedCount: number
    avgBookingValue: number
    cancellationRate: number
    totalBookings: number
  }
  monthlyRevenue: { month: string; revenue: number }[]
  statusBreakdown: { status: BookingStatus; count: number }[]
  topServices: { name: string; count: number; revenue: number }[]
  topStylists: { name: string; bookings: number; revenue: number }[]
}

export interface SalonSettings {
  salonName: string
  tagline: string
  email: string
  phone: string
  address: string
  openingHours: string
  notificationEmail: string
  emailNotifications: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  bookingId: string
  read: boolean
  createdAt: string
}
