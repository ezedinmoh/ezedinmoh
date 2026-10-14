"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Play,
  VolumeX,
  Volume2,
  Disc3,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CommentSheet } from "./CommentSheet"
import { ReelData, formatCompactNumber, getRelatedProject } from "./types"

interface ReelCardProps {
  reel: ReelData
  isActive?: boolean
  priority?: boolean
  onCommentClick?: () => void
  showDesktopComments?: boolean
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  hasPrev?: boolean
  hasNext?: boolean
  className?: string
}

export function ReelCard({
  reel,
  isActive = false,
  priority = false,
  onCommentClick,
  showDesktopComments = false,
  onSwipeUp,
  onSwipeDown,
  hasPrev = false,
  hasNext = false,
  className,
}: ReelCardProps) {
  const {
    id,
    tiktokId,
    tiktokUrl,
    title,
    caption,
    thumbnail,
    tiktokLikes = 0,
    tiktokComments = 0,
    tiktokShares = 0,
    authorName = "ezedinmoh",
    authorAvatar,
    musicTitle,
    _count,
  } = reel

  const [playerLoaded, setPlayerLoaded] = useState(priority || isActive)
  const [iframeLoading, setIframeLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [liked, setLiked] = useState(false)
  const [siteLikeCount, setSiteLikeCount] = useState(_count?.likes ?? 0)
  const [siteCommentCount, setSiteCommentCount] = useState(_count?.comments ?? 0)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [shareLabel, setShareLabel] = useState<"Share" | "Copied!" | "Shared!">("Share")
  const [captionExpanded, setCaptionExpanded] = useState(false)
  const [showHeartBurst, setShowHeartBurst] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  // SOUND: Track mute state via postMessage (unMute & changeVolume)
  const [isMuted, setIsMuted] = useState(true)
  const [showSoundHint, setShowSoundHint] = useState(false)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const touchStartY = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartTime = useRef<number>(0)
  const lastTapRef = useRef<number>(0)
  const soundHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const relatedProject = getRelatedProject(reel)
  const totalLikes = (tiktokLikes || 0) + siteLikeCount
  const totalComments = (tiktokComments || 0) + siteCommentCount

  const sendTikTokCommand = useCallback((type: string, value: unknown = undefined) => {
    if (!iframeRef.current?.contentWindow) return
    const win = iframeRef.current.contentWindow
    const payload = { "x-tiktok-player": true, type, value }
    const stringified = JSON.stringify(payload)
    const legacy = JSON.stringify({ c: type, value: value ?? "" })
    try {
      win.postMessage(payload, "https://www.tiktok.com")
      win.postMessage(payload, "*")
      win.postMessage(stringified, "https://www.tiktok.com")
      win.postMessage(stringified, "*")
      win.postMessage(legacy, "https://www.tiktok.com")
      win.postMessage(legacy, "*")
    } catch {}
  }, [])

  // Listen for TikTok player ready & state events
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.origin.includes("tiktok.com")) return
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data
        if (!data) return
        if (data.type === "onPlayerReady" || data.event === "onPlayerReady") {
          setIframeLoading(false)
          if (isActive) sendTikTokCommand("play")
        }
        if (data.type === "onStateChange" || data.event === "onStateChange") {
          const val = data.value ?? data.state
          if (val === 1) setIsPlaying(true)
          if (val === 0 || val === 2) setIsPlaying(false)
        }
        if (data.type === "onVolumeChange" || data.event === "onVolumeChange") {
          if (typeof data.value === "number") {
            setIsMuted(data.value === 0)
          }
        }
      } catch {}
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [isActive, sendTikTokCommand])

  // Auto-load and play/pause
  useEffect(() => {
    if (isActive && !playerLoaded) setPlayerLoaded(true)
    if (isActive && playerLoaded) sendTikTokCommand("play")
    else if (!isActive && playerLoaded) sendTikTokCommand("pause")
  }, [isActive, playerLoaded, sendTikTokCommand])

  // Show sound hint when this reel becomes active
  useEffect(() => {
    if (isActive && isMuted) {
      setShowSoundHint(true)
      soundHintTimer.current = setTimeout(() => setShowSoundHint(false), 3500)
    }
    if (!isActive) {
      setIsMuted(true) // Reset to muted on inactive
      setShowSoundHint(false)
    }
    return () => { if (soundHintTimer.current) clearTimeout(soundHintTimer.current) }
  }, [isActive, isMuted])

  // Fetch liked state
  useEffect(() => {
    fetch(`/api/reels/${id}`)
      .then(r => r.json())
      .then(d => {
        if (typeof d.liked === "boolean") setLiked(d.liked)
        if (typeof d._count?.likes === "number") setSiteLikeCount(d._count.likes)
        if (typeof d._count?.comments === "number") setSiteCommentCount(d._count.comments)
      })
      .catch(() => {})
  }, [id])

  // SOUND FIX: Use TikTok Embedded Player API unMute and changeVolume postMessage commands
  const unmuteAudio = useCallback(() => {
    setIsMuted(false)
    setShowSoundHint(false)
    const fire = () => {
      sendTikTokCommand("unMute")
      sendTikTokCommand("unmute")
      sendTikTokCommand("changeVolume", 100)
      sendTikTokCommand("play")
    }
    fire()
    setTimeout(fire, 60)
    setTimeout(fire, 200)
    setTimeout(fire, 500)
  }, [sendTikTokCommand])

  const muteAudio = useCallback(() => {
    setIsMuted(true)
    const fire = () => {
      sendTikTokCommand("mute")
      sendTikTokCommand("changeVolume", 0)
    }
    fire()
    setTimeout(fire, 60)
  }, [sendTikTokCommand])

  const toggleMute = useCallback(() => {
    if (isMuted) unmuteAudio()
    else muteAudio()
  }, [isMuted, unmuteAudio, muteAudio])

  const togglePlayPause = useCallback(() => {
    const next = !isPlaying
    setIsPlaying(next)
    sendTikTokCommand(next ? "play" : "pause")
  }, [isPlaying, sendTikTokCommand])

  async function handleLike() {
    if (likeLoading) return
    const prevLiked = liked
    const prevCount = siteLikeCount
    setLiked(!prevLiked)
    setSiteLikeCount(prevCount + (prevLiked ? -1 : 1))
    setLikeLoading(true)
    try {
      const res = await fetch(`/api/reels/${id}/like`, { method: "POST" })
      const data = await res.json()
      if (res.ok) { setLiked(data.liked); setSiteLikeCount(data.count) }
      else { setLiked(prevLiked); setSiteLikeCount(prevCount) }
    } catch {
      setLiked(prevLiked); setSiteLikeCount(prevCount)
    } finally {
      setLikeLoading(false)
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY
    touchStartX.current = e.touches[0].clientX
    touchStartTime.current = Date.now()
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    const deltaX = touchStartX.current !== null ? e.changedTouches[0].clientX - touchStartX.current : 0
    const dur = Date.now() - touchStartTime.current
    touchStartY.current = null
    touchStartX.current = null
    if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5 && dur < 600) {
      if (deltaY < 0 && onSwipeUp) onSwipeUp()
      else if (deltaY > 0 && onSwipeDown) onSwipeDown()
    }
  }

  function handleVideoAreaClick() {
    const now = Date.now()
    if (now - lastTapRef.current < 280) {
      if (!liked) handleLike()
      setShowHeartBurst(true)
      setTimeout(() => setShowHeartBurst(false), 1000)
    } else {
      if (!playerLoaded) { setPlayerLoaded(true) }
      else if (isMuted) { unmuteAudio() }
      else { togglePlayPause() }
    }
    lastTapRef.current = now
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? `${window.location.origin}/reels/${id}` : tiktokUrl
    try {
      if (navigator.share) { await navigator.share({ title: title ?? "Check this reel by Ezedin Moh", url }); setShareLabel("Shared!") }
      else { await navigator.clipboard.writeText(url); setShareLabel("Copied!") }
      fetch(`/api/reels/${id}/share`, { method: "POST" }).catch(() => {})
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") { await navigator.clipboard.writeText(url).catch(() => {}); setShareLabel("Copied!") }
    }
    setTimeout(() => setShareLabel("Share"), 2200)
  }

  function openComments() {
    if (onCommentClick) onCommentClick()
    else setCommentsOpen(true)
  }

  const iframeSrc = `https://www.tiktok.com/player/v1/${tiktokId}?music_info=1&description=0&autoplay=1&muted=1&loop=1&rel=0&native_context_menu=0&closed_caption=0`

  return (
    <div
      className={cn("relative w-full h-full bg-black overflow-hidden select-none", className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ══ FULL-SCREEN VIDEO LAYER ══ */}
      <div className="absolute inset-0 w-full h-full">
        {playerLoaded && !iframeError ? (
          <>
            {/* Loading skeleton behind iframe */}
            {iframeLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900">
                {thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnail}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-[3px] border-white/80 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            )}

            {/* TikTok embed — fills entire card without unmounting on mute */}
            <iframe
              ref={iframeRef}
              key={`tk-${tiktokId}`}
              src={iframeSrc}
              className="absolute inset-0 w-full h-full border-none"
              style={{ background: "black" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIframeLoading(false)}
              onError={() => setIframeError(true)}
              title={title ?? `TikTok ${tiktokId}`}
            />

            {/* Gesture capture layer (sits above iframe, leaves bottom controls free) */}
            <div
              className="absolute inset-x-0 top-0 z-10 cursor-pointer"
              style={{ bottom: "160px" }}
              onClick={handleVideoAreaClick}
            />
          </>
        ) : (
          /* Pre-load thumbnail with tap-to-play */
          <div
            className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer group"
            onClick={() => setPlayerLoaded(true)}
          >
            {thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt={title ?? ""}
                className="absolute inset-0 w-full h-full object-cover"
                loading={priority ? "eager" : "lazy"}
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-900" />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-active:scale-95">
                <Play className="w-9 h-9 fill-white text-white ml-1.5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ HEART BURST ══ */}
      {showHeartBurst && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <Heart className="w-28 h-28 text-white fill-white drop-shadow-[0_0_30px_rgba(255,255,255,0.9)] animate-ping" style={{ animationDuration: "0.6s", animationIterationCount: 1 }} />
        </div>
      )}

      {/* ══ PAUSE OVERLAY ══ */}
      {!isPlaying && playerLoaded && !iframeLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* ══ MUTED INDICATOR (TikTok style — interactive center tap hint) ══ */}
      {isMuted && showSoundHint && playerLoaded && !iframeLoading && (
        <div className="absolute inset-x-0 bottom-48 z-30 flex justify-center pointer-events-auto">
          <button
            onClick={(e) => { e.stopPropagation(); unmuteAudio() }}
            className="flex items-center gap-2 bg-black/80 hover:bg-black backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl active:scale-95 transition-all cursor-pointer animate-pulse"
            aria-label="Tap to unmute"
          >
            <VolumeX className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-semibold">Tap to unmute</span>
          </button>
        </div>
      )}

      {/* ══ TOP BAR (sound toggle only — minimal like TikTok) ══ */}
      <div className="absolute top-0 right-0 z-30 p-3 pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute() }}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10 active:scale-90 transition-transform"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted
            ? <VolumeX className="w-4 h-4 text-white" />
            : <Volume2 className="w-4 h-4 text-white" />
          }
        </button>
      </div>

      {/* ══ RIGHT ACTION SIDEBAR (TikTok style) ══ */}
      <div
        className="absolute right-2 z-30 flex flex-col items-center gap-4 pointer-events-auto"
        style={{ bottom: "16px" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-1">
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block active:scale-90 transition-transform"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-zinc-800 shadow-lg">
              {authorAvatar
                ? <img src={authorAvatar} alt={authorName || ""} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm">{(authorName || "EM").slice(0, 2).toUpperCase()}</div>
              }
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#FE2C55] rounded-full flex items-center justify-center border-2 border-black">
              <span className="text-white text-[10px] font-black leading-none">+</span>
            </div>
          </a>
        </div>

        {/* Like */}
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={cn("flex flex-col items-center gap-1 active:scale-90 transition-transform", likeLoading && "opacity-60")}
          aria-label="Like"
        >
          <Heart className={cn("w-8 h-8 drop-shadow-md transition-all duration-200", liked ? "fill-[#FE2C55] text-[#FE2C55] scale-110" : "fill-white text-white")} />
          <span className="text-white text-xs font-semibold drop-shadow-md">{formatCompactNumber(totalLikes)}</span>
        </button>

        {/* Comment */}
        <button
          onClick={openComments}
          className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          aria-label="Comments"
        >
          <MessageCircle className="w-8 h-8 fill-white text-white drop-shadow-md" />
          <span className="text-white text-xs font-semibold drop-shadow-md">{formatCompactNumber(totalComments)}</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          aria-label="Share"
        >
          <Share2 className="w-7 h-7 text-white fill-white drop-shadow-md" />
          <span className="text-white text-xs font-semibold drop-shadow-md">
            {shareLabel !== "Share" ? shareLabel : formatCompactNumber(tiktokShares || 0)}
          </span>
        </button>

        {/* Open on TikTok */}
        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          aria-label="Open on TikTok"
        >
          <ExternalLink className="w-6 h-6 text-white drop-shadow-md" />
          <span className="text-white/70 text-[10px] font-medium">TikTok</span>
        </a>

        {/* Spinning vinyl disc */}
        {musicTitle && (
          <div className="w-10 h-10 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center shadow-lg overflow-hidden" style={{ animation: "spin 4s linear infinite" }}>
            <div className="w-4 h-4 rounded-full bg-zinc-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            </div>
          </div>
        )}
      </div>

      {/* ══ BOTTOM OVERLAY (TikTok style) ══ */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        {/* Gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" style={{ height: "180px", bottom: 0, top: "auto", position: "absolute" }} />

        <div className="relative px-3 pb-4 pt-16 pointer-events-auto max-w-[calc(100%-60px)]">
          {/* Author name */}
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold text-white text-sm drop-shadow-md mb-1 hover:opacity-80 active:opacity-70 transition-opacity"
          >
            @{authorName}
          </a>

          {/* Title/Caption */}
          {(title || caption) && (
            <div className="mb-2">
              <p className={cn("text-white text-sm leading-snug drop-shadow", !captionExpanded && "line-clamp-2")}>
                {title || caption}
              </p>
              {(title || caption || "").length > 80 && (
                <button
                  onClick={() => setCaptionExpanded(v => !v)}
                  className="text-white/60 text-xs font-semibold mt-0.5"
                >
                  {captionExpanded ? "less" : "more"}
                </button>
              )}
            </div>
          )}

          {/* Related project CTA */}
          {relatedProject && (
            <a
              href={relatedProject.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded-full bg-[#FE2C55] text-white font-bold text-xs active:scale-95 transition-transform shadow-lg"
            >
              <Sparkles className="w-3 h-3" />
              <span>{relatedProject.name}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}

          {/* Music ticker */}
          {musicTitle && (
            <div className="flex items-center gap-2 mt-1">
              <Disc3 className="w-3.5 h-3.5 text-white shrink-0" style={{ animation: "spin 3s linear infinite" }} />
              <div className="overflow-hidden flex-1">
                <p className="text-white text-xs font-medium truncate drop-shadow">{musicTitle}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Comment Sheet */}
      {!showDesktopComments && (
        <CommentSheet
          reelId={id}
          open={commentsOpen}
          onOpenChange={setCommentsOpen}
          onCommentAdded={() => setSiteCommentCount(c => c + 1)}
        />
      )}
    </div>
  )
}
