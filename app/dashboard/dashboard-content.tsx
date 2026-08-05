"use client"

import { Loader2 } from "lucide-react"
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard"
import { StatCards } from "@/features/dashboard/components/stat-cards"
import { MonthlyBookingsChart } from "@/features/dashboard/components/monthly-bookings-chart"
import { ServicesPerformanceChart } from "@/features/dashboard/components/services-performance-chart"
import { UpcomingAppointmentsTable } from "@/features/dashboard/components/upcoming-appointments-table"
import { RecentActivity } from "@/features/dashboard/components/recent-activity"

export function DashboardContent() {
  const { data, isLoading, isError } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <p className="p-6 text-sm text-destructive">
        Could not load dashboard data. Please refresh the page.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <StatCards stats={data.stats} />

      {/* `min-w-0` on every grid child is load-bearing, not defensive tidying.
          Grid items default to `min-width: auto`, which refuses to shrink below
          the intrinsic width of their content. Without it the appointments
          table pushed its column wider than the track instead of letting the
          `overflow-x-auto` container inside <Table> take over, so the right-hand
          columns were clipped with no way to scroll to them. Recharts has the
          same problem — it measures a parent that never shrank. */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <MonthlyBookingsChart data={data.monthlyBookings} />
        </div>
        <div className="min-w-0">
          <ServicesPerformanceChart data={data.servicesPerformance} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <UpcomingAppointmentsTable appointments={data.upcomingAppointments} />
        </div>
        <div id="activity" className="min-w-0">
          <RecentActivity items={data.recentActivity} />
        </div>
      </div>
    </div>
  )
}
