import { auth } from "@/auth"
import { NextResponse } from "next/server"

/* An early redirect for signed-out visitors — a convenience, not the
   protection. The real checks run next to the data: requireOwner() in every
   dashboard page and denyUnlessOwner() in every private API route (see
   features/auth/server/session.ts), because proxy only sees this matcher and
   can't tell a disabled account from an active one. */
export default auth((req) => {
  if (req.auth?.user?.role === "owner") return

  const loginUrl = new URL("/login", req.nextUrl)
  loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
})

export const config = {
  matcher: ["/dashboard/:path*"],
}
