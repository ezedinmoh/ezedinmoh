import { MetadataRoute } from "next"
import { allProjects } from "@/lib/projects"
import { prisma } from "@/lib/db"
import { SITE_URL, absoluteUrl } from "@/lib/site"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/projects"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/reels"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/resume"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/guestbook"), changeFrequency: "daily", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/terms"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/privacy"), changeFrequency: "monthly", priority: 0.5 },
  ]

  let projectIds: { id: string; updatedAt?: Date }[] = allProjects.map((p) => ({ id: p.id }))
  try {
    const dbProjects = await prisma.project.findMany({
      select: { id: true, slug: true, updatedAt: true },
    })
    if (dbProjects && dbProjects.length > 0) {
      projectIds = dbProjects.map((p) => ({ id: p.slug || p.id, updatedAt: p.updatedAt }))
    }
  } catch { }

  const projectRoutes: MetadataRoute.Sitemap = projectIds.map((item) => ({
    url: absoluteUrl(`/projects/${item.id}`),
    ...(item.updatedAt ? { lastModified: new Date(item.updatedAt) } : {}),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  let reelRoutes: MetadataRoute.Sitemap = []
  try {
    const reels = await prisma.reel.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    })
    reelRoutes = reels.map((r) => ({
      url: absoluteUrl(`/reels/${r.id}`),
      ...(r.updatedAt ? { lastModified: new Date(r.updatedAt) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch { }

  return [...staticRoutes, ...projectRoutes, ...reelRoutes]
}
