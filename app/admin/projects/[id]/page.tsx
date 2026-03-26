import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { ProjectForm } from "@/components/admin/ProjectForm"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
        <p className="text-sm text-muted-foreground mt-1">{project.title}</p>
      </div>
      <ProjectForm initial={project as unknown as Record<string, unknown>} projectId={id} />
    </div>
  )
}
