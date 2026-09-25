import { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog"
import { allProjects } from "@/lib/projects"
import { prisma } from "@/lib/db"

export const revalidate = 3600

const BASE_URL = "https://ezedinmoh.pro.et"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/resume`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/guestbook`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ]

  let projectIds: { id: string; updatedAt?: Date }[] = allProjects.map((p) => ({ id: p.id }))
  try {
    const dbProjects = await prisma.project.findMany({
      select: { id: true, slug: true, updatedAt: true },
    })
    if (dbProjects && dbProjects.length > 0) {
      projectIds = dbProjects.map((p) => ({
        id: p.slug || p.id,
        updatedAt: p.updatedAt,
      }))
    }
  } catch {
    // fallback to static list
  }

  const projectRoutes: MetadataRoute.Sitemap = projectIds.map((item) => ({
    url: `${BASE_URL}/projects/${item.id}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...blogRoutes]
}
