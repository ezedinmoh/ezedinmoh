import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getOrCreateGuestId } from "@/lib/guest-id"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { guestId, headers } = await getOrCreateGuestId()

  // Rate limit: 10 toggles per minute per guest
  const rl = await rateLimit(guestId, "reel-like", 10, 60)
  if (!rl.success) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429, headers })
  }

  try {
    const reel = await prisma.reel.findFirst({ where: { id, published: true } })
    if (!reel) {
      return NextResponse.json({ message: "Reel not found" }, { status: 404, headers })
    }

    const existing = await prisma.reelLike.findUnique({
      where: { reelId_guestId: { reelId: id, guestId } },
    })

    if (existing) {
      await prisma.reelLike.delete({ where: { reelId_guestId: { reelId: id, guestId } } })
    } else {
      await prisma.reelLike.create({ data: { reelId: id, guestId } })
    }

    const count = await prisma.reelLike.count({ where: { reelId: id } })
    return NextResponse.json({ liked: !existing, count }, { headers })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("POST /api/reels/[id]/like error:", msg)
    return NextResponse.json({ message: "Failed to toggle like" }, { status: 500, headers })
  }
}
