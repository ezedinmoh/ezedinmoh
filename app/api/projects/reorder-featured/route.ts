import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"
import { validateBody } from "@/lib/api/validate"
import { FeaturedReorderSchema } from "@/lib/validations"

export async function PATCH(req: Request) {
    try { await requireAuth() } catch (e) { return e as Response }

    try {
        const { items } = await validateBody(req, FeaturedReorderSchema)

        for (const item of items) {
            await prisma.project.update({
                where: { id: item.id },
                data: { featuredSortOrder: item.featuredSortOrder },
            })
        }

        revalidatePath("/")
        revalidatePath("/admin/projects")

        return NextResponse.json({ success: true, message: "Featured order updated" })
    } catch (e) {
        if (e instanceof Response || (e as { status?: number })?.status) return e as Response
        const msg = e instanceof Error ? e.message : String(e)
        console.error("PATCH /api/projects/reorder-featured error:", msg)
        return NextResponse.json({ success: false, message: `Failed: ${msg}` }, { status: 500 })
    }
}
