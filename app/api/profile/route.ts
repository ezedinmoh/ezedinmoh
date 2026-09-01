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

export const DEFAULT_TIMELINE = [
  { year: "2019", event: "First Line of Code", description: "Wrote my first HTML page and got completely hooked on building things for the web.", emoji: "🌱" },
  { year: "2020", event: "Started Coding Journey", description: "Fell deep into JavaScript, built 10+ side projects, and discovered React.", emoji: "🚀" },
  { year: "2021", event: "First Developer Job", description: "Landed a junior developer role at a local agency. Shipped real products for real clients.", emoji: "💼" },
  { year: "2022", event: "Full-Stack Developer", description: "Expanded into backend with Node.js and PostgreSQL. Started contributing to open source.", emoji: "⚡" },
  { year: "2023", event: "Senior Engineer", description: "Led frontend architecture for enterprise apps. Mentored junior devs.", emoji: "🏆" },
  { year: "2024", event: "Software Engineer", description: "Working on cutting-edge products, exploring AI integrations, and building this portfolio.", emoji: "🌟" },
]

export const DEFAULT_FUN_FACTS = [
  { emoji: "☕", fact: "I've tried 40+ Ethiopian coffee varieties and can tell them apart by taste" },
  { emoji: "⌨️", fact: "I type at 95 WPM and have strong opinions about mechanical keyboards" },
  { emoji: "🌍", fact: "I've worked with clients from 8 different countries without leaving Ethiopia" },
  { emoji: "📚", fact: "I read at least one tech book per month — currently on 'Designing Data-Intensive Applications'" },
  { emoji: "🎯", fact: "I once fixed a production bug in under 3 minutes during a live demo" },
  { emoji: "🌙", fact: "My most productive hours are between 10pm and 2am" },
]

export const DEFAULT_WORK_STYLE = [
  { icon: "Zap", title: "Fast Learner", desc: "I pick up new technologies quickly and love diving into unfamiliar codebases." },
  { icon: "Heart", title: "Detail-Oriented", desc: "I care deeply about pixel-perfect UI, clean code, and thoughtful UX." },
  { icon: "Users", title: "Collaborative", desc: "I communicate clearly, give honest feedback, and love pair programming." },
  { icon: "Smile", title: "Low Ego", desc: "I'm always open to better ideas, regardless of where they come from." },
]

export const DEFAULT_INTERESTS = [
  { icon: "Code2", label: "Open Source", description: "Contributing to the community" },
  { icon: "Coffee", label: "Ethiopian Coffee", description: "The best coffee in the world" },
  { icon: "Book", label: "Continuous Learning", description: "Always exploring new tech" },
  { icon: "Gamepad2", label: "Gaming", description: "Strategy games and RPGs" },
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
  timeline: DEFAULT_TIMELINE,
  funFacts: DEFAULT_FUN_FACTS,
  workStyle: DEFAULT_WORK_STYLE,
  interests: DEFAULT_INTERESTS,
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
        timeline: Array.isArray(profile.timeline) && (profile.timeline as unknown[]).length > 0 ? profile.timeline : DEFAULT_TIMELINE,
        funFacts: Array.isArray(profile.funFacts) && (profile.funFacts as unknown[]).length > 0 ? profile.funFacts : DEFAULT_FUN_FACTS,
        workStyle: Array.isArray(profile.workStyle) && (profile.workStyle as unknown[]).length > 0 ? profile.workStyle : DEFAULT_WORK_STYLE,
        interests: Array.isArray(profile.interests) && (profile.interests as unknown[]).length > 0 ? profile.interests : DEFAULT_INTERESTS,
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
    const timeline        = Array.isArray(body.timeline) ? body.timeline : DEFAULT_TIMELINE
    const funFacts        = Array.isArray(body.funFacts) ? body.funFacts : DEFAULT_FUN_FACTS
    const workStyle       = Array.isArray(body.workStyle) ? body.workStyle : DEFAULT_WORK_STYLE
    const interests       = Array.isArray(body.interests) ? body.interests : DEFAULT_INTERESTS

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
        timeline,
        funFacts,
        workStyle,
        interests,
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
        timeline,
        funFacts,
        workStyle,
        interests,
      },
    })

    return NextResponse.json(updated)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("PUT /api/profile error:", msg)
    return NextResponse.json({ message: `Failed to update profile: ${msg}` }, { status: 500 })
  }
}
