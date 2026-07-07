import { NextResponse } from "next/server"
import { getReports } from "@/features/reports/server/get-reports"

export async function GET() {
  const reports = await getReports()
  return NextResponse.json(reports)
}
