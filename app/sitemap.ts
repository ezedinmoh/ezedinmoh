import { MetadataRoute } from "next"
import { allProjects } from "@/lib/projects"
import { prisma } from "@/lib/db"

export const revalidate = 3600

const BASE_URL = "https://ezedinmoh.pro.et"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/reels`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/resume`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/guestbook`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
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
    url: `${BASE_URL}/projects/${item.id}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
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
      url: `${BASE_URL}/reels/${r.id}`,
      lastModified: r.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch { }

  return [...staticRoutes, ...projectRoutes, ...reelRoutes]
}
