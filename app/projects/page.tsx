"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/projects"
import {
  ExternalLink, Github, X, ArrowUpRight, Layers,
  ChevronRight, Target, Lightbulb, TrendingUp, Monitor, Loader2
} from "lucide-react"

const categories = ["All", "Frontend", "Full-Stack", "AI"]

// ── Demo Modal ──────────────────────────────────────────────────────────────
function DemoModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">{project.title}</h3>
            <p className="text-xs text-muted-foreground">{project.liveUrl}</p>
          </div>
          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-all">
                <ExternalLink className="w-3 h-3" /> Open
              </a>
            )}
            <button onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Preview area */}
        <div className="relative bg-secondary/30 h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "linear-gradient(rgba(100,200,180,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,180,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="text-center relative z-10">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Monitor className="w-10 h-10 text-primary" />
            </div>
            <p className="text-foreground font-semibold mb-1">{project.title}</p>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs">{project.description}</p>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all">
                Visit Live Site <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Case Study Modal ─────────────────────────────────────────────────────────
function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  if (!project.caseStudy) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl my-auto animate-scale-in"
        onClick={e => e.stopPropagation()}>
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

// ── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index, onDemo, onCaseStudy }: {
  project: Project; index: number
  onDemo: () => void; onCaseStudy: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 animate-slide-up opacity-0"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "forwards" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image / preview area */}
      <div className="relative aspect-video overflow-hidden">
        {/* Image if available, otherwise gradient */}
        {project.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              className={cn("absolute inset-0 w-full h-full object-cover transition-transform duration-700", hovered ? "scale-110" : "scale-100")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          </>
        ) : (
          <>
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-700",
              hovered ? "scale-110 animate-morph" : "scale-100"
            )} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2 p-8 opacity-20">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={cn(
                    "w-8 h-8 rounded-lg bg-primary transition-all duration-500",
                    hovered && "animate-pulse-3d"
                  )} style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent transition-opacity duration-500",
              hovered ? "opacity-100" : "opacity-60"
            )} />
          </>
        )}
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 text-xs bg-background/80 backdrop-blur-sm rounded-full text-muted-foreground">{tag}</span>
          ))}
        </div>
        {/* Year */}
        <span className="absolute top-3 right-3 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full">{project.year}</span>
        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <button onClick={onDemo}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all hover:scale-105">
            <Monitor className="w-3.5 h-3.5" /> Live Preview
          </button>
          {project.caseStudy && (
            <button onClick={onCaseStudy}
              className="flex items-center gap-1.5 px-4 py-2 bg-card border border-border text-foreground rounded-full text-sm font-medium hover:border-primary/50 transition-all hover:scale-105">
              <Layers className="w-3.5 h-3.5" /> Case Study
            </button>
          )}
        </div>
        {/* Gradient shift glow on hover */}
        <div className={cn(
          "absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none",
          hovered ? "opacity-100" : "opacity-0"
        )} style={{
          background: "linear-gradient(135deg, transparent 40%, rgba(100,200,180,0.1) 50%, transparent 60%)",
          backgroundSize: "200% 200%",
          animation: hovered ? "gradientShift 3s ease infinite" : "none",
        }} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-4">{project.description}</p>
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          <button onClick={onDemo}
            className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
            Preview <ArrowUpRight className="w-3 h-3" />
          </button>
          {project.caseStudy && (
            <button onClick={onCaseStudy}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              Case Study <ChevronRight className="w-3 h-3" />
            </button>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
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
        // Map DB fields to Project shape
        setProjects(data.map((p: Record<string, unknown>) => ({
          ...p,
          github: p.githubUrl,
          link: p.liveUrl,
          caseStudy: p.caseStudyProblem ? {
            problem:  p.caseStudyProblem,
            solution: p.caseStudySolution,
            outcome:  p.caseStudyOutcome,
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

      {demoProject && <DemoModal project={demoProject} onClose={() => setDemoProject(null)} />}
      {caseStudyProject && <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />}

      {/* Hero */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        {/* Mesh blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-morph" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "3s" }} />
        </div>
        {/* Grid pattern */}
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
          {/* Category */}
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
          {/* Tech stack filter */}
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
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
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
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">I'm always excited to work on interesting projects. Let's bring your ideas to life.</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-105">
            Start a Project <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
