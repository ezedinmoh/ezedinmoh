"use client"

import { useState, useEffect, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"
import { Send, MessageSquareHeart, Search, ArrowUpDown, Pin, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const AVATARS = ["🦊", "🐼", "🦁", "🐸", "🦋", "🐙", "🦄", "🐺", "🦅", "🐬", "🌟", "🔥", "🌈", "🎭", "🚀", "🎸"]
const REACTIONS = ["👍", "❤️", "🔥"] as const
type Reaction = typeof REACTIONS[number]

interface Entry {
  id: string
  name: string
  message: string
  avatar: string
  reactions: Record<string, number>
  pinned: boolean
  hostReply: string | null
  createdAt: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

type SortMode = "newest" | "oldest" | "most-reacted"

function MessageCard({ entry, index, userReacted, onReact }: {
  entry: Entry; index: number
  userReacted: Record<string, boolean>
  onReact: (id: string, emoji: string) => void
}) {
  const colors = [
    "from-primary/5 to-primary/10 border-primary/20",
    "from-accent/5 to-accent/10 border-accent/20",
    "from-secondary to-secondary/50 border-border",
    "from-card to-muted/30 border-border",
  ]
  const colorClass = colors[index % colors.length]

  return (
    <div className={cn(
      "masonry-item bg-gradient-to-br border rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 animate-fade-in-up",
      colorClass, entry.pinned && "ring-1 ring-primary/40"
    )} style={{ animationDelay: `${Math.min(index * 0.06, 0.5)}s`, opacity: 0 }}>
      {entry.pinned && (
        <div className="flex items-center gap-1 text-xs text-primary mb-2 font-medium">
          <Pin className="w-3 h-3" /> Pinned
        </div>
      )}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center text-xl shrink-0 border border-border">
          {entry.avatar || "🙂"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground text-sm truncate">{entry.name}</p>
          <p className="text-xs text-muted-foreground">{timeAgo(entry.createdAt)}</p>
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{entry.message}</p>

      {entry.hostReply && (
        <div className="mt-2 mb-3 pl-3 border-l-2 border-primary/40 bg-primary/5 rounded-r-lg py-2 pr-2">
          <p className="text-xs text-primary font-medium mb-0.5">Ezedin replied</p>
          <p className="text-xs text-muted-foreground">{entry.hostReply}</p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {REACTIONS.map(r => {
          const count = entry.reactions?.[r] ?? 0
          const reacted = userReacted[`${entry.id}:${r}`] ?? false
          return (
            <button key={r} onClick={() => onReact(entry.id, r)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-all hover:scale-110",
                reacted
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "bg-background/50 border-border text-muted-foreground hover:border-primary/30"
              )}>
              {r} {count > 0 && <span>{count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortMode>("newest")
  const [userReacted, setUserReacted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch("/api/guestbook")
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const fireConfetti = useCallback(async () => {
    const confetti = (await import("canvas-confetti")).default
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#64c8b4", "#a78bfa", "#f472b6", "#facc15"] })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setSubmitting(true)
    setError("")

    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), message: text.trim(), avatar }),
    })

    const data = await res.json()
    setSubmitting(false)

    if (res.ok) {
      setEntries(prev => [data, ...prev])
      setName("")
      setText("")
      setAvatar(AVATARS[Math.floor(Math.random() * AVATARS.length)])
      fireConfetti()
    } else {
      setError(data.message ?? "Something went wrong. Try again.")
    }
  }

  const handleReact = async (id: string, emoji: string) => {
    const key = `${id}:${emoji}`
    const alreadyReacted = userReacted[key] ?? false
    const action = alreadyReacted ? "decrement" : "increment"

    setUserReacted(prev => ({ ...prev, [key]: !alreadyReacted }))
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e
      const current = e.reactions?.[emoji] ?? 0
      return { ...e, reactions: { ...e.reactions, [emoji]: Math.max(0, current + (alreadyReacted ? -1 : 1)) } }
    }))

    await fetch(`/api/guestbook/${id}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji, action }),
    })
  }

  const totalReactions = (e: Entry) =>
    Object.values(e.reactions ?? {}).reduce((a: number, b) => a + (b as number), 0)

  const filtered = entries
    .filter(e => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return e.name.toLowerCase().includes(q) || e.message.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return totalReactions(b) - totalReactions(a)
    })

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <AnimatedCursor />
      <Navigation />

      <div className="pt-24 pb-20 container mx-auto px-6 max-w-6xl relative">
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 -z-0">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-morph" />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "4s" }} />
        </div>

        <div className="text-center mb-14 animate-slide-up opacity-0 stagger-1" style={{ animationFillMode: "forwards" }}>
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-2 block">Say Hello</span>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Guest<span className="text-gradient">book</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Leave a message, share your thoughts, or just say hi. I read every single one.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto mb-16 animate-scale-in opacity-0 stagger-2" style={{ animationFillMode: "forwards" }}>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="mb-5">
              <label className="text-sm font-medium text-foreground mb-3 block">Pick your avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map(em => (
                  <button key={em} type="button" onClick={() => setAvatar(em)}
                    className={cn("w-10 h-10 text-xl rounded-xl transition-all hover:scale-110",
                      avatar === em ? "bg-primary/20 ring-2 ring-primary scale-110" : "bg-secondary hover:bg-secondary/80"
                    )}>{em}</button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Your name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex Chen" maxLength={40} required
                className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Your message</label>
              <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder="Leave a kind word, feedback, or just say hi 👋" maxLength={280} required rows={3}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" />
              <p className="text-xs text-muted-foreground mt-1 text-right">{text.length}/280</p>
            </div>
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            <button type="submit" disabled={submitting || !name.trim() || !text.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" />Posting…</>
                : <><Send className="w-4 h-4" />Sign the Guestbook</>}
            </button>
          </form>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…"
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select value={sort} onChange={e => setSort(e.target.value as SortMode)}
              className="pl-10 pr-8 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="most-reacted">Most reacted</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquareHeart className="w-4 h-4 text-primary" />
            {filtered.length} message{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-5xl mb-4">💬</p>
            <p>{search ? "No messages match your search." : "No messages yet. Be the first to sign!"}</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {filtered.map((entry, i) => (
              <MessageCard key={entry.id} entry={entry} index={i}
                userReacted={userReacted} onReact={handleReact} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
