import { NextResponse } from "next/server"
import { getCustomers } from "@/features/customers/server/get-customers"

export async function GET() {
  const customers = await getCustomers()
  return NextResponse.json(customers)
}
