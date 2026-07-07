import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/lib/models/Service"
import type { Service } from "@/types"

export async function getServices(): Promise<Service[]> {
  await connectDB()
  const services = await ServiceModel.find().sort({ name: 1 }).lean()

  return services.map((s) => ({
    id: String(s._id),
    name: s.name,
    description: s.description,
    price: s.price,
    duration: s.duration,
    category: s.category ?? "Hair",
    image: s.image,
  }))
}
