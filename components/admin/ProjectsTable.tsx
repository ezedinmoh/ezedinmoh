"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Star, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Project } from "@prisma/client"

export function ProjectsTable({ projects: initial }: { projects: Project[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(
    [...initial].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  )
  const [deleting, setDeleting] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Hero = first featured project
  const firstFeatured = projects.find(p => p.featured)

  async function handleToggleFeatured(id: string, currentFeatured: boolean) {
    setTogglingId(id)
    const nextFeatured = !currentFeatured
    // Optimistic UI update
    setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: nextFeatured } : p))
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: nextFeatured }),
      })
      if (res.ok) {
        toast.success(
          nextFeatured
            ? "Project marked as Featured on home page!"
            : "Project hidden from Featured section."
        )
        router.refresh()
      } else {
        throw new Error("Failed to update status")
      }
    } catch {
      // Revert optimistic update
      setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: currentFeatured } : p))
      toast.error("Failed to update featured status.")
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProjects(prev => prev.filter(x => x.id !== id))
        toast.success("Project deleted.")
        router.refresh()
      } else {
        toast.error("Failed to delete project.")
      }
    } catch {
      toast.error("Error deleting project.")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium w-8">#</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Title</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Category</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Year</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((p, idx) => {
              const isHero = p.id === firstFeatured?.id
              return (
                <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{idx + 1}</td>

                  <td className="px-4 py-3 cursor-pointer group/title"
                    onClick={() => router.push(`/admin/projects/${p.id}`)}>
                    <div className="flex items-center gap-2">
                      {isHero && (
                        <span className="px-2 py-0.5 bg-yellow-400/15 text-yellow-400 text-xs rounded-full border border-yellow-400/30 font-semibold shrink-0">
                          Hero
                        </span>
                      )}
                      <span className="font-semibold text-foreground group-hover/title:text-primary group-hover/title:underline truncate max-w-xs">
                        {p.title}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => router.push(`/admin/projects/${p.id}`)}>
                    {p.category.join(", ")}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground tabular-nums cursor-pointer hover:text-foreground"
                    onClick={() => router.push(`/admin/projects/${p.id}`)}>
                    {p.year}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={togglingId === p.id}
                      onClick={() => handleToggleFeatured(p.id, Boolean(p.featured))}
                      title={p.featured ? "Currently visible in Featured — Click to hide from home page" : "Currently hidden from Featured — Click to make visible on home page"}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        p.featured
                          ? "bg-yellow-400/15 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/25"
                          : "bg-secondary text-muted-foreground/60 border border-border hover:text-foreground hover:bg-secondary/80"
                      } disabled:opacity-50`}
                    >
                      {togglingId === p.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Star className={`w-3 h-3 ${p.featured ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`} />
                      )}
                      <span>{p.featured ? "Featured" : "Hidden"}</span>
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/projects/${p.id}`}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-40">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No projects yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="lg:hidden divide-y divide-border">
        {projects.length === 0 && (
          <p className="px-4 py-10 text-center text-muted-foreground text-sm">No projects yet</p>
        )}
        {projects.map((p, idx) => {
          const isHero = p.id === firstFeatured?.id
          return (
            <div key={p.id} className="p-4 flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground tabular-nums w-5 shrink-0">{idx + 1}</span>

              <div className="flex-1 min-w-0 cursor-pointer group/card"
                onClick={() => router.push(`/admin/projects/${p.id}`)}>
                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                  {isHero && (
                    <span className="px-1.5 py-0.5 bg-yellow-400/15 text-yellow-400 text-[10px] rounded-full border border-yellow-400/30 font-semibold">
                      Hero
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={togglingId === p.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleFeatured(p.id, Boolean(p.featured))
                    }}
                    title={p.featured ? "Click to hide from featured" : "Click to feature"}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 transition-all ${
                      p.featured
                        ? "bg-yellow-400/15 text-yellow-400 border-yellow-400/30"
                        : "bg-secondary text-muted-foreground/60 border-border"
                    } disabled:opacity-50`}
                  >
                    {togglingId === p.id ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : (
                      <Star className={`w-2.5 h-2.5 ${p.featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    )}
                    <span>{p.featured ? "Featured" : "Hidden"}</span>
                  </button>
                </div>
                <p className="font-semibold text-foreground group-hover/card:text-primary group-hover/card:underline text-sm truncate">
                  {p.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.category.join(", ")} · {p.year}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/projects/${p.id}`}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
