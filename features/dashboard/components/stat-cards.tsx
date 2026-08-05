import { Banknote, CalendarCheck, CalendarClock, Hourglass, UsersRound } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/currency"
import type { DashboardStats } from "@/types"

export function StatCards({ stats }: { stats: DashboardStats }) {
  /* Tints were emerald/amber/rose/sky — five unrelated stock hues that
     predated the rosé theme and read as a different product next to it.
     They now follow one rule, expressed in theme tokens so they track the
     palette instead of drifting from it again:

       fuchsia  = what the salon earned or is committed to (the numbers
                  the owner opens the page for)
       mauve    = what's merely waiting or is roster context

     The icons are decorative — the figures carry the meaning — so the
     restraint costs nothing and stops the row competing with the charts. */
  const cards = [
    {
      label: "Total revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: Banknote,
      tint: "bg-primary/12 text-primary",
    },
    {
      label: "Total appointments",
      value: stats.totalAppointments.toLocaleString(),
      icon: CalendarCheck,
      tint: "bg-primary/12 text-primary",
    },
    {
      label: "Today's appointments",
      value: stats.todaysAppointments.toLocaleString(),
      icon: CalendarClock,
      tint: "bg-primary/12 text-primary",
    },
    {
      label: "Pending appointments",
      value: stats.pendingAppointments.toLocaleString(),
      icon: Hourglass,
      tint: "bg-muted text-muted-foreground",
    },
    {
      label: "Stylists",
      value: stats.stylistCount.toLocaleString(),
      icon: UsersRound,
      tint: "bg-muted text-muted-foreground",
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
