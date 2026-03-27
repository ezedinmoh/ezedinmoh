"use client"

import { useRef, useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"
import { Download, Printer, MapPin, Mail, Globe, Github, Linkedin } from "lucide-react"

const resumeData = {
  name: "Ezedin Mohammed",
  title: "Software Engineer",
  location: "Addis Ababa, Ethiopia",
  email: "ezedinmoh1@gmail.com",
  website: "ezedin.dev",
  github: "github.com/ezedinmoh",
  linkedin: "linkedin.com/in/ezedinmoh",
  summary:
    "Passionate Software Engineer with 5+ years of experience crafting immersive digital experiences. Specializing in React, Next.js, and modern web technologies. I bridge the gap between thoughtful design and robust engineering.",
  experience: [
    {
      title: "Senior Frontend Engineer",
      company: "TechCorp",
      period: "2024 – Present",
      location: "Remote",
      bullets: [
        "Led frontend architecture for enterprise applications used by 50+ developers",
        "Implemented a design system that reduced UI inconsistencies by 80%",
        "Mentored 4 junior engineers and conducted weekly code reviews",
      ],
      tech: ["React", "TypeScript", "GraphQL", "Storybook"],
    },
    {
      title: "Full-Stack Developer",
      company: "StartupXYZ",
      period: "2022 – 2024",
      location: "Addis Ababa",
      bullets: [
        "Built and scaled a SaaS platform from 0 to 100k users",
        "Led migration to microservices architecture, improving uptime to 99.9%",
        "Reduced page load time by 60% through performance optimizations",
      ],
      tech: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
    },
    {
      title: "Frontend Developer",
      company: "Digital Agency Co",
      period: "2020 – 2022",
      location: "Addis Ababa",
      bullets: [
        "Delivered 20+ client projects from marketing sites to complex web apps",
        "Introduced component-driven development, cutting delivery time by 30%",
      ],
      tech: ["React", "Vue.js", "SASS", "WordPress"],
    },
    {
      title: "Junior Developer",
      company: "CodeStart",
      period: "2019 – 2020",
      location: "Addis Ababa",
      bullets: [
        "Built responsive websites and learned modern web technologies",
        "Contributed to open-source projects and internal tooling",
      ],
      tech: ["JavaScript", "HTML/CSS", "PHP", "MySQL"],
    },
  ],
  education: [
    {
      degree: "B.Sc. Computer Science",
      school: "Addis Ababa University",
      period: "2015 – 2019",
      note: "Graduated with Distinction",
    },
  ],
  skills: {
    Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    Backend: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis"],
    Tools: ["Git", "Docker", "AWS", "Figma", "Storybook"],
    Languages: ["JavaScript", "TypeScript", "Python", "SQL"],
  },
  certifications: [
    { name: "AWS Certified Developer – Associate", year: "2023" },
    { name: "Google Professional Cloud Developer", year: "2022" },
  ],
}

export default function ResumePage() {
  const printRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [resume, setResume] = useState(resumeData)

  // Fetch live resume data from API, fall back to static if unavailable
  useEffect(() => {
    fetch("/api/resume")
      .then(r => r.json())
      .then(data => { if (data?.name) setResume(data) })
      .catch(() => {})
  }, [])

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const pageW = 210
      const pageH = 297
      const margin = 16
      const contentW = pageW - margin * 2
      let y = 0

      // ── Helpers ──────────────────────────────────────────────────────────
      const checkPageBreak = (needed: number) => {
        if (y + needed > pageH - 14) {
          doc.addPage()
          y = 16
        }
      }

      const accent: [number, number, number] = [22, 163, 140]   // teal
      const dark:   [number, number, number] = [15,  23,  42]   // near-black
      const mid:    [number, number, number] = [55,  65,  81]   // gray-700
      const light:  [number, number, number] = [107, 114, 128]  // gray-500
      const white:  [number, number, number] = [255, 255, 255]

      // ── Header ───────────────────────────────────────────────────────────
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, pageW, 52, "F")
      // teal accent bar
      doc.setFillColor(...accent)
      doc.rect(0, 52, pageW, 2, "F")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(28)
      doc.setTextColor(...white)
      doc.text(resume.name, margin, 20)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(13)
      doc.setTextColor(...accent)
      doc.text(resume.title, margin, 30)

      // Contact row — two lines to avoid overflow
      doc.setFontSize(7.5)
      doc.setTextColor(180, 190, 210)
      const line1 = `${resume.location}   •   ${resume.email}   •   ${resume.website}`
      const line2 = `${resume.github}   •   ${resume.linkedin}`
      doc.text(line1, margin, 40)
      doc.text(line2, margin, 46)

      y = 62

      // ── Section title ────────────────────────────────────────────────────
      const sectionTitle = (title: string) => {
        checkPageBreak(12)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(8)
        doc.setTextColor(...accent)
        doc.text(title.toUpperCase(), margin, y)
        doc.setDrawColor(...accent)
        doc.setLineWidth(0.3)
        doc.line(margin + doc.getTextWidth(title.toUpperCase()) + 2, y - 0.5, margin + contentW, y - 0.5)
        y += 6
      }

      // ── Body text ────────────────────────────────────────────────────────
      const bodyText = (text: string, indent = 0, color: [number, number, number] = mid) => {
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(...color)
        const lines = doc.splitTextToSize(text, contentW - indent)
        checkPageBreak(lines.length * 4.5)
        doc.text(lines, margin + indent, y)
        y += lines.length * 4.5
      }

      // ── Summary ──────────────────────────────────────────────────────────
      sectionTitle("Summary")
      bodyText(resume.summary, 0, mid)
      y += 5

      // ── Experience ───────────────────────────────────────────────────────
      sectionTitle("Experience")
      for (const exp of resume.experience) {
        checkPageBreak(28)
        // Role + period on same line
        doc.setFont("helvetica", "bold")
        doc.setFontSize(10)
        doc.setTextColor(...dark)
        doc.text(exp.title, margin, y)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(...light)
        doc.text(exp.period, margin + contentW, y, { align: "right" })
        y += 5

        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(...accent)
        doc.text(`${exp.company}  ·  ${exp.location}`, margin, y)
        y += 5.5

        for (const b of exp.bullets) {
          doc.setTextColor(...mid)
          doc.setFontSize(8.5)
          const lines = doc.splitTextToSize(b, contentW - 6)
          checkPageBreak(lines.length * 4.2 + 1)
          doc.text("▸", margin + 1, y)
          doc.text(lines, margin + 5, y)
          y += lines.length * 4.2
        }

        // Tech pills row
        doc.setFontSize(7.5)
        doc.setTextColor(...light)
        doc.text(exp.tech.join("  ·  "), margin + 1, y + 1)
        y += 8
      }

      // ── Education ────────────────────────────────────────────────────────
      sectionTitle("Education")
      for (const edu of resume.education) {
        checkPageBreak(18)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(10)
        doc.setTextColor(...dark)
        doc.text(edu.degree, margin, y)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(...light)
        doc.text(edu.period, margin + contentW, y, { align: "right" })
        y += 5
        doc.setFontSize(9)
        doc.setTextColor(...accent)
        doc.text(edu.school, margin, y)
        y += 5
        doc.setFontSize(8.5)
        doc.setTextColor(...mid)
        doc.text(edu.note, margin + 1, y)
        y += 8
      }

      // ── Skills (2-column grid) ────────────────────────────────────────────
      sectionTitle("Skills")
      const skillEntries = Object.entries(resume.skills)
      const colW = contentW / 2 - 4
      for (let i = 0; i < skillEntries.length; i += 2) {
        checkPageBreak(14)
        const left  = skillEntries[i]
        const right = skillEntries[i + 1]
        const rowY  = y

        const renderSkillCol = (entry: [string, string[]], xOffset: number) => {
          doc.setFont("helvetica", "bold")
          doc.setFontSize(8.5)
          doc.setTextColor(...dark)
          doc.text(entry[0], margin + xOffset, rowY)
          doc.setFont("helvetica", "normal")
          doc.setFontSize(8)
          doc.setTextColor(...mid)
          const wrapped = doc.splitTextToSize(entry[1].join("  ·  "), colW)
          doc.text(wrapped, margin + xOffset, rowY + 4.5)
          return wrapped.length
        }

        const lLines = renderSkillCol(left as [string, string[]], 0)
        if (right) renderSkillCol(right as [string, string[]], contentW / 2 + 2)
        y = rowY + 4.5 + lLines * 4.5 + 3
      }
      y += 2

      // ── Certifications ───────────────────────────────────────────────────
      sectionTitle("Certifications")
      for (const cert of resume.certifications) {
        checkPageBreak(8)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(...mid)
        doc.text(`▸  ${cert.name}`, margin + 1, y)
        doc.setTextColor(...accent)
        doc.text(cert.year, margin + contentW, y, { align: "right" })
        y += 6
      }

      // ── Footer ───────────────────────────────────────────────────────────
      const totalPages = (doc as any).internal.getNumberOfPages()
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p)
        doc.setFontSize(7)
        doc.setTextColor(...light)
        doc.text(`${resume.name} — Resume`, margin, pageH - 6)
        doc.text(`Page ${p} of ${totalPages}`, margin + contentW, pageH - 6, { align: "right" })
      }

      doc.save("Ezedin_Mohammed_Resume.pdf")
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => window.print()

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <AnimatedCursor />
      <Navigation />

      {/* Action bar — hidden on print */}
      <div className="print:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Generating…" : "Download PDF"}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-3 bg-secondary text-secondary-foreground rounded-full font-medium shadow-lg hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      <div className="pt-24 pb-20 container mx-auto px-6 max-w-4xl relative">
        {/* Mesh blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 -z-0">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-morph" />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "3s" }} />
        </div>
        {/* Page title */}
        <div className="text-center mb-12 print:hidden animate-slide-up opacity-0 stagger-1" style={{ animationFillMode: "forwards" }}>
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-2 block">My Story</span>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Resu<span className="text-gradient">me</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A snapshot of my journey, skills, and impact. Download or print a clean PDF version.
          </p>
        </div>

        {/* Resume card */}
        <div
          ref={printRef}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl print:shadow-none print:border-none print:rounded-none"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[oklch(0.15_0.03_250)] to-[oklch(0.12_0.02_220)] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-1">{resume.name}</h2>
              <p className="text-primary text-xl font-medium mb-6">{resume.title}</p>
              <div className="flex flex-wrap gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />{resume.location}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" />{resume.email}</span>
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-primary" />{resume.website}</span>
                <span className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-primary" />{resume.github}</span>
                <span className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 text-primary" />{resume.linkedin}</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            {/* Summary */}
            <ResumeSection title="Summary">
              <p className="text-muted-foreground leading-relaxed">{resume.summary}</p>
            </ResumeSection>

            {/* Experience */}
            <ResumeSection title="Experience">
              <div className="relative">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
                <div className="space-y-8 pl-6">
                  {resume.experience.map((exp, i) => (
                    <TimelineItem key={i} index={i}>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="text-foreground font-semibold text-lg">{exp.title}</h4>
                          <span className="text-primary font-medium">{exp.company}</span>
                          <span className="text-muted-foreground text-sm"> · {exp.location}</span>
                        </div>
                        <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full whitespace-nowrap">{exp.period}</span>
                      </div>
                      <ul className="space-y-1.5 mb-3">
                        {exp.bullets.map((b, j) => (
                          <li key={j} className="text-muted-foreground text-sm flex gap-2">
                            <span className="text-primary mt-1 shrink-0">▸</span>{b}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {exp.tech.map((t) => (
                          <span key={t} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded border border-primary/20">{t}</span>
                        ))}
                      </div>
                    </TimelineItem>
                  ))}
                </div>
              </div>
            </ResumeSection>

            {/* Education */}
            <ResumeSection title="Education">
              {resume.education.map((edu, i) => (
                <div key={i} className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="text-foreground font-semibold text-lg">{edu.degree}</h4>
                    <p className="text-primary font-medium">{edu.school}</p>
                    <p className="text-muted-foreground text-sm mt-1">{edu.note}</p>
                  </div>
                  <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">{edu.period}</span>
                </div>
              ))}
            </ResumeSection>

            {/* Skills */}
            <ResumeSection title="Skills">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(resume.skills).map(([cat, items]) => (
                  <div key={cat}>
                    <p className="text-sm font-semibold text-foreground mb-2">{cat}</p>
                    <div className="flex flex-wrap gap-2">
                      {(items as string[]).map((skill) => (
                        <span key={skill} className="px-2.5 py-1 text-xs bg-secondary text-muted-foreground rounded-full border border-border">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ResumeSection>

            {/* Certifications */}
            <ResumeSection title="Certifications">
              <div className="space-y-2">
                {resume.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-foreground text-sm">{cert.name}</span>
                    <span className="text-primary text-sm font-medium">{cert.year}</span>
                  </div>
                ))}
              </div>
            </ResumeSection>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </main>
  )
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">{title}</h3>
        <div className="flex-1 h-px bg-border" />
      </div>
      {children}
    </div>
  )
}

function TimelineItem({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <div className="relative group hover:translate-x-1 transition-transform duration-300">
      <div
        className="absolute -left-[25px] top-2 w-3 h-3 rounded-full bg-primary ring-4 ring-card group-hover:scale-125 transition-transform duration-300"
        style={{ animationDelay: `${index * 0.1}s` }}
      />
      {children}
    </div>
  )
}
