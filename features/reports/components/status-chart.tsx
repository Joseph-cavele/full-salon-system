"use client"

import { Cell, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BookingStatus } from "@/types"

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: "#d9bd85",
  CONFIRMED: "#c9a24b",
  COMPLETED: "#4a7c59",
  CANCELLED: "#b4462f",
  NO_SHOW: "#8a7550",
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
}

export function StatusChart({
  data,
}: {
  data: { status: BookingStatus; count: number }[]
}) {
  const chartConfig = Object.fromEntries(
    data.map((d) => [
      d.status,
      { label: STATUS_LABEL[d.status], color: STATUS_COLORS[d.status] },
    ])
  ) satisfies ChartConfig

  const chartData = data.map((d) => ({
    status: STATUS_LABEL[d.status],
    count: d.count,
    fill: STATUS_COLORS[d.status],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No booking data yet</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {chartData.map((d) => (
                  <Cell key={d.status} fill={d.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="status" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
