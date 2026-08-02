"use client"

import { useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    GripVertical, ChevronUp, ChevronDown, CheckCircle2,
    RefreshCw, Save, X, ShieldAlert, Sparkles, FolderKanban
} from "lucide-react"
import { toast } from "sonner"
import type { Project } from "@prisma/client"
import { ProjectsPreviewPane, PreviewToggleButton } from "@/components/admin/ProjectsPreviewPane"

export function ProjectsSorter({ projects: initial }: { projects: Project[] }) {
    const router = useRouter()

    const [saved, setSaved] = useState<Project[]>(() =>
        [...initial].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    )
    const [projects, setProjects] = useState<Project[]>(() =>
        [...initial].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    )
    const [isSaving, setIsSaving] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(true)
    const [previewKey, setPreviewKey] = useState(Date.now())
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
    const dragItem = useRef<number | null>(null)

    const hasChanges = useMemo(() =>
        projects.length !== saved.length || projects.some((p, i) => p.id !== saved[i]?.id),
        [projects, saved]
    )

    function move(id: string, dir: "up" | "down") {
        const idx = projects.findIndex(p => p.id === id)
        if (dir === "up" && idx === 0) return
        if (dir === "down" && idx === projects.length - 1) return
        const next = [...projects]
        const swap = dir === "up" ? idx - 1 : idx + 1
            ;[next[idx], next[swap]] = [next[swap], next[idx]]
        setProjects(next)
    }

    function handleDragStart(e: React.DragEvent, idx: number) {
        dragItem.current = idx
        setDraggedIdx(idx)
        e.dataTransfer.effectAllowed = "move"
    }
    function handleDragOver(e: React.DragEvent, idx: number) {
        e.preventDefault()
        if (dragItem.current === null || dragItem.current === idx) return
        const next = [...projects]
        const item = next[dragItem.current]
        next.splice(dragItem.current, 1)
        next.splice(idx, 0, item)
        dragItem.current = idx
        setDraggedIdx(idx)
        setProjects(next)
    }
    function handleDragEnd() {
        setDraggedIdx(null)
        dragItem.current = null
    }

    async function confirmSave() {
        setIsSaving(true)
        const items = projects.map((p, i) => ({ id: p.id, sortOrder: i }))
        try {
            const res = await fetch("/api/projects/reorder", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            })
            const data = await res.json().catch(() => ({}))
            if (res.ok && data.success !== false) {
                setSaved([...projects])
                setShowConfirm(false)
                // Force cache-busted reload — picked up by the useEffect in ProjectsPreviewPane
                setPreviewKey(Date.now())
                toast.success("Projects page order saved!", {
                    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
                })
                router.refresh()
            } else {
                throw new Error(data.message || "Save failed")
            }
        } catch (err) {
            setProjects([...saved])
            setShowConfirm(false)
            toast.error("Failed to save. Order reverted.", {
                description: err instanceof Error ? err.message : String(err),
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-secondary/30 border border-border rounded-xl text-xs text-muted-foreground">
                <span className="flex items-center gap-2 font-medium">
                    <GripVertical className="w-4 h-4 text-primary" />
                    Drag or use arrows to set display order on <strong className="text-foreground">/projects</strong>. Does not affect the home featured section.
                </span>
                <div className="flex items-center gap-2">
                    {hasChanges && (
                        <span className="flex items-center gap-1.5 font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20 animate-pulse">
                            <Sparkles className="w-3.5 h-3.5" /> Unsaved
                        </span>
                    )}
                    <PreviewToggleButton previewOpen={previewOpen} onToggle={() => setPreviewOpen(v => !v)} />
                </div>
            </div>

            {/* Split layout: list left, preview right on xl+ */}
            <div className={`grid gap-6 ${previewOpen ? "xl:grid-cols-[1fr_480px]" : "grid-cols-1"}`}>

                {/* ── Left: sortable list ── */}
                <div className="space-y-4 min-w-0">
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        {projects.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <FolderKanban className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p>No projects yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {projects.map((p, idx) => {
                                    const isDragging = draggedIdx === idx
                                    return (
                                        <div
                                            key={p.id}
                                            draggable
                                            onDragStart={e => handleDragStart(e, idx)}
                                            onDragOver={e => handleDragOver(e, idx)}
                                            onDragEnd={handleDragEnd}
                                            className={[
                                                "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 cursor-grab active:cursor-grabbing transition-all group",
                                                "border-b border-border/50 last:border-b-0",
                                                isDragging
                                                    ? "bg-primary/10 opacity-60 border-2 border-dashed border-primary"
                                                    : "hover:bg-secondary/20",
                                            ].join(" ")}
                                        >
                                            <GripVertical className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />

                                            <span className="text-xs font-bold text-muted-foreground tabular-nums w-5 text-center shrink-0">
                                                {idx + 1}
                                            </span>

                                            <div className="flex flex-col gap-0.5 shrink-0">
                                                <button type="button" onClick={() => move(p.id, "up")} disabled={idx === 0}
                                                    className="p-0.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20">
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button type="button" onClick={() => move(p.id, "down")} disabled={idx === projects.length - 1}
                                                    className="p-0.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20">
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {p.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={p.image} alt={p.title}
                                                    className="w-12 h-8 sm:w-14 sm:h-10 rounded-lg object-cover border border-border shrink-0" />
                                            ) : (
                                                <div className="w-12 h-8 sm:w-14 sm:h-10 rounded-lg bg-primary/10 border border-border shrink-0 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary">{p.title.charAt(0)}</span>
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-foreground text-sm truncate">{p.title}</p>
                                                    {p.featured && (
                                                        <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate hidden sm:block">
                                                    {p.category.join(", ")} · {p.year}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Floating save bar */}
                    {hasChanges && (
                        <div className="sticky bottom-6 z-40 p-3 sm:p-4 bg-card border-2 border-primary/40 rounded-2xl shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-sm">Unsaved Projects Order</p>
                                    <p className="text-xs text-muted-foreground hidden sm:block">Save to update the /projects page.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <button type="button" onClick={() => setProjects([...saved])} disabled={isSaving}
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-xs font-medium transition-all">
                                    <X className="w-3.5 h-3.5" /> Discard
                                </button>
                                <button type="button" onClick={() => setShowConfirm(true)} disabled={isSaving}
                                    className="flex items-center gap-2 px-3 sm:px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-xs font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105">
                                    <Save className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Save Projects Order</span>
                                    <span className="sm:hidden">Save</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Inline preview on mobile/tablet (below the list, < xl) */}
                    {previewOpen && (
                        <div className="xl:hidden">
                            <ProjectsPreviewPane
                                previewKey={previewKey}
                                previewUrl="/projects"
                                previewLabel="LIVE PREVIEW — /projects"
                                onRefresh={() => setPreviewKey(Date.now())}
                                inlineMode
                            />
                        </div>
                    )}
                </div>

                {/* ── Right: sticky preview on xl+ ── */}
                {previewOpen && (
                    <div className="hidden xl:block">
                        <ProjectsPreviewPane
                            previewKey={previewKey}
                            previewUrl="/projects"
                            previewLabel="LIVE PREVIEW — /projects"
                            onRefresh={() => setPreviewKey(Date.now())}
                        />
                    </div>
                )}
            </div>

            {/* Confirm modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                    onClick={() => !isSaving && setShowConfirm(false)}>
                    <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-lg">Save Projects Order?</h3>
                                <p className="text-xs text-muted-foreground">Updates /projects page grid order</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            This will reorder all projects on the <strong>/projects</strong> page. The home featured section is unaffected.
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button onClick={() => setShowConfirm(false)} disabled={isSaving}
                                className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-xs font-medium transition-all">
                                Cancel
                            </button>
                            <button onClick={confirmSave} disabled={isSaving}
                                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-xs font-semibold transition-all disabled:opacity-50">
                                {isSaving
                                    ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                                    : <><CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Save</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
