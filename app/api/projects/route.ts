import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { allProjects } from "@/lib/projects"
import { requireAuth } from "@/lib/api/auth"
import { validateBody } from "@/lib/api/validate"
import { sanitize } from "@/lib/api/sanitize"
import { generateUniqueSlug } from "@/lib/slug"
import { ProjectCreateSchema } from "@/lib/validations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const featured = searchParams.get("featured")

  try {
    const projects = await prisma.project.findMany({
      where: featured === "true" ? { featured: true } : undefined,
      orderBy: { sortOrder: "asc" },
    })

    if (projects && projects.length > 0) {
      return NextResponse.json(projects)
    }
  } catch (err) {
    console.error("GET /api/projects DB query error:", err)
  }

  // Fallback to static allProjects if DB query fails or returns 0 records
  const fallback = featured === "true"
    ? allProjects.filter((p) => p.featured)
    : allProjects

  return NextResponse.json(fallback)
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
        tags:        Array.isArray(clean.tags)        ? (clean.tags as string[])        : [],
        stack:       Array.isArray(clean.stack)       ? (clean.stack as string[])       : [],
        category:    Array.isArray(clean.category)    ? (clean.category as string[])    : [],
        screenshots: Array.isArray(clean.screenshots) ? (clean.screenshots as string[]) : [],
        previewMode: (clean.previewMode as string) || "slideshow",
      } as unknown as Parameters<typeof prisma.project.create>[0]["data"],
    })

    return NextResponse.json(project, { status: 201 })
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    const msg = e instanceof Error ? e.message : String(e)
    console.error("POST /api/projects error:", msg)
    return NextResponse.json({ message: `Internal server error: ${msg}` }, { status: 500 })
  }
}
