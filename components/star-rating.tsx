"use client"

import { useState, useEffect } from "react"
import { Star, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  projectId: string
  initialSum?: number
  initialCount?: number
  compact?: boolean
  className?: string
}

export function StarRating({
  projectId,
  initialSum = 0,
  initialCount = 0,
  compact = false,
  className = "",
}: StarRatingProps) {
  const [sum, setSum] = useState(initialSum)
  const [count, setCount] = useState(initialCount)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const average = count > 0 ? Number((sum / count).toFixed(1)) : 0

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`project_rating_${projectId}`)
      if (stored) {
        setUserRating(Number(stored))
      }
    }
  }, [projectId])

  const handleRate = async (rating: number) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    // Optimistic UI update
    const previousUserRating = userRating
    const diff = previousUserRating ? rating - previousUserRating : rating
    const newCount = previousUserRating ? count : count + 1
    const newSum = sum + diff

    setUserRating(rating)
    setSum(newSum)
    setCount(newCount)

    if (typeof window !== "undefined") {
      localStorage.setItem(`project_rating_${projectId}`, rating.toString())
    }

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      })

      if (res.ok) {
        const data = await res.json()
        if (typeof data.averageRating === "number") {
          setCount(data.ratingCount)
          setSum(data.averageRating * data.ratingCount)
        }
      }
    } catch (err) {
      console.warn("Rating API submission failed:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeDisplayRating = hoverRating ?? userRating ?? Math.round(average)

  if (compact) {
    return (
      <div className={cn("inline-flex items-center gap-2 bg-secondary/40 border border-border/50 px-2.5 py-1 rounded-xl text-xs", className)}>
        {/* Overall Average Score Badge */}
        <div className="flex items-center gap-1 font-bold text-foreground">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{average > 0 ? average : "5.0"}</span>
          <span className="text-[10px] text-muted-foreground font-normal">/ 5.0</span>
        </div>

        <span className="w-px h-3 bg-border shrink-0" />

        {/* Total People Rated */}
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Users className="w-3 h-3 opacity-60" />
          {count > 0 ? `${count}` : "0"}
        </span>

        {/* Quick Rate Stars */}
        <div className="flex items-center gap-0.5 ml-1 border-l border-border/50 pl-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRate(star)
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="focus:outline-none p-0.5 transition-transform hover:scale-125"
              title={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  star <= activeDisplayRating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted/20 text-muted-foreground/30 hover:text-amber-400/60"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-card border border-border/80 rounded-2xl p-4 space-y-3 shadow-sm", className)}>
      {/* ── PlayStore Header: Overall Score + Voter Count ── */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
            Overall Rating
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">{average > 0 ? average : "5.0"}</span>
            <span className="text-sm font-bold text-amber-400">/ 5.0</span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-amber-400 mb-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground flex items-center justify-end gap-1">
            <Users className="w-3 h-3 opacity-60" />
            {count > 0 ? `${count} rating${count > 1 ? "s" : ""}` : "Be the first to rate"}
          </p>
        </div>
      </div>

      {/* ── Interactive Rate Component ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <span className="text-xs font-semibold text-foreground block">Rate this Project</span>
          <p className="text-[11px] text-muted-foreground">Tap stars to share your experience</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                className="focus:outline-none p-1 transition-transform hover:scale-125 active:scale-95"
              >
                <Star
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    star <= activeDisplayRating
                      ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                      : "fill-muted/20 text-muted-foreground/30 hover:text-amber-400/60"
                  )}
                />
              </button>
            ))}
          </div>

          {userRating ? (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 shrink-0">
              Your Rate: {userRating} ★
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
