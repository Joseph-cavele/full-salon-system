import "dotenv/config"
import { connectDB } from "../lib/db"
import { ServiceModel } from "../lib/models/Service"
import { StylistModel } from "../lib/models/Stylist"
import { UserModel } from "../lib/models/User"
import { CustomerModel } from "../lib/models/Customer"
import { BookingModel } from "../lib/models/Booking"
import { NotificationModel } from "../lib/models/Notification"

// Sign-in is by emailed code, so the owner account must be a real inbox.
// Falls back to a placeholder (codes then only appear in the dev console).
const OWNER_LOGIN_EMAIL = (process.env.OWNER_EMAIL ?? "owner@salon.test").trim().toLowerCase()

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
  await StylistModel.insertMany(
    stylists.map((stylist, i) => ({
      ...stylist,
      services: createdServices.map((s) => s._id).filter((_, idx) => idx !== i),
    }))
  )

  // The one dashboard account. `npm run setup-owner` manages it afterwards.
  await UserModel.findOneAndUpdate(
    { role: "owner" },
    { name: "Salon Owner", email: OWNER_LOGIN_EMAIL, role: "owner", status: "active", $unset: { password: 1 } },
    { upsert: true }
  )

  await CustomerModel.deleteMany({})
  await BookingModel.deleteMany({})
  await NotificationModel.deleteMany({})

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
  console.log("Cleared customers, bookings and notifications. No sample bookings were created.")
  console.log("Seeded users (sign in with an emailed code — no passwords):")
  console.log(`  ${OWNER_LOGIN_EMAIL} (role: owner)`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
