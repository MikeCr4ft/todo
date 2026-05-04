import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"

export const authConfig: NextAuthConfig = {
  providers: [GitHub],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    authorized({ auth }) {
      return !!auth
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
}
