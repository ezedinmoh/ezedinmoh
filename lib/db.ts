import { PrismaClient } from "@prisma/client"
import { PrismaNeonHttp } from "@prisma/adapter-neon"

function getConnectionString(): string {
  const url = process.env.DATABASE_URL
  if (url && url.trim().length > 0) {
    return url.trim().replace(/^["']|["']$/g, "")
  }
  return "postgresql://neondb_owner:npg_Jc6BmuQFNfO0@ep-twilight-butterfly-anxet41t-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
}

function createPrismaClient() {
  const connectionString = getConnectionString()
  const adapter = new PrismaNeonHttp(connectionString, {})
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
