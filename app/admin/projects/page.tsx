import Link from "next/link"
import { prisma } from "@/lib/db"
import { Plus } from "lucide-react"
import { ProjectsTable } from "@/components/admin/ProjectsTable"

export default async function AdminProjects() {
  const projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } })

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
