import { prisma } from "@/lib/db"
import { allProjects } from "@/lib/projects"
import { SortPageClient } from "@/components/admin/SortPageClient"

export const dynamic = "force-dynamic"

export default async function SortProjectsPage() {
    let projects: any[] = []
    try {
        projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } })
    } catch {
        console.warn("[DB Offline] Sort page using static fallback")
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
            featuredSortOrder: idx,
        }))
    }

    return <SortPageClient projects={projects} />
}
