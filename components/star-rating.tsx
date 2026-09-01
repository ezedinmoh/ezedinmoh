"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
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
      <div className={cn("inline-flex items-center gap-1.5 text-xs", className)}>
        <div className="flex items-center gap-0.5">
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
                  star <= (hoverRating ?? userRating ?? Math.round(average))
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted/20 text-muted-foreground/40"
                )}
              />
            </button>
          ))}
        </div>
        <span className="font-semibold text-foreground">{average > 0 ? average : "New"}</span>
        {count > 0 && <span className="text-muted-foreground text-[11px]">({count})</span>}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-1.5 p-3 bg-secondary/30 border border-border/60 rounded-xl", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Project Rating
        </span>
        {userRating ? (
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Your Rating: {userRating} ★
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">Click to rate</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mt-1">
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
                    : "fill-muted/20 text-muted-foreground/30 hover:text-amber-300/60"
                )}
              />
            </button>
          ))}
        </div>

        <div className="text-right">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-lg font-bold text-foreground">{average > 0 ? average : "—"}</span>
            <span className="text-xs text-amber-400 font-semibold">★</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {count > 0 ? `${count} rating${count > 1 ? "s" : ""}` : "No ratings yet"}
          </p>
        </div>
      </div>
    </div>
  )
}
