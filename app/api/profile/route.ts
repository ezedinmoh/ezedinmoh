import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"

export const DEFAULT_STATS = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 30, suffix: "+", label: "Projects Shipped" },
  { value: 20, suffix: "+", label: "Happy Clients" },
  { value: 8, suffix: "", label: "Countries Worked With" },
]

export const DEFAULT_EXPERIENCES = [
  {
    title: "Senior Frontend Engineer",
    company: "TechCorp",
    companyUrl: "https://example.com",
    period: "2024 - Present",
    description: "Leading frontend architecture for a suite of enterprise applications. Implemented design system used by 50+ developers.",
    technologies: ["React", "TypeScript", "GraphQL", "Storybook"],
  },
  {
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    companyUrl: "https://example.com",
    period: "2022 - 2024",
    description: "Built and scaled a SaaS platform from 0 to 100k users. Led migration to microservices architecture.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    title: "Frontend Developer",
    company: "Digital Agency Co",
    companyUrl: "https://example.com",
    period: "2020 - 2022",
    description: "Delivered 20+ client projects ranging from marketing sites to complex web applications.",
    technologies: ["React", "Vue.js", "SASS", "WordPress"],
  },
  {
    title: "Junior Developer",
    company: "CodeStart",
    companyUrl: "https://example.com",
    period: "2019 - 2020",
    description: "Started my professional journey building responsive websites and learning modern web technologies.",
    technologies: ["JavaScript", "HTML/CSS", "PHP", "MySQL"],
  },
]

const DEFAULT_PROFILE = {
  id: "singleton",
  avatarUrl: "",
  coverImageUrl: "",
  title: "Ezedin Mohammed",
  location: "Kombolcha, Ethiopia",
  yearsExperience: "5+ Years Experience",
  bio: "I'm a passionate Software Engineer from Ethiopia who believes in the power of clean code and thoughtful design. My journey started with a simple curiosity about how websites work and evolved into a deep love for crafting digital experiences.",
  stats: DEFAULT_STATS,
  experiences: DEFAULT_EXPERIENCES,
}

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: "singleton" },
    })

    if (profile) {
      return NextResponse.json({
        ...profile,
        stats: Array.isArray(profile.stats) && (profile.stats as unknown[]).length > 0 ? profile.stats : DEFAULT_STATS,
        experiences: Array.isArray(profile.experiences) && (profile.experiences as unknown[]).length > 0 ? profile.experiences : DEFAULT_EXPERIENCES,
      })
    }
  } catch (e) {
    console.warn("GET /api/profile DB error:", e)
  }

  return NextResponse.json(DEFAULT_PROFILE)
}

export async function PUT(req: Request) {
  try { await requireAuth() } catch (e) { return e as Response }

  try {
    const body = await req.json()

    const avatarUrl       = typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : ""
    const coverImageUrl   = typeof body.coverImageUrl === "string" ? body.coverImageUrl.trim() : ""
    const title           = typeof body.title === "string" ? body.title.trim() : DEFAULT_PROFILE.title
    const location        = typeof body.location === "string" ? body.location.trim() : DEFAULT_PROFILE.location
    const yearsExperience = typeof body.yearsExperience === "string" ? body.yearsExperience.trim() : DEFAULT_PROFILE.yearsExperience
    const bio             = typeof body.bio === "string" ? body.bio.trim() : DEFAULT_PROFILE.bio

    const stats           = Array.isArray(body.stats) ? body.stats : DEFAULT_STATS
    const experiences     = Array.isArray(body.experiences) ? body.experiences : DEFAULT_EXPERIENCES

    const updated = await prisma.profile.upsert({
      where: { id: "singleton" },
      update: {
        avatarUrl,
        coverImageUrl,
        title,
        location,
        yearsExperience,
        bio,
        stats,
        experiences,
      },
      create: {
        id: "singleton",
        avatarUrl,
        coverImageUrl,
        title,
        location,
        yearsExperience,
        bio,
        stats,
        experiences,
      },
    })

    return NextResponse.json(updated)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("PUT /api/profile error:", msg)
    return NextResponse.json({ message: `Failed to update profile: ${msg}` }, { status: 500 })
  }
}
