import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"
import { validateBody } from "@/lib/api/validate"
import { sanitize } from "@/lib/api/sanitize"
import { GuestbookPatchSchema } from "@/lib/validations"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth() } catch (e) { return e as Response }

  const { id } = await params
  try {
    const body = await validateBody(req, GuestbookPatchSchema)
    const clean = sanitize(body as Record<string, unknown>)

    const entry = await prisma.guestbookEntry.update({
      where: { id },
      data: clean as Parameters<typeof prisma.guestbookEntry.update>[0]["data"],
    })

    return NextResponse.json(entry)
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth() } catch (e) { return e as Response }

  const { id } = await params
  try {
    await prisma.guestbookEntry.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }
}
