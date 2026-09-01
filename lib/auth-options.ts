import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password:   { label: "Password font",     type: "password" },
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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days multi-device session retention
  },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
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
