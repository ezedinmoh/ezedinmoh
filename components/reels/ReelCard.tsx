"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Play,
  Pause,
  Eye,
  Disc3,
  Clock,
  Sparkles,
  ArrowUpRight,
  Volume2,
  VolumeX,
  Volume1,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CommentSheet } from "./CommentSheet"
import { ReelData, formatCompactNumber, formatDuration, getRelatedProject } from "./types"

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
    views = 0,
    tiktokLikes = 0,
    tiktokComments = 0,
    tiktokShares = 0,
    duration = 0,
    authorName = "Ezedin Moh",
    authorAvatar,
    musicTitle,
    category,
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

  // Audio controls state: MUST start muted=true due to browser cross-origin autoplay policies
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(100)
  const [showVolumePopup, setShowVolumePopup] = useState(false)
  const [soundToast, setSoundToast] = useState<string | null>(null)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const touchStartY = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartTime = useRef<number>(0)
  const lastTapRef = useRef<number>(0)

  const relatedProject = getRelatedProject(reel)
  const totalLikes = (tiktokLikes || 0) + siteLikeCount
  const totalComments = (tiktokComments || 0) + siteCommentCount

  // Send postMessage to TikTok Embed Player v1 API
  const sendTikTokCommand = useCallback((type: string, value: unknown = null) => {
    if (!iframeRef.current?.contentWindow) return
    const payload = {
      "x-tiktok-player": true,
      type,
      value,
    }
    try {
      iframeRef.current.contentWindow.postMessage(payload, "https://www.tiktok.com")
      iframeRef.current.contentWindow.postMessage(payload, "*")
    } catch {}
  }, [])

  // Listen for TikTok player events
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.origin.includes("tiktok.com")) return
      const data = event.data
      if (!data || data["x-tiktok-player"] !== true) return

      if (data.type === "onPlayerReady") {
        setIframeLoading(false)
        if (isActive) {
          sendTikTokCommand("play")
        }
      }
      if (data.type === "onStateChange") {
        if (data.value === 1) setIsPlaying(true)
        if (data.value === 0 || data.value === 2) setIsPlaying(false)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [isActive, sendTikTokCommand])

  // Automatically load player if active
  useEffect(() => {
    if (isActive && !playerLoaded) {
      setPlayerLoaded(true)
    }
    if (isActive && playerLoaded) {
      sendTikTokCommand("play")
    } else if (!isActive && playerLoaded) {
      sendTikTokCommand("pause")
    }
  }, [isActive, playerLoaded, sendTikTokCommand])

  // Fetch initial liked state
  useEffect(() => {
    fetch(`/api/reels/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.liked === "boolean") setLiked(d.liked)
        if (typeof d._count?.likes === "number") setSiteLikeCount(d._count.likes)
        if (typeof d._count?.comments === "number") setSiteCommentCount(d._count.comments)
      })
      .catch(() => {})
  }, [id])

  // Sound toast helper
  const showToast = (msg: string) => {
    setSoundToast(msg)
    setTimeout(() => setSoundToast(null), 2000)
  }

  // Audio unmute / mute handlers
  const unmuteAudio = () => {
    setIsMuted(false)
    setVolume(100)
    sendTikTokCommand("unMute", null)
    sendTikTokCommand("changeVolume", 100)
    sendTikTokCommand("play", null)
    showToast("🔊 Sound Unmuted (100%)")
  }

  const muteAudio = () => {
    setIsMuted(true)
    sendTikTokCommand("mute", null)
    showToast("🔇 Sound Muted")
  }

  const toggleMute = () => {
    if (isMuted) {
      unmuteAudio()
    } else {
      muteAudio()
    }
  }

  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)))
    setVolume(clamped)
    if (clamped === 0) {
      setIsMuted(true)
      sendTikTokCommand("mute", null)
      showToast("🔇 Volume: 0%")
    } else {
      setIsMuted(false)
      sendTikTokCommand("unMute", null)
      sendTikTokCommand("changeVolume", clamped)
      showToast(`🔊 Volume: ${clamped}%`)
    }
  }

  const increaseVolume = () => {
    handleVolumeChange(volume + 15)
  }

  const decreaseVolume = () => {
    handleVolumeChange(volume - 15)
  }

  const togglePlayPause = () => {
    const nextPlaying = !isPlaying
    setIsPlaying(nextPlaying)
    sendTikTokCommand(nextPlaying ? "play" : "pause", null)
  }

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
      if (res.ok) {
        setLiked(data.liked)
        setSiteLikeCount(data.count)
      } else {
        setLiked(prevLiked)
        setSiteLikeCount(prevCount)
      }
    } catch {
      setLiked(prevLiked)
      setSiteLikeCount(prevCount)
    } finally {
      setLikeLoading(false)
    }
  }

  // Mobile Touch Swipe Handling
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

    // Vertical swipe with threshold
    if (Math.abs(deltaY) > 40 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2 && durationMs < 650) {
      if (deltaY < 0 && onSwipeUp) {
        onSwipeUp()
      } else if (deltaY > 0 && onSwipeDown) {
        onSwipeDown()
      }
    }
  }

  function handleVideoAreaClick() {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      // Double tap -> heart burst
      if (!liked) handleLike()
      setShowHeartBurst(true)
      setTimeout(() => setShowHeartBurst(false), 900)
    } else {
      // Single tap -> If muted, immediately unmute! Otherwise toggle play/pause
      if (!playerLoaded) {
        setPlayerLoaded(true)
      } else if (isMuted) {
        unmuteAudio()
      } else {
        togglePlayPause()
      }
    }
    lastTapRef.current = now
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? `${window.location.origin}/reels/${id}` : tiktokUrl
    try {
      if (navigator.share) {
        await navigator.share({ title: title ?? "Check out this reel by Ezedin Moh", url })
        setShareLabel("Shared!")
      } else {
        await navigator.clipboard.writeText(url)
        setShareLabel("Copied!")
      }
      fetch(`/api/reels/${id}/share`, { method: "POST" }).catch(() => {})
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") {
        await navigator.clipboard.writeText(url).catch(() => {})
        setShareLabel("Copied!")
      }
    }
    setTimeout(() => setShareLabel("Share"), 2200)
  }

  function openComments() {
    if (onCommentClick) {
      onCommentClick()
    } else {
      setCommentsOpen(true)
    }
  }

  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 
        CRITICAL FIX FOR DUPLICATE VIDEO PARTS:
        We constrain the container to exact 9:16 aspect ratio using CSS min().
        Width never exceeds 9/16 of available height, and height never exceeds 16/9 of width.
        This ensures TikTok player receives an EXACT 9:16 viewport on any device,
        eliminating TikTok's mirrored/blurred video letterbox padding completely!
      */}
      <div
        className="relative mx-auto flex items-center justify-center bg-black overflow-hidden shadow-2xl"
        style={{
          aspectRatio: "9/16",
          width: "min(100%, calc(100% * 9 / 16))",
          maxWidth: "calc(100vh * 9 / 16)",
          height: "100%",
          maxHeight: "100%",
        }}
      >
        {/* Top Badges (Views & Category) */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            {views > 0 && (
              <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-white/90 text-[11px] font-medium shadow-md">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>{formatCompactNumber(views)}</span>
                <span className="text-white/40 text-[9px]">plays</span>
              </div>
            )}

            {category && (
              <div className="bg-cyan-500/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold hidden sm:flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                <span>{category}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {duration > 0 && (
              <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-white/90 text-[10px] font-mono shadow-md">
                <Clock className="w-2.5 h-2.5 text-white/40" />
                <span>{formatDuration(duration)}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── AUDIO CONTROLS (Top-Right under Header) ── */}
        <div
          className="absolute top-11 right-3 z-30 flex flex-col items-end pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {isMuted ? (
            /* Unmute Prompt Button — impossible to miss! */
            <button
              onClick={unmuteAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white font-semibold text-xs shadow-xl shadow-rose-600/40 animate-pulse transition-all active:scale-95 border border-white/20"
              title="Tap to turn on sound"
              aria-label="Tap to turn on sound"
            >
              <VolumeX className="w-4 h-4 text-white" />
              <span className="text-[11px] font-bold">Unmute Sound</span>
            </button>
          ) : (
            /* Active Sound Control Pill */
            <div className="flex items-center gap-1 bg-black/85 backdrop-blur-md border border-cyan-500/40 rounded-full p-1 shadow-xl">
              <button
                onClick={toggleMute}
                className="p-1 rounded-full hover:bg-white/20 text-cyan-400 transition-all active:scale-90"
                title="Mute audio"
                aria-label="Mute audio"
              >
                {volume < 50 ? <Volume1 className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowVolumePopup(!showVolumePopup)}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold text-white hover:text-cyan-300 hover:bg-white/10 transition-colors"
                title="Adjust Volume"
              >
                {volume}%
              </button>

              <button
                onClick={decreaseVolume}
                className="w-5 h-5 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white text-[10px]"
                title="Volume Down"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>

              <button
                onClick={increaseVolume}
                className="w-5 h-5 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white text-[10px]"
                title="Volume Up"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          )}

          {/* Volume Popup Slider */}
          {showVolumePopup && !isMuted && (
            <div className="mt-1.5 p-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={decreaseVolume}
                className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white text-xs"
                title="Decrease volume"
              >
                <Minus className="w-3 h-3" />
              </button>

              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              <button
                onClick={increaseVolume}
                className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white text-xs"
                title="Increase volume"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Temporary Sound Toast Notification */}
        {soundToast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/90 text-white border border-cyan-500/50 px-3 py-1 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 pointer-events-none">
            {soundToast}
          </div>
        )}

        {/* Video Player / Thumbnail */}
        <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
          {playerLoaded && !iframeError ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {iframeLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
                  {thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail}
                      alt={title ?? "TikTok reel"}
                      className="absolute inset-0 w-full h-full object-contain bg-black"
                    />
                  )}
                  <div className="relative z-20 flex flex-col items-center gap-2 bg-black/80 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/80 text-[11px] font-medium">Loading Reel...</p>
                  </div>
                </div>
              )}

              <iframe
                ref={iframeRef}
                key={`tiktok-player-${tiktokId}`}
                src={`https://www.tiktok.com/player/v1/${tiktokId}?music_info=1&description=1&autoplay=1&muted=1`}
                className="w-full h-full border-none bg-black block"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setIframeLoading(false)}
                onError={() => setIframeError(true)}
                title={title ?? `TikTok video ${tiktokId}`}
              />

              {/* 
                Mobile Gesture Tap Layer:
                Captures single tap (to unmute / play-pause) and double tap (to heart)
                without swallowing scroll/swipe!
              */}
              <div
                className="absolute inset-0 z-10 pointer-events-auto cursor-pointer"
                style={{ height: "calc(100% - 130px)", top: "35px" }}
                onClick={handleVideoAreaClick}
              />
            </div>
          ) : (
            /* Clean Thumbnail with ZERO duplicate blurred mirror */
            <div
              className="relative w-full h-full flex items-center justify-center bg-black group cursor-pointer"
              onClick={() => setPlayerLoaded(true)}
            >
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnail}
                  alt={title ?? "TikTok reel"}
                  className="w-full h-full object-contain bg-black"
                  loading={priority ? "eager" : "lazy"}
                />
              ) : (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center" />
              )}

              <div className="relative z-10 flex flex-col items-center gap-2">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 group-hover:border-cyan-400">
                  <Play className="w-7 h-7 fill-white text-white ml-0.5" />
                </span>
                <span className="text-white/90 text-[11px] font-semibold bg-black/75 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                  Tap to Watch
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Double Tap Heart Burst Animation */}
        {showHeartBurst && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-out duration-700">
            <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.8)] animate-bounce" />
          </div>
        )}

        {/* ── MOBILE FLOATING CHEVRON NAV (Up / Down) ── */}
        <div className="lg:hidden absolute right-3 bottom-44 z-30 flex flex-col items-center gap-2 pointer-events-auto">
          {hasPrev && (
            <button
              onClick={onSwipeDown}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg active:scale-90"
              title="Previous reel"
              aria-label="Previous reel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={onSwipeUp}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg active:scale-90"
              title="Next reel"
              aria-label="Next reel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── RIGHT ACTION BUTTONS STACK ── */}
        <div
          className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-3.5 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Author Avatar Pill */}
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group transition-transform active:scale-90 mb-1"
            title={`@${authorName} on TikTok`}
          >
            <div className="w-9 h-9 rounded-full ring-2 ring-cyan-400 overflow-hidden bg-zinc-800 shadow-lg">
              {authorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={authorAvatar} alt={authorName || "Ezedin Moh"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-cyan-600 text-white font-bold text-[11px]">
                  {(authorName || "EM").slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-cyan-500 rounded-full flex items-center justify-center text-black text-[9px] font-black border border-black shadow">
              +
            </span>
          </a>

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={cn(
              "flex flex-col items-center gap-0.5 group/like transition-transform active:scale-90",
              likeLoading && "opacity-70"
            )}
            aria-label={liked ? "Unlike this reel" : "Like this reel"}
            aria-pressed={liked}
            title={`${totalLikes} total likes`}
          >
            <span
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300",
                liked
                  ? "bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                  : "bg-black/60 backdrop-blur-md border-white/15 text-white hover:border-white/30"
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-transform group-hover/like:scale-110",
                  liked ? "text-rose-500 fill-rose-500" : "text-white"
                )}
              />
            </span>
            <span className="text-white text-[10px] font-semibold drop-shadow tracking-tight">
              {formatCompactNumber(totalLikes)}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={openComments}
            className="flex flex-col items-center gap-0.5 group/comment transition-transform active:scale-90"
            aria-label="Open comments"
            title={`${totalComments} comments`}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white transition-all duration-300 hover:border-white/30">
              <MessageCircle className="w-4 h-4 transition-transform group-hover/comment:scale-110" />
            </span>
            <span className="text-white text-[10px] font-semibold drop-shadow tracking-tight">
              {formatCompactNumber(totalComments)}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-0.5 group/share transition-transform active:scale-90"
            aria-label="Share reel"
            title={shareLabel}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white transition-all duration-300 hover:border-white/30">
              <Share2 className="w-4 h-4 transition-transform group-hover/share:scale-110" />
            </span>
            <span className="text-white text-[9px] font-semibold drop-shadow">
              {shareLabel === "Share" ? (tiktokShares > 0 ? formatCompactNumber(tiktokShares) : "Share") : shareLabel}
            </span>
          </button>

          {/* External TikTok Link */}
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 group/tt transition-transform active:scale-90"
            aria-label="Open on TikTok"
            title="Watch on TikTok"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400">
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
            <span className="text-white/50 text-[8px]">TikTok</span>
          </a>

          {/* Vinyl Audio Track Indicator */}
          {musicTitle && (
            <div className="mt-0.5 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-cyan-400 animate-spin duration-3000 shadow-md">
                <Disc3 className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM INFO OVERLAY ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 pt-14 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-[calc(100%-65px)] pointer-events-auto space-y-1">
            {/* Creator Pill */}
            <div className="flex items-center gap-2">
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold text-xs hover:underline hover:text-cyan-300 transition-colors drop-shadow"
              >
                @{authorName}
              </a>
              <span className="text-cyan-400 text-[9px] font-semibold bg-cyan-500/20 px-1.5 py-0.2 rounded-full border border-cyan-500/30">
                Creator
              </span>
            </div>

            {/* Title */}
            {title && (
              <p className="text-white font-semibold text-[11px] leading-snug drop-shadow-md">
                {title}
              </p>
            )}

            {/* Caption with Expand/Collapse */}
            {caption && caption !== title && (
              <div>
                <p
                  className={cn(
                    "text-white/80 text-[10px] leading-relaxed drop-shadow",
                    !captionExpanded && "line-clamp-2"
                  )}
                >
                  {caption}
                </p>
                {caption.length > 60 && (
                  <button
                    onClick={() => setCaptionExpanded(!captionExpanded)}
                    className="text-cyan-400 text-[10px] font-semibold hover:underline"
                  >
                    {captionExpanded ? "Show less" : "...more"}
                  </button>
                )}
              </div>
            )}

            {/* Project Link CTA Pill (If linked to real portfolio project) */}
            {relatedProject && (
              <div className="pt-0.5">
                <a
                  href={relatedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] transition-all duration-300 shadow-md shadow-cyan-500/20 active:scale-95"
                >
                  <span>Live Demo: {relatedProject.name}</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </a>
              </div>
            )}

            {/* Sound / Music Info */}
            {musicTitle && (
              <div className="flex items-center gap-1 text-white/60 text-[9px] truncate pt-0.5">
                <Disc3 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                <span className="truncate">{musicTitle}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Standalone Mobile Comment Sheet */}
      {!showDesktopComments && (
        <CommentSheet
          reelId={id}
          open={commentsOpen}
          onOpenChange={setCommentsOpen}
          onCommentAdded={() => setSiteCommentCount((c) => c + 1)}
        />
      )}
    </div>
  )
}
