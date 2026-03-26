import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { validateBody } from "@/lib/api/validate"
import { ReactSchema } from "@/lib/validations"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const { emoji, action } = await validateBody(req, ReactSchema)

    const entry = await prisma.guestbookEntry.findUnique({ where: { id }, select: { reactions: true } })
    if (!entry) return NextResponse.json({ message: "Not found" }, { status: 404 })

    const reactions = (entry.reactions as Record<string, number>) ?? {}
    const current = reactions[emoji] ?? 0
    reactions[emoji] = action === "increment" ? current + 1 : Math.max(0, current - 1)

    const updated = await prisma.guestbookEntry.update({
      where: { id },
      data: { reactions },
    })

    return NextResponse.json(updated)
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
