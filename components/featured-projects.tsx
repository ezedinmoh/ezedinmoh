"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Github, ExternalLink, X, Monitor, Layers, ChevronRight, Target, Lightbulb, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { allProjects, type Project } from "@/lib/projects"

const featuredIds = ["ar-soap", "gym-house", "ramadanly"]
const featuredProjects = featuredIds.map(id => allProjects.find(p => p.id === id)).filter(Boolean) as Project[]

function DemoModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">{project.title}</h3>
            <p className="text-xs text-muted-foreground">{project.liveUrl}</p>
          </div>
          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-all">
                <ExternalLink className="w-3 h-3" /> Open
              </a>
            )}
            <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="relative bg-secondary/30 h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(100,200,180,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,180,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="text-center relative z-10">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Monitor className="w-10 h-10 text-primary" />
            </div>
            <p className="text-foreground font-semibold mb-1">{project.title}</p>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs">{project.description}</p>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all">
                Visit Live Site <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
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
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all">
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-all">
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index, large, onDemo, onCaseStudy }: { project: Project; index: number; large?: boolean; onDemo: () => void; onCaseStudy: () => void }) {
  const [hovered, setHovered] = useState(false)
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
        <div className={cn("absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-700", hovered ? "scale-110 animate-morph" : "scale-100")} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn("grid gap-2 opacity-20", large ? "grid-cols-4 p-10" : "grid-cols-3 p-6")}>
            {[...Array(large ? 16 : 9)].map((_, i) => (
              <div key={i} className={cn("rounded-lg bg-primary transition-all duration-500", large ? "w-8 h-8" : "w-6 h-6", hovered && "animate-pulse-3d")} style={{ animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
        </div>
        <div className={cn("absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent transition-opacity duration-500", hovered ? "opacity-100" : "opacity-60")} />
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, large ? 4 : 2).map(tag => (
            <span key={tag} className="px-2.5 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full text-muted-foreground">{tag}</span>
          ))}
        </div>
        {large && (
          <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold bg-primary/15 border border-primary/30 text-primary rounded-full">Featured</span>
        )}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <button onClick={onDemo} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all hover:scale-105">
            <Monitor className="w-3.5 h-3.5" /> Live Preview
          </button>
          {project.caseStudy && (
            <button onClick={onCaseStudy} className="flex items-center gap-1.5 px-4 py-2 bg-card border border-border text-foreground rounded-full text-sm font-medium hover:border-primary/50 transition-all hover:scale-105">
              <Layers className="w-3.5 h-3.5" /> Case Study
            </button>
          )}
        </div>
        <div className={cn("absolute inset-0 transition-opacity duration-500 pointer-events-none", hovered ? "opacity-100" : "opacity-0")} style={{ background: "linear-gradient(135deg, transparent 40%, rgba(100,200,180,0.1) 50%, transparent 60%)", backgroundSize: "200% 200%", animation: hovered ? "gradientShift 3s ease infinite" : "none" }} />
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
  const [hero, ...rest] = featuredProjects
  const [demoProject, setDemoProject] = useState<Project | null>(null)
  const [caseStudyProject, setCaseStudyProject] = useState<Project | null>(null)
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-stretch md:grid-rows-1">
          <div className="md:col-span-2 flex self-stretch">
            <ProjectCard project={hero} index={0} large onDemo={() => setDemoProject(hero)} onCaseStudy={() => setCaseStudyProject(hero)} />
          </div>
          <div className="flex flex-col gap-6 self-stretch">
            {rest.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i + 1} onDemo={() => setDemoProject(project)} onCaseStudy={() => setCaseStudyProject(project)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
