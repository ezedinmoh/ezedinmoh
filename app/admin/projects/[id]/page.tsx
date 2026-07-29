import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { ProjectForm } from "@/components/admin/ProjectForm"
import { allProjects } from "@/lib/projects"

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)

  let project: any = null

  try {
    project = await prisma.project.findFirst({
      where: {
        OR: [{ id: decodedId }, { slug: decodedId }],
      },
    })
  } catch (err) {
    console.warn("Edit Project DB connection timeout, using fallback matching:", err)
  }

  if (!project) {
    const staticItem = allProjects.find(
      (p) => p.id === decodedId || p.id === id || p.title.toLowerCase().includes(decodedId.toLowerCase())
    )
    if (staticItem) {
      project = {
        id: staticItem.id,
        slug: staticItem.id,
        title: staticItem.title,
        description: staticItem.description,
        image: staticItem.image ?? "",
        tags: staticItem.tags,
        stack: staticItem.stack,
        category: staticItem.category,
        liveUrl: staticItem.liveUrl ?? staticItem.link ?? null,
        githubUrl: staticItem.github ?? null,
        featured: staticItem.featured ?? false,
        year: staticItem.year,
        caseStudyProblem: staticItem.caseStudy?.problem ?? null,
        caseStudySolution: staticItem.caseStudy?.solution ?? null,
        caseStudyOutcome: staticItem.caseStudy?.outcome ?? null,
      }
    }
  }

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
        <p className="text-sm text-muted-foreground mt-1">{project.title}</p>
      </div>
      <ProjectForm initial={project as unknown as Record<string, unknown>} projectId={project.id || id} />
    </div>
  )
}
