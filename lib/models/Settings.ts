import { Schema, model, models, type InferSchemaType } from "mongoose"

const settingsSchema = new Schema(
  {
    // Singleton key so there is only ever one settings document.
    key: { type: String, default: "salon", unique: true },
    salonName: { type: String, default: "Patrick Dreadlocks & Beauty Salon" },
    tagline: { type: String, default: "Enhancing your natural beauty" },
    /* Defaults are the salon's real details, not samples. They were a New
       York address and a +1 (555) number left over from the "Glow & Grace"
       era, which a fresh install would have shown as though they were
       genuine. Kept in step with lib/salon-contact.ts by hand — this model
       cannot import it, since the seed and the API both load the schema
       outside the app's module graph. */
    email: { type: String, default: "booking@patrickdreadlocks.co.za" },
    phone: { type: String, default: "074 780 9371" },
    address: { type: String, default: "Shop 7, 26 Park St, Kempton Park, Johannesburg" },
    openingHours: { type: String, default: "Mon–Sat: 9:00 AM – 8:00 PM" },
    notificationEmail: { type: String, default: "" },
    emailNotifications: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export type SettingsDoc = InferSchemaType<typeof settingsSchema>
export const SettingsModel = models.Settings || model("Settings", settingsSchema)
