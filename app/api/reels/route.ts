import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const sort = searchParams.get("sort") // "views" | "likes" | "newest" | "curated"

    const where: Record<string, unknown> = { published: true }
    if (category && category !== "all") {
      where.category = { equals: category, mode: "insensitive" }
    }

    let orderBy: Record<string, "asc" | "desc"> = { order: "asc" }
    if (sort === "views") {
      orderBy = { views: "desc" }
    } else if (sort === "likes") {
      orderBy = { tiktokLikes: "desc" }
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" }
    }

    const reels = await prisma.reel.findMany({
      where,
      orderBy,
      include: {
        _count: { select: { likes: true, comments: { where: { hidden: false } } } },
      },
    })
    return NextResponse.json({ reels, total: reels.length })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("GET /api/reels error:", msg)
    return NextResponse.json({ message: "Failed to fetch reels" }, { status: 500 })
  }
}
