import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"

const DEFAULT_RESUME = {
  name: "Ezedin Mohammed",
  title: "Software Engineer",
  location: "Kombolcha, Ethiopia",
  email: "ezedinmoh1@gmail.com",
  website: "ezedin.dev",
  github: "github.com/ezedinmoh",
  linkedin: "linkedin.com/in/ezedinmoh",
  summary: "Passionate Software Engineer with 5+ years of experience crafting immersive digital experiences. Specializing in React, Next.js, and modern web technologies. I bridge the gap between thoughtful design and robust engineering.",
  experience: [
    { title: "Senior Frontend Engineer", company: "TechCorp", period: "2024 – Present", location: "Remote",
      bullets: ["Led frontend architecture for enterprise applications used by 50+ developers", "Implemented a design system that reduced UI inconsistencies by 80%", "Mentored 4 junior engineers and conducted weekly code reviews"],
      tech: ["React", "TypeScript", "GraphQL", "Storybook"] },
    { title: "Full-Stack Developer", company: "StartupXYZ", period: "2022 – 2024", location: "Addis Ababa",
      bullets: ["Built and scaled a SaaS platform from 0 to 100k users", "Led migration to microservices architecture, improving uptime to 99.9%", "Reduced page load time by 60% through performance optimizations"],
      tech: ["Next.js", "Node.js", "PostgreSQL", "AWS"] },
    { title: "Frontend Developer", company: "Digital Agency Co", period: "2020 – 2022", location: "Addis Ababa",
      bullets: ["Delivered 20+ client projects from marketing sites to complex web apps", "Introduced component-driven development, cutting delivery time by 30%"],
      tech: ["React", "Vue.js", "SASS", "WordPress"] },
    { title: "Junior Developer", company: "CodeStart", period: "2019 – 2020", location: "Addis Ababa",
      bullets: ["Built responsive websites and learned modern web technologies", "Contributed to open-source projects and internal tooling"],
      tech: ["JavaScript", "HTML/CSS", "PHP", "MySQL"] },
  ],
  education: [
    { degree: "B.Sc. Computer Science", school: "Addis Ababa University", period: "2015 – 2019", note: "Graduated with Distinction" },
  ],
  skills: {
    Frontend:  ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    Backend:   ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis"],
    Tools:     ["Git", "Docker", "AWS", "Figma", "Storybook"],
    Languages: ["JavaScript", "TypeScript", "Python", "SQL"],
  },
  certifications: [
    { name: "AWS Certified Developer – Associate", year: "2023" },
    { name: "Google Professional Cloud Developer",  year: "2022" },
  ],
}

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<{ data: unknown }[]>`
      SELECT data FROM resume WHERE id = 'singleton' LIMIT 1
    `
    if (rows.length > 0 && rows[0].data) {
      const saved = rows[0].data as Record<string, unknown>
      // Merge with defaults so missing fields are filled in
      const merged = {
        ...DEFAULT_RESUME,
        ...saved,
        experience:     Array.isArray(saved.experience)     && (saved.experience as unknown[]).length     > 0 ? saved.experience     : DEFAULT_RESUME.experience,
        education:      Array.isArray(saved.education)      && (saved.education as unknown[]).length      > 0 ? saved.education      : DEFAULT_RESUME.education,
        certifications: Array.isArray(saved.certifications) && (saved.certifications as unknown[]).length > 0 ? saved.certifications : DEFAULT_RESUME.certifications,
        skills:         saved.skills && Object.keys(saved.skills as object).length > 0 ? saved.skills : DEFAULT_RESUME.skills,
      }
      return NextResponse.json(merged)
    }
    return NextResponse.json(DEFAULT_RESUME)
  } catch {
    return NextResponse.json(DEFAULT_RESUME)
  }
}

export async function PUT(req: Request) {
  try { await requireAuth() } catch (e) { return e as Response }

  try {
    const data = await req.json()
    await prisma.$executeRaw`
      INSERT INTO resume (id, data, "updatedAt")
      VALUES ('singleton', ${JSON.stringify(data)}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(data)}::jsonb, "updatedAt" = NOW()
    `
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Failed to save resume" }, { status: 500 })
  }
}
