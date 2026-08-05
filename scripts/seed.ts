import "dotenv/config"
import bcrypt from "bcryptjs"
import { connectDB } from "../lib/db"
import { ServiceModel } from "../lib/models/Service"
import { StylistModel } from "../lib/models/Stylist"
import { UserModel } from "../lib/models/User"
import { CustomerModel } from "../lib/models/Customer"
import { BookingModel } from "../lib/models/Booking"
import { NotificationModel } from "../lib/models/Notification"

// Password for the seeded accounts. Set SEED_PASSWORD in your (gitignored) .env
// so no real password is ever committed. The fallback is intentionally unusable
// as a real credential — set SEED_PASSWORD and re-run `npm run seed` to apply.
const DEV_PASSWORD = process.env.SEED_PASSWORD ?? "change-me-set-SEED_PASSWORD"

/* ══════════════════════════════════════════════════════════════════════
   The bookable service list. Two things about it matter:

   PRICES ARE REAL AND IN RAND. They come from the same published list the
   marketing site renders (lib/salon-services.ts) — this file used to hold
   nine invented services priced 45–320, which `formatCurrency` rendered as
   Rand, so the booking flow was quoting "R 45" for a haircut the salon
   charges R60 for and offering a "Bridal Package" it does not do.

   Where the published price is a RANGE, `price` is the bottom of it and the
   range is stated in the description. A booking system needs one number, and
   quoting the low end while hiding the top is how a customer arrives expecting
   R1,000 and is billed R1,500.

   DURATIONS ARE ESTIMATES AND NEED CONFIRMING. They are trade-typical, not
   measured, and they drive the booking calendar — too short and the day
   double-books, too long and it turns away work. Walk this column with the
   salon before taking real bookings.
   ══════════════════════════════════════════════════════════════════════ */
const services = [
  // ── Dreadlocks ──────────────────────────────────────────────────────
  { name: "Dreadlocks Installation", description: "Starting your locs from scratch with the crochet method, sectioned and installed to grow evenly for years. R1,000–R1,500 depending on length and density — confirmed before we start.", price: 1000, duration: 240, category: "Dreadlocks" },
  { name: "Starting Dreadlocks (Crochet Method)", description: "Locs started and set with the crochet hook, parted to a grid that grows out cleanly.", price: 1000, duration: 240, category: "Dreadlocks" },
  { name: "Wash & Crochet Dreadlocks", description: "A full wash followed by crochet maintenance on new growth and loose hairs. R550–R800 depending on loc count.", price: 550, duration: 150, category: "Dreadlocks" },
  { name: "Dreadlocks Wash, Twist & Style", description: "Wash, root twist and a finished style. R350–R450 depending on length.", price: 350, duration: 90, category: "Dreadlocks" },
  { name: "Bleaching Half Locks", description: "Lightening the lower half of the locs, done in stages to protect the hair.", price: 350, duration: 120, category: "Dreadlocks" },
  { name: "Dreadlocks Detox", description: "A deep clarifying soak that strips product build-up and residue, leaving locs lighter and the scalp fresh.", price: 250, duration: 60, category: "Dreadlocks" },
  { name: "Black Dye Only", description: "Full black colour applied to the locs, no wash or styling included.", price: 200, duration: 60, category: "Dreadlocks" },
  { name: "Dreadlocks Wash Only", description: "A straightforward wash and dry, no retwist or styling.", price: 100, duration: 30, category: "Dreadlocks" },

  // ── Braids ──────────────────────────────────────────────────────────
  { name: "Long Braids", description: "Knotless braids installed with even tension, sized and parted to sit comfortably for weeks. R800–R1,000 depending on length and thickness.", price: 800, duration: 300, category: "Braids" },
  { name: "Short Braids", description: "Shoulder-length braids with curled ends — lighter on the scalp and quicker to install than a full set. R500–R650.", price: 500, duration: 180, category: "Braids" },

  // ── Cuts & Styling ──────────────────────────────────────────────────
  { name: "Pixie Cut (First Time)", description: "A sharp, low-maintenance cut shaped to your face and hairline, finished and styled in the chair.", price: 550, duration: 60, category: "Cuts & Styling" },
  { name: "Straight Up", description: "Cornrows braided straight up into a gathered crown.", price: 350, duration: 120, category: "Cuts & Styling" },
  { name: "Straight Back", description: "Classic straight-back cornrows, parted evenly and braided flat.", price: 300, duration: 90, category: "Cuts & Styling" },
  { name: "Hair Cut & Dye", description: "A cut and full colour in one sitting, finished and styled.", price: 150, duration: 90, category: "Cuts & Styling" },
  { name: "Hair Cut Only", description: "A clean cut and shape-up, no colour or treatment.", price: 60, duration: 30, category: "Cuts & Styling" },

  // ── Treatments ──────────────────────────────────────────────────────
  { name: "Dark & Lovely Relaxer", description: "A relaxer applied and neutralised with the scalp protected throughout.", price: 250, duration: 90, category: "Treatments" },
  { name: "Hair Wash Only", description: "A wash, condition and blow-dry on its own.", price: 50, duration: 30, category: "Treatments" },

  // ── Wigs ────────────────────────────────────────────────────────────
  { name: "Wig Installation", description: "Secure, natural-looking installation with the hairline blended and the unit styled before you leave.", price: 400, duration: 60, category: "Wigs" },
  { name: "Wig Removal", description: "Careful removal of glue or stitching with the natural hair cleaned and conditioned after.", price: 250, duration: 30, category: "Wigs" },
]

const stylists = [
  { name: "Amara Johnson", email: "amara@salon.test", phone: "555-0101", bio: "Braids & natural hair specialist", active: true },
  { name: "Jordan Lee", email: "jordan@salon.test", phone: "555-0102", bio: "Color specialist, 8 years experience", active: true },
  { name: "Taylor Brooks", email: "taylor@salon.test", phone: "555-0103", bio: "Cuts, silk press, and styling", active: true },
]

async function seed() {
  await connectDB()

  await ServiceModel.deleteMany({})
  const createdServices = await ServiceModel.insertMany(services)

  await StylistModel.deleteMany({})
  const createdStylists = await StylistModel.insertMany(
    stylists.map((stylist, i) => ({
      ...stylist,
      services: createdServices.map((s) => s._id).filter((_, idx) => idx !== i),
    }))
  )

  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10)
  await UserModel.findOneAndUpdate(
    { email: "owner@salon.test" },
    { name: "Salon Owner", email: "owner@salon.test", password: passwordHash, role: "owner" },
    { upsert: true }
  )
  await UserModel.findOneAndUpdate(
    { email: "jordan@salon.test" },
    { name: "Jordan Lee", email: "jordan@salon.test", password: passwordHash, role: "stylist" },
    { upsert: true }
  )

  await CustomerModel.deleteMany({})
  const customers = await CustomerModel.insertMany([
    { name: "Priya Nair", email: "priya@example.test" },
    { name: "Marcus Webb", email: "marcus@example.test" },
    { name: "Elena Ruiz", email: "elena@example.test" },
    { name: "Devon Clarke", email: "devon@example.test" },
  ])

  await BookingModel.deleteMany({})
  await NotificationModel.deleteMany({})

  const today = new Date()
  const dateOffset = (days: number) => {
    const d = new Date(today)
    d.setDate(d.getDate() + days)
    return d.toISOString().split("T")[0]
  }
  const monthsAgoDate = (months: number, day: number) => {
    const d = new Date(today.getFullYear(), today.getMonth() - months, day)
    return d.toISOString().split("T")[0]
  }

  const sampleBookings = [
    { customer: 0, stylist: 0, services: [1], bookingDate: monthsAgoDate(4, 5), bookingTime: "10:00", status: "COMPLETED" },
    { customer: 1, stylist: 1, services: [3], bookingDate: monthsAgoDate(3, 12), bookingTime: "13:00", status: "COMPLETED" },
    { customer: 2, stylist: 2, services: [2], bookingDate: monthsAgoDate(3, 20), bookingTime: "15:30", status: "CANCELLED" },
    { customer: 3, stylist: 0, services: [1, 3], bookingDate: monthsAgoDate(2, 8), bookingTime: "09:30", status: "COMPLETED" },
    { customer: 0, stylist: 1, services: [0], bookingDate: monthsAgoDate(1, 15), bookingTime: "11:00", status: "COMPLETED" },
    { customer: 1, stylist: 2, services: [4], bookingDate: monthsAgoDate(1, 22), bookingTime: "16:00", status: "NO_SHOW" },
    { customer: 2, stylist: 0, services: [0], bookingDate: dateOffset(0), bookingTime: "14:00", status: "CONFIRMED" },
    { customer: 3, stylist: 1, services: [3], bookingDate: dateOffset(2), bookingTime: "10:30", status: "PENDING" },
    { customer: 0, stylist: 2, services: [2], bookingDate: dateOffset(5), bookingTime: "12:00", status: "PENDING" },
    { customer: 1, stylist: 0, services: [1], bookingDate: dateOffset(7), bookingTime: "09:00", status: "CONFIRMED" },
  ] as const

  const createdBookings = await BookingModel.insertMany(
    sampleBookings.map((b) => ({
      customer: customers[b.customer]._id,
      stylist: createdStylists[b.stylist]._id,
      services: b.services.map((i) => createdServices[i]._id),
      bookingDate: b.bookingDate,
      bookingTime: b.bookingTime,
      status: b.status,
    }))
  )

  const pendingBookings = createdBookings.filter((b) => b.status === "PENDING")
  await NotificationModel.insertMany(
    pendingBookings.map((b) => {
      const customer = customers.find((c) => c._id.equals(b.customer))
      const stylist = createdStylists.find((s) => s._id.equals(b.stylist))
      return {
        title: "New Booking Request",
        message: `${customer?.name} requested an appointment with ${stylist?.name}`,
        bookingId: b._id,
        read: false,
      }
    })
  )

  console.log(`Seeded ${createdServices.length} services and ${stylists.length} stylists.`)
  /* This script writes straight to Mongo, so it never calls revalidateTag —
     and features/services/server/get-services.ts wraps the list in
     unstable_cache under the "services" tag. The app therefore keeps serving
     the PREVIOUS services after a seed, which looks exactly like the seed
     having silently failed.

     Restarting the dev server does NOT fix it: unstable_cache persists to
     .next/cache on disk, so a fresh process reads the same stale entry back.
     Delete that directory (or wait out the 300s revalidate). */
  console.log("Seeded data is live, but the app caches the service list on disk.")
  console.log("  rm -rf .next/cache   # then restart dev, or wait 300s")
  console.log(`Seeded ${customers.length} customers and ${createdBookings.length} bookings.`)
  console.log(`Seeded users (dev password: "${DEV_PASSWORD}"):`)
  console.log("  owner@salon.test (role: owner)")
  console.log("  jordan@salon.test (role: stylist)")
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
