import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const THIRTY_DAYS = 30 * 24 * 60 * 60

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "ezedinmoh-portfolio-auth-secret-key-2026-v1",
  session: {
    strategy: "jwt",
    maxAge: THIRTY_DAYS,
  },
  jwt: {
    maxAge: THIRTY_DAYS,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: THIRTY_DAYS, // Ensures persistent 30-day cookie across mobile & desktop browser restarts
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password:   { label: "Password",          type: "password" },
      },
      async authorize(credentials) {
        const input = (credentials?.identifier || (credentials as { email?: string })?.email || "").trim().toLowerCase()
        const pass  = credentials?.password || ""

        const adminEmail    = (process.env.ADMIN_EMAIL || "ezedinmoh1@gmail.com").trim().toLowerCase()
        const adminUsername = (process.env.ADMIN_USERNAME || adminEmail.split("@")[0] || "ezedinmoh").trim().toLowerCase()
        const adminPassword = process.env.ADMIN_PASSWORD || ""

        if (!pass || !adminPassword) return null

        const isMatch = (input === adminEmail || input === adminUsername) && pass === adminPassword

        if (isMatch) {
          return {
            id: "1",
            email: adminEmail,
            name: adminUsername,
          }
        }
        return null
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.name  = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email as string,
          name:  token.name  as string,
        }
      }
      return session
    },
  },
}
