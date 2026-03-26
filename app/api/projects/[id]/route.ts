import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"
import { validateBody } from "@/lib/api/validate"
import { sanitize } from "@/lib/api/sanitize"
import { generateUniqueSlug } from "@/lib/slug"
import { ProjectCreateSchema } from "@/lib/validations"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth() } catch (e) { return e as Response }

  const { id } = await params
  try {
    const body = await validateBody(req, ProjectCreateSchema)
    const clean = sanitize(body as Record<string, unknown>)

    const existing = await prisma.project.findUnique({ where: { id }, select: { title: true } })
    if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 })

    const slug = existing.title !== clean.title
      ? await generateUniqueSlug(clean.title as string, id)
      : undefined

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...clean,
        ...(slug ? { slug } : {}),
        tags:        Array.isArray(clean.tags)        ? (clean.tags as string[])        : [],
        stack:       Array.isArray(clean.stack)       ? (clean.stack as string[])       : [],
        category:    Array.isArray(clean.category)    ? (clean.category as string[])    : [],
        screenshots: Array.isArray(clean.screenshots) ? (clean.screenshots as string[]) : [],
      } as Parameters<typeof prisma.project.update>[0]["data"],
    })

    return NextResponse.json(project)
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    const msg = e instanceof Error ? e.message : String(e)
    console.error("PUT /api/projects/[id] error:", msg)
    return NextResponse.json({ message: `Internal server error: ${msg}` }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth() } catch (e) { return e as Response }

  const { id } = await params
  try {
    await prisma.project.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }
}
