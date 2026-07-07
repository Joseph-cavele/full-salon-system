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

      <div className="grid gap-4 lg:grid-cols-2">
        <MonthlyBookingsChart data={data.monthlyBookings} />
        <ServicesPerformanceChart data={data.servicesPerformance} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingAppointmentsTable appointments={data.upcomingAppointments} />
        </div>
        <div id="activity">
          <RecentActivity items={data.recentActivity} />
        </div>
      </div>
    </div>
  )
}
