import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try { await requireAuth() } catch (e) { return e as Response }
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
  const limit = 30

  try {
    const [comments, total] = await Promise.all([
      prisma.reelComment.findMany({
        where: { reelId: id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.reelComment.count({ where: { reelId: id } }),
    ])
    return NextResponse.json({ comments, total, page })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
