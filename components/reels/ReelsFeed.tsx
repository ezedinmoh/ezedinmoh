"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Film,
  Sparkles,
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

  // Comments state for Desktop right panel
  const [comments, setComments] = useState<CommentItem[]>([])
  const [commentsTotal, setCommentsTotal] = useState(0)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [newCommentText, setNewCommentText] = useState("")
  const [newCommentAuthor, setNewCommentAuthor] = useState("")
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  const isScrollingRef = useRef(false)
  const touchStartY = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartTime = useRef<number>(0)

  // Filter reels by category
  const filteredReels = selectedCategory === "All"
    ? reels
    : reels.filter((r) => r.category === selectedCategory)

  // Bound activeIndex if category filter changes
  useEffect(() => {
    setActiveIndex(0)
  }, [selectedCategory])

  const currentReel = filteredReels[activeIndex] || filteredReels[0]

  // Navigation handlers
  const goToNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, filteredReels.length - 1))
  }, [filteredReels.length])

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  // Desktop Mouse Wheel Scroll Navigation (throttled to 400ms)
  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (Math.abs(e.deltaY) < 30) return
      if (isScrollingRef.current) return

      // Don't hijack scroll if wheeling inside the comments or playlist panel
      const target = e.target as HTMLElement | null
      if (target?.closest("[data-scrollable-panel]")) return

      isScrollingRef.current = true
      if (e.deltaY > 0) {
        goToNext()
      } else {
        goToPrev()
      }

      setTimeout(() => {
        isScrollingRef.current = false
      }, 400)
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [goToNext, goToPrev])

  // Keyboard navigation (ArrowUp / ArrowDown)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if user is typing in an input
      const activeEl = document.activeElement
      if (activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA") return

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault()
        goToNext()
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault()
        goToPrev()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNext, goToPrev])

  // Mobile Touch Swipe Handlers for outer container
  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY
    touchStartX.current = e.touches[0].clientX
    touchStartTime.current = Date.now()
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    const deltaX = touchStartX.current !== null ? e.changedTouches[0].clientX - touchStartX.current : 0
    const durationMs = Date.now() - touchStartTime.current

    touchStartY.current = null
    touchStartX.current = null

    // Require distinct vertical drag
    if (Math.abs(deltaY) > 40 && Math.abs(deltaY) > Math.abs(deltaX) * 1.3 && durationMs < 650) {
      if (deltaY < 0) {
        goToNext()
      } else {
        goToPrev()
      }
    }
  }

  // Fetch comments when currentReel changes or tab opens
  const fetchComments = useCallback(async (reelId: string) => {
    setCommentsLoading(true)
    setCommentError(null)
    try {
      const res = await fetch(`/api/reels/${reelId}/comments?page=1`)
      const data = await res.json()
      if (res.ok) {
        setComments(data.comments || [])
        setCommentsTotal(data.total || 0)
      } else {
        setCommentError("Couldn't load comments")
      }
    } catch {
      setCommentError("Network error loading comments")
    } finally {
      setCommentsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (currentReel && desktopTab === "comments") {
      fetchComments(currentReel.id)
    }
  }, [currentReel, desktopTab, fetchComments])

  // Submit comment from Desktop panel
  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentReel || !newCommentText.trim() || commentSubmitting) return

    setCommentSubmitting(true)
    setCommentError(null)

    try {
      const res = await fetch(`/api/reels/${currentReel.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newCommentText.trim(),
          displayName: newCommentAuthor.trim() || "Anonymous",
        }),
      })

      const data = await res.json()
      if (res.ok && data.comment) {
        setComments((prev) => [data.comment, ...prev])
        setCommentsTotal((prev) => prev + 1)
        setNewCommentText("")
      } else {
        setCommentError(data.message || "Failed to post comment")
      }
    } catch {
      setCommentError("Network error. Please try again.")
    } finally {
      setCommentSubmitting(false)
    }
  }

  if (filteredReels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white/40 gap-4 pt-16">
        <Film className="w-16 h-16 text-cyan-400/50" />
        <p className="text-lg font-medium text-white">No reels found in this category</p>
        <button
          onClick={() => setSelectedCategory("All")}
          className="text-cyan-400 hover:underline text-sm font-semibold"
        >
          View all reels
        </button>
      </div>
    )
  }

  return (
    <div data-reels-page className="relative w-full min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* 
        ── DESKTOP CATEGORY BAR (lg: screens only) ───────────────────────────
        Hidden on mobile as explicitly requested by user!
      */}
      <div className="hidden lg:block w-full pt-20 pb-3 px-6 z-20 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wide uppercase">
              <Film className="w-4 h-4" />
              <span>Dev Reels</span>
            </div>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-xs text-zinc-400 font-medium">
              Interactive Web & UI/UX Demos
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 shrink-0",
                  selectedCategory === cat
                    ? "bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                )}
              >
                {cat === "All" ? "All Reels" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP LANDSCAPE THEATER VIEWPORT (lg: screens) ────────────────── */}
      <div className="hidden lg:flex flex-1 items-center justify-center py-4 px-6">
        {/* Unified Landscape Theater Container (Widescreen Card) */}
        <div className="max-w-6xl w-full h-[740px] max-h-[82vh] bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/80 rounded-[32px] overflow-hidden shadow-2xl flex relative">
          {/* Left Widescreen Stage (Video Theater) */}
          <div className="flex-1 h-full bg-black relative flex items-center justify-center p-3">
            {/* Stage Left Arrow Button */}
            <button
              onClick={goToPrev}
              disabled={activeIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-zinc-900/80 border border-zinc-700 hover:border-cyan-400 flex items-center justify-center text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 shadow-xl backdrop-blur-sm"
              title="Previous video (Scroll Up / ↑)"
              aria-label="Previous video"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            {currentReel && (
              <div className="h-full w-full max-h-full flex items-center justify-center">
                <ReelCard
                  key={currentReel.id}
                  reel={currentReel}
                  isActive={true}
                  priority={true}
                  showDesktopComments={true}
                  onCommentClick={() => setDesktopTab("comments")}
                  className="h-full max-h-full"
                />
              </div>
            )}

            {/* Stage Right Arrow Button */}
            <button
              onClick={goToNext}
              disabled={activeIndex === filteredReels.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-zinc-900/80 border border-zinc-700 hover:border-cyan-400 flex items-center justify-center text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 shadow-xl backdrop-blur-sm"
              title="Next video (Scroll Down / ↓)"
              aria-label="Next video"
            >
              <ChevronDown className="w-5 h-5" />
            </button>

            {/* Bottom Floating Nav Indicator on Stage */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-zinc-400">
              <span className="text-cyan-400 font-bold">{activeIndex + 1}</span>
              <span>/</span>
              <span>{filteredReels.length}</span>
              <span className="text-[10px] text-zinc-500 ml-1 hidden sm:inline">· Scroll wheel to navigate</span>
            </div>
          </div>

          {/* Right Section of Landscape Card (Info, Comments & Playlist) */}
          {currentReel && (
            <div className="w-[420px] h-full flex flex-col bg-zinc-900/60 border-l border-zinc-800/80 shrink-0">
              {/* Tabs Navigation */}
              <div className="flex items-center border-b border-zinc-800 bg-zinc-900/90 shrink-0">
                <button
                  onClick={() => setDesktopTab("details")}
                  className={cn(
                    "flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2",
                    desktopTab === "details"
                      ? "border-cyan-400 text-cyan-300 bg-zinc-800/40"
                      : "border-transparent text-zinc-400 hover:text-white"
                  )}
                >
                  <Info className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setDesktopTab("comments")}
                  className={cn(
                    "flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2",
                    desktopTab === "comments"
                      ? "border-cyan-400 text-cyan-300 bg-zinc-800/40"
                      : "border-transparent text-zinc-400 hover:text-white"
                  )}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comments ({commentsTotal})</span>
                </button>
                <button
                  onClick={() => setDesktopTab("playlist")}
                  className={cn(
                    "flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2",
                    desktopTab === "playlist"
                      ? "border-cyan-400 text-cyan-300 bg-zinc-800/40"
                      : "border-transparent text-zinc-400 hover:text-white"
                  )}
                >
                  <ListVideo className="w-4 h-4" />
                  <span>Playlist ({filteredReels.length})</span>
                </button>
              </div>

              {/* Tab 1: Overview & Metrics */}
              {desktopTab === "details" && (
                <div data-scrollable-panel className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Creator Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full ring-2 ring-cyan-400 overflow-hidden bg-zinc-800">
                        {currentReel.authorAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={currentReel.authorAvatar}
                            alt={currentReel.authorName || "Ezedin Moh"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-cyan-600 text-white font-bold text-sm">
                            {(currentReel.authorName || "EM").slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-white font-bold text-sm">{currentReel.authorName || "Ezedin Moh"}</p>
                          <span className="text-cyan-400 text-[10px] bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 font-semibold">
                            Creator
                          </span>
                        </div>
                        <a
                          href={currentReel.tiktokUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 text-xs hover:text-cyan-300 transition-colors flex items-center gap-1 mt-0.5"
                        >
                          <span>Watch on TikTok</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {currentReel.category && (
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                        {currentReel.category}
                      </span>
                    )}
                  </div>

                  {/* Title & Caption */}
                  <div className="space-y-2">
                    {currentReel.title && (
                      <h3 className="text-white font-bold text-base leading-snug">
                        {currentReel.title}
                      </h3>
                    )}
                    {currentReel.caption && (
                      <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-line bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/60">
                        {currentReel.caption}
                      </p>
                    )}
                  </div>

                  {/* Live TikTok Stats Grid */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Live Performance Metrics
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                          <Eye className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-zinc-400 text-[10px]">Total Views</p>
                          <p className="text-white font-bold text-sm">
                            {formatCompactNumber(currentReel.views || 0)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-zinc-400 text-[10px]">TikTok Likes</p>
                          <p className="text-white font-bold text-sm">
                            {formatCompactNumber(currentReel.tiktokLikes || 0)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-zinc-400 text-[10px]">TikTok Shares</p>
                          <p className="text-white font-bold text-sm">
                            {formatCompactNumber(currentReel.tiktokShares || 0)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-zinc-400 text-[10px]">Duration</p>
                          <p className="text-white font-bold text-sm font-mono">
                            {formatDuration(currentReel.duration || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Music Track Info */}
                  {currentReel.musicTitle && (
                    <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-400 shrink-0">
                        <Disc3 className="w-4 h-4 animate-spin duration-3000" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-zinc-400 text-[10px]">Original Audio</p>
                        <p className="text-white font-medium text-xs truncate">
                          {currentReel.musicTitle}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Related Portfolio Project CTA */}
                  {getRelatedProject(currentReel) && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-zinc-950 border border-cyan-500/30 space-y-2">
                      <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Featured Portfolio Showcase</span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        This video is a live design breakdown of the project{" "}
                        <strong className="text-white">{getRelatedProject(currentReel)?.name}</strong>.
                      </p>
                      <a
                        href={getRelatedProject(currentReel)?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
                      >
                        <span>Launch Live Website</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Comments */}
              {desktopTab === "comments" && (
                <div data-scrollable-panel className="flex-1 flex flex-col min-h-0 bg-zinc-900/40">
                  {/* Comments List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {commentsLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-2 text-zinc-500">
                        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Loading comments...</span>
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-12 text-zinc-500 space-y-1">
                        <MessageCircle className="w-8 h-8 mx-auto opacity-40 text-cyan-400" />
                        <p className="text-xs font-medium text-zinc-400">No comments yet</p>
                        <p className="text-[11px]">Be the first to share your thoughts on this reel!</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-300 font-semibold text-xs flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                                {comment.displayName.slice(0, 1).toUpperCase()}
                              </span>
                              {comment.displayName}
                            </span>
                            <span className="text-zinc-500 text-[10px]">
                              {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-zinc-200 text-xs leading-relaxed pl-6">
                            {comment.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input Form */}
                  <form
                    onSubmit={handleCommentSubmit}
                    className="p-3 border-t border-zinc-800 bg-zinc-950/90 space-y-2 shrink-0"
                  >
                    {commentError && (
                      <p className="text-rose-400 text-[11px]">{commentError}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Your name (optional)"
                          value={newCommentAuthor}
                          onChange={(e) => setNewCommentAuthor(e.target.value)}
                          maxLength={50}
                          className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        maxLength={500}
                        required
                        className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="submit"
                        disabled={commentSubmitting || !newCommentText.trim()}
                        className="p-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                        title="Post Comment"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 3: Playlist */}
              {desktopTab === "playlist" && (
                <div data-scrollable-panel className="flex-1 overflow-y-auto p-3 space-y-2">
                  {filteredReels.map((reel, idx) => {
                    const isSelected = idx === activeIndex
                    return (
                      <button
                        key={reel.id}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                          "w-full text-left p-2.5 rounded-2xl flex items-center gap-3 transition-all border",
                          isSelected
                            ? "bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                            : "bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700"
                        )}
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-16 rounded-xl bg-zinc-800 overflow-hidden relative shrink-0 border border-zinc-700">
                          {reel.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={reel.thumbnail}
                              alt={reel.title || "Thumbnail"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <Film className="w-5 h-5" />
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-cyan-500/30 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            </div>
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-xs font-semibold leading-snug truncate",
                              isSelected ? "text-cyan-300" : "text-white"
                            )}
                          >
                            {reel.title || reel.caption || `Reel #${idx + 1}`}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
                            {reel.category && (
                              <span className="text-cyan-400/80 font-medium">
                                {reel.category}
                              </span>
                            )}
                            {reel.views > 0 && (
                              <span>{formatCompactNumber(reel.views)} views</span>
                            )}
                            {reel.duration > 0 && (
                              <span>{formatDuration(reel.duration)}</span>
                            )}
                          </div>
                        </div>

                        {/* Order index pill */}
                        <span
                          className={cn(
                            "text-xs font-mono px-2 py-0.5 rounded-md",
                            isSelected
                              ? "bg-cyan-500 text-black font-bold"
                              : "bg-zinc-800 text-zinc-400"
                          )}
                        >
                          #{idx + 1}
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

      {/* 
        ── MOBILE FULL-SCREEN SLIDER VIEWPORT (<lg: screens) ───────────────
        Fixed between the top navbar (top-14 sm:top-16) and bottom screen edge.
        Category pills are hidden on mobile as requested!
        No conflict with bottom nav because bottom nav is hidden on /reels!
      */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="lg:hidden fixed left-0 right-0 top-14 sm:top-16 bottom-0 w-full h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] overflow-hidden bg-black z-10"
      >
        <div
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateY(-${activeIndex * 100}%)` }}
        >
          {filteredReels.map((reel, idx) => (
            <div key={reel.id} className="w-full h-full relative flex items-center justify-center">
              <ReelCard
                reel={reel}
                isActive={idx === activeIndex}
                priority={idx === 0}
                onSwipeUp={goToNext}
                onSwipeDown={goToPrev}
                hasPrev={idx > 0}
                hasNext={idx < filteredReels.length - 1}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>

        {/* Floating mobile active indicator pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-[10px] font-mono text-white/70 shadow-md flex items-center gap-1.5">
            <span className="text-cyan-400 font-bold">{activeIndex + 1}</span>
            <span>/</span>
            <span>{filteredReels.length}</span>
            <span className="text-white/40 text-[9px]">· Swipe or tap arrows</span>
          </div>
        </div>
      </div>
    </div>
  )
}
