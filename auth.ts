import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import { UserModel } from "@/lib/models/User"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email
        const password = credentials?.password

        if (typeof email !== "string" || typeof password !== "string") {
          return null
        }

        await connectDB()
        const user = await UserModel.findOne({ email })
        if (!user) return null

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role as "owner" | "stylist",
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role as "owner" | "stylist"
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.role) {
        ;(session.user as { role: "owner" | "stylist" }).role = token.role as
          | "owner"
          | "stylist"
      }
      return session
    },
  },
})
