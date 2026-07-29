import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
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

    revalidatePath("/")
    revalidatePath("/projects")
    revalidatePath("/admin/projects")

    return NextResponse.json({ success: true, message: "Reordered successfully" })
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    const msg = e instanceof Error ? e.message : String(e)
    console.error("PATCH /api/projects/reorder error:", msg)
    return NextResponse.json({ success: false, message: `Failed to reorder: ${msg}` }, { status: 500 })
  }
}
