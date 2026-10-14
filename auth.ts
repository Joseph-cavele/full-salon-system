import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { connectDB } from "@/lib/db"
import { clientIp, hitAll } from "@/lib/rate-limit"
import { verifyCodeSchema } from "@/features/auth/schema"
import {
  VERIFY_CODE_LIMITS,
  consumeLoginCode,
  findActiveOwner,
  normalizeEmail,
} from "@/features/auth/server/login-code"

/** Reaches the client as `result.code`, so the form can say "slow down". */
class RateLimited extends CredentialsSignin {
  code = "rate_limited"
}

/* Short enough that a lost or shared device doesn't stay signed in for long,
   long enough to cover a working day without re-entering a code. */
const SESSION_MAX_AGE_S = 12 * 60 * 60

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Trust the deployment host (Vercel serves behind a proxy). Without this,
  // Auth.js rejects requests as UntrustedHost in production and login fails.
  trustHost: true,
  /* JWT sessions in an httpOnly, SameSite=Lax cookie. Auth.js adds the
     `__Secure-` prefix and the Secure flag automatically whenever the site
     is served over https. The token only says who signed in; every protected
     page and route re-checks the account in the database (see
     features/auth/server/session.ts), so disabling the owner takes effect
     immediately rather than when the token expires. */
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_S },
  pages: { signIn: "/login" },
  providers: [
    /* Passwordless: the "credential" is the 6-digit code emailed by
       app/api/login-code. It's single-use, so a matching code both proves
       the owner holds the inbox and is spent in the same step. */
    Credentials({
      credentials: {
        email: {},
        code: {},
      },
      authorize: async (credentials, request) => {
        const parsed = verifyCodeSchema.safeParse(credentials)
        if (!parsed.success) return null

        const email = normalizeEmail(parsed.data.email)

        // Counted before the account lookup, so it applies to any address.
        const allowed = await hitAll([
          [VERIFY_CODE_LIMITS.email, email],
          [VERIFY_CODE_LIMITS.ip, clientIp(request.headers)],
        ])
        if (!allowed) throw new RateLimited()

        await connectDB()
        // Active-owner check before the session is created.
        const owner = await findActiveOwner(email)
        if (!owner) return null

        const valid = await consumeLoginCode(owner.email, parsed.data.code)
        if (!valid) return null

        return { id: owner.id, name: owner.name, email: owner.email, role: "owner" }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // `user` is only present on the sign-in request itself.
      if (user) token.role = user.role
      return token
    },
    session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub
        if (token.role === "owner") session.user.role = "owner"
      }
      return session
    },
  },
})
