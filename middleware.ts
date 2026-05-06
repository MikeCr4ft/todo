import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Uses the edge-safe config (no Prisma adapter) — JWT-only verification.
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: ["/", "/board/:path*"],
}
