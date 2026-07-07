import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { StylistModel } from "@/lib/models/Stylist"
import { stylistInputSchema } from "@/features/stylists/schema"
import { getStylists } from "@/features/stylists/server/get-stylists"

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all")
  const stylists = await getStylists(!!all)
  return NextResponse.json(stylists)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = stylistInputSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid stylist data", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  await connectDB()
  const stylist = await StylistModel.create(parsed.data)

  return NextResponse.json({ id: String(stylist._id) }, { status: 201 })
}
