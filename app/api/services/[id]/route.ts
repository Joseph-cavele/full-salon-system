import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/lib/models/Service"
import { serviceInputSchema } from "@/features/services/schema"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const parsed = serviceInputSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid service data", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  await connectDB()
  const service = await ServiceModel.findByIdAndUpdate(id, parsed.data, {
    returnDocument: "after",
  })

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  revalidateTag("services", "max")
  revalidateTag("dashboard", "max")

  return NextResponse.json({ id: String(service._id) })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await connectDB()
  const service = await ServiceModel.findByIdAndDelete(id)

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  revalidateTag("services", "max")
  revalidateTag("dashboard", "max")

  return NextResponse.json({ id })
}
