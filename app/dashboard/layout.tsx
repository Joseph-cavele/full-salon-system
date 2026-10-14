import { requireOwner } from "@/features/auth/server/session"
import { Topbar } from "@/components/dashboard/topbar"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardNavProvider } from "@/components/dashboard/dashboard-nav-context"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* Layouts don't re-render on client navigation, so this is not the guard
     for the pages inside — each page calls requireOwner() itself. Here it
     only supplies the name/email for the chrome (memoized, no extra query). */
  const owner = await requireOwner()

  return (
    <DashboardNavProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <Topbar name={owner.name} email={owner.email} />
        <div className="flex flex-1">
          <Sidebar name={owner.name} email={owner.email} />
          <div className="min-w-0 flex-1 overflow-x-hidden bg-muted/40">{children}</div>
        </div>
      </div>
    </DashboardNavProvider>
  )
}
