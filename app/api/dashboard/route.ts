import { NextResponse } from "next/server"
import { getDashboardData } from "@/features/dashboard/server/get-dashboard-data"

export async function GET() {
  const data = await getDashboardData()
  return NextResponse.json(data)
}
