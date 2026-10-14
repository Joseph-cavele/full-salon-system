import { NextResponse } from "next/server"
import { getCustomers } from "@/features/customers/server/get-customers"
import { denyUnlessOwner } from "@/features/auth/server/session"

export async function GET() {
  const denied = await denyUnlessOwner()
  if (denied) return denied

  const customers = await getCustomers()
  return NextResponse.json(customers)
}
