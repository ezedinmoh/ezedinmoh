"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  Film,
  ChevronUp,
  ChevronDown,
  Info,
  MessageCircle,
  ListVideo,
  Eye,
  Heart,
  Share2,
  Clock,
  Disc3,
  ExternalLink,
  ArrowUpRight,
  Send,
  User,
  Sparkles,
  ArrowLeft,
} from "lucide-react"
import { ReelCard } from "./ReelCard"
import { ReelData, CATEGORIES, formatCompactNumber, formatDuration, getRelatedProject } from "./types"
import { cn } from "@/lib/utils"

interface ReelsFeedProps {
  initialReels: ReelData[]
}

interface CommentItem {
  id: string
  displayName: string
  text: string
  createdAt: string
}

export function ReelsFeed({ initialReels }: ReelsFeedProps) {
  const [reels] = useState<ReelData[]>(initialReels)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [activeIndex, setActiveIndex] = useState(0)
  const [desktopTab, setDesktopTab] = useState<"details" | "comments" | "playlist">("details")

  // Prevent duplicate audio: only mount the card for the active viewport
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Global sound state — persists across reel transitions
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(80)

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev
      if (!next && volume === 0) {
        setVolume(80)
      }
      return next
    })
  }, [volume])

  const handleVolumeChange = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)))
    setVolume(clamped)
    if (clamped === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }, [])

  const [comments, setComments] = useState<CommentItem[]>([])
  const [commentsTotal, setCommentsTotal] = useState(0)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [newCommentText, setNewCommentText] = useState("")
  const [newCommentAuthor, setNewCommentAuthor] = useState("")
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  const isScrollingRef = useRef(false)
  // Touch tracking for the swipe overlay
  const touchStartY = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartTime = useRef<number>(0)

  const filteredReels = useMemo(
    () => (selectedCategory === "All" ? reels : reels.filter(r => r.category === selectedCategory)),
    [reels, selectedCategory]
  )

  useEffect(() => { setActiveIndex(0) }, [selectedCategory])

  // Set of reel IDs that have been mounted — once loaded, they STAY mounted in the sliding strip
  // This guarantees that swiping to next or navigating back to previous NEVER reloads or refreshes!
  const [loadedReelIds, setLoadedReelIds] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    if (initialReels[0]) initial.add(initialReels[0].id)
    if (initialReels[1]) initial.add(initialReels[1].id)
    return initial
  })

  // Whenever activeIndex or filteredReels changes, ensure current and adjacent reels are marked as loaded
  useEffect(() => {
    setLoadedReelIds(prev => {
      const next = new Set(prev)
      if (filteredReels[activeIndex]) next.add(filteredReels[activeIndex].id)
      if (filteredReels[activeIndex + 1]) next.add(filteredReels[activeIndex + 1].id)
      if (activeIndex > 0 && filteredReels[activeIndex - 1]) next.add(filteredReels[activeIndex - 1].id)
      return next
    })
  }, [activeIndex, filteredReels])

  const currentReel = filteredReels[activeIndex] || filteredReels[0]

  const goToNext = useCallback(() => {
    setActiveIndex(prev => Math.min(prev + 1, filteredReels.length - 1))
  }, [filteredReels.length])

  const goToPrev = useCallback(() => {
    setActiveIndex(prev => Math.max(prev - 1, 0))
  }, [])

  // Universal touch swipe handlers: detects swipe anywhere across the mobile section
  const handleFeedTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    touchStartY.current = e.touches[0].clientY
    touchStartX.current = e.touches[0].clientX
    touchStartTime.current = Date.now()
  }, [])

  const handleFeedTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return
    const touch = e.changedTouches[0]
    const dy = touch.clientY - touchStartY.current
    const dx = touch.clientX - touchStartX.current
    const duration = Date.now() - touchStartTime.current

    touchStartY.current = null
    touchStartX.current = null

    // Require vertical swipe > 35px, dominated by vertical movement, within 700ms
    if (Math.abs(dy) > 35 && Math.abs(dy) > Math.abs(dx) * 1.1 && duration < 700) {
      if (dy < 0) {
        goToNext()
      } else {
        goToPrev()
      }
    }
  }, [goToNext, goToPrev])

  const handleBack = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
        window.history.back()
      } else {
        window.location.href = "/"
      }
    }
  }, [])

  // Desktop: mouse wheel nav
  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (Math.abs(e.deltaY) < 30) return
      if (isScrollingRef.current) return
      const target = e.target as HTMLElement | null
      if (target?.closest("[data-scrollable-panel]")) return
      isScrollingRef.current = true
      if (e.deltaY > 0) goToNext(); else goToPrev()
      setTimeout(() => { isScrollingRef.current = false }, 500)
    }
    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [goToNext, goToPrev])

  // Keyboard nav
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const el = document.activeElement
      if (el?.tagName === "INPUT" || el?.tagName === "TEXTAREA") return
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); goToNext() }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); goToPrev() }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNext, goToPrev])

  const fetchComments = useCallback(async (reelId: string) => {
    setCommentsLoading(true)
    setCommentError(null)
    try {
      const res = await fetch(`/api/reels/${reelId}/comments?page=1`)
      const data = await res.json()
      if (res.ok) { setComments(data.comments || []); setCommentsTotal(data.total || 0) }
      else setCommentError("Couldn't load comments")
    } catch { setCommentError("Network error") }
    finally { setCommentsLoading(false) }
  }, [])

  useEffect(() => {
    if (currentReel && desktopTab === "comments") fetchComments(currentReel.id)
  }, [currentReel, desktopTab, fetchComments])

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentReel || !newCommentText.trim() || commentSubmitting) return
    setCommentSubmitting(true)
    setCommentError(null)
    try {
      const res = await fetch(`/api/reels/${currentReel.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newCommentText.trim(), displayName: newCommentAuthor.trim() || "Anonymous" }),
      })
      const data = await res.json()
      if (res.ok && data.comment) {
        setComments(prev => [data.comment, ...prev])
        setCommentsTotal(prev => prev + 1)
        setNewCommentText("")
      } else setCommentError(data.message || "Failed to post comment")
    } catch { setCommentError("Network error. Try again.") }
    finally { setCommentSubmitting(false) }
  }

  if (filteredReels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white/40 gap-4 pt-16">
        <Film className="w-16 h-16 text-white/20" />
        <p className="text-lg font-medium text-white/60">No reels in this category</p>
        <button onClick={() => setSelectedCategory("All")} className="text-[#FE2C55] hover:opacity-80 text-sm font-semibold">
          View all reels
        </button>
      </div>
    )
  }

  const activeReel = filteredReels[activeIndex]

  return (
    <div className="relative w-full bg-black text-white" style={{ minHeight: "100svh" }}>

      {/* ════════════════════════════════════════════════════════
          MOBILE — single-card, swipe overlay, nav arrows
         ════════════════════════════════════════════════════════ */}
      <div
        className="lg:hidden fixed left-0 right-0 bg-black z-10 overflow-hidden"
        style={{
          top: "56px",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 76px)",
          overscrollBehavior: "none",
          touchAction: "none",
        }}
        onTouchStartCapture={handleFeedTouchStart}
        onTouchEndCapture={handleFeedTouchEnd}
      >
        {/* Preloaded sliding strip on mobile — zero reload when switching reels */}
        {!isDesktop && (
          <div
            className="w-full h-full flex flex-col"
            style={{
              transform: `translate3d(0, -${activeIndex * 100}%, 0)`,
              transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
              willChange: "transform",
            }}
          >
            {filteredReels.map((reel, idx) => {
              const isLoaded = loadedReelIds.has(reel.id)
              const isCurrent = idx === activeIndex

              return (
                <div
                  key={reel.id}
                  className="relative w-full shrink-0 overflow-hidden"
                  style={{ height: "100%", minHeight: "100%" }}
                >
                  {isLoaded ? (
                    <ReelCard
                      reel={reel}
                      isActive={isCurrent && !isDesktop}
                      priority={isCurrent}
                      isMuted={isMuted}
                      volume={volume}
                      onToggleMute={toggleMute}
                      onVolumeChange={handleVolumeChange}
                      onSwipeUp={goToNext}
                      onSwipeDown={goToPrev}
                      className="h-full w-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-black relative flex items-center justify-center">
                      {reel.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={reel.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── Swipe detection: handled by onTouchStart/onTouchEnd on the
            container above — no overlay needed, taps reach the iframe. */}

        {/* ── Top bar: Back + counter ── */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-white shadow-lg active:scale-95 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <div className="bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/15 text-[11px] font-mono text-white/80 shadow-md pointer-events-none">
            <span className="text-white font-bold">{activeIndex + 1}</span>
            <span className="text-white/50"> / {filteredReels.length}</span>
          </div>
        </div>

        {/* ── Mobile nav arrows — left edge, vertically centred ── */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 pointer-events-auto">
          <button
            onClick={goToPrev}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white disabled:opacity-20 disabled:cursor-not-allowed active:scale-90 transition-all shadow-lg hover:bg-black/80"
            aria-label="Previous reel"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            disabled={activeIndex === filteredReels.length - 1}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white disabled:opacity-20 disabled:cursor-not-allowed active:scale-90 transition-all shadow-lg hover:bg-black/80"
            aria-label="Next reel"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          DESKTOP — theater layout with right sidebar
         ════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col min-h-screen">
        {/* Category bar */}
        <div className="pt-24 pb-4 px-8">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-all active:scale-95 mr-1 shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2 text-white font-bold text-sm mr-4 shrink-0">
              <Film className="w-4 h-4 text-[#FE2C55]" />
              <span>Reels</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                    selectedCategory === cat
                      ? "bg-white text-black border-white font-bold"
                      : "bg-white/8 text-white/70 border-white/10 hover:bg-white/15"
                  )}
                >
                  {cat === "All" ? "For You" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theater */}
        <div className="flex-1 flex items-center justify-center px-8 pb-8">
          <div className="max-w-6xl w-full h-[780px] max-h-[85vh] flex gap-6">

            {/* Video stage */}
            <div className="relative flex-1 flex items-center justify-center">
              <button
                onClick={goToPrev}
                disabled={activeIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 z-20 w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-700 hover:border-white flex items-center justify-center text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 backdrop-blur-sm"
                aria-label="Previous reel"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              <div
                className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5"
                style={{ aspectRatio: "9/16", height: "100%", maxWidth: "calc(100% * 9 / 16)" }}
              >
                {/* Preloading sliding strip on desktop — zero reload when switching reels */}
                {isDesktop && (
                  <div
                    className="w-full h-full flex flex-col"
                    style={{
                      transform: `translate3d(0, -${activeIndex * 100}%, 0)`,
                      transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
                      willChange: "transform",
                    }}
                  >
                    {filteredReels.map((reel, idx) => {
                      const isLoaded = loadedReelIds.has(reel.id)
                      const isCurrent = idx === activeIndex

                      return (
                        <div
                          key={reel.id}
                          className="relative w-full shrink-0 overflow-hidden"
                          style={{ height: "100%", minHeight: "100%" }}
                        >
                          {isLoaded ? (
                            <ReelCard
                              reel={reel}
                              isActive={isCurrent && isDesktop}
                              priority={isCurrent}
                              isMuted={isMuted}
                              volume={volume}
                              onToggleMute={toggleMute}
                              onVolumeChange={handleVolumeChange}
                              onSwipeUp={goToNext}
                              onSwipeDown={goToPrev}
                              showDesktopComments
                              onCommentClick={() => setDesktopTab("comments")}
                              className="h-full w-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-black relative flex items-center justify-center">
                              {reel.thumbnail && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={reel.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="absolute top-3 left-3 z-30 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-mono text-white/70">
                    <span className="text-white font-bold">{activeIndex + 1}</span>
                    <span className="text-white/40"> / {filteredReels.length}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={goToNext}
                disabled={activeIndex === filteredReels.length - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 z-20 w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-700 hover:border-white flex items-center justify-center text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 backdrop-blur-sm"
                aria-label="Next reel"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Right panel */}
            {currentReel && (
              <div className="w-[380px] shrink-0 flex flex-col bg-zinc-950 border border-zinc-800/80 rounded-3xl overflow-hidden">
                <div className="flex border-b border-zinc-800 shrink-0">
                  {(["details", "comments", "playlist"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setDesktopTab(tab)}
                      className={cn(
                        "flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 capitalize",
                        desktopTab === tab
                          ? "border-white text-white bg-white/5"
                          : "border-transparent text-zinc-400 hover:text-white"
                      )}
                    >
                      {tab === "details" && <Info className="w-3.5 h-3.5" />}
                      {tab === "comments" && <MessageCircle className="w-3.5 h-3.5" />}
                      {tab === "playlist" && <ListVideo className="w-3.5 h-3.5" />}
                      {tab === "details" ? "Overview" : tab === "comments" ? `Comments (${commentsTotal})` : `Playlist (${filteredReels.length})`}
                    </button>
                  ))}
                </div>

                {/* Details */}
                {desktopTab === "details" && (
                  <div data-scrollable-panel className="flex-1 overflow-y-auto p-5 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                      <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-zinc-800 shrink-0">
                        {currentReel.authorAvatar
                          ? <img src={currentReel.authorAvatar} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm">{(currentReel.authorName || "EM").slice(0, 2).toUpperCase()}</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm">@{currentReel.authorName || "ezedinmoh"}</p>
                        <a href={currentReel.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 text-xs hover:text-white transition-colors flex items-center gap-1 mt-0.5">
                          <ExternalLink className="w-3 h-3" />Watch on TikTok
                        </a>
                      </div>
                      {currentReel.category && (
                        <span className="px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-white/70 text-[11px] font-medium">{currentReel.category}</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {currentReel.title && <h3 className="text-white font-bold text-base leading-snug">{currentReel.title}</h3>}
                      {currentReel.caption && (
                        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line bg-zinc-900 p-3 rounded-xl border border-zinc-800">{currentReel.caption}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Eye, label: "Views", value: currentReel.views || 0, color: "text-cyan-400" },
                        { icon: Heart, label: "Likes", value: currentReel.tiktokLikes || 0, color: "text-[#FE2C55]" },
                        { icon: Share2, label: "Shares", value: currentReel.tiktokShares || 0, color: "text-amber-400" },
                        { icon: Clock, label: "Duration", value: null, raw: formatDuration(currentReel.duration || 0), color: "text-emerald-400" },
                      ].map(({ icon: Icon, label, value, raw, color }) => (
                        <div key={label} className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0", color)}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-zinc-400 text-[10px]">{label}</p>
                            <p className="text-white font-bold text-sm">{raw ?? formatCompactNumber(value ?? 0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {currentReel.musicTitle && (
                      <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-white shrink-0" style={{ animation: "spin 4s linear infinite" }}>
                          <Disc3 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-zinc-400 text-[10px]">Music</p>
                          <p className="text-white text-xs font-medium truncate">{currentReel.musicTitle}</p>
                        </div>
                      </div>
                    )}

                    {getRelatedProject(currentReel) && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FE2C55]/10 to-zinc-900 border border-[#FE2C55]/20 space-y-2">
                        <div className="flex items-center gap-2 text-[#FE2C55] text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5" />Portfolio Project
                        </div>
                        <p className="text-xs text-zinc-300">This reel showcases <strong className="text-white">{getRelatedProject(currentReel)?.name}</strong></p>
                        <a href={getRelatedProject(currentReel)?.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FE2C55] hover:bg-[#FE2C55]/90 text-white font-bold text-xs transition-all">
                          <span>View Live Site</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Comments */}
                {desktopTab === "comments" && (
                  <div data-scrollable-panel className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {commentsLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : comments.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500 space-y-2">
                          <MessageCircle className="w-8 h-8 mx-auto opacity-30" />
                          <p className="text-xs">No comments yet. Be first!</p>
                        </div>
                      ) : comments.map(c => (
                        <div key={c.id} className="flex gap-3">
                          <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-xs font-bold text-white">
                            {c.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span className="text-white text-xs font-bold truncate">{c.displayName}</span>
                              <span className="text-zinc-500 text-[10px] shrink-0">
                                {new Date(c.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                              </span>
                            </div>
                            <p className="text-zinc-200 text-xs leading-relaxed">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleCommentSubmit} className="p-3 border-t border-zinc-800 bg-zinc-950 space-y-2 shrink-0">
                      {commentError && <p className="text-[#FE2C55] text-[11px]">{commentError}</p>}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                          <input type="text" placeholder="Your name (optional)" value={newCommentAuthor} onChange={e => setNewCommentAuthor(e.target.value)} maxLength={50} className="w-full pl-8 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="text" placeholder="Add a comment..." value={newCommentText} onChange={e => setNewCommentText(e.target.value)} maxLength={500} required className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40" />
                        <button type="submit" disabled={commentSubmitting || !newCommentText.trim()} className="p-2 bg-[#FE2C55] hover:bg-[#FE2C55]/90 text-white rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Playlist */}
                {desktopTab === "playlist" && (
                  <div data-scrollable-panel className="flex-1 overflow-y-auto p-3 space-y-1.5">
                    {filteredReels.map((reel, idx) => {
                      const isSelected = idx === activeIndex
                      return (
                        <button
                          key={reel.id}
                          onClick={() => setActiveIndex(idx)}
                          className={cn(
                            "w-full text-left p-2.5 rounded-2xl flex items-center gap-3 transition-all",
                            isSelected ? "bg-white/10 border border-white/20" : "hover:bg-zinc-900 border border-transparent"
                          )}
                        >
                          <div className="w-10 h-14 rounded-xl bg-zinc-800 overflow-hidden relative shrink-0">
                            {reel.thumbnail
                              ? <img src={reel.thumbnail} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><Film className="w-4 h-4 text-zinc-600" /></div>
                            }
                            {isSelected && (
                              <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={cn("text-xs font-semibold leading-snug truncate", isSelected ? "text-white" : "text-zinc-300")}>
                              {reel.title || reel.caption || `Reel #${idx + 1}`}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                              {reel.views > 0 && <span>{formatCompactNumber(reel.views)} views</span>}
                              {reel.duration > 0 && <span>{formatDuration(reel.duration)}</span>}
                            </div>
                          </div>
                          <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0", isSelected ? "bg-white text-black font-bold" : "bg-zinc-800 text-zinc-400")}>
                            {idx + 1}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}
