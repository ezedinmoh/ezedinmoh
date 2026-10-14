import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try { await requireAuth() } catch (e) { return e as Response }
  const { commentId } = await params

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  if ("hidden" in body) data.hidden = body.hidden === true
  if ("flagged" in body) data.flagged = body.flagged === true

  try {
    const comment = await prisma.reelComment.update({ where: { id: commentId }, data })
    return NextResponse.json(comment)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try { await requireAuth() } catch (e) { return e as Response }
  const { commentId } = await params
  try {
    await prisma.reelComment.delete({ where: { id: commentId } })
    return NextResponse.json({ message: "Deleted" })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
