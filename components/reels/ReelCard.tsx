"use client"

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Play,
  VolumeX,
  Volume1,
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
  isMuted: boolean
  volume?: number
  onToggleMute: () => void
  onVolumeChange?: (vol: number) => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onCommentClick?: () => void
  showDesktopComments?: boolean
  className?: string
}

function ReelCardComponent({
  reel,
  isActive = false,
  priority = false,
  isMuted,
  volume = 80,
  onToggleMute,
  onVolumeChange,
  onSwipeUp,
  onSwipeDown,
  onCommentClick,
  showDesktopComments = false,
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

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const lastTapTimeRef = useRef<number>(0)
  const touchStartY = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartTime = useRef<number>(0)
  const isSwipingRef = useRef(false)

  // Tracking refs to keep listeners stable without tear-down cycles
  const isActiveRef = useRef(isActive)
  const isMutedRef = useRef(isMuted)
  const volumeRef = useRef(volume)

  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  useEffect(() => {
    volumeRef.current = volume
  }, [volume])

  const relatedProject = getRelatedProject(reel)
  const totalLikes = (tiktokLikes || 0) + siteLikeCount
  const totalComments = (tiktokComments || 0) + siteCommentCount

  // Embed player URL — strictly memoized with native controls, music, and descriptions disabled to prevent conflict
  const iframeSrc = useMemo(
    () =>
      `https://www.tiktok.com/player/v1/${tiktokId}?controls=0&play_button=0&volume_control=0&fullscreen_button=0&progress_bar=0&music_info=0&description=0&autoplay=1&loop=1&rel=0&native_context_menu=0&closed_caption=0`,
    [tiktokId]
  )

  // Send control commands to TikTok Embed Player via HTML5 postMessage
  const sendTikTokCommand = useCallback((type: string, value?: unknown) => {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    const msg: Record<string, unknown> = {
      "x-tiktok-player": true,
      type,
    }
    if (value !== undefined) {
      msg.value = value
    }
    const stringified = JSON.stringify(msg)
    const origins = ["https://www.tiktok.com", "*"]
    for (const origin of origins) {
      try {
        win.postMessage(msg, origin)
        win.postMessage(stringified, origin)
      } catch {}
    }
  }, [])

  // Sync volume & mute state ONLY — NEVER sends "play", preventing playback restarts on unmute
  useEffect(() => {
    if (!isActive || iframeLoading) return
    if (isMuted) {
      sendTikTokCommand("mute")
      sendTikTokCommand("changeVolume", 0)
    } else {
      sendTikTokCommand("unMute")
      sendTikTokCommand("unmute")
      sendTikTokCommand("changeVolume", volume)
      sendTikTokCommand("setVolume", volume)
    }
  }, [isActive, isMuted, volume, iframeLoading, sendTikTokCommand])

  const userPausedRef = useRef(false)

  // Listen for TikTok player events (bound once, reads stable refs)
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.origin.includes("tiktok.com")) return
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data
        if (!data || !data["x-tiktok-player"]) return
        if (data.type === "onPlayerReady") {
          setIframeLoading(false)
          if (isActiveRef.current) {
            userPausedRef.current = false
            setIsPlaying(true)
            sendTikTokCommand("play")
            if (!isMutedRef.current) {
              sendTikTokCommand("unMute")
              sendTikTokCommand("unmute")
              sendTikTokCommand("changeVolume", volumeRef.current)
              sendTikTokCommand("setVolume", volumeRef.current)
            } else {
              sendTikTokCommand("mute")
              sendTikTokCommand("changeVolume", 0)
            }
          } else {
            sendTikTokCommand("pause")
            sendTikTokCommand("mute")
          }
        }
        if (data.type === "onStateChange") {
          const val = data.value ?? data.state
          if (val === 1) {
            setIsPlaying(true)
          }
          if (val === 0 || val === 2) {
            // Only reflect paused state if the user explicitly tapped pause
            if (userPausedRef.current) {
              setIsPlaying(false)
            } else if (isActiveRef.current) {
              // Auto-resume if active so it feels seamless like TikTok
              sendTikTokCommand("play")
              setIsPlaying(true)
            }
          }
        }
      } catch {}
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [sendTikTokCommand])

  // Sync play/pause when active state changes — strictly triggered by isActive transition
  useEffect(() => {
    if (isActive) {
      userPausedRef.current = false
      setIsPlaying(true)
      sendTikTokCommand("play")
      if (!isMutedRef.current) {
        sendTikTokCommand("unMute")
        sendTikTokCommand("unmute")
        sendTikTokCommand("changeVolume", volumeRef.current)
        sendTikTokCommand("setVolume", volumeRef.current)
      } else {
        sendTikTokCommand("mute")
        sendTikTokCommand("changeVolume", 0)
      }

      // Re-trigger play during slide transition so returning to prev or next reel auto-plays immediately
      const t1 = setTimeout(() => {
        if (isActiveRef.current && !userPausedRef.current) {
          sendTikTokCommand("play")
          setIsPlaying(true)
        }
      }, 120)

      const t2 = setTimeout(() => {
        if (isActiveRef.current && !userPausedRef.current) {
          sendTikTokCommand("play")
          setIsPlaying(true)
        }
      }, 300)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    } else {
      userPausedRef.current = false
      sendTikTokCommand("pause")
      sendTikTokCommand("mute")
      setIsPlaying(false)
    }
  }, [isActive, sendTikTokCommand])

  // Toggle Play / Pause via postMessage
  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev
      userPausedRef.current = !next
      if (next) {
        sendTikTokCommand("play")
      } else {
        sendTikTokCommand("pause")
      }
      return next
    })
  }, [sendTikTokCommand])

  // Toggle Mute / Unmute
  const handleToggleMute = useCallback(() => {
    onToggleMute()
  }, [onToggleMute])

  const lastTouchTimeRef = useRef<number>(0)
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Gesture handling: single-tap to play/pause, double-tap to like, vertical swipe to navigate
  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0]
    touchStartY.current = touch.clientY
    touchStartX.current = touch.clientX
    touchStartTime.current = Date.now()
    isSwipingRef.current = false
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartY.current === null) return
    const dy = e.touches[0].clientY - touchStartY.current
    const dx = e.touches[0].clientX - (touchStartX.current ?? 0)
    if (Math.abs(dy) > 10 || Math.abs(dx) > 10) {
      isSwipingRef.current = true
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return
    const touch = e.changedTouches[0]
    const dy = touch.clientY - touchStartY.current
    const dx = touch.clientX - (touchStartX.current ?? 0)
    const duration = Date.now() - touchStartTime.current

    touchStartY.current = null
    touchStartX.current = null
    lastTouchTimeRef.current = Date.now()

    // Vertical swipe: navigate reels
    if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx) * 1.2 && duration < 600) {
      if (dy < 0 && onSwipeUp) onSwipeUp()
      else if (dy > 0 && onSwipeDown) onSwipeDown()
      return
    }

    // Tap: play/pause or double-tap like
    if (!isSwipingRef.current && duration < 300) {
      handleGestureTap()
    }
  }

  function handleClick(e: React.MouseEvent) {
    // If this click is a synthetic event from a touch within the last 400ms, ignore it
    if (Date.now() - lastTouchTimeRef.current < 400) {
      return
    }
    handleGestureTap()
  }

  function handleGestureTap() {
    const now = Date.now()
    const diff = now - lastTapTimeRef.current
    lastTapTimeRef.current = now

    // Double tap -> Like with heart burst
    if (diff < 280) {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current)
        tapTimeoutRef.current = null
      }
      if (!liked) handleLike()
      setShowHeartBurst(true)
      setTimeout(() => setShowHeartBurst(false), 900)
      return
    }

    // Single tap -> Play / Pause (debounced by 220ms so double-tap doesn't trigger play/pause or heart)
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current)
    tapTimeoutRef.current = setTimeout(() => {
      togglePlayPause()
      tapTimeoutRef.current = null
    }, 220)
  }

  // Fetch liked state
  useEffect(() => {
    fetch(`/api/reels/${id}`)
      .then(r => r.json())
      .then(d => {
        if (typeof d.liked === "boolean") setLiked(d.liked)
        if (typeof d._count?.likes === "number") setSiteLikeCount(d._count.likes)
        if (typeof d._count?.comments === "number") setSiteCommentCount(d._count.comments)
      })
      .catch(() => { })
  }, [id])

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
    } finally { setLikeLoading(false) }
  }

  async function handleShare() {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/reels/${id}`
      : tiktokUrl
    try {
      if (navigator.share) {
        await navigator.share({ title: title ?? "Check this reel by Ezedin", url })
        setShareLabel("Shared!")
      } else {
        await navigator.clipboard.writeText(url)
        setShareLabel("Copied!")
      }
      fetch(`/api/reels/${id}/share`, { method: "POST" }).catch(() => { })
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") {
        await navigator.clipboard.writeText(url).catch(() => { })
        setShareLabel("Copied!")
      }
    }
    setTimeout(() => setShareLabel("Share"), 2200)
  }

  function openComments() {
    if (onCommentClick) onCommentClick()
    else setCommentsOpen(true)
  }

  return (
    <div className={cn("relative w-full h-full bg-black overflow-hidden select-none", className)}>

      {/* ══ VIDEO LAYER ══ */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {!iframeError ? (
          <>
            {iframeLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                {thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10">
                  <div className="w-8 h-8 border-[3px] border-white/80 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              key={`tk-${tiktokId}`}
              src={iframeSrc}
              className="absolute inset-0 border-none pointer-events-none"
              style={{
                background: "black",
                width: "calc(100% + 78px)",
                maxWidth: "none",
                height: "100%",
              }}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope; clipboard-write; web-share"
              referrerPolicy="no-referrer-when-downgrade"
              loading="eager"
              onLoad={() => {
                setIframeLoading(false)
                if (isActiveRef.current) {
                  sendTikTokCommand("play")
                  if (!isMutedRef.current) {
                    sendTikTokCommand("unMute")
                    sendTikTokCommand("unmute")
                    sendTikTokCommand("changeVolume", volumeRef.current)
                    sendTikTokCommand("setVolume", volumeRef.current)
                  } else {
                    sendTikTokCommand("mute")
                    sendTikTokCommand("changeVolume", 0)
                  }
                } else {
                  sendTikTokCommand("pause")
                  sendTikTokCommand("mute")
                }
              }}
              onError={() => setIframeError(true)}
              title={title ?? `TikTok reel`}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            {thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            )}
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="relative z-10 flex flex-col items-center gap-2 text-white/70 text-xs"
            >
              <ExternalLink className="w-8 h-8" />
              <span>Watch on TikTok</span>
            </a>
          </div>
        )}
      </div>

      {/* ══ GESTURE OVERLAY ══ */}
      {/* Captures single-tap to play/pause, double-tap to like, swipe on mobile */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        style={{ touchAction: "none", overscrollBehavior: "none" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      />

      {/* ══ PAUSE INDICATOR ══ */}
      {!isPlaying && isActive && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-18 h-18 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl animate-in zoom-in-75 duration-150">
            <Play className="w-9 h-9 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* ══ HEART BURST (Double-tap) ══ */}
      {showHeartBurst && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <Heart
            className="w-24 h-24 text-[#FE2C55] fill-[#FE2C55] drop-shadow-[0_0_25px_rgba(254,44,85,0.85)] animate-in zoom-in-50 fade-in duration-200"
          />
        </div>
      )}

      {/* ══ SOUND HINT (Tap to unmute) ══ */}
      {isMuted && !iframeLoading && isActive && (
        <div className="absolute inset-x-0 bottom-48 z-30 flex justify-center pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggleMute()
            }}
            className="flex items-center gap-2 bg-black/85 hover:bg-black active:scale-95 text-white backdrop-blur-md px-5 py-2.5 rounded-full border border-white/25 shadow-2xl transition-all cursor-pointer animate-bounce"
            aria-label="Tap to unmute"
          >
            <VolumeX className="w-4 h-4 text-[#FE2C55]" />
            <span className="text-white text-xs font-bold tracking-wide">Tap for sound 🔊</span>
          </button>
        </div>
      )}

      {/* ══ TOP-RIGHT AUDIO CONTROL ══
          Desktop: Hover reveals horizontal volume slider with smooth CSS transition
          Mobile: Minimal circular button ONLY displaying mute and unmute icon
      */}
      <div
        className={cn(
          "absolute top-3 right-3 z-30 flex items-center justify-end transition-opacity duration-200",
          isActive ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0 invisible"
        )}
        onClick={e => { e.preventDefault(); e.stopPropagation() }}
      >
        {/* Desktop: Collapsible hover slider pill */}
        <div className="group/vol hidden sm:flex items-center bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full border border-white/20 p-1 shadow-xl transition-all duration-300 ease-out">
          {/* Slider & readout (revealed on hover) */}
          <div className="flex items-center gap-2 max-w-0 opacity-0 group-hover/vol:max-w-[140px] group-hover/vol:opacity-100 transition-all duration-300 ease-out overflow-hidden px-0 group-hover/vol:px-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                e.stopPropagation()
                onVolumeChange?.(Number(e.target.value))
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-16 h-1 bg-white/25 rounded-lg appearance-none cursor-pointer accent-[#FE2C55]"
              aria-label="Volume slider"
            />
            <span className="text-[11px] font-mono font-bold text-white/90 select-none">
              {isMuted ? "0%" : `${volume}%`}
            </span>
          </div>

          {/* Audio Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggleMute()
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all text-white cursor-pointer"
            aria-label={isMuted ? "Unmute" : "Mute"}
            title={isMuted ? "Unmute" : `Volume ${volume}% (Click to mute)`}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#FE2C55]" />
            ) : volume < 50 ? (
              <Volume1 className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Mobile: Only display mute/unmute icon, zero extra controls */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleToggleMute()
          }}
          className="sm:hidden w-10 h-10 rounded-full bg-black/60 active:scale-90 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-xl cursor-pointer"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-[#FE2C55]" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* ══ RIGHT SIDEBAR ══ */}
      <div
        className={cn(
          "absolute right-2 z-30 flex flex-col items-center gap-3 transition-opacity duration-200",
          isActive ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0 invisible"
        )}
        style={{ bottom: "88px" }}
        onClick={e => { e.preventDefault(); e.stopPropagation() }}
      >
        <div className="flex flex-col items-center mb-1">
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="relative block active:scale-90 transition-transform"
          >
            <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-zinc-800 shadow-lg">
              {authorAvatar
                ? <img src={authorAvatar} alt={authorName ?? ""} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm">{(authorName || "EM").slice(0, 2).toUpperCase()}</div>
              }
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#FE2C55] rounded-full flex items-center justify-center border-2 border-black shadow-md">
              <span className="text-white text-[10px] font-black leading-none">+</span>
            </div>
          </a>
        </div>

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLike() }}
          disabled={likeLoading}
          className={cn("flex flex-col items-center gap-0.5 active:scale-90 transition-transform cursor-pointer", likeLoading && "opacity-60")}
          aria-label="Like"
        >
          <Heart className={cn("w-7 h-7 drop-shadow-md transition-all duration-200", liked ? "fill-[#FE2C55] text-[#FE2C55] scale-110" : "fill-white text-white")} />
          <span className="text-white text-[11px] font-semibold drop-shadow-md">{formatCompactNumber(totalLikes)}</span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); openComments() }}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform cursor-pointer"
          aria-label="Comments"
        >
          <MessageCircle className="w-7 h-7 fill-white text-white drop-shadow-md" />
          <span className="text-white text-[11px] font-semibold drop-shadow-md">{formatCompactNumber(totalComments)}</span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShare() }}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform cursor-pointer"
          aria-label="Share"
        >
          <Share2 className="w-6 h-6 text-white fill-white drop-shadow-md" />
          <span className="text-white text-[11px] font-semibold drop-shadow-md">
            {shareLabel !== "Share" ? shareLabel : formatCompactNumber(tiktokShares || 0)}
          </span>
        </button>

        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform cursor-pointer"
          aria-label="Open on TikTok"
        >
          <ExternalLink className="w-5 h-5 text-white drop-shadow-md" />
          <span className="text-white/70 text-[10px] font-medium">TikTok</span>
        </a>

        {musicTitle && (
          <div className="w-9 h-9 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center shadow-lg overflow-hidden" style={{ animation: "spin 4s linear infinite" }}>
            <div className="w-3.5 h-3.5 rounded-full bg-zinc-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            </div>
          </div>
        )}
      </div>

      {/* ══ BOTTOM OVERLAY ══ */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-200",
          isActive ? "opacity-100" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div
          className="relative px-3 pb-4 pt-16 pointer-events-auto max-w-[calc(100%-64px)]"
          onClick={e => { e.preventDefault(); e.stopPropagation() }}
        >
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-block font-bold text-white text-sm drop-shadow-md mb-1 hover:opacity-80 active:opacity-70 transition-opacity"
          >
            @{authorName}
          </a>
          {(title || caption) && (
            <div className="mb-2">
              <p className={cn("text-white text-sm leading-snug drop-shadow", !captionExpanded && "line-clamp-2")}>{title || caption}</p>
              {(title || caption || "").length > 80 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCaptionExpanded(v => !v)
                  }}
                  className="text-white/60 hover:text-white/90 text-xs font-semibold mt-0.5 cursor-pointer"
                >
                  {captionExpanded ? "less" : "more"}
                </button>
              )}
            </div>
          )}
          {relatedProject && (
            <a
              href={relatedProject.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded-full bg-[#FE2C55] text-white font-bold text-xs active:scale-95 transition-transform shadow-lg cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{relatedProject.name}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
          {musicTitle && (
            <div className="flex items-center gap-2 mt-1">
              <Disc3 className="w-3.5 h-3.5 text-white shrink-0" style={{ animation: "spin 3s linear infinite" }} />
              <p className="text-white text-xs font-medium truncate drop-shadow">{musicTitle}</p>
            </div>
          )}
        </div>
      </div>

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

export const ReelCard = memo(ReelCardComponent)
