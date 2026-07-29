"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Star, ChevronUp, ChevronDown, GripVertical, Check, Loader2 } from "lucide-react"
import type { Project } from "@prisma/client"

export function ProjectsTable({ projects: initial }: { projects: Project[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(() =>
    [...initial].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  )
  const [deleting, setDeleting] = useState<string | null>(null)
  const [settingHero, setSettingHero] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Drag-and-drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const dragItem = useRef<number | null>(null)

  /** Persist current array order to backend without causing lagging router.refresh() */
  async function persistOrder(updatedList: Project[]) {
    setSavingOrder(true)
    setSavedSuccess(false)

    const items = updatedList.map((p, i) => ({
      id: p.id,
      sortOrder: i,
    }))

    try {
      const res = await fetch("/api/projects/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      if (res.ok) {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 2000)
      }
    } catch (err) {
      console.error("Failed to persist order:", err)
    } finally {
      setSavingOrder(false)
    }
  }

  /** Handle instant item movement via Arrow buttons */
  function handleMove(id: string, direction: "up" | "down") {
    const idx = projects.findIndex(p => p.id === id)
    if (direction === "up" && idx === 0) return
    if (direction === "down" && idx === projects.length - 1) return

    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    const updated = [...projects]
    ;[updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]]

    // Assign clean 0..N sortOrder
    const reordered = updated.map((p, i) => ({ ...p, sortOrder: i }))
    setProjects(reordered)
    persistOrder(reordered)
  }

  /** Set target project as top Hero (index 0) cleanly without index hacks */
  async function handleSetHero(id: string) {
    setSettingHero(id)
    const targetIdx = projects.findIndex(p => p.id === id)
    if (targetIdx === -1) return

    const targetProject = { ...projects[targetIdx], featured: true }
    const remaining = projects.filter(p => p.id !== id)
    
    // Put target project at position 0 (Main Hero slot)
    const updated = [targetProject, ...remaining].map((p, i) => ({ ...p, sortOrder: i }))
    
    setProjects(updated)

    // Update featured status in DB if needed
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: true }),
      })
      await persistOrder(updated)
    } catch (err) {
      console.error("Failed to set hero project:", err)
    } finally {
      setSettingHero(null)
      router.refresh()
    }
  }

  /** Delete project handler */
  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return
    setDeleting(id)
    await fetch(`/api/projects/${id}`, { method: "DELETE" })
    const updated = projects.filter(x => x.id !== id).map((p, i) => ({ ...p, sortOrder: i }))
    setProjects(updated)
    setDeleting(null)
    await persistOrder(updated)
    router.refresh()
  }

  /** HTML5 Drag Handlers */
  function handleDragStart(e: React.DragEvent, idx: number) {
    dragItem.current = idx
    setDraggedIdx(idx)
    e.dataTransfer.effectAllowed = "move"
    // Transparent or custom drag preview handle
    if (e.dataTransfer.setDragImage) {
      const ghost = e.currentTarget as HTMLElement
      e.dataTransfer.setDragImage(ghost, 20, 20)
    }
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragItem.current === null || dragItem.current === idx) return

    const updated = [...projects]
    const draggedItem = updated[dragItem.current]
    updated.splice(dragItem.current, 1)
    updated.splice(idx, 0, draggedItem)

    dragItem.current = idx
    setDraggedIdx(idx)
    setDragOverIdx(idx)

    // Assign sequential sortOrder
    const reordered = updated.map((p, i) => ({ ...p, sortOrder: i }))
    setProjects(reordered)
  }

  function handleDragEnd() {
    setDraggedIdx(null)
    setDragOverIdx(null)
    if (dragItem.current !== null) {
      dragItem.current = null
      persistOrder(projects)
    }
  }

  // Hero project is index 0 among featured projects (or overall index 0)
  const featuredSorted = projects.filter(p => p.featured)
  const heroIds = new Set(
    Array.from({ length: Math.ceil(featuredSorted.length / 6) }, (_, gi) =>
      featuredSorted[gi * 6]?.id
    ).filter(Boolean)
  )

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Header status indicator */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/20 border-b border-border text-xs text-muted-foreground">
        <span className="flex items-center gap-2 font-medium">
          <GripVertical className="w-3.5 h-3.5 text-primary" />
          Drag rows or use arrows to reorder projects anywhere
        </span>
        <div className="flex items-center gap-2">
          {savingOrder && (
            <span className="flex items-center gap-1.5 text-primary animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving order...
            </span>
          )}
          {savedSuccess && (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Check className="w-3.5 h-3.5" /> Order saved
            </span>
          )}
        </div>
      </div>

      {/* Desktop table — lg+ only */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40">
            <tr>
              <th className="px-3 py-3 w-10" />
              <th className="text-left px-3 py-3 text-muted-foreground font-medium w-16">Order</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Title</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Category</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Year</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((p, idx) => {
              const isHero = heroIds.has(p.id) || idx === 0
              const isDragging = draggedIdx === idx

              return (
                <tr
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`group transition-all duration-200 cursor-grab active:cursor-grabbing ${
                    isDragging
                      ? "bg-primary/10 opacity-60 border-2 border-primary border-dashed"
                      : dragOverIdx === idx
                      ? "bg-secondary/40"
                      : "hover:bg-secondary/20"
                  }`}
                >
                  {/* Drag handle */}
                  <td className="px-3 py-3 text-center">
                    <GripVertical className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors mx-auto" />
                  </td>

                  {/* Order controls */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground font-semibold tabular-nums w-4 text-center">
                        {idx + 1}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => handleMove(p.id, "up")}
                          disabled={idx === 0}
                          title="Move up"
                          className="p-0.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(p.id, "down")}
                          disabled={idx === projects.length - 1}
                          title="Move down"
                          className="p-0.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Title & Badges */}
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {isHero && (
                        <span className="px-2 py-0.5 bg-yellow-400/15 text-yellow-400 text-xs rounded-full border border-yellow-400/30 font-semibold shadow-sm">
                          Hero Card
                        </span>
                      )}
                      <span className="truncate max-w-xs">{p.title}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">{p.category.join(", ")}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{p.year}</td>
                  
                  <td className="px-4 py-3">
                    {p.featured && (
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        Featured
                      </span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {!isHero && (
                        <button
                          onClick={() => handleSetHero(p.id)}
                          disabled={settingHero === p.id}
                          title="Set as Hero Card (Move to top)"
                          className="p-1.5 text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all disabled:opacity-40"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No projects yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/tablet card list with drag-and-drop & arrows */}
      <div className="lg:hidden divide-y divide-border">
        {projects.length === 0 && (
          <p className="px-4 py-8 text-center text-muted-foreground text-sm">No projects yet</p>
        )}
        {projects.map((p, idx) => {
          const isHero = heroIds.has(p.id) || idx === 0
          const isDragging = draggedIdx === idx

          return (
            <div
              key={p.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`p-4 space-y-2 cursor-grab active:cursor-grabbing transition-all ${
                isDragging ? "bg-primary/10 opacity-60 border-2 border-primary border-dashed" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                  <span className="text-xs font-bold text-muted-foreground tabular-nums">{idx + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    {isHero && (
                      <span className="px-2 py-0.5 bg-yellow-400/15 text-yellow-400 text-xs rounded-full border border-yellow-400/30 font-semibold">
                        Hero Card
                      </span>
                    )}
                    {p.featured && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-foreground text-sm truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.category.join(", ")} · {p.year}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Up/Down buttons */}
                  <div className="flex flex-col gap-0.5 mr-1">
                    <button
                      onClick={() => handleMove(p.id, "up")}
                      disabled={idx === 0}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(p.id, "down")}
                      disabled={idx === projects.length - 1}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {!isHero && (
                    <button
                      onClick={() => handleSetHero(p.id)}
                      disabled={settingHero === p.id}
                      title="Set as Hero"
                      className="p-2 text-muted-foreground hover:text-yellow-400 transition-colors disabled:opacity-40"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
