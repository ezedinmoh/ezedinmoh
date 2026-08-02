"use client"

import { useState } from "react"
import { ArrowLeft, Star, FolderKanban } from "lucide-react"
import Link from "next/link"
import { FeaturedSorter } from "@/components/admin/FeaturedSorter"
import { ProjectsSorter } from "@/components/admin/ProjectsSorter"
import { cn } from "@/lib/utils"
import type { Project } from "@prisma/client"

type ProjectWithFeaturedOrder = Project & { featuredSortOrder?: number | null }
type Tab = "featured" | "projects"

export function SortPageClient({ projects }: { projects: ProjectWithFeaturedOrder[] }) {
    const [tab, setTab] = useState<Tab>("featured")

    const featuredCount = projects.filter(p => p.featured).length

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/projects"
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                        title="Back to Projects"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Sort Projects</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Set display order for the home page featured section and the /projects page independently.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 p-1 bg-secondary/40 border border-border rounded-xl w-fit">
                <button
                    onClick={() => setTab("featured")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        tab === "featured"
                            ? "bg-card text-foreground shadow-sm border border-border"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Star className={cn("w-4 h-4", tab === "featured" ? "text-yellow-400" : "text-muted-foreground")} />
                    Featured Section
                    <span className={cn(
                        "ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                        tab === "featured"
                            ? "bg-yellow-400/15 text-yellow-400 border border-yellow-400/30"
                            : "bg-secondary text-muted-foreground"
                    )}>
                        {featuredCount}
                    </span>
                </button>

                <button
                    onClick={() => setTab("projects")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        tab === "projects"
                            ? "bg-card text-foreground shadow-sm border border-border"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <FolderKanban className={cn("w-4 h-4", tab === "projects" ? "text-primary" : "text-muted-foreground")} />
                    Projects Page
                    <span className={cn(
                        "ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                        tab === "projects"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-secondary text-muted-foreground"
                    )}>
                        {projects.length}
                    </span>
                </button>
            </div>

            {/* Tab description */}
            <div className={cn(
                "flex items-start gap-3 px-4 py-3 rounded-xl border text-xs",
                tab === "featured"
                    ? "bg-yellow-400/5 border-yellow-400/20 text-yellow-300"
                    : "bg-primary/5 border-primary/20 text-primary"
            )}>
                {tab === "featured" ? (
                    <>
                        <Star className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                            <strong>Featured Section order</strong> — controls the display order in the &quot;Featured Projects&quot; section on the home page.
                            The first project becomes the large Hero card. Only featured-marked projects appear here.
                            This order is <em>independent</em> from the Projects page.
                        </span>
                    </>
                ) : (
                    <>
                        <FolderKanban className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                            <strong>Projects Page order</strong> — controls the display order on the <strong>/projects</strong> page grid.
                            All projects appear here. This order is <em>independent</em> from the home featured section.
                        </span>
                    </>
                )}
            </div>

            {/* Active tab content */}
            {tab === "featured" && <FeaturedSorter projects={projects} />}
            {tab === "projects" && <ProjectsSorter projects={projects} />}
        </div>
    )
}
