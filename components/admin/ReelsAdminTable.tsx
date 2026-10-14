"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Trash2, Pencil, ExternalLink, Heart, MessageSquare, RefreshCw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReelRow {
  id: string
  tiktokId: string
  tiktokUrl: string
  title: string | null
  views?: number
  tiktokLikes?: number
  tiktokComments?: number
  published: boolean
  featured: boolean
  order: number
  _count: { likes: number; comments: number }
}

export function ReelsAdminTable({ reels: initial }: { reels: ReelRow[] }) {
  const [reels, setReels] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState("")

  async function togglePublish(reel: ReelRow) {
    setLoading(reel.id)
    const res = await fetch(`/api/admin/reels/${reel.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !reel.published }),
    })
    if (res.ok) {
      setReels((prev) => prev.map((r) => r.id === reel.id ? { ...r, published: !r.published } : r))
    }
    setLoading(null)
  }

  async function deleteReel(reel: ReelRow) {
    if (!confirm(`Delete reel "${reel.title ?? reel.tiktokId}"? This cannot be undone.`)) return
    setLoading(reel.id)
    const res = await fetch(`/api/admin/reels/${reel.id}`, { method: "DELETE" })
    if (res.ok) {
      setReels((prev) => prev.filter((r) => r.id !== reel.id))
    }
    setLoading(null)
  }

  async function syncAllMetrics() {
    setSyncing(true)
    setSyncMsg("")
    try {
      const res = await fetch("/api/admin/reels/sync", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setSyncMsg(data.message || "Synced metrics successfully!")
        // Refresh table data
        const rRes = await fetch("/api/admin/reels")
        const rData = await rRes.json()
        if (rData.reels) setReels(rData.reels)
      } else {
        setSyncMsg(data.message || "Sync failed")
      }
    } catch {
      setSyncMsg("Sync error")
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMsg(""), 4000)
    }
  }

  if (reels.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border border-border rounded-xl">
        No reels yet.{" "}
        <Link href="/admin/reels/new" className="text-primary hover:underline">
          Add your first reel
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Showing {reels.length} reels</p>
        <div className="flex items-center gap-2">
          {syncMsg && <span className="text-xs text-primary font-medium">{syncMsg}</span>}
          <button
            onClick={syncAllMetrics}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground transition-all disabled:opacity-50"
            title="Fetch latest TikTok views, likes, comments"
          >
            {syncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Sync Live TikTok Stats</span>
          </button>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">#</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Title / ID</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  <Eye className="w-3.5 h-3.5 inline mr-1 text-cyan-500" />TikTok Views
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  <Heart className="w-3.5 h-3.5 inline mr-1 text-rose-500" />TikTok Likes
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  <Heart className="w-3.5 h-3.5 inline mr-1" />Site Likes
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1" />Comments
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reels.map((reel) => (
                <tr key={reel.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{reel.order + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground truncate max-w-[220px]">
                        {reel.title ?? <span className="text-muted-foreground italic">No title</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{reel.tiktokId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      reel.published
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    )}>
                      {reel.published ? "Published" : "Draft"}
                    </span>
                    {reel.featured && (
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground font-mono text-xs">{reel.views ?? 0}</td>
                  <td className="px-4 py-3 text-foreground font-mono text-xs">{reel.tiktokLikes ?? 0}</td>
                  <td className="px-4 py-3 text-foreground font-mono text-xs">{reel._count.likes}</td>
                  <td className="px-4 py-3 text-foreground font-mono text-xs">{reel._count.comments}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/reels/${reel.id}`}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => togglePublish(reel)}
                        disabled={loading === reel.id}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                        title={reel.published ? "Unpublish" : "Publish"}
                      >
                        {reel.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={reel.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                        title="View on TikTok"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => deleteReel(reel)}
                        disabled={loading === reel.id}
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
