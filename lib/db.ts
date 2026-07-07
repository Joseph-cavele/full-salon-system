import mongoose from "mongoose"
import "@/lib/models"

const MONGODB_URI = process.env.MONGODB_URI

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null }
global.mongooseCache = cache

export async function connectDB() {
  if (cache.conn) return cache.conn

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI)
      .then((conn) => {
        const { host, port, name } = conn.connection
        console.log(`✅ MongoDB connected — ${host}:${port}/${name}`)
        return conn
      })
      .catch((err) => {
        // Clear the cached promise so the next request retries instead of
        // forever re-awaiting this rejected connection attempt.
        cache.promise = null
        console.error(`❌ MongoDB connection failed: ${err.message}`)
        throw err
      })
  }

  cache.conn = await cache.promise
  return cache.conn
}
