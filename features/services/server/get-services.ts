import { unstable_cache } from "next/cache"
import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/lib/models/Service"
import type { Service } from "@/types"

async function fetchServices(): Promise<Service[]> {
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

/**
 * Cached service list. Services rarely change, so the DB read is reused across
 * requests until a service mutation calls `revalidateTag("services")`.
 */
export const getServices = unstable_cache(fetchServices, ["services-list"], {
  tags: ["services"],
  revalidate: 300,
})
