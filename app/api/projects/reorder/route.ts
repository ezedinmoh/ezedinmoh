import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"
import { validateBody } from "@/lib/api/validate"
import { ReorderSchema } from "@/lib/validations"

export async function PATCH(req: Request) {
  try { await requireAuth() } catch (e) { return e as Response }

  try {
    const { items } = await validateBody(req, ReorderSchema)
    await prisma.$transaction(
      items.map(({ id, sortOrder }) =>
        prisma.project.update({ where: { id }, data: { sortOrder } })
      )
    )
    return NextResponse.json({ message: "Reordered" })
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
