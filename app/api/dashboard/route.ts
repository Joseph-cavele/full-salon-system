import { NextResponse } from "next/server"
import { getDashboardData } from "@/features/dashboard/server/get-dashboard-data"
import { denyUnlessOwner } from "@/features/auth/server/session"

export async function GET() {
  const denied = await denyUnlessOwner()
  if (denied) return denied

  const data = await getDashboardData()
  return NextResponse.json(data)
}
