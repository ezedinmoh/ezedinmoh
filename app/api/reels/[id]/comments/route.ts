import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getOrCreateGuestId } from "@/lib/guest-id"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
  const limit = 20

  try {
    const [comments, total] = await Promise.all([
      prisma.reelComment.findMany({
        where: { reelId: id, hidden: false },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          displayName: true,
          text: true,
          createdAt: true,
        },
      }),
      prisma.reelComment.count({ where: { reelId: id, hidden: false } }),
    ])

    return NextResponse.json({ comments, total, page, pages: Math.ceil(total / limit) })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("GET /api/reels/[id]/comments error:", msg)
    return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { guestId, headers } = await getOrCreateGuestId()

  // Rate limit: 3 comments per 5 minutes per guest
  const rl = await rateLimit(guestId, "reel-comment", 3, 300)
  if (!rl.success) {
    return NextResponse.json(
      { message: "You're commenting too fast. Please wait a moment." },
      { status: 429, headers }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400, headers })
  }

  const text = typeof body.text === "string" ? body.text.trim() : ""
  const displayName =
    typeof body.displayName === "string" && body.displayName.trim().length > 0
      ? body.displayName.trim().slice(0, 50)
      : "Anonymous"

  if (text.length < 1) {
    return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400, headers })
  }
  if (text.length > 500) {
    return NextResponse.json({ message: "Comment must be 500 characters or less" }, { status: 400, headers })
  }

  try {
    const reel = await prisma.reel.findFirst({ where: { id, published: true } })
    if (!reel) {
      return NextResponse.json({ message: "Reel not found" }, { status: 404, headers })
    }

    const comment = await prisma.reelComment.create({
      data: { reelId: id, guestId, displayName, text },
      select: { id: true, displayName: true, text: true, createdAt: true },
    })

    return NextResponse.json({ comment }, { status: 201, headers })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("POST /api/reels/[id]/comments error:", msg)
    return NextResponse.json({ message: "Failed to post comment" }, { status: 500, headers })
  }
}
