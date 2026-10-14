import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try { await requireAuth() } catch (e) { return e as Response }
  const { id } = await params
  try {
    const reel = await prisma.reel.findUnique({
      where: { id },
      include: { _count: { select: { likes: true, comments: true } } },
    })
    if (!reel) return NextResponse.json({ message: "Not found" }, { status: 404 })
    return NextResponse.json(reel)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try { await requireAuth() } catch (e) { return e as Response }
  const { id } = await params

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  if ("title" in body) data.title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : null
  if ("caption" in body) data.caption = typeof body.caption === "string" && body.caption.trim() ? body.caption.trim() : null
  if ("thumbnail" in body) data.thumbnail = typeof body.thumbnail === "string" && body.thumbnail.trim() ? body.thumbnail.trim() : null
  if ("category" in body) data.category = typeof body.category === "string" && body.category.trim() ? body.category.trim() : null
  if ("published" in body) data.published = body.published === true
  if ("featured" in body) data.featured = body.featured === true
  if ("order" in body && typeof body.order === "number") data.order = body.order

  try {
    const reel = await prisma.reel.update({ where: { id }, data })
    return NextResponse.json(reel)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try { await requireAuth() } catch (e) { return e as Response }
  const { id } = await params
  try {
    await prisma.reel.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
