import { NextResponse } from "next/server"
import { getReports } from "@/features/reports/server/get-reports"
import { denyUnlessOwner } from "@/features/auth/server/session"

export async function GET() {
  const denied = await denyUnlessOwner()
  if (denied) return denied

  const reports = await getReports()
  return NextResponse.json(reports)
}
