import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "portfolio-auth-secret-key-2026-v1",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days persistent session
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password:   { label: "Password",          type: "password" },
      },
      async authorize(credentials) {
        const rawInput = (credentials?.identifier || (credentials as { email?: string })?.email || "")
        // Clean input: remove whitespace, convert to lowercase, strip leading @ if user typed @ezedinmoh
        const input = rawInput.trim().toLowerCase().replace(/^@/, "")
        const pass  = (credentials?.password || "")

        const adminEmail    = (process.env.ADMIN_EMAIL || "").trim().toLowerCase()
        const adminUsername = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase()
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!pass || !adminPassword) return null

        // Allowed username/email identifiers:
        const allowedIdentifiers = new Set([
          ...(adminEmail ? [adminEmail, adminEmail.split("@")[0].toLowerCase()] : []),
          ...(adminUsername ? [adminUsername] : []),
          "admin",
        ])

        const isUserMatch = allowedIdentifiers.has(input)

        // Password matching: support exact or trimmed in case of mobile auto-space
        const isPassMatch =
          pass === adminPassword ||
          pass.trim() === adminPassword.trim()

        if (isUserMatch && isPassMatch) {
          return {
            id: "admin-user",
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
