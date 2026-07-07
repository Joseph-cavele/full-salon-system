import { Schema, model, models, type InferSchemaType } from "mongoose"

const settingsSchema = new Schema(
  {
    // Singleton key so there is only ever one settings document.
    key: { type: String, default: "salon", unique: true },
    salonName: { type: String, default: "Glow & Grace Salon" },
    tagline: { type: String, default: "Enhancing your natural beauty" },
    email: { type: String, default: "info@glowandgracesalon.com" },
    phone: { type: String, default: "+1 (555) 123-4567" },
    address: { type: String, default: "123 Beauty Street, New York, NY 10001" },
    openingHours: { type: String, default: "Mon–Sat: 9:00 AM – 8:00 PM" },
    notificationEmail: { type: String, default: "" },
    emailNotifications: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export type SettingsDoc = InferSchemaType<typeof settingsSchema>
export const SettingsModel = models.Settings || model("Settings", settingsSchema)
