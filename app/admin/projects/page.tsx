import Link from "next/link"
import { prisma } from "@/lib/db"
import { allProjects } from "@/lib/projects"
import { Plus } from "lucide-react"
import { ProjectsTable } from "@/components/admin/ProjectsTable"

export const dynamic = "force-dynamic"

export default async function AdminProjects() {
  let projects: any[] = []
  try {
    projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } })
  } catch {
    console.warn("[DB Offline] Admin Projects using static fallback")
  }

  if (!projects || projects.length === 0) {
    projects = allProjects.map((p, idx) => ({
      id: p.id,
      slug: p.id,
      title: p.title,
      description: p.description,
      image: p.image ?? "",
      tags: p.tags,
      stack: p.stack,
      category: p.category,
      liveUrl: p.liveUrl ?? p.link ?? null,
      githubUrl: p.github ?? null,
      featured: p.featured ?? false,
      year: p.year,
      sortOrder: idx,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} total</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  )
}
