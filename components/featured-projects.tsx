"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Github, ExternalLink, X, Monitor, Layers, ChevronRight, Target, Lightbulb, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/projects"

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/video/upload/")
}

type DBProject = Project & { screenshots?: string[] }

function DemoModal({ project, onClose }: { project: DBProject; onClose: () => void }) {
  const media: string[] = (project.screenshots?.length)
    ? project.screenshots!
    : project.image ? [project.image] : []
  const [idx, setIdx] = useState(0)
  const current = media[idx]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div>
            <h3 className="font-semibold text-foreground">{project.title}</h3>
            <p className="text-xs text-muted-foreground">{media.length > 1 ? `${idx + 1} / ${media.length}` : project.liveUrl}</p>
          </div>
          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-all">
                <ExternalLink className="w-3 h-3" /> Open
              </a>
            )}
            <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative bg-secondary/30 flex-1 min-h-0 h-[55vh] flex items-center justify-center overflow-hidden">
          {current ? (
            <>
              {isVideoUrl(current) ? (
                <video key={current} src={current} autoPlay muted loop playsInline controls className="w-full h-full object-contain" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={current} src={current} alt={project.title} className="w-full h-full object-contain" />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
                <p className="text-white font-bold text-base">{project.title}</p>
                <p className="text-white/70 text-xs line-clamp-2 mt-0.5">{project.description}</p>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold pointer-events-auto hover:opacity-90 transition-all hover:scale-105 shadow-lg">
                    Visit Live Site <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Monitor className="w-10 h-10 text-primary" />
              </div>
              <p className="text-foreground font-semibold mb-1">{project.title}</p>
              <p className="text-muted-foreground text-sm mb-4 max-w-xs">{project.description}</p>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:opacity-90 transition-all hover:scale-105">
                  Visit Live Site <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
          {media.length > 1 && (
            <>
              <button onClick={() => setIdx(i => (i - 1 + media.length) % media.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background transition-all text-lg font-bold">&#8249;</button>
              <button onClick={() => setIdx(i => (i + 1) % media.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background transition-all text-lg font-bold">&#8250;</button>
            </>
          )}
        </div>

        {media.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto border-t border-border bg-background/50 shrink-0">
            {media.map((url, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={cn("shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all",
                  i === idx ? "border-primary" : "border-transparent opacity-50 hover:opacity-100")}>
                {isVideoUrl(url)
                  ? <video src={url} muted className="w-full h-full object-cover" />
                  // eslint-disable-next-line @next/next/no-img-element
                  : <img src={url} alt="" className="w-full h-full object-cover" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CaseStudyModal({ project, onClose }: { project: DBProject; onClose: () => void }) {
  if (!project.caseStudy) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl my-auto animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <span className="text-xs text-primary font-medium uppercase tracking-wider">Case Study</span>
            <h3 className="text-xl font-bold text-foreground mt-0.5">{project.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {[
            { icon: Target, label: "Problem", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", text: project.caseStudy.problem },
            { icon: Lightbulb, label: "Solution", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", text: project.caseStudy.solution },
            { icon: TrendingUp, label: "Outcome", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", text: project.caseStudy.outcome },
          ].map(({ icon: Icon, label, color, bg, text }) => (
            <div key={label} className={cn("p-5 rounded-xl border", bg)}>
              <div className={cn("flex items-center gap-2 mb-2 font-semibold", color)}>
                <Icon className="w-4 h-4" />{label}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
            </div>
          ))}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map(t => (
                <span key={t} className="px-2.5 py-1 text-xs bg-secondary text-muted-foreground rounded-full border border-border">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all">
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-all">
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index, large, onDemo, onCaseStudy }: {
  project: DBProject; index: number; large?: boolean; onDemo: () => void; onCaseStudy: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const hasMedia = !!project.image

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border",
        "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500",
        "animate-slide-up opacity-0 flex flex-col w-full",
        large ? "h-full" : "flex-1"
      )}
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={cn("relative overflow-hidden", large ? "flex-1 min-h-64" : "flex-1 min-h-36")}>
        {hasMedia ? (
          <>
            {isVideoUrl(project.image!) ? (
              <video src={project.image} autoPlay muted loop playsInline
                className={cn("absolute inset-0 w-full h-full object-cover transition-transform duration-700", hovered ? "scale-110" : "scale-100")} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.image} alt={project.title}
                className={cn("absolute inset-0 w-full h-full object-cover transition-transform duration-700", hovered ? "scale-110" : "scale-100")} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
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
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, large ? 4 : 2).map(tag => (
            <span key={tag} className="px-2.5 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full text-muted-foreground">{tag}</span>
          ))}
        </div>
        {large && <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold bg-primary/15 border border-primary/30 text-primary rounded-full backdrop-blur-sm">Featured</span>}
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
      <div className="p-5 flex flex-col">
        <h3 className={cn("font-bold text-card-foreground group-hover:text-primary transition-colors mb-2", large ? "text-xl md:text-2xl" : "text-base md:text-lg")}>{project.title}</h3>
        <p className={cn("text-muted-foreground leading-relaxed", large ? "text-sm mb-5" : "text-xs mb-4 line-clamp-2")}>{project.description}</p>
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
          screenshots: Array.isArray(p.screenshots) ? p.screenshots as string[] : [],
          caseStudy: p.caseStudyProblem ? {
            problem:  p.caseStudyProblem as string,
            solution: p.caseStudySolution as string,
            outcome:  p.caseStudyOutcome as string,
          } : undefined,
        })).sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) as DBProject[])
      })
      .catch(() => {})
  }, [])

  const [hero, ...rest] = projects

  // Split all projects into groups of 6
  const groups: DBProject[][] = []
  for (let i = 0; i < projects.length; i += 6) {
    groups.push(projects.slice(i, i + 6))
  }

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {demoProject && <DemoModal project={demoProject} onClose={() => setDemoProject(null)} />}
      {caseStudyProject && <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-6 relative">
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
                <div className="md:col-span-2 flex self-stretch" style={{ minHeight: 420 }}>
                  <ProjectCard project={groupHero} index={baseIndex} large
                    onDemo={() => setDemoProject(groupHero)}
                    onCaseStudy={() => setCaseStudyProject(groupHero)} />
                </div>
                <div className="flex flex-col gap-6 self-stretch">
                  {groupRest.slice(0, 2).map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={baseIndex + i + 1}
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
