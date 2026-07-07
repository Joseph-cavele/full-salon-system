"use client"

import { Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { AvatarMenu } from "@/components/dashboard/avatar-menu"
import { useDashboardNav } from "@/components/dashboard/dashboard-nav-context"

export function Topbar({
  name,
  email,
}: {
  name?: string | null
  email?: string | null
}) {
  const { setMobileNavOpen } = useDashboardNav()

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4">
      <button
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setMobileNavOpen(true)}
        className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground sm:hidden"
      >
        <Menu className="size-5" />
      </button>

      <h1 className="font-heading text-lg font-semibold">Dashboard</h1>

      <div className="flex-1">
        <Input
          type="search"
          placeholder="Search bookings, customers, stylists..."
          className="hidden max-w-sm sm:flex"
        />
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />
        <AvatarMenu name={name} email={email} />
      </div>
    </header>
  )
}
