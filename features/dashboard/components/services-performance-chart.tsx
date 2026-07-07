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
import type { ServicePerformancePoint } from "@/types"

const SLOT_COLORS: { light: string; dark: string }[] = [
  { light: "#c9a24b", dark: "#d9bd85" }, // gold
  { light: "#8a6d3b", dark: "#b9945a" }, // bronze
  { light: "#b07d4a", dark: "#cf9b63" }, // copper
  { light: "#6f5a34", dark: "#a08658" }, // deep brass
  { light: "#e0c88a", dark: "#ecd9a8" }, // light gold
  { light: "#9c6f42", dark: "#c08a52" }, // caramel
  { light: "#4f4128", dark: "#8a7550" }, // umber
  { light: "#d4a373", dark: "#e0b487" }, // sand
]

export function ServicesPerformanceChart({
  data,
}: {
  data: ServicePerformancePoint[]
}) {
  const chartConfig = Object.fromEntries(
    data.map((service, i) => [
      service.name,
      { label: service.name, theme: SLOT_COLORS[i % SLOT_COLORS.length] },
    ])
  ) satisfies ChartConfig

  const total = data.reduce((sum, s) => sum + s.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No booking data yet
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                label={({ value }: { value?: number }) =>
                  total && value ? `${Math.round((value / total) * 100)}%` : ""
                }
              >
                {data.map((service, i) => (
                  <Cell
                    key={service.name}
                    fill={SLOT_COLORS[i % SLOT_COLORS.length].light}
                  />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
