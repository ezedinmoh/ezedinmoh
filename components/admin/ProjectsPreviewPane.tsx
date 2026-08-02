"use client"

import { useRef, useState, useEffect } from "react"
import { Eye, EyeOff, RefreshCw, Smartphone, Monitor } from "lucide-react"

interface ProjectsPreviewPaneProps {
    previewKey?: number
    /** The URL the iframe loads. Defaults to "/projects" */
    previewUrl?: string
    /** Label shown in the header bar */
    previewLabel?: string
    onRefresh?: () => void
    /**
     * inlineMode: renders a fixed-height panel instead of sticky full-height.
     * Use this when placing the pane below the list on mobile/tablet.
     */
    inlineMode?: boolean
}

/** Build a cache-busted URL that preserves hash fragments */
function bustUrl(url: string) {
    const [base, hash] = url.split("#")
    // strip any existing ?t= param before adding a new one
    const cleanBase = base.replace(/[?&]t=\d+/, "")
    const sep = cleanBase.includes("?") ? "&" : "?"
    return `${cleanBase}${sep}t=${Date.now()}${hash ? `#${hash}` : ""}`
}

export function ProjectsPreviewPane({
    previewKey,
    previewUrl = "/projects",
    previewLabel,
    onRefresh,
    inlineMode = false,
}: ProjectsPreviewPaneProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [mobileView, setMobileView] = useState(false)
    const label = previewLabel ?? `LIVE PREVIEW — ${previewUrl}`

    /**
     * Hard-refresh the iframe by directly updating its src with a cache-busting
     * timestamp. This bypasses Next.js's soft-navigation cache so the new DB
     * order is always visible immediately after save.
     */
    function hardRefresh() {
        if (iframeRef.current) {
            iframeRef.current.src = bustUrl(previewUrl)
        }
        onRefresh?.()
    }

    /**
     * When previewKey changes (triggered by parent after a successful save),
     * also force a hard src update so the iframe actually reloads even if React's
     * key reconciliation doesn't cause a full remount.
     */
    useEffect(() => {
        if (previewKey && iframeRef.current) {
            iframeRef.current.src = bustUrl(previewUrl)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previewKey])

    // ── PHONE FRAME (mobile simulation) ─────────────────────────────────────
    const phoneFrame = (
        <div className="relative h-full flex items-start justify-center w-full overflow-hidden">
            {/* Outer phone shell */}
            <div
                className="relative rounded-[2rem] border-[3px] border-foreground/20 bg-zinc-950 shadow-2xl overflow-hidden shrink-0"
                style={{ width: 280, height: "100%" }}
            >
                {/* Dynamic Island notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-zinc-950 rounded-full z-10 border border-zinc-800" />
                {/* Side button */}
                <div className="absolute right-[-3px] top-20 w-[3px] h-10 bg-foreground/20 rounded-l-sm" />
                {/* Volume buttons */}
                <div className="absolute left-[-3px] top-16 w-[3px] h-7 bg-foreground/20 rounded-r-sm" />
                <div className="absolute left-[-3px] top-28 w-[3px] h-7 bg-foreground/20 rounded-r-sm" />
                {/* Screen area */}
                <div className="absolute inset-0 pt-8 overflow-hidden rounded-[1.85rem]">
                    <iframe
                        ref={iframeRef}
                        key={previewKey}
                        src={previewUrl}
                        className="border-0 origin-top-left"
                        title={`${label} (mobile)`}
                        style={{
                            /* Render at 390px (iPhone 14 width) then scale to fit 280px shell */
                            width: "390px",
                            height: "calc(100% / 0.718)",
                            transform: "scale(0.718)",
                            transformOrigin: "top left",
                        }}
                    />
                </div>
            </div>
        </div>
    )

    // ── DESKTOP IFRAME ───────────────────────────────────────────────────────
    const desktopFrame = (
        <iframe
            ref={iframeRef}
            key={previewKey}
            src={previewUrl}
            className="h-full w-full border-0 rounded-xl"
            title={label}
        />
    )

    // ── HEADER BAR ───────────────────────────────────────────────────────────
    const headerBar = (
        <div className="flex items-center justify-between border-b border-border px-3 py-2 shrink-0">
            <span className="flex items-center gap-2 font-mono text-[11px] text-primary min-w-0 mr-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
                <span className="truncate">{label}</span>
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
                <button
                    type="button"
                    onClick={() => setMobileView(v => !v)}
                    title={mobileView ? "Switch to desktop view" : "Switch to mobile view"}
                    className="flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                >
                    {mobileView
                        ? <><Monitor className="h-3 w-3 shrink-0" /><span className="hidden sm:inline">&nbsp;Desktop</span></>
                        : <><Smartphone className="h-3 w-3 shrink-0" /><span className="hidden sm:inline">&nbsp;Mobile</span></>
                    }
                </button>
                <button
                    type="button"
                    onClick={hardRefresh}
                    title="Force-refresh preview"
                    className="flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-950/30 px-2 py-1 text-[10px] font-medium text-emerald-400 hover:bg-emerald-900/50 transition"
                >
                    <RefreshCw className="h-3 w-3 shrink-0" />
                    <span className="hidden sm:inline">&nbsp;Refresh</span>
                </button>
            </div>
        </div>
    )

    // ── INLINE MODE (below list, fixed height) ───────────────────────────────
    if (inlineMode) {
        return (
            <div className="rounded-2xl border border-border bg-card shadow-lg flex flex-col overflow-hidden"
                style={{ height: mobileView ? 520 : 400 }}>
                {headerBar}
                <div className={`relative flex-1 overflow-hidden bg-background mt-2 mx-2 mb-2 rounded-xl flex ${mobileView ? "items-start justify-center py-2" : ""}`}>
                    {mobileView ? phoneFrame : desktopFrame}
                </div>
            </div>
        )
    }

    // ── STICKY SIDEBAR MODE (default, xl screens) ────────────────────────────
    return (
        <div className="sticky top-24 h-[calc(100vh-140px)] rounded-2xl border border-border bg-card p-2 shadow-2xl flex flex-col">
            {headerBar}
            <div className={`relative flex-1 overflow-hidden rounded-xl bg-background mt-2 flex ${mobileView ? "items-start justify-center py-2" : ""}`}>
                {mobileView ? phoneFrame : desktopFrame}
            </div>
            <p className="text-center text-[10px] text-muted-foreground px-2 pt-1.5 pb-0.5 shrink-0">
                Preview auto-refreshes after saving · click Refresh to force reload
            </p>
        </div>
    )
}

/** Toggle button for hiding/showing the preview pane */
export function PreviewToggleButton({
    previewOpen,
    onToggle,
}: {
    previewOpen: boolean
    onToggle: () => void
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
            {previewOpen
                ? <><EyeOff className="h-3.5 w-3.5 text-amber-400 shrink-0" /><span className="hidden sm:inline">&nbsp;Hide Preview</span></>
                : <><Eye className="h-3.5 w-3.5 text-primary shrink-0" /><span className="hidden sm:inline">&nbsp;Show Preview</span></>
            }
        </button>
    )
}
