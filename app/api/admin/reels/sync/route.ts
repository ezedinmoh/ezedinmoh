import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"
import { fetchTikTokMetadata } from "@/lib/tiktok-oembed"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try { await requireAuth() } catch (e) { return e as Response }

  try {
    let body: Record<string, unknown> = {}
    try { body = await req.json() } catch {}

    const reelId = typeof body.id === "string" ? body.id : null

    const reels = await prisma.reel.findMany({
      where: reelId ? { id: reelId } : {},
      orderBy: { order: "asc" },
    })

    const results: Array<{ id: string; tiktokId: string; success: boolean; views?: number }> = []

    for (const r of reels) {
      const meta = await fetchTikTokMetadata(r.tiktokUrl || r.tiktokId)
      if (meta) {
        await prisma.reel.update({
          where: { id: r.id },
          data: {
            title: meta.title || r.title,
            caption: meta.caption || r.caption,
            thumbnail: meta.thumbnail || r.thumbnail,
            views: meta.views || r.views,
            tiktokLikes: meta.likes || r.tiktokLikes,
            tiktokComments: meta.comments || r.tiktokComments,
            tiktokShares: meta.shares || r.tiktokShares,
            duration: meta.duration || r.duration,
            authorName: meta.authorName || r.authorName,
            authorAvatar: meta.authorAvatar || r.authorAvatar,
            musicTitle: meta.musicTitle || r.musicTitle,
          },
        })
        results.push({ id: r.id, tiktokId: r.tiktokId, success: true, views: meta.views })
      } else {
        results.push({ id: r.id, tiktokId: r.tiktokId, success: false })
      }
      // slight delay to prevent rate limiting
      await new Promise((res) => setTimeout(res, 300))
    }

    return NextResponse.json({
      message: `Synced ${results.filter((r) => r.success).length}/${results.length} reels`,
      results,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ message: `Sync failed: ${msg}` }, { status: 500 })
  }
}
