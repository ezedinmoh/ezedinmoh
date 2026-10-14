"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ExternalLink, RefreshCw, Eye, Heart, MessageSquare, Clock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReelData {
  id?: string
  tiktokId?: string
  tiktokUrl?: string
  title?: string | null
  caption?: string | null
  thumbnail?: string | null
  category?: string | null
  views?: number
  tiktokLikes?: number
  tiktokComments?: number
  duration?: number
  published?: boolean
  featured?: boolean
}

export function ReelForm({ reel }: { reel?: ReelData }) {
  const router = useRouter()
  const isEdit = !!reel?.id

  const [tiktokUrl, setTiktokUrl] = useState(reel?.tiktokUrl ?? "")
  const [title, setTitle] = useState(reel?.title ?? "")
  const [caption, setCaption] = useState(reel?.caption ?? "")
  const [thumbnail, setThumbnail] = useState(reel?.thumbnail ?? "")
  const [category, setCategory] = useState(reel?.category ?? "")
  const [views, setViews] = useState(reel?.views ?? 0)
  const [tiktokLikes, setTiktokLikes] = useState(reel?.tiktokLikes ?? 0)
  const [tiktokComments, setTiktokComments] = useState(reel?.tiktokComments ?? 0)
  const [duration, setDuration] = useState(reel?.duration ?? 0)
  const [published, setPublished] = useState(reel?.published ?? true)
  const [featured, setFeatured] = useState(reel?.featured ?? false)
  const [loading, setLoading] = useState(false)
  const [fetchingMeta, setFetchingMeta] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const tiktokId = tiktokUrl.match(/\/video\/(\d+)/)?.[1] ?? (tiktokUrl.match(/^\d+$/) ? tiktokUrl : null)

  async function fetchMetadata() {
    if (!tiktokUrl.trim()) return
    setFetchingMeta(true)
    setError("")
    try {
      const res = await fetch(`/api/reels/metadata?url=${encodeURIComponent(tiktokUrl.trim())}`)
      if (res.ok) {
        const data = await res.json()
        if (data.title && !title) setTitle(data.title)
        if (data.caption && !caption) setCaption(data.caption)
        if (data.thumbnail && !thumbnail) setThumbnail(data.thumbnail)
        if (typeof data.views === "number") setViews(data.views)
        if (typeof data.likes === "number") setTiktokLikes(data.likes)
        if (typeof data.comments === "number") setTiktokComments(data.comments)
        if (typeof data.duration === "number") setDuration(data.duration)
      } else {
        setError("Could not auto-fetch metadata from TikTok.")
      }
    } catch {
      setError("Network error while fetching TikTok info.")
    } finally {
      setFetchingMeta(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const body = {
      tiktokUrl: tiktokUrl.trim(),
      title: title.trim() || null,
      caption: caption.trim() || null,
      thumbnail: thumbnail.trim() || null,
      category: category.trim() || null,
      views,
      tiktokLikes,
      tiktokComments,
      duration,
      published,
      featured,
    }

    try {
      const res = await fetch(
        isEdit ? `/api/admin/reels/${reel!.id}` : "/api/admin/reels",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? "Something went wrong")
        return
      }
      setSuccess(isEdit ? "Reel updated!" : "Reel added!")
      if (!isEdit) {
        setTimeout(() => router.push("/admin/reels"), 800)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!reel?.id) return
    if (!confirm("Delete this reel? All likes and comments will also be deleted.")) return
    setLoading(true)
    const res = await fetch(`/api/admin/reels/${reel.id}`, { method: "DELETE" })
    if (res.ok) {
      router.push("/admin/reels")
    } else {
      setError("Delete failed")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* TikTok URL */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          TikTok URL <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={tiktokUrl}
            onChange={(e) => setTiktokUrl(e.target.value)}
            onBlur={() => { if (!title && tiktokUrl) fetchMetadata() }}
            placeholder="https://www.tiktok.com/@ezedinmoh/video/..."
            required
            disabled={isEdit}
            className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
          />
          <button
            type="button"
            onClick={fetchMetadata}
            disabled={fetchingMeta || !tiktokUrl}
            className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 flex items-center gap-1.5"
            title="Fetch stats from TikTok"
          >
            {fetchingMeta ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span className="text-xs">Fetch Stats</span>
          </button>
        </div>
        {tiktokId && (
          <p className="text-xs text-muted-foreground mt-1">Video ID: {tiktokId}</p>
        )}
      </div>

      {/* Real stats summary if available */}
      {(views > 0 || tiktokLikes > 0 || duration > 0) && (
        <div className="p-3 bg-secondary/40 border border-border rounded-xl grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">Views</span>
            <span className="font-bold text-foreground">{views}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">TikTok Likes</span>
            <span className="font-bold text-rose-500">{tiktokLikes}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Comments</span>
            <span className="font-bold text-amber-500">{tiktokComments}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Duration</span>
            <span className="font-bold text-foreground">{duration}s</span>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Auto-filled from TikTok or custom title"
          maxLength={200}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Caption */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Caption & Description</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Description and tags shown on the feed"
          maxLength={500}
          rows={3}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Thumbnail URL</label>
        <input
          type="url"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="Auto-filled from TikTok"
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt="Thumbnail preview" className="mt-2 w-24 h-32 object-cover rounded-lg border border-border shadow-md" />
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Web Design, UI/UX, Ecommerce, Case Studies, Showcase"
          maxLength={50}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary accent-primary"
          />
          <span className="text-sm text-foreground">Published</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary accent-primary"
          />
          <span className="text-sm text-foreground">Featured</span>
        </label>
      </div>

      {/* Embed preview */}
      {tiktokId && (
        <div>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showPreview ? "Hide" : "Show"} TikTok Player preview
          </button>
          {showPreview && (
            <div className="mt-2 border border-border rounded-2xl overflow-hidden bg-black" style={{ maxWidth: 320, height: 520 }}>
              <iframe
                src={`https://www.tiktok.com/player/v1/${tiktokId}?music_info=1&description=1`}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="TikTok preview"
              />
            </div>
          )}
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-1.5 transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> View original on TikTok
          </a>
        </div>
      )}

      {error && <p className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
      {success && <p className="text-sm text-green-600 bg-green-500/10 px-3 py-2 rounded-lg">{success}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-all"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Add Reel"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 disabled:opacity-60 transition-all"
          >
            Delete Reel
          </button>
        )}
      </div>
    </form>
  )
}
