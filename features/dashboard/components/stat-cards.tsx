import { Banknote, CalendarCheck, CalendarClock, Hourglass, UsersRound } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/currency"
import type { DashboardStats } from "@/types"

export function StatCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: "Total revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: Banknote,
      tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Total appointments",
      value: stats.totalAppointments.toLocaleString(),
      icon: CalendarCheck,
      tint: "bg-primary/10 text-primary",
    },
    {
      label: "Today's appointments",
      value: stats.todaysAppointments.toLocaleString(),
      icon: CalendarClock,
      tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Pending appointments",
      value: stats.pendingAppointments.toLocaleString(),
      icon: Hourglass,
      tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      label: "Stylists",
      value: stats.stylistCount.toLocaleString(),
      icon: UsersRound,
      tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
  )
}
