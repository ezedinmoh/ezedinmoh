"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactCTA } from "@/components/contact-cta"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"
import { ArrowUpRight, Github, ChevronRight, Monitor, Layers, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProjectPreviewModal } from "@/components/project-preview-modal"
import { StarRating } from "@/components/star-rating"
import { Skeleton } from "@/components/ui/skeleton"

export interface CaseStudyData {
  problem: string
  solution: string
  outcome: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  screenshots?: string[]
  previewMode?: "slideshow" | "iframe"
  tags: string[]
  stack: string[]
  category: string[]
  link?: string
  github?: string
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
  ratingSum?: number
  ratingCount?: number
  caseStudy?: CaseStudyData
}

const categories = ["All", "Full-Stack", "Frontend", "Backend", "AI / ML"]

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  if (!project.caseStudy) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-primary text-xs font-semibold uppercase tracking-wider block mb-1">Case Study</span>
            <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-500/90">The Challenge</h3>
            <p className="text-sm text-foreground leading-relaxed">{project.caseStudy.problem}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">The Solution</h3>
            <p className="text-sm text-foreground leading-relaxed">{project.caseStudy.solution}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500">The Impact</h3>
            <p className="text-sm text-foreground leading-relaxed">{project.caseStudy.outcome}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-foreground text-xs font-medium rounded-xl hover:bg-secondary/80 transition-all">
              <Github className="w-3.5 h-3.5" /> Source Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:opacity-90 transition-all">
              <ArrowUpRight className="w-3.5 h-3.5" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProjectsGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-2xl bg-card border border-border/60 overflow-hidden flex flex-col h-full min-h-[380px]">
          <Skeleton className="h-52 w-full rounded-none" />
          <div className="p-5 space-y-3 flex-1 flex flex-col">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="mt-auto flex justify-between items-center pt-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProjectCard({
  project, index, onDemo, onCaseStudy
}: {
  project: Project
  index: number
  onDemo: () => void
  onCaseStudy: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const isVideo = project.image ? (
    project.image.endsWith(".mp4") ||
    project.image.endsWith(".webm") ||
    project.image.endsWith(".mov") ||
    (project.image.includes("cloudinary.com") && project.image.includes("/video/upload/"))
  ) : false

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl bg-card border border-border/60 overflow-hidden transition-all duration-500 flex flex-col hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1 h-full min-h-[380px]"
    >
      <div className="relative overflow-hidden shrink-0 h-52">
        {project.image ? (
          <>
            {isVideo ? (
              <video
                src={project.image}
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card/50 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <>
            <div className={cn("absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-700", hovered ? "scale-110 animate-morph" : "scale-100")} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2 p-6 opacity-20">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={cn("w-6 h-6 rounded-lg bg-primary transition-all duration-500", hovered && "animate-pulse-3d")} style={{ animationDelay: `${i * 0.07}s` }} />
                ))}
              </div>
            </div>
            <div className={cn("absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent transition-opacity duration-500", hovered ? "opacity-100" : "opacity-60")} />
          </>
        )}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <button onClick={onDemo} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all hover:scale-105">
            <Monitor className="w-3.5 h-3.5" /> Preview
          </button>
          {project.caseStudy && (
            <button onClick={onCaseStudy} className="flex items-center gap-1.5 px-4 py-2 bg-card border border-border text-foreground rounded-full text-sm font-medium hover:border-primary/50 transition-all hover:scale-105">
              <Layers className="w-3.5 h-3.5" /> Case Study
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-card-foreground text-base md:text-lg group-hover:text-primary transition-colors">{project.title}</h3>
          <StarRating
            projectId={project.id}
            initialSum={project.ratingSum}
            initialCount={project.ratingCount}
            compact
          />
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2">{project.description}</p>
        <div className="flex items-center gap-3 mt-auto">
          <button onClick={onDemo} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Preview <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          {project.caseStudy && (
            <button onClick={onCaseStudy} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Case Study <ChevronRight className="w-3 h-3" />
            </button>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeTech, setActiveTech] = useState<string | null>(null)
  const [demoProject, setDemoProject] = useState<Project | null>(null)
  const [caseStudyProject, setCaseStudyProject] = useState<Project | null>(null)

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(data => {
        setProjects(data.map((p: Record<string, unknown>) => ({
          ...p,
          github: p.githubUrl as string | undefined,
          link: p.liveUrl as string | undefined,
          liveUrl: p.liveUrl as string | undefined,
          githubUrl: p.githubUrl as string | undefined,
          screenshots: Array.isArray(p.screenshots) ? p.screenshots as string[] : [],
          previewMode: (p.previewMode as string | undefined) ?? "slideshow",
          ratingSum: typeof p.ratingSum === "number" ? p.ratingSum : 0,
          ratingCount: typeof p.ratingCount === "number" ? p.ratingCount : 0,
          caseStudy: p.caseStudyProblem ? {
            problem:  p.caseStudyProblem as string,
            solution: p.caseStudySolution as string,
            outcome:  p.caseStudyOutcome as string,
          } : undefined,
        })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p => {
    const catMatch = activeCategory === "All" || p.category.includes(activeCategory)
    const techMatch = !activeTech || p.stack.includes(activeTech)
    return catMatch && techMatch
  })

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <AnimatedCursor />
      <Navigation />

      <ProjectPreviewModal project={demoProject} onClose={() => setDemoProject(null)} />
      {caseStudyProject && <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />}

      {/* Hero */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-morph" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "3s" }} />
        </div>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(100,200,180,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,180,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl">
            <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block animate-fade-in">Portfolio</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              My <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed animate-slide-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              {projects.length} projects spanning full-stack apps, AI tools, and creative experiments. Click any card to preview live or read the case study.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8 sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/40 py-4">
        <div className="container mx-auto px-6 flex flex-wrap gap-3 items-center">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground")}>
                {cat}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-border hidden sm:block" />
          <div className="flex gap-2 flex-wrap">
            {["React", "Next.js", "Node.js", "TypeScript", "AI", "Python"].map(tech => (
              <button key={tech} onClick={() => setActiveTech(activeTech === tech ? null : tech)}
                className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all border",
                  activeTech === tech
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-transparent border-border text-muted-foreground hover:border-primary/30 hover:text-foreground")}>
                {tech}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} projects</span>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {loading ? (
            <ProjectsGridSkeleton />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-4xl mb-3">🔍</p>
              <p>No projects match that filter combination.</p>
              <button onClick={() => { setActiveCategory("All"); setActiveTech(null) }}
                className="mt-4 text-primary text-sm hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i}
                  onDemo={() => setDemoProject(project)}
                  onCaseStudy={() => setCaseStudyProject(project)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Have a project in mind?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            I'm always open to discussing new opportunities, creative ideas, or vision for your product.
          </p>
        </div>
      </section>

      <ContactCTA />
      <Footer />
    </main>
  )
}
