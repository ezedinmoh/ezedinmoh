"use client"

import { useState, useEffect, useRef } from "react"
import {
  X, ExternalLink, RefreshCw, Monitor, Tablet, Smartphone,
  ChevronLeft, ChevronRight, Play, Pause, ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"

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
    url.includes("cloudinary.com") && url.includes("/video/upload/")
  )
}

export function ProjectPreviewModal({ project, onClose }: ProjectPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "slideshow">("preview")
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop")
  
  // Iframe state
  const [iframeLoading, setIframeLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(10)
  const [iframeKey, setIframeKey] = useState(0)

  // Slideshow state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const isIframeMode = project?.previewMode === "iframe" && !!project?.liveUrl

  // Media list for slideshow
  const mediaList = project
    ? [project.image, ...(project.screenshots || [])].filter(Boolean) as string[]
    : []

  // Preconnect & Progress bar simulation for iframe loading
  useEffect(() => {
    if (!project || !isIframeMode) return

    setIframeLoading(true)
    setIframeError(false)
    setLoadingProgress(15)

    // Preconnect to domain
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
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.floor(Math.random() * 15 + 5)
      })
    }, 200)

    return () => clearInterval(interval)
  }, [project, isIframeMode, iframeKey])

  // Slideshow autoplay
  useEffect(() => {
    if (!isPlaying || mediaList.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaList.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [isPlaying, mediaList.length])

  // Keybindings (Escape, Left, Right)
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
    setTimeout(() => {
      setIframeLoading(false)
    }, 200)
  }

  const reloadIframe = () => {
    setIframeLoading(true)
    setIframeError(false)
    setLoadingProgress(10)
    setIframeKey((prev) => prev + 1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl h-[92vh] flex flex-col bg-card border border-border rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
        
        {/* ── Modal Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border/80 bg-card shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="font-bold text-foreground text-base sm:text-lg truncate max-w-xs sm:max-w-sm">
              {project.title}
            </h2>
            {project.tags && project.tags.length > 0 && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {project.tags[0]}
              </span>
            )}
          </div>

          {/* View Mode & Controls */}
          <div className="flex items-center gap-2">
            {/* Viewport Width Selector (for iframe mode) */}
            {isIframeMode && (
              <div className="hidden sm:flex items-center bg-secondary/60 p-1 rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => setDeviceView("desktop")}
                  className={cn(
                    "p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1",
                    deviceView === "desktop" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Desktop View (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView("tablet")}
                  className={cn(
                    "p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1",
                    deviceView === "tablet" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView("mobile")}
                  className={cn(
                    "p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1",
                    deviceView === "mobile" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Mobile</span>
                </button>
              </div>
            )}

            {/* Reload iframe button */}
            {isIframeMode && (
              <button
                type="button"
                onClick={reloadIframe}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                title="Reload Preview"
              >
                <RefreshCw className={cn("w-4 h-4", iframeLoading && "animate-spin text-primary")} />
              </button>
            )}

            {/* Direct Open in New Tab Button */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
              >
                <span>Live Site</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Browser Address Bar Simulation & Loading Progress Bar ── */}
        {isIframeMode && (
          <div className="relative bg-secondary/40 border-b border-border/60 px-4 py-1.5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            </div>
            <div className="flex-1 max-w-xl mx-auto bg-background/80 border border-border/60 px-3 py-1 rounded-lg truncate text-center font-mono text-[11px] text-foreground/80">
              {project.liveUrl}
            </div>

            {/* Loading progress bar */}
            {iframeLoading && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Modal Main Viewport ── */}
        <div className="flex-1 relative bg-secondary/10 overflow-hidden flex items-center justify-center">

          {/* ── OPTION 1: IFRAME LIVE PREVIEW MODE ── */}
          {isIframeMode ? (
            <div
              className={cn(
                "h-full transition-all duration-300 relative flex flex-col items-center justify-center mx-auto",
                deviceView === "desktop" && "w-full",
                deviceView === "tablet" && "w-[768px] max-w-full border-x border-border shadow-2xl bg-background",
                deviceView === "mobile" && "w-[375px] max-w-full border-x border-border shadow-2xl bg-background"
              )}
            >
              {/* Skeleton & Loading Indicator */}
              {iframeLoading && !iframeError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 bg-background/90 backdrop-blur-sm">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-foreground text-sm">Loading Live Preview…</p>
                    <p className="text-xs text-muted-foreground">Connecting to {new URL(project.liveUrl!).hostname}</p>
                  </div>
                </div>
              )}

              {/* Error fallback state */}
              {iframeError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 p-8 text-center bg-background">
                  <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                    <Monitor className="w-8 h-8 text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Preview Embed Restricted</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This website restricts iframe embedding (X-Frame-Options / Content-Security-Policy). You can open it directly in a new tab.
                    </p>
                  </div>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
                    >
                      Open Live Site in New Tab <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              {/* Real Iframe */}
              {!iframeError && (
                <iframe
                  key={iframeKey}
                  src={project.liveUrl!}
                  title={`Live preview of ${project.title}`}
                  className={cn(
                    "w-full h-full border-0 transition-opacity duration-500",
                    iframeLoading ? "opacity-0" : "opacity-100"
                  )}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onLoad={handleIframeLoad}
                  onError={() => {
                    setIframeLoading(false)
                    setIframeError(true)
                  }}
                />
              )}
            </div>
          ) : (

            /* ── OPTION 2: SLIDESHOW IMAGE / VIDEO MODE ── */
            <div className="relative w-full h-full flex items-center justify-center bg-background">
              {mediaList.length > 0 ? (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  {isVideoUrl(mediaList[currentIndex]) ? (
                    <video
                      key={mediaList[currentIndex]}
                      src={mediaList[currentIndex]}
                      controls
                      autoPlay
                      className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mediaList[currentIndex]}
                      alt={`${project.title} screenshot ${currentIndex + 1}`}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                    />
                  )}

                  {/* Navigation Arrows */}
                  {mediaList.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCurrentIndex((p) => (p - 1 + mediaList.length) % mediaList.length)}
                        className="absolute left-4 p-3 rounded-full bg-background/80 border border-border text-foreground hover:bg-background transition-all shadow-lg"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentIndex((p) => (p + 1) % mediaList.length)}
                        className="absolute right-4 p-3 rounded-full bg-background/80 border border-border text-foreground hover:bg-background transition-all shadow-lg"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No preview media available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="px-6 py-3 border-t border-border bg-card flex flex-wrap items-center justify-between gap-4 shrink-0">
          <p className="text-xs text-muted-foreground max-w-xl line-clamp-1">
            {project.description}
          </p>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground rounded-xl text-xs font-medium hover:bg-secondary/80 transition-all border border-border"
              >
                <span>GitHub Code</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
              >
                <span>Open Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
