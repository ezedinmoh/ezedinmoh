import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"
import { validateBody } from "@/lib/api/validate"
import { sanitize } from "@/lib/api/sanitize"
import { generateUniqueSlug } from "@/lib/slug"
import { ProjectCreateSchema } from "@/lib/validations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const featured = searchParams.get("featured")

  const projects = await prisma.project.findMany({
    where: featured === "true" ? { featured: true } : undefined,
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  try { await requireAuth() } catch (e) { return e as Response }

  try {
    const body = await validateBody(req, ProjectCreateSchema)
    const clean = sanitize(body as Record<string, unknown>)
    const slug = await generateUniqueSlug(clean.title as string)

    const project = await prisma.project.create({
      data: {
        ...clean,
        slug,
        tags:     Array.isArray(clean.tags)     ? (clean.tags as string[])     : [],
        stack:    Array.isArray(clean.stack)    ? (clean.stack as string[])    : [],
        category: Array.isArray(clean.category) ? (clean.category as string[]) : [],
      } as Parameters<typeof prisma.project.create>[0]["data"],
    })

    return NextResponse.json(project, { status: 201 })
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    console.error(e)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
