"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  X, ExternalLink, RefreshCw, Monitor, Tablet, Smartphone,
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StarRating } from "@/components/star-rating"

export interface ProjectModalItem {
  id: string
  title: string
  description: string
  image?: string
  screenshots?: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  tags?: string[]
  previewMode?: "slideshow" | "iframe"
  ratingSum?: number
  ratingCount?: number
}

interface ProjectPreviewModalProps {
  project: ProjectModalItem | null
  onClose: () => void
}

function isVideoUrl(url: string) {
  return (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".mov") ||
    (url.includes("cloudinary.com") && url.includes("/video/upload/"))
  )
}

export function ProjectPreviewModal({ project, onClose }: ProjectPreviewModalProps) {
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [iframeLoading, setIframeLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(10)
  const [iframeKey, setIframeKey] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying] = useState(false)

  const isIframeMode = project?.previewMode === "iframe" && !!project?.liveUrl
  const mediaList = project
    ? [project.image, ...(project.screenshots || [])].filter(Boolean) as string[]
    : []

  useEffect(() => {
    if (!project || !isIframeMode) return
    setIframeLoading(true)
    setIframeError(false)
    setLoadingProgress(15)
    try {
      if (project.liveUrl) {
        const url = new URL(project.liveUrl)
        const link = document.createElement("link")
        link.rel = "preconnect"
        link.href = url.origin
        document.head.appendChild(link)
      }
    } catch {}
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) { clearInterval(interval); return 90 }
        return prev + Math.floor(Math.random() * 15 + 5)
      })
    }, 200)
    return () => clearInterval(interval)
  }, [project, isIframeMode, iframeKey])

  useEffect(() => {
    if (!isPlaying || mediaList.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaList.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [isPlaying, mediaList.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (!isIframeMode && mediaList.length > 1) {
        if (e.key === "ArrowLeft") setCurrentIndex((p) => (p - 1 + mediaList.length) % mediaList.length)
        if (e.key === "ArrowRight") setCurrentIndex((p) => (p + 1) % mediaList.length)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, isIframeMode, mediaList.length])

  if (!project) return null

  const handleIframeLoad = () => {
    setLoadingProgress(100)
    setTimeout(() => setIframeLoading(false), 200)
  }

  const reloadIframe = () => {
    setIframeLoading(true)
    setIframeError(false)
    setLoadingProgress(10)
    setIframeKey((prev) => prev + 1)
  }

  return (
    <div data-project-preview-modal className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-3 md:p-6 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl h-[96vh] sm:h-[93vh] flex flex-col bg-card border border-border rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border-b border-border/80 bg-card shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h2 className="font-bold text-foreground text-sm sm:text-base truncate">
              {project.title}
            </h2>
            <div className="hidden sm:block shrink-0">
              <StarRating
                projectId={project.id}
                initialSum={project.ratingSum}
                initialCount={project.ratingCount}
                compact
              />
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Device switcher — all screen sizes */}
            {isIframeMode && (
              <div className="flex items-center bg-secondary/60 p-0.5 rounded-lg border border-border/60 mr-1">
                <button
                  type="button"
                  onClick={() => setDeviceView("desktop")}
                  className={cn("p-1.5 rounded-md transition-all", deviceView === "desktop" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
                  title="Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView("tablet")}
                  className={cn("p-1.5 rounded-md transition-all", deviceView === "tablet" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
                  title="Tablet"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView("mobile")}
                  className={cn("p-1.5 rounded-md transition-all", deviceView === "mobile" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
                  title="Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {isIframeMode && (
              <button type="button" onClick={reloadIframe} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all" title="Reload">
                <RefreshCw className={cn("w-3.5 h-3.5", iframeLoading && "animate-spin text-primary")} />
              </button>
            )}

            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-all shadow-sm">
                <span>Live</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            <button type="button" onClick={onClose}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-xs font-medium"
              aria-label="Back">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <button type="button" onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Address Bar ── */}
        {isIframeMode && (
          <div className="relative bg-secondary/30 border-b border-border/50 px-3 py-1 flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
              <span className="w-2 h-2 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 bg-background/70 border border-border/50 px-2.5 py-0.5 rounded-md truncate font-mono text-[10px] sm:text-[11px] text-foreground/70 text-center">
              {project.liveUrl}
            </div>
            {iframeLoading && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }} />
              </div>
            )}
          </div>
        )}

        {/* ── Viewport ── */}
        <div className="flex-1 relative bg-secondary/10 overflow-hidden flex items-center justify-center min-h-0">

          {isIframeMode ? (
            <div className={cn(
              "h-full transition-all duration-300 relative flex flex-col items-center justify-center mx-auto",
              deviceView === "desktop" && "w-full",
              deviceView === "tablet" && "w-[768px] max-w-full border-x border-border shadow-2xl bg-background",
              deviceView === "mobile" && "w-[390px] max-w-[calc(100%-2rem)] shadow-2xl bg-background rounded-[2rem] border-[6px] border-border overflow-hidden my-3"
            )}>
              {/* Mobile notch bar */}
              {deviceView === "mobile" && (
                <div className="absolute top-0 left-0 right-0 z-30 flex justify-center py-2 bg-card/95 border-b border-border/30 shrink-0">
                  <div className="w-16 h-1 rounded-full bg-border" />
                </div>
              )}

              {iframeLoading && !iframeError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 bg-background/90 backdrop-blur-sm">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground text-sm">Loading Preview…</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {project.liveUrl ? new URL(project.liveUrl).hostname : ""}
                    </p>
                  </div>
                </div>
              )}

              {iframeError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 p-6 text-center bg-background">
                  <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                    <Monitor className="w-7 h-7 text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1 text-sm">Preview Embed Restricted</p>
                    <p className="text-xs text-muted-foreground max-w-xs">This site blocks iframe embedding. Open it directly instead.</p>
                  </div>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg">
                      Open Live Site <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              {!iframeError && (
                <iframe
                  key={iframeKey}
                  src={project.liveUrl!}
                  title={`Live preview of ${project.title}`}
                  className={cn(
                    "w-full border-0 transition-opacity duration-500",
                    deviceView === "mobile" ? "h-[calc(100%-28px)] mt-7" : "h-full",
                    iframeLoading ? "opacity-0" : "opacity-100"
                  )}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onLoad={handleIframeLoad}
                  onError={() => { setIframeLoading(false); setIframeError(true) }}
                />
              )}
            </div>

          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-background">
              {mediaList.length > 0 ? (
                <div className="relative w-full h-full flex items-center justify-center p-3">
                  {isVideoUrl(mediaList[currentIndex]) ? (
                    <video key={mediaList[currentIndex]} src={mediaList[currentIndex]} controls autoPlay
                      className="max-w-full max-h-full object-contain rounded-xl shadow-lg" />
                  ) : (
                    <Image
                      src={mediaList[currentIndex]}
                      alt={`${project.title} screenshot ${currentIndex + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 80vw"
                      className="object-contain rounded-xl shadow-lg"
                    />
                  )}
                  {mediaList.length > 1 && (
                    <>
                      <button type="button"
                        onClick={() => setCurrentIndex((p) => (p - 1 + mediaList.length) % mediaList.length)}
                        className="absolute left-3 p-2.5 rounded-full bg-background/80 border border-border text-foreground hover:bg-background transition-all shadow-lg"
                        aria-label="Previous">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button type="button"
                        onClick={() => setCurrentIndex((p) => (p + 1) % mediaList.length)}
                        className="absolute right-3 p-2.5 rounded-full bg-background/80 border border-border text-foreground hover:bg-background transition-all shadow-lg"
                        aria-label="Next">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground text-sm">No preview media available</div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-3 py-2 sm:px-5 sm:py-2.5 border-t border-border bg-card shrink-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] sm:text-xs text-muted-foreground truncate flex-1 min-w-0 hidden sm:block">
              {project.description}
            </p>
            <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              <div className="sm:hidden">
                <StarRating
                  projectId={project.id}
                  initialSum={project.ratingSum}
                  initialCount={project.ratingCount}
                  compact
                />
              </div>
              <div className="flex items-center gap-1.5">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary text-foreground rounded-lg text-[11px] sm:text-xs font-medium hover:bg-secondary/80 transition-all border border-border">
                    <ExternalLink className="w-3 h-3" />
                    <span>Code</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground rounded-lg text-[11px] sm:text-xs font-semibold hover:opacity-90 transition-all shadow-sm">
                    <span>Open</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
