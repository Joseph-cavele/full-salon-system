import {
  LayoutDashboard,
  CalendarClock,
  Sparkles,
  Users,
  UserRound,
  Bell,
  BarChart3,
  Settings,
} from "lucide-react"

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/dashboard/bookings", icon: CalendarClock },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Services", href: "/dashboard/services", icon: Sparkles },
  { label: "Stylists", href: "/dashboard/stylists", icon: UserRound },
  { label: "Notifications", href: "/dashboard#activity", icon: Bell, badge: true },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const
