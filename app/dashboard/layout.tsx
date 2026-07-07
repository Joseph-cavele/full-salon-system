import { auth } from "@/auth"
import { Topbar } from "@/components/dashboard/topbar"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardNavProvider } from "@/components/dashboard/dashboard-nav-context"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <DashboardNavProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <Topbar name={session?.user?.name} email={session?.user?.email} />
        <div className="flex flex-1">
          <Sidebar name={session?.user?.name} email={session?.user?.email} />
          <div className="min-w-0 flex-1 overflow-x-hidden bg-muted/40">{children}</div>
        </div>
      </div>
    </DashboardNavProvider>
  )
}
