import type { DefaultSession } from "next-auth"

/* Only the owner can sign in. Stored User records may still say "stylist"
   (the model keeps it for old data), but no session is ever issued for one. */
export type UserRole = "owner"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
  }
}
