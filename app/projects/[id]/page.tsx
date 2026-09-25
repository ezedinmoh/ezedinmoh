import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Github, Calendar, Layers, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react"
import { prisma } from "@/lib/db"
import { allProjects, type Project } from "@/lib/projects"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

async function getProjectData(id: string): Promise<Project | null> {
  const decodedId = decodeURIComponent(id)

  try {
    const dbProject = await prisma.project.findFirst({
      where: {
        OR: [{ id: decodedId }, { slug: decodedId }],
      },
    })

    if (dbProject) {
      return {
        id: dbProject.slug || dbProject.id,
        title: dbProject.title,
        description: dbProject.description,
        image: dbProject.image || "",
        tags: dbProject.tags,
        stack: dbProject.stack,
        category: dbProject.category,
        liveUrl: dbProject.liveUrl || undefined,
        github: dbProject.githubUrl || undefined,
        featured: dbProject.featured,
        previewMode: dbProject.previewMode as "iframe" | "slideshow",
        year: dbProject.year || "2026",
        caseStudy: (dbProject.caseStudyProblem || dbProject.caseStudySolution || dbProject.caseStudyOutcome) ? {
          problem: dbProject.caseStudyProblem || "",
          solution: dbProject.caseStudySolution || "",
          outcome: dbProject.caseStudyOutcome || "",
        } : undefined,
      }
    }
  } catch (err) {
    console.warn("DB lookup fallback in project page:", err)
  }

  // Fallback to static allProjects
  const staticItem = allProjects.find(
    (p) => p.id === decodedId || p.id === id || p.title.toLowerCase().includes(decodedId.toLowerCase())
  )

  return staticItem || null
}

export async function generateStaticParams() {
  return allProjects.map((p) => ({
    id: p.id,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params
  const project = await getProjectData(id)

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested software engineering project could not be found.",
      robots: { index: false, follow: true },
    }
  }

  const title = `${project.title} | Software Project`
  const description = project.description
  const url = `https://ezedinmoh.pro.et/projects/${project.id}`
  const image = project.image || "https://ezedinmoh.pro.et/opengraph-image"

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${project.title} | Ezedin Mohammed`,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Ezedin Mohammed`,
      description,
      images: [image],
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params
  const project = await getProjectData(id)

  if (!project) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    image: project.image,
    url: `https://ezedinmoh.pro.et/projects/${project.id}`,
    applicationCategory: project.category.join(", "),
    operatingSystem: "Web Browser",
    author: {
      "@type": "Person",
      name: "Ezedin Mohammed",
      url: "https://ezedinmoh.pro.et",
    },
    ...(project.github ? { codeRepository: project.github } : {}),
    ...(project.liveUrl ? { installUrl: project.liveUrl } : {}),
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-28 pb-20 container mx-auto px-4 sm:px-6 relative">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Projects
          </Link>
        </div>

        {/* Header */}
        <header className="space-y-4 max-w-4xl mb-12">
          <div className="flex flex-wrap items-center gap-2">
            {project.category.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {cat}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-muted-foreground bg-secondary/60">
              <Calendar className="w-3 h-3" />
              {project.year}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {project.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/25"
              >
                Open Live Site <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-foreground font-medium text-sm hover:bg-secondary/80 border border-border transition-all"
              >
                <Github className="w-4 h-4" /> View Source Code
              </a>
            )}
          </div>
        </header>

        {/* Live Preview / Screenshot Display */}
        <div className="mb-16 rounded-3xl overflow-hidden border border-border/80 bg-card shadow-2xl">
          {project.liveUrl && project.previewMode === "iframe" ? (
            <div className="space-y-0">
              <div className="px-4 py-3 bg-secondary/40 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-3 font-mono text-xs text-muted-foreground truncate max-w-xs sm:max-w-md">
                    {project.liveUrl}
                  </span>
                </div>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-mono"
                >
                  Fullscreen <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div className="w-full aspect-[16/10] bg-background relative">
                <iframe
                  src={project.liveUrl}
                  title={`${project.title} Live Preview`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>
          ) : project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto object-cover max-h-[600px]"
            />
          ) : null}
        </div>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Technologies & Tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-xl text-sm bg-card border border-border/70 text-foreground font-mono"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Case Study Section */}
        {project.caseStudy && (
          <section className="space-y-8 mb-16">
            <h2 className="text-2xl font-bold text-foreground">Project Case Study</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {project.caseStudy.problem && (
                <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">The Challenge</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.caseStudy.problem}
                  </p>
                </div>
              )}

              {project.caseStudy.solution && (
                <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">The Solution</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.caseStudy.solution}
                  </p>
                </div>
              )}

              {project.caseStudy.outcome && (
                <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">The Outcome</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.caseStudy.outcome}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </main>
  )
}
