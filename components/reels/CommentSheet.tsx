"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X, Send, MessageCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  displayName: string
  text: string
  createdAt: string
}

interface CommentSheetProps {
  reelId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCommentAdded?: () => void
}

export function CommentSheet({ reelId, open, onOpenChange, onCommentAdded }: CommentSheetProps) {
  const [mounted, setMounted] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      fetchComments(1, true)
      setTimeout(() => inputRef.current?.focus(), 300)
    } else {
      setComments([])
      setPage(1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reelId])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onOpenChange])

  // Scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  async function fetchComments(p: number, reset = false) {
    if (reset) setLoading(true)
    else setLoadingMore(true)
    try {
      const res = await fetch(`/api/reels/${reelId}/comments?page=${p}`)
      const data = await res.json()
      setComments((prev) => reset ? data.comments : [...prev, ...data.comments])
      setTotal(data.total)
      setPage(p)
      setHasMore(p < data.pages)
    } catch {
      // ignore
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch(`/api/reels/${reelId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim() || "Anonymous", text: text.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.message ?? "Failed to post comment")
        return
      }
      setComments((prev) => [data.comment, ...prev])
      setTotal((t) => t + 1)
      setText("")
      onCommentAdded?.()
    } catch {
      setSubmitError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || !mounted || typeof document === "undefined") return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-50 transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Comments"
        className={cn(
          "fixed z-[60] bg-zinc-950 border-t border-zinc-800 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200",
          // Mobile: bottom sheet
          "bottom-0 left-0 right-0 rounded-t-3xl max-h-[75vh]",
          // Desktop: right panel
          "lg:bottom-0 lg:top-0 lg:left-auto lg:right-0 lg:w-[380px] lg:rounded-none lg:border-t-0 lg:border-l lg:max-h-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-white/60" />
            <span className="text-white font-semibold text-sm">{total} Comments</span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close comments"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-white/40 text-sm">No comments yet. Be the first!</p>
            </div>
          ) : (
            <>
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 text-xs text-white/60 font-medium">
                    {c.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-white text-xs font-semibold truncate">{c.displayName}</span>
                      <span className="text-white/30 text-[10px] shrink-0">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed break-words">{c.text}</p>
                  </div>
                </div>
              ))}
              {hasMore && (
                <button
                  onClick={() => fetchComments(page + 1)}
                  disabled={loadingMore}
                  className="w-full text-white/40 text-xs py-2 hover:text-white/60 transition-colors"
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              )}
            </>
          )}
        </div>

        {/* Comment form */}
        <div className="shrink-0 px-4 py-3 border-t border-zinc-800">
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name (optional)"
              maxLength={50}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan-500 transition-colors"
              aria-label="Display name"
            />
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                maxLength={500}
                required
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan-500 transition-colors"
                aria-label="Comment text"
              />
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="px-3 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Post comment"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            {submitError && (
              <p className="text-rose-400 text-xs" role="alert">{submitError}</p>
            )}
            <p className="text-white/20 text-[10px]">
              {text.length}/500 · Website comments only, not visible on TikTok
            </p>
          </form>
        </div>
      </div>
    </>,
    document.body
  )
}
