"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ExternalLink, ArrowUpRight, Github, X, ChevronRight, Monitor, Layers, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { StarRating } from "@/components/star-rating"
import { ProjectPreviewModal } from "@/components/project-preview-modal"

interface CaseStudy {
  problem: string
  solution: string
  outcome: string
}

interface DBProject {
  id: string
  title: string
  description: string
  image: string
  screenshots: string[]
  tags: string[]
  stack: string[]
  category: string[]
  github?: string
  link?: string
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  featuredSortOrder?: number
  sortOrder?: number
  previewMode?: "slideshow" | "iframe"
  ratingSum?: number
  ratingCount?: number
  caseStudy?: CaseStudy
}

function CaseStudyModal({ project, onClose }: { project: DBProject; onClose: () => void }) {
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
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-foreground text-xs font-medium rounded-xl hover:bg-secondary/80 transition-all">
              <Github className="w-3.5 h-3.5" /> Source Code
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:opacity-90 transition-all">
              <ArrowUpRight className="w-3.5 h-3.5" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({
  project, index, large = false, compact = false, onDemo, onCaseStudy
}: {
  project: DBProject
  index: number
  large?: boolean
  compact?: boolean
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
      className={cn(
        "group relative rounded-2xl bg-card border border-border/60 overflow-hidden transition-all duration-500 flex flex-col hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1",
        large ? "h-full min-h-[520px]" : compact ? "h-full min-h-[220px]" : "h-full min-h-[380px]"
      )}
    >
      <div className={cn("relative overflow-hidden shrink-0", large ? "h-72 sm:h-96 md:h-[380px]" : compact ? "h-36" : "h-52")}>
        {project.image ? (
          <>
            {isVideo ? (
              <video
                src={project.image}
                autoPlay muted loop playsInline
                className={cn("absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105")}
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
              <div className={cn("grid gap-2 opacity-20", large ? "grid-cols-4 p-10" : "grid-cols-3 p-6")}>
                {[...Array(large ? 16 : 9)].map((_, i) => (
                  <div key={i} className={cn("rounded-lg bg-primary transition-all duration-500", large ? "w-8 h-8" : "w-6 h-6", hovered && "animate-pulse-3d")} style={{ animationDelay: `${i * 0.07}s` }} />
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
      <div className={cn("flex flex-col flex-1", compact ? "p-4" : "p-5")}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={cn("font-bold text-card-foreground group-hover:text-primary transition-colors", large ? "text-xl md:text-2xl" : compact ? "text-sm md:text-base line-clamp-1" : "text-base md:text-lg")}>{project.title}</h3>
          <StarRating
            projectId={project.id}
            initialSum={project.ratingSum}
            initialCount={project.ratingCount}
            compact
          />
        </div>
        <p className={cn("text-muted-foreground leading-relaxed", large ? "text-sm mb-5" : compact ? "text-xs mb-3 line-clamp-1" : "text-xs mb-4 line-clamp-2")}>{project.description}</p>
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

export function FeaturedProjects() {
  const [projects, setProjects] = useState<DBProject[]>([])
  const [demoProject, setDemoProject] = useState<DBProject | null>(null)
  const [caseStudyProject, setCaseStudyProject] = useState<DBProject | null>(null)

  useEffect(() => {
    fetch("/api/projects?featured=true")
      .then(r => r.json())
      .then((data: Record<string, unknown>[]) => {
        setProjects(data.map(p => ({
          ...(p as object),
          github: p.githubUrl as string | undefined,
          link: p.liveUrl as string | undefined,
          liveUrl: p.liveUrl as string | undefined,
          githubUrl: p.githubUrl as string | undefined,
          screenshots: Array.isArray(p.screenshots) ? p.screenshots as string[] : [],
          previewMode: (p.previewMode as string | undefined) ?? "slideshow",
          ratingSum: typeof p.ratingSum === "number" ? p.ratingSum : 0,
          ratingCount: typeof p.ratingCount === "number" ? p.ratingCount : 0,
          caseStudy: p.caseStudyProblem ? {
            problem: p.caseStudyProblem as string,
            solution: p.caseStudySolution as string,
            outcome: p.caseStudyOutcome as string,
          } : undefined,
        })).sort((a: any, b: any) => (a.featuredSortOrder ?? a.sortOrder ?? 0) - (b.featuredSortOrder ?? b.sortOrder ?? 0)) as DBProject[])
      })
      .catch(() => { })
  }, [])

  // Split all projects into groups of 6
  const groups: DBProject[][] = []
  for (let i = 0; i < projects.length; i += 6) {
    groups.push(projects.slice(i, i + 6))
  }

  return (
    <section id="featured-projects" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <ProjectPreviewModal project={demoProject} onClose={() => setDemoProject(null)} />
      {caseStudyProject && <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-wider mb-2 block">Selected Work</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Featured Projects</h2>
          </div>
          <Link href="/projects" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            View all projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {groups.map((group, gi) => {
          const [groupHero, ...groupRest] = group
          const baseIndex = gi * 6
          return (
            <div key={groupHero.id} className={cn("space-y-6", gi > 0 && "mt-16 pt-16 border-t border-border")}>
              {/* Hero row: 2-col hero + 2 stacked */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-stretch">
                <div className="md:col-span-2">
                  <ProjectCard project={groupHero} index={baseIndex} large
                    onDemo={() => setDemoProject(groupHero)}
                    onCaseStudy={() => setCaseStudyProject(groupHero)} />
                </div>
                <div className="grid grid-rows-2 gap-6 self-stretch">
                  {groupRest.slice(0, 2).map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={baseIndex + i + 1}
                      compact
                      onDemo={() => setDemoProject(project)}
                      onCaseStudy={() => setCaseStudyProject(project)} />
                  ))}
                </div>
              </div>

              {/* Bottom row: remaining 3 side by side */}
              {groupRest.length > 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupRest.slice(2).map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={baseIndex + i + 3}
                      onDemo={() => setDemoProject(project)}
                      onCaseStudy={() => setCaseStudyProject(project)} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
