import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "ezedinmoh-portfolio-auth-secret-key-2026-v1",
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // No maxAge: browser session cookie. Automatically erased when browser/tab is closed for security.
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
            id: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Unique session ID per device login
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
        token.id    = user.id
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
