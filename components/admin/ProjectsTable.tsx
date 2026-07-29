"use client"

import { useState, useRef, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Pencil, Trash2, Star, ChevronUp, ChevronDown,
  GripVertical, CheckCircle2, AlertCircle, RefreshCw,
  Save, X, ShieldAlert, Sparkles
} from "lucide-react"
import { toast } from "sonner"
import type { Project } from "@prisma/client"

export function ProjectsTable({ projects: initial }: { projects: Project[] }) {
  const router = useRouter()

  // Track saved baseline vs pending UI changes
  const [savedProjects, setSavedProjects] = useState<Project[]>(() =>
    [...initial].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  )
  const [projects, setProjects] = useState<Project[]>(() =>
    [...initial].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  )

  // UI state
  const [deleting, setDeleting] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Drag-and-drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const dragItem = useRef<number | null>(null)

  // Check if there are unsaved order changes
  const hasUnsavedChanges = useMemo(() => {
    if (projects.length !== savedProjects.length) return true
    return projects.some((p, i) => p.id !== savedProjects[i]?.id)
  }, [projects, savedProjects])

  /** Move project up or down 1 step */
  function handleMove(id: string, direction: "up" | "down") {
    const idx = projects.findIndex(p => p.id === id)
    if (direction === "up" && idx === 0) return
    if (direction === "down" && idx === projects.length - 1) return

    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    const updated = [...projects]
    ;[updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]]

    const reordered = updated.map((p, i) => ({ ...p, sortOrder: i }))
    setProjects(reordered)
  }

  /** Set project as Hero (moves to top position 0 and marks featured) */
  function handleSetHero(id: string) {
    const targetIdx = projects.findIndex(p => p.id === id)
    if (targetIdx === -1) return

    const targetProject = { ...projects[targetIdx], featured: true }
    const remaining = projects.filter(p => p.id !== id)
    const updated = [targetProject, ...remaining].map((p, i) => ({ ...p, sortOrder: i }))

    setProjects(updated)
    toast.info(`" ${targetProject.title}" staged as Hero card. Click 'Save Order & Apply' to commit.`)
  }

  /** Revert unsaved drag/arrow changes back to saved database state */
  function handleDiscardChanges() {
    setProjects(savedProjects)
    toast.info("Reverted unsaved order changes.")
  }

  /** Submit new order array to Database & Client */
  async function handleConfirmSaveOrder() {
    setIsSaving(true)
    const items = projects.map((p, i) => ({
      id: p.id,
      sortOrder: i,
    }))

    try {
      const res = await fetch("/api/projects/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && (data.success !== false)) {
        setSavedProjects(projects)
        setShowConfirmModal(false)
        toast.success("Project order successfully saved to database & client website!", {
          description: "All client pages updated with the new order.",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        })
        router.refresh()
      } else {
        throw new Error(data.message || "Failed to update project order in database.")
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error("Reorder failed:", errorMsg)
      
      // Rollback to saved order
      setProjects(savedProjects)
      setShowConfirmModal(false)
      toast.error("Failed to save project order!", {
        description: `Error: ${errorMsg}. Reverted to original saved order.`,
        icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      })
    } finally {
      setIsSaving(false)
    }
  }

  /** Delete project handler */
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) {
        const updated = projects.filter(x => x.id !== id).map((p, i) => ({ ...p, sortOrder: i }))
        setProjects(updated)
        setSavedProjects(updated)
        toast.success("Project deleted successfully.")
        router.refresh()
      } else {
        toast.error("Failed to delete project.")
      }
    } catch (err) {
      toast.error("Error deleting project.")
    } finally {
      setDeleting(null)
    }
  }

  /** Drag and Drop handlers */
  function handleDragStart(e: React.DragEvent, idx: number) {
    dragItem.current = idx
    setDraggedIdx(idx)
    e.dataTransfer.effectAllowed = "move"
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragItem.current === null || dragItem.current === idx) return

    const updated = [...projects]
    const itemToMove = updated[dragItem.current]
    updated.splice(dragItem.current, 1)
    updated.splice(idx, 0, itemToMove)

    dragItem.current = idx
    setDraggedIdx(idx)
    setDragOverIdx(idx)

    const reordered = updated.map((p, i) => ({ ...p, sortOrder: i }))
    setProjects(reordered)
  }

  function handleDragEnd() {
    setDraggedIdx(null)
    setDragOverIdx(null)
    dragItem.current = null
  }

  // Hero project is index 0 among featured projects
  const featuredSorted = projects.filter(p => p.featured)
  const heroIds = new Set(
    Array.from({ length: Math.ceil(featuredSorted.length / 6) }, (_, gi) =>
      featuredSorted[gi * 6]?.id
    ).filter(Boolean)
  )

  return (
    <div className="relative space-y-4">
      {/* Top Banner / Drag Guidance */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-secondary/30 border border-border rounded-xl text-xs text-muted-foreground">
        <span className="flex items-center gap-2 font-medium">
          <GripVertical className="w-4 h-4 text-primary" />
          Drag rows or use arrow buttons to reorder. The #1 project becomes the main Hero card on client.
        </span>
        {hasUnsavedChanges && (
          <span className="flex items-center gap-1.5 font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Unsaved order changes
          </span>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {/* Desktop Table */}
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
                    <td className="px-3 py-3 text-center">
                      <GripVertical className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors mx-auto" />
                    </td>

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

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        {!isHero && (
                          <button
                            onClick={() => handleSetHero(p.id)}
                            title="Set as Hero Card (Move to top)"
                            className="p-1.5 text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all"
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

        {/* Mobile/Tablet List */}
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
                        title="Set as Hero"
                        className="p-2 text-muted-foreground hover:text-yellow-400 transition-colors"
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

      {/* Floating Unsaved Changes Action Bar */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-6 z-40 p-4 bg-card border-2 border-primary/40 rounded-2xl shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Unsaved Order Changes</p>
              <p className="text-xs text-muted-foreground">
                You reordered projects. Click &quot;Save Order &amp; Apply&quot; to push changes to database and live client website.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={handleDiscardChanges}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-xs font-medium transition-all"
            >
              <X className="w-4 h-4" /> Discard
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-xs font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105"
            >
              <Save className="w-4 h-4" /> Save Order &amp; Apply
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal Dialog */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={() => !isSaving && setShowConfirmModal(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Confirm Project Order?</h3>
                <p className="text-xs text-muted-foreground">Update sequence across database &amp; client</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to apply this new project order? This will update PostgreSQL and immediately reorder cards on the portfolio homepage and projects page.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
                className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-xs font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSaveOrder}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-xs font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving to Database...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Confirm &amp; Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
