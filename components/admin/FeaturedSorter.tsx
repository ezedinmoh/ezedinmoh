"use client"

import { useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    GripVertical, ChevronUp, ChevronDown, CheckCircle2,
    RefreshCw, Save, X, ShieldAlert, Sparkles, Star, EyeOff, Plus
} from "lucide-react"
import { toast } from "sonner"
import type { Project } from "@prisma/client"
import { ProjectsPreviewPane, PreviewToggleButton } from "@/components/admin/ProjectsPreviewPane"

type ProjectWithFeaturedOrder = Project & { featuredSortOrder?: number | null }

const GROUP_SIZE = 6

/** Index of the hero within a group (always position 0 of that group) */
function getGroupHeroIdx(idx: number) {
    return Math.floor(idx / GROUP_SIZE) * GROUP_SIZE
}

export function FeaturedSorter({ projects: initial }: { projects: ProjectWithFeaturedOrder[] }) {
    const router = useRouter()

    const sortFeatured = (arr: ProjectWithFeaturedOrder[]) =>
        [...arr].filter(p => p.featured).sort((a, b) =>
            ((a.featuredSortOrder ?? a.sortOrder ?? 0) - (b.featuredSortOrder ?? b.sortOrder ?? 0))
        )

    const sortUnfeatured = (arr: ProjectWithFeaturedOrder[]) =>
        [...arr].filter(p => !p.featured).sort((a, b) =>
            ((a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        )

    const [savedFeatured, setSavedFeatured] = useState<ProjectWithFeaturedOrder[]>(() => sortFeatured(initial))
    const [savedUnfeatured, setSavedUnfeatured] = useState<ProjectWithFeaturedOrder[]>(() => sortUnfeatured(initial))

    const [projects, setProjects] = useState<ProjectWithFeaturedOrder[]>(() => sortFeatured(initial))
    const [unfeaturedProjects, setUnfeaturedProjects] = useState<ProjectWithFeaturedOrder[]>(() => sortUnfeatured(initial))

    const [isSaving, setIsSaving] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(true)
    const [previewKey, setPreviewKey] = useState(Date.now())
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
    const dragItem = useRef<number | null>(null)

    const hasChanges = useMemo(() => {
        if (projects.length !== savedFeatured.length || unfeaturedProjects.length !== savedUnfeatured.length) {
            return true
        }
        const featuredChanged = projects.some((p, i) => p.id !== savedFeatured[i]?.id)
        const unfeaturedChanged = unfeaturedProjects.some((p, i) => p.id !== savedUnfeatured[i]?.id)
        return featuredChanged || unfeaturedChanged
    }, [projects, savedFeatured, unfeaturedProjects, savedUnfeatured])

    /** Move a project up or down by 1 within featured list */
    function move(id: string, dir: "up" | "down") {
        const idx = projects.findIndex(p => p.id === id)
        if (dir === "up" && idx === 0) return
        if (dir === "down" && idx === projects.length - 1) return
        const next = [...projects]
        const swap = dir === "up" ? idx - 1 : idx + 1
            ;[next[idx], next[swap]] = [next[swap], next[idx]]
        setProjects(next)
    }

    /** Hide a project from Featured -> moves to unfeaturedProjects */
    function hideFromFeatured(id: string) {
        const item = projects.find(p => p.id === id)
        if (!item) return
        setProjects(prev => prev.filter(p => p.id !== id))
        setUnfeaturedProjects(prev => [{ ...item, featured: false }, ...prev])
        toast.info(`"${item.title}" hidden from Featured — save to apply.`)
    }

    /** Add an unfeatured project to Featured -> appends to featured projects */
    function addToFeatured(id: string) {
        const item = unfeaturedProjects.find(p => p.id === id)
        if (!item) return
        setUnfeaturedProjects(prev => prev.filter(p => p.id !== id))
        setProjects(prev => [...prev, { ...item, featured: true, featuredSortOrder: prev.length }])
        toast.info(`"${item.title}" added to Featured — save to apply.`)
    }

    /** Discard all changes */
    function discardChanges() {
        setProjects([...savedFeatured])
        setUnfeaturedProjects([...savedUnfeatured])
    }

    /**
     * Set a project as the Hero of its group.
     * Moves the project to the first position of its group (index groupStart),
     * shifting the previous hero down by one.
     */
    function setGroupHero(id: string) {
        const idx = projects.findIndex(p => p.id === id)
        if (idx < 0) return
        const groupStart = getGroupHeroIdx(idx)
        if (idx === groupStart) return // already hero

        const next = [...projects]
        // Remove from current position and re-insert at group start
        const [item] = next.splice(idx, 1)
        next.splice(groupStart, 0, item)
        setProjects(next)
        toast.info(`"${item.title}" set as Group ${Math.floor(idx / GROUP_SIZE) + 1} Hero — save to apply.`)
    }

    /* ── Drag handlers ── */
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

    /* ── Save ── */
    async function confirmSave() {
        setIsSaving(true)
        const items = projects.map((p, i) => ({ id: p.id, featuredSortOrder: i, featured: true }))
        const hiddenIds = unfeaturedProjects.map(p => p.id)
        try {
            const res = await fetch("/api/projects/reorder-featured", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, hiddenIds }),
            })
            const data = await res.json().catch(() => ({}))
            if (res.ok && data.success !== false) {
                setSavedFeatured([...projects])
                setSavedUnfeatured([...unfeaturedProjects])
                setShowConfirm(false)
                // Force a hard cache-busted refresh so the preview picks up the new DB order
                setPreviewKey(Date.now())
                toast.success("Featured projects and order saved — home page updated!", {
                    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
                })
                router.refresh()
            } else {
                throw new Error(data.message || "Save failed")
            }
        } catch (err) {
            discardChanges()
            setShowConfirm(false)
            toast.error("Failed to save. Changes reverted.", {
                description: err instanceof Error ? err.message : String(err),
            })
        } finally {
            setIsSaving(false)
        }
    }

    /* ── Group headers: show divider + label before each group of 6 ── */
    function renderGroupDivider(idx: number) {
        if (idx % GROUP_SIZE !== 0) return null
        const groupNum = Math.floor(idx / GROUP_SIZE) + 1
        return (
            <div key={`group-${groupNum}`}
                className="flex items-center gap-3 px-4 py-2 bg-secondary/40 border-b border-border">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Group {groupNum}
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                    ({Math.min(GROUP_SIZE, projects.length - (groupNum - 1) * GROUP_SIZE)} projects · positions {(groupNum - 1) * GROUP_SIZE + 1}–{Math.min(groupNum * GROUP_SIZE, projects.length)})
                </span>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-yellow-400/70 font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" /> Star = Set Hero
                </span>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-secondary/30 border border-border rounded-xl text-xs text-muted-foreground">
                <span className="flex items-center gap-2 font-medium">
                    <GripVertical className="w-4 h-4 text-primary" />
                    Drag or use arrows to reorder. Click <Star className="w-3.5 h-3.5 inline text-yellow-400 mx-0.5" /> to set the Hero for that group of 6.
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

            {/* Split layout */}
            <div className={`grid gap-6 ${previewOpen ? "xl:grid-cols-[1fr_480px]" : "grid-cols-1"}`}>

                {/* ── Left: sortable list ── */}
                <div className="space-y-4 min-w-0">
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        {projects.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="font-medium text-sm">No featured projects yet</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Click &quot;+ Add to Featured&quot; below to feature projects on the home page.
                                </p>
                            </div>
                        ) : (
                            projects.map((p, idx) => {
                                const isDragging = draggedIdx === idx
                                const groupStart = getGroupHeroIdx(idx)
                                const isGroupHero = idx === groupStart
                                const groupNum = Math.floor(idx / GROUP_SIZE) + 1

                                return (
                                    <div key={p.id}>
                                        {/* Group divider before first item of each group */}
                                        {renderGroupDivider(idx)}

                                        <div
                                            draggable
                                            onDragStart={e => handleDragStart(e, idx)}
                                            onDragOver={e => handleDragOver(e, idx)}
                                            onDragEnd={handleDragEnd}
                                            className={[
                                                "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 cursor-grab active:cursor-grabbing transition-all group",
                                                "border-b border-border/50 last:border-b-0",
                                                isDragging
                                                    ? "bg-primary/10 opacity-60 border-2 border-dashed border-primary"
                                                    : isGroupHero
                                                        ? "bg-yellow-400/5 hover:bg-yellow-400/10"
                                                        : "hover:bg-secondary/20",
                                            ].join(" ")}
                                        >
                                            {/* Drag handle */}
                                            <GripVertical className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />

                                            {/* Position number */}
                                            <span className="text-xs font-bold text-muted-foreground tabular-nums w-5 text-center shrink-0">
                                                {idx + 1}
                                            </span>

                                            {/* Arrow buttons */}
                                            <div className="flex flex-col gap-0.5 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => move(p.id, "up")}
                                                    disabled={idx === 0}
                                                    className="p-0.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20"
                                                >
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => move(p.id, "down")}
                                                    disabled={idx === projects.length - 1}
                                                    className="p-0.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-20"
                                                >
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Thumbnail */}
                                            {p.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={p.image} alt={p.title}
                                                    className="w-12 h-8 sm:w-14 sm:h-10 rounded-lg object-cover border border-border shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-8 sm:w-14 sm:h-10 rounded-lg bg-primary/10 border border-border shrink-0 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary">{p.title.charAt(0)}</span>
                                                </div>
                                            )}

                                            {/* Title + meta */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-foreground text-sm truncate">{p.title}</p>
                                                <p className="text-xs text-muted-foreground truncate hidden sm:block">
                                                    {p.category.join(", ")} · {p.year}
                                                </p>
                                            </div>

                                            {/* Actions: Hero star & Hide from featured */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                {/* Hero badge / Set Hero star button */}
                                                {isGroupHero ? (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-yellow-400/15 text-yellow-400 rounded-full border border-yellow-400/30">
                                                        <Star className="w-3 h-3 fill-yellow-400" />
                                                        Group {groupNum} Hero
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setGroupHero(p.id)}
                                                        title={`Set as Group ${groupNum} Hero`}
                                                        className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all border border-transparent hover:border-yellow-400/30"
                                                    >
                                                        <Star className="w-3.5 h-3.5" />
                                                    </button>
                                                )}

                                                {/* Hide from featured button */}
                                                <button
                                                    type="button"
                                                    onClick={() => hideFromFeatured(p.id)}
                                                    title="Hide project from home page Featured Section"
                                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
                                                >
                                                    <EyeOff className="w-3.5 h-3.5" />
                                                    <span>Hide</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* ── Unfeatured / Hidden from Featured section ── */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                                <h3 className="text-sm font-semibold text-foreground">
                                    Hidden from Featured ({unfeaturedProjects.length})
                                </h3>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Click &quot;Show in Featured&quot; to make visible on home page
                            </p>
                        </div>

                        {unfeaturedProjects.length === 0 ? (
                            <div className="p-4 text-center rounded-xl bg-secondary/20 border border-border text-xs text-muted-foreground">
                                All projects are currently featured!
                            </div>
                        ) : (
                            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border/50">
                                {unfeaturedProjects.map(p => (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 hover:bg-secondary/15 transition-all"
                                    >
                                        {/* Thumbnail */}
                                        {p.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={p.image}
                                                alt={p.title}
                                                className="w-12 h-8 sm:w-14 sm:h-10 rounded-lg object-cover border border-border shrink-0 opacity-80"
                                            />
                                        ) : (
                                            <div className="w-12 h-8 sm:w-14 sm:h-10 rounded-lg bg-secondary border border-border shrink-0 flex items-center justify-center">
                                                <span className="text-xs font-bold text-muted-foreground">{p.title.charAt(0)}</span>
                                            </div>
                                        )}

                                        {/* Title + meta */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground text-sm truncate">{p.title}</p>
                                            <p className="text-xs text-muted-foreground truncate hidden sm:block">
                                                {p.category.join(", ")} · {p.year}
                                            </p>
                                        </div>

                                        {/* Action: Add to Featured */}
                                        <button
                                            type="button"
                                            onClick={() => addToFeatured(p.id)}
                                            title="Make project visible in Featured Section"
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all shrink-0 hover:scale-[1.02] cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Show in Featured</span>
                                        </button>
                                    </div>
                                ))}
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
                                    <p className="font-semibold text-foreground text-sm">Unsaved Featured Changes</p>
                                    <p className="text-xs text-muted-foreground hidden sm:block">Save to update the home page featured section.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    type="button"
                                    onClick={discardChanges}
                                    disabled={isSaving}
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-xs font-medium transition-all"
                                >
                                    <X className="w-3.5 h-3.5" /> Discard
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(true)}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-3 sm:px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-xs font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Save Changes</span>
                                    <span className="sm:hidden">Save</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mobile/tablet inline preview — shown below list on screens < xl */}
                    {previewOpen && (
                        <div className="xl:hidden">
                            <ProjectsPreviewPane
                                previewKey={previewKey}
                                previewUrl="/#featured-projects"
                                previewLabel="LIVE PREVIEW — / (Featured Section)"
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
                            previewUrl="/#featured-projects"
                            previewLabel="LIVE PREVIEW — / (Featured Section)"
                            onRefresh={() => setPreviewKey(Date.now())}
                        />
                    </div>
                )}
            </div>

            {/* Confirm modal */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                    onClick={() => !isSaving && setShowConfirm(false)}
                >
                    <div
                        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-lg">Save Featured Order?</h3>
                                <p className="text-xs text-muted-foreground">Updates home page featured section</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            This will reorder the Featured Projects section on the home page. The projects page order is unaffected.
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isSaving}
                                className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-xs font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                            >
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
