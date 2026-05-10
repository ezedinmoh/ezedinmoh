"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Star, ChevronUp, ChevronDown } from "lucide-react"
import type { Project } from "@prisma/client"

export function ProjectsTable({ projects: initial }: { projects: Project[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState(
    [...initial].sort((a, b) => a.sortOrder - b.sortOrder)
  )
  const [deleting, setDeleting]     = useState<string | null>(null)
  const [settingHero, setSettingHero] = useState<string | null>(null)
  const [moving, setMoving]         = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return
    setDeleting(id)
    await fetch(`/api/projects/${id}`, { method: "DELETE" })
    setProjects(p => p.filter(x => x.id !== id))
    setDeleting(null)
    router.refresh()
  }

  async function handleSetHero(id: string) {
    setSettingHero(id)
    const items = projects
      .filter(p => p.featured)
      .map((p, i) => ({ id: p.id, sortOrder: p.id === id ? -1 : i }))

    await fetch("/api/projects/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })

    setProjects(prev => prev.map(p =>
      !p.featured ? p :
      p.id === id ? { ...p, sortOrder: -1 } :
      { ...p, sortOrder: Math.max(0, p.sortOrder) }
    ))
    setSettingHero(null)
    router.refresh()
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const idx = projects.findIndex(p => p.id === id)
    if (direction === "up"   && idx === 0) return
    if (direction === "down" && idx === projects.length - 1) return

    setMoving(id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    const updated = [...projects]
    // Swap positions
    ;[updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]]
    // Reassign sortOrder based on new positions
    const reordered = updated.map((p, i) => ({ ...p, sortOrder: i }))
    setProjects(reordered)

    await fetch("/api/projects/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: reordered.map(p => ({ id: p.id, sortOrder: p.sortOrder })),
      }),
    })

    setMoving(null)
    router.refresh()
  }

  // Hero = lowest sortOrder per group of 6
  const featuredSorted = [...projects]
    .filter(p => p.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const heroIds = new Set(
    Array.from({ length: Math.ceil(featuredSorted.length / 6) }, (_, gi) =>
      featuredSorted[gi * 6]?.id
    ).filter(Boolean)
  )

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Desktop table — lg+ only */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium w-10">Order</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Title</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Category</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Year</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.map((p, idx) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                {/* Order controls */}
                <td className="px-2 py-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <button
                      onClick={() => handleMove(p.id, "up")}
                      disabled={idx === 0 || moving === p.id}
                      title="Move up"
                      className="p-0.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-muted-foreground/50 tabular-nums">{idx + 1}</span>
                    <button
                      onClick={() => handleMove(p.id, "down")}
                      disabled={idx === projects.length - 1 || moving === p.id}
                      title="Move down"
                      className="p-0.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {heroIds.has(p.id) && (
                      <span className="px-2 py-0.5 bg-yellow-400/15 text-yellow-400 text-xs rounded-full border border-yellow-400/30">Hero</span>
                    )}
                    {p.title}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category.join(", ")}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.year}</td>
                <td className="px-4 py-3">
                  {p.featured && <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Featured</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    {p.featured && !heroIds.has(p.id) && (
                      <button onClick={() => handleSetHero(p.id)} disabled={settingHero === p.id} title="Set as hero card"
                        className="p-1.5 text-muted-foreground hover:text-yellow-400 transition-colors disabled:opacity-40">
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <Link href={`/admin/projects/${p.id}`} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                      className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No projects yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/tablet card list */}
      <div className="lg:hidden divide-y divide-border">
        {projects.length === 0 && (
          <p className="px-4 py-8 text-center text-muted-foreground text-sm">No projects yet</p>
        )}
        {projects.map((p, idx) => (
          <div key={p.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  {heroIds.has(p.id) && (
                    <span className="px-2 py-0.5 bg-yellow-400/15 text-yellow-400 text-xs rounded-full border border-yellow-400/30">Hero</span>
                  )}
                  {p.featured && <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Featured</span>}
                </div>
                <p className="font-medium text-foreground text-sm truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.category.join(", ")} · {p.year}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {/* Up/Down on mobile */}
                <div className="flex flex-col gap-0.5 mr-1">
                  <button
                    onClick={() => handleMove(p.id, "up")}
                    disabled={idx === 0 || moving === p.id}
                    className="p-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(p.id, "down")}
                    disabled={idx === projects.length - 1 || moving === p.id}
                    className="p-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                {p.featured && !heroIds.has(p.id) && (
                  <button onClick={() => handleSetHero(p.id)} disabled={settingHero === p.id} title="Set as hero"
                    className="p-2 text-muted-foreground hover:text-yellow-400 transition-colors disabled:opacity-40">
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <Link href={`/admin/projects/${p.id}`} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
