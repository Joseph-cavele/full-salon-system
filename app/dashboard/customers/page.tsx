import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/get-query-client"
import { requireOwner } from "@/features/auth/server/session"
import { getCustomers } from "@/features/customers/server/get-customers"
import { CustomersManagement } from "@/features/customers/components/customers-management"

export default async function DashboardCustomersPage() {
  await requireOwner()

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-4 sm:p-6">
        <CustomersManagement />
      </div>
    </HydrationBoundary>
  )
}
