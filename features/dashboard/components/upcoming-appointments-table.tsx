import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BookingRowActions } from "@/features/bookings/components/booking-row-actions"
import type { UpcomingAppointment } from "@/types"

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
}

export function UpcomingAppointmentsTable({
  appointments,
}: {
  appointments: UpcomingAppointment[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No upcoming appointments
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Stylist</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.customerName}</TableCell>
                  <TableCell>{appt.serviceNames.join(", ")}</TableCell>
                  <TableCell>{appt.stylistName}</TableCell>
                  <TableCell>{appt.bookingDate}</TableCell>
                  <TableCell>{appt.bookingTime}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[appt.status] ?? "secondary"}>
                      {appt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <BookingRowActions bookingId={appt.id} status={appt.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
