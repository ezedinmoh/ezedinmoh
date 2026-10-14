import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"
import { extractTikTokId, fetchTikTokMetadata } from "@/lib/tiktok-oembed"

export async function GET() {
  try { await requireAuth() } catch (e) { return e as Response }

  try {
    const reels = await prisma.reel.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { likes: true, comments: true } },
      },
    })
    return NextResponse.json({ reels, total: reels.length })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ message: `Failed to fetch reels: ${msg}` }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try { await requireAuth() } catch (e) { return e as Response }

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }

  const tiktokUrl = typeof body.tiktokUrl === "string" ? body.tiktokUrl.trim() : ""
  const tiktokId = extractTikTokId(tiktokUrl)
  if (!tiktokId) {
    return NextResponse.json({ message: "Invalid TikTok URL format" }, { status: 400 })
  }

  // Check duplicate
  const existing = await prisma.reel.findUnique({ where: { tiktokId } }).catch(() => null)
  if (existing) {
    return NextResponse.json({ message: "This TikTok video is already registered" }, { status: 409 })
  }

  // Fetch rich metadata
  const meta = await fetchTikTokMetadata(tiktokUrl)

  const maxOrder = await prisma.reel.aggregate({ _max: { order: true } }).catch(() => ({ _max: { order: 0 } }))
  const order = (maxOrder._max.order ?? 0) + 1

  try {
    const reel = await prisma.reel.create({
      data: {
        tiktokId,
        tiktokUrl: `https://www.tiktok.com/@ezedinmoh/video/${tiktokId}`,
        title: typeof body.title === "string" && body.title.trim() ? body.title.trim() : (meta?.title ?? null),
        caption: typeof body.caption === "string" && body.caption.trim() ? body.caption.trim() : (meta?.caption ?? null),
        thumbnail: typeof body.thumbnail === "string" && body.thumbnail.trim() ? body.thumbnail.trim() : (meta?.thumbnail ?? null),
        category: typeof body.category === "string" && body.category.trim() ? body.category.trim() : null,
        views: meta?.views ?? 0,
        tiktokLikes: meta?.likes ?? 0,
        tiktokComments: meta?.comments ?? 0,
        tiktokShares: meta?.shares ?? 0,
        duration: meta?.duration ?? 0,
        authorName: meta?.authorName ?? "Ezedin Moh",
        authorAvatar: meta?.authorAvatar ?? null,
        musicTitle: meta?.musicTitle ?? null,
        published: body.published === true,
        featured: body.featured === true,
        order,
      },
    })
    return NextResponse.json(reel, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ message: `Failed to create reel: ${msg}` }, { status: 500 })
  }
}
