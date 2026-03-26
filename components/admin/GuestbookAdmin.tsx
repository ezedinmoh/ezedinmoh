"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pin, Trash2, MessageSquare, RefreshCw } from "lucide-react"
import type { GuestbookEntry } from "@prisma/client"

export function GuestbookAdmin({ entries: initial }: { entries: GuestbookEntry[] }) {
  const router = useRouter()
  const [entries, setEntries] = useState(initial)
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [refreshing, setRefreshing] = useState(false)

  async function refresh() {
    setRefreshing(true)
    router.refresh()
    // re-fetch latest from API and update local state
    const res = await fetch("/api/guestbook")
    const data = await res.json()
    setEntries(data)
    setRefreshing(false)
  }

  async function togglePin(id: string, pinned: boolean) {
    await fetch(`/api/guestbook/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !pinned }),
    })
    setEntries(e => e.map(x => x.id === id ? { ...x, pinned: !pinned } : x))
  }

  async function saveReply(id: string) {
    const hostReply = replyText[id] ?? ""
    await fetch(`/api/guestbook/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostReply }),
    })
    setEntries(e => e.map(x => x.id === id ? { ...x, hostReply } : x))
    router.refresh()
  }

  async function deleteEntry(id: string) {
    if (!confirm("Delete this entry?")) return
    await fetch(`/api/guestbook/${id}`, { method: "DELETE" })
    setEntries(e => e.filter(x => x.id !== id))
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={refresh} disabled={refreshing} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-muted-foreground hover:text-foreground rounded-lg text-xs font-medium transition-all disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>
      {entries.length === 0 && <p className="text-muted-foreground text-sm">No entries yet</p>}
      {entries.map(entry => (
        <div key={entry.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {entry.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{entry.name}</p>
                <p className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</p>
              </div>
              {entry.pinned && <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Pinned</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => togglePin(entry.id, entry.pinned)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Toggle pin">
                <Pin className="w-4 h-4" />
              </button>
              <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-sm text-foreground">{entry.message}</p>

          {entry.hostReply && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-foreground">
              <span className="text-xs text-primary font-medium block mb-1">Your reply</span>
              {entry.hostReply}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText[entry.id] ?? entry.hostReply ?? ""}
              onChange={e => setReplyText(r => ({ ...r, [entry.id]: e.target.value }))}
              className="flex-1 px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => saveReply(entry.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
