"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useBookings } from "@/features/bookings/hooks/use-bookings"
import { BookingManagementRowActions } from "@/features/bookings/components/booking-management-row-actions"
import type { BookingStatus } from "@/types"

const TABS: { label: string; status?: BookingStatus }[] = [
  { label: "All" },
  { label: "Pending", status: "PENDING" },
  { label: "Confirmed", status: "CONFIRMED" },
  { label: "Cancelled", status: "CANCELLED" },
  { label: "Completed", status: "COMPLETED" },
]

const statusVariant: Record<BookingStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  CANCELLED: "destructive",
  COMPLETED: "outline",
  NO_SHOW: "outline",
}

export function BookingsManagement() {
  const [tab, setTab] = useState<string>("All")
  const activeStatus = TABS.find((t) => t.label === tab)?.status
  const { data, isLoading, isError } = useBookings(activeStatus)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Bookings Management</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1 border-b pb-3">
          {TABS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTab(t.label)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t.label
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : isError || !data ? (
          <p className="py-8 text-center text-sm text-destructive">
            Could not load bookings.
          </p>
        ) : data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No bookings in this view.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Stylist</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.customerName}</TableCell>
                    <TableCell>{booking.serviceNames.join(", ")}</TableCell>
                    <TableCell>{booking.stylistName}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {booking.bookingDate}, {booking.bookingTime}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <BookingManagementRowActions booking={booking} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
