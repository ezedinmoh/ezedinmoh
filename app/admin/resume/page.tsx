"use client"

import { useEffect, useState } from "react"
import { ResumeAdmin } from "@/components/admin/ResumeAdmin"
import { Loader2 } from "lucide-react"

export type ExperienceItem = { title: string; company: string; period: string; location: string; bullets: string[]; tech: string[] }
export type EducationItem  = { degree: string; school: string; period: string; note: string }
export type CertItem       = { name: string; year: string }
export type ResumeData = {
  name: string; title: string; location: string; email: string
  website: string; github: string; linkedin: string; summary: string
  experience: ExperienceItem[]; education: EducationItem[]
  skills: Record<string, string[]>; certifications: CertItem[]
}

const DEFAULT_RESUME: ResumeData = {
  name: "Ezedin Mohammed",
  title: "Software Engineer",
  location: "Kombolcha, Ethiopia",
  email: "ezedinmoh1@gmail.com",
  website: "ezedin.dev",
  github: "github.com/ezedinmoh",
  linkedin: "linkedin.com/in/ezedinmoh",
  summary: "Passionate Software Engineer with 5+ years of experience crafting immersive digital experiences. Specializing in React, Next.js, and modern web technologies. I bridge the gap between thoughtful design and robust engineering.",
  experience: [
    {
      title: "Senior Frontend Engineer", company: "TechCorp",
      period: "2024 – Present", location: "Remote",
      bullets: [
        "Led frontend architecture for enterprise applications used by 50+ developers",
        "Implemented a design system that reduced UI inconsistencies by 80%",
        "Mentored 4 junior engineers and conducted weekly code reviews",
      ],
      tech: ["React", "TypeScript", "GraphQL", "Storybook"],
    },
    {
      title: "Full-Stack Developer", company: "StartupXYZ",
      period: "2022 – 2024", location: "Addis Ababa",
      bullets: [
        "Built and scaled a SaaS platform from 0 to 100k users",
        "Led migration to microservices architecture, improving uptime to 99.9%",
        "Reduced page load time by 60% through performance optimizations",
      ],
      tech: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
    },
    {
      title: "Frontend Developer", company: "Digital Agency Co",
      period: "2020 – 2022", location: "Addis Ababa",
      bullets: [
        "Delivered 20+ client projects from marketing sites to complex web apps",
        "Introduced component-driven development, cutting delivery time by 30%",
      ],
      tech: ["React", "Vue.js", "SASS", "WordPress"],
    },
    {
      title: "Junior Developer", company: "CodeStart",
      period: "2019 – 2020", location: "Addis Ababa",
      bullets: [
        "Built responsive websites and learned modern web technologies",
        "Contributed to open-source projects and internal tooling",
      ],
      tech: ["JavaScript", "HTML/CSS", "PHP", "MySQL"],
    },
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

export default function AdminResumePage() {
  const [data, setData] = useState<ResumeData | null>(null)

  useEffect(() => {
    fetch("/api/resume")
      .then(r => r.json())
      .then(d => {
        // Always ensure arrays are populated — fall back to defaults if empty
        const merged: ResumeData = {
          ...DEFAULT_RESUME,
          ...(d?.name ? d : {}),
          experience:     d?.experience?.length     > 0 ? d.experience     : DEFAULT_RESUME.experience,
          education:      d?.education?.length      > 0 ? d.education      : DEFAULT_RESUME.education,
          certifications: d?.certifications?.length > 0 ? d.certifications : DEFAULT_RESUME.certifications,
          skills:         d?.skills && Object.keys(d.skills).length > 0 ? d.skills : DEFAULT_RESUME.skills,
        }
        setData(merged)
      })
      .catch(() => setData(DEFAULT_RESUME))
  }, [])

  if (!data) {
    return (
      <div className="flex items-center gap-3 py-12 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading resume data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resume Manager</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit your resume — changes reflect on the public resume page instantly.</p>
      </div>
      <ResumeAdmin initial={data} />
    </div>
  )
}
