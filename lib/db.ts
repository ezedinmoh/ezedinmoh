import { PrismaClient } from "@prisma/client"
import { PrismaNeonHttp } from "@prisma/adapter-neon"

function getConnectionString(): string {
  const url = process.env.DATABASE_URL
  if (url && url.trim().length > 0) {
    return url.trim().replace(/^["']|["']$/g, "")
  }
  return "postgresql://neondb_owner:dummy@localhost:5432/neondb"
}

function createPrismaClient() {
  const connectionString = getConnectionString()
  const adapter = new PrismaNeonHttp(connectionString, {})
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
