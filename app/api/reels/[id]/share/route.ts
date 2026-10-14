import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await prisma.reelShareEvent.create({ data: { reelId: id } })
    const count = await prisma.reelShareEvent.count({ where: { reelId: id } })
    return NextResponse.json({ shares: count })
  } catch {
    // Non-critical — don't fail the UX if share tracking fails
    return NextResponse.json({ shares: 0 })
  }
}
