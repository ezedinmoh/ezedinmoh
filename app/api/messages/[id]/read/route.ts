import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth() } catch (e) { return e as Response }

  const { id } = await params
  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    })
    return NextResponse.json(message)
  } catch {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }
}
