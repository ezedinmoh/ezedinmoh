import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getOrCreateGuestId } from "@/lib/guest-id"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { guestId, headers } = await getOrCreateGuestId()

  try {
    const reel = await prisma.reel.findFirst({
      where: { id, published: true },
      include: {
        _count: { select: { likes: true, comments: { where: { hidden: false } } } },
      },
    })

    if (!reel) {
      return NextResponse.json({ message: "Reel not found" }, { status: 404 })
    }

    const liked = !!(await prisma.reelLike.findUnique({
      where: { reelId_guestId: { reelId: id, guestId } },
    }))

    return NextResponse.json({ ...reel, liked }, { headers })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("GET /api/reels/[id] error:", msg)
    return NextResponse.json({ message: "Failed to fetch reel" }, { status: 500 })
  }
}
