"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { ChevronsUpDown, Flower2, LogOut, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/features/notifications/hooks/use-notifications"
import { useDashboardNav } from "@/components/dashboard/dashboard-nav-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { navItems } from "@/components/dashboard/nav-items"

function initials(name?: string | null) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function SidebarBrand() {
  return (
    <span className="flex flex-col leading-none">
      <span className="flex items-center gap-1.5 font-lux text-base font-semibold text-sidebar-foreground">
        <Flower2 className="size-4 text-[#c9a24b]" />
        GLOW &amp; GRACE
      </span>
      <span className="pl-5.5 text-[10px] font-medium tracking-[0.3em] text-[#c9a24b]">
        SALON
      </span>
    </span>
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { data } = useNotifications()

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = !item.href.includes("#") && pathname === item.href

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              <Icon className="size-4" />
              {item.label}
            </span>
            {"badge" in item && item.badge && !!data?.unreadCount && (
              <span className="flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
                {data.unreadCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarUserMenu({
  name,
  email,
}: {
  name?: string | null
  email?: string | null
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 border-t border-sidebar-border p-3 text-left outline-none hover:bg-sidebar-accent">
        <Avatar className="size-8">
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col leading-none">
          <span className="text-sm font-medium">{name ?? "Admin"}</span>
          <span className="text-xs text-sidebar-foreground/60">Admin</span>
        </div>
        <ChevronsUpDown className="size-4 text-sidebar-foreground/50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-52">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Sidebar({
  name,
  email,
}: {
  name?: string | null
  email?: string | null
}) {
  const { mobileNavOpen, setMobileNavOpen } = useDashboardNav()
  const pathname = usePathname()

  useEffect(() => {
    setMobileNavOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground sm:flex">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <SidebarBrand />
        </div>
        <SidebarNav />
        <SidebarUserMenu name={name} email={email} />
      </aside>

      {/* Mobile drawer */}
      <DialogPrimitive.Root open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 sm:hidden data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Popup className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80%] flex-col bg-sidebar text-sidebar-foreground outline-none sm:hidden data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left">
            <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
              <SidebarBrand />
              <DialogPrimitive.Close
                aria-label="Close navigation"
                className="inline-flex size-8 items-center justify-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent"
              >
                <X className="size-4" />
              </DialogPrimitive.Close>
            </div>
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
            <SidebarUserMenu name={name} email={email} />
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}
