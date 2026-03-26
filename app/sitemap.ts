import { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog"

const BASE_URL = "https://ezedin.dev"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/about`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/projects`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/blog`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/resume`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/guestbook`, priority: 0.6, changeFrequency: "daily" as const },
    { url: `${BASE_URL}/contact`, priority: 0.7, changeFrequency: "monthly" as const },
  ]

  const blogRoutes = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.id}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }))

  return [...staticRoutes, ...blogRoutes]
}
