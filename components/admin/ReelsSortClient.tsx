"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUp, ArrowDown, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReelRow {
  id: string
  tiktokId: string
  title: string | null
  order: number
  published: boolean
}

export function ReelsSortClient({ reels: initial }: { reels: ReelRow[] }) {
  const [reels, setReels] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  function move(index: number, direction: -1 | 1) {
    const newReels = [...reels]
    const target = index + direction
    if (target < 0 || target >= newReels.length) return
    ;[newReels[index], newReels[target]] = [newReels[target], newReels[index]]
    setReels(newReels)
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    const res = await fetch("/api/admin/reels/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reels.map((r) => r.id) }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      router.refresh()
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sort Reels</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag or use arrows to reorder</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            saved
              ? "bg-green-500/10 text-green-600 border border-green-500/20"
              : "bg-primary text-primary-foreground hover:opacity-90"
          )}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Order"}
        </button>
      </div>

      <div className="space-y-2">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl"
          >
            <span className="w-6 text-center text-sm text-muted-foreground font-mono">{index + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {reel.title ?? <span className="text-muted-foreground italic">No title</span>}
              </p>
              <p className="text-xs text-muted-foreground">{reel.tiktokId}</p>
            </div>
            {!reel.published && (
              <span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">Draft</span>
            )}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded disabled:opacity-30 transition-colors"
                aria-label="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => move(index, 1)}
                disabled={index === reels.length - 1}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded disabled:opacity-30 transition-colors"
                aria-label="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
