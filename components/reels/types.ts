export const CATEGORIES = [
  "All",
  "Web Design",
  "UI / UX",
  "E-Commerce",
  "Case Studies",
] as const

export interface ReelData {
  id: string
  tiktokId: string
  tiktokUrl: string
  title: string | null
  caption: string | null
  thumbnail: string | null
  category: string | null
  views: number
  tiktokLikes: number
  tiktokComments: number
  tiktokShares: number
  duration: number
  authorName: string | null
  authorAvatar: string | null
  musicTitle: string | null
  published: boolean
  featured: boolean
  order: number
  createdAt: string | Date
  _count: { likes: number; comments: number }
}

export interface RelatedProject {
  name: string
  url: string
}

export function formatCompactNumber(num?: number | null): string {
  if (typeof num !== "number" || isNaN(num)) return "0"
  if (num < 1000) return num.toString()
  if (num < 1000000) {
    const formatted = (num / 1000).toFixed(1)
    return formatted.endsWith(".0") ? formatted.slice(0, -2) + "K" : formatted + "K"
  }
  const formatted = (num / 1000000).toFixed(1)
  return formatted.endsWith(".0") ? formatted.slice(0, -2) + "M" : formatted + "M"
}

export function formatDuration(sec?: number | null): string {
  if (!sec || sec <= 0) return ""
  const mins = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${mins}:${s < 10 ? "0" : ""}${s}`
}

export function getRelatedProject(reel: { tiktokId?: string; title?: string | null; category?: string | null }): RelatedProject | null {
  const t = (reel.title || "").toLowerCase()
  const id = reel.tiktokId || ""

  if (id === "7670064348332576021" || t.includes("holland dairy")) {
    return { name: "Holland Dairy Ethiopia", url: "https://holland-dairy.vercel.app" }
  }
  if (id === "7671611191864675605" || t.includes("iphone") || t.includes("apple")) {
    return { name: "Apple iPhone 15 Showcase", url: "https://apple-clone-new.vercel.app" }
  }
  if (id === "7677198929301196052" || t.includes("byd")) {
    return { name: "BYD Ethiopia Brand Site", url: "https://byd-ethiopia.vercel.app" }
  }
  if (id === "7682790473752186133" || id === "7683112730294865173" || t.includes("amore")) {
    return { name: "Amore Cafe & Restaurant", url: "https://amore-cafe.vercel.app" }
  }
  if (id === "7690214314351037717" || id === "7690919403667377460" || t.includes("shoes") || t.includes("ecommerce") || t.includes("streetwear")) {
    return { name: "WEARIFY E-Commerce App", url: "https://wearify-et.vercel.app" }
  }
  if (id === "7668291336642645269" || t.includes("haliyung") || t.includes("portfolio")) {
    return { name: "Personal Portfolio v2", url: "https://ezedinmoh.pro.et" }
  }
  return null
}
