"use client"

import { useState } from "react"
import { Eye, EyeOff, Trash2, Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface CommentRow {
  id: string
  displayName: string
  text: string
  hidden: boolean
  flagged: boolean
  createdAt: string | Date
  reel: { title: string | null; tiktokId: string }
}

export function ReelCommentsAdmin({ comments: initial }: { comments: CommentRow[] }) {
  const [comments, setComments] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function patch(id: string, data: Record<string, unknown>) {
    setLoading(id)
    const res = await fetch(`/api/admin/reels/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, ...updated } : c))
    }
    setLoading(null)
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment permanently?")) return
    setLoading(id)
    const res = await fetch(`/api/admin/reels/comments/${id}`, { method: "DELETE" })
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id))
    setLoading(null)
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border border-border rounded-xl">
        No comments yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div
          key={c.id}
          className={cn(
            "p-4 border rounded-xl transition-colors",
            c.hidden ? "border-amber-500/20 bg-amber-500/5" : "border-border bg-card"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-foreground">{c.displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </span>
                <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
                  {c.reel.title ?? c.reel.tiktokId}
                </span>
                {c.hidden && (
                  <span className="text-xs text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">Hidden</span>
                )}
                {c.flagged && (
                  <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Flagged</span>
                )}
              </div>
              <p className="text-sm text-foreground break-words">{c.text}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => patch(c.id, { hidden: !c.hidden })}
                disabled={loading === c.id}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                title={c.hidden ? "Show comment" : "Hide comment"}
              >
                {c.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => patch(c.id, { flagged: !c.flagged })}
                disabled={loading === c.id}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  c.flagged
                    ? "text-red-500 bg-red-500/10"
                    : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                )}
                title={c.flagged ? "Unflag" : "Flag"}
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => remove(c.id)}
                disabled={loading === c.id}
                className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
