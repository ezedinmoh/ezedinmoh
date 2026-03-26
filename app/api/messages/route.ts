import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"

export async function GET() {
  try { await requireAuth() } catch (e) { return e as Response }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(messages)
}
