import { PrismaClient } from "@prisma/client"
import { PrismaNeonHttp } from "@prisma/adapter-neon"
import fs from "fs"
import path from "path"

function getDatabaseUrl(): string {
  let url = process.env.DATABASE_URL || ""
  if (!url) {
    try {
      const envPath = path.resolve(process.cwd(), ".env.local")
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf8")
        const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)
        if (match) url = match[1]
      }
    } catch {
      // ignore
    }
  }

  url = url.trim().replace(/^["']|["']$/g, "")
  if (url.includes("channel_binding=")) {
    url = url.replace(/([?&])channel_binding=[^&]*&?/g, "$1").replace(/[?&]$/, "")
  }
  return url
}

function createPrismaClient() {
  const url = getDatabaseUrl()
  const adapter = new PrismaNeonHttp(url, {})
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
