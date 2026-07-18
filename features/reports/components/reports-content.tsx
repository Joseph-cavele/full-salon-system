"use client"

import { Banknote, CalendarCheck, TrendingUp, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/currency"
import { useReports } from "@/features/reports/hooks/use-reports"
import { RevenueChart } from "@/features/reports/components/revenue-chart"
import { StatusChart } from "@/features/reports/components/status-chart"

const money = formatCurrency

export function ReportsContent() {
  const { data, isLoading, isError } = useReports()

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
        Could not load reports. Please refresh the page.
      </p>
    )
  }

  const cards = [
    {
      label: "Total revenue",
      value: money(data.summary.totalRevenue),
      icon: Banknote,
      tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Completed bookings",
      value: data.summary.completedCount.toLocaleString(),
      icon: CalendarCheck,
      tint: "bg-primary/15 text-primary",
    },
    {
      label: "Avg booking value",
      value: money(data.summary.avgBookingValue),
      icon: TrendingUp,
      tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Cancellation rate",
      value: `${data.summary.cancellationRate}%`,
      icon: XCircle,
      tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Performance overview across all bookings.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <span className={cn("flex size-8 items-center justify-center rounded-full", card.tint)}>
                  <card.icon className="size-4" />
                </span>
              </div>
              <span className="text-2xl font-semibold">{card.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart data={data.monthlyRevenue} />
        <StatusChart data={data.statusBreakdown} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topServices.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No data yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Bookings</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topServices.map((s) => (
                    <TableRow key={s.name}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-right">{s.count}</TableCell>
                      <TableCell className="text-right">{money(s.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Stylists</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topStylists.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No data yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stylist</TableHead>
                    <TableHead className="text-right">Bookings</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topStylists.map((s) => (
                    <TableRow key={s.name}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-right">{s.bookings}</TableCell>
                      <TableCell className="text-right">{money(s.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
