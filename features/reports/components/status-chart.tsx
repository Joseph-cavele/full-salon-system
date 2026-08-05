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

/* Status colours, ramped along the brand's fuchsia arc so "further through
   the funnel" reads as "deeper pink": pale rose while money is outstanding,
   full fuchsia once confirmed, deep berry when completed.

   The two exits from the funnel deliberately leave the ramp — cancelled is
   red and no-show is a neutral mauve-grey. If they stayed on the pink scale
   they'd read as just another stage rather than a failure. */
const STATUS_COLORS: Record<BookingStatus, { light: string; dark: string }> = {
  PENDING_PAYMENT: { light: "#f9d9e3", dark: "#6b3a52" },
  PENDING: { light: "#f9a8d4", dark: "#f9a8d4" },
  CONFIRMED: { light: "#ec4899", dark: "#ec4899" },
  COMPLETED: { light: "#be185d", dark: "#f472b6" },
  CANCELLED: { light: "#ba1a1a", dark: "#ffb4ab" },
  NO_SHOW: { light: "#7c6b74", dark: "#b9a8b2" },
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "Awaiting payment",
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
      { label: STATUS_LABEL[d.status], theme: STATUS_COLORS[d.status] },
    ])
  ) satisfies ChartConfig

  const chartData = data.map((d) => ({
    status: STATUS_LABEL[d.status],
    count: d.count,
    fill: `var(--color-${d.status})`,
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
