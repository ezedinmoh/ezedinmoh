import https from "https"

/**
 * Robustly extracts a numeric TikTok video ID from any TikTok URL variant or direct ID.
 */
export function extractTikTokId(url: string): string | null {
  if (!url) return null
  const trimmed = url.trim()

  // If already numeric ID
  if (/^\d{15,22}$/.test(trimmed)) {
    return trimmed
  }

  // Matches /video/{id}
  const videoMatch = trimmed.match(/\/video\/(\d{15,22})/)
  if (videoMatch) return videoMatch[1]

  // Matches /v/{id}
  const vMatch = trimmed.match(/\/v\/(\d{15,22})/)
  if (vMatch) return vMatch[1]

  // Matches any sequence of 18-20 digits
  const generalMatch = trimmed.match(/(\d{18,21})/)
  if (generalMatch) return generalMatch[1]

  return null
}

export interface TikTokOEmbed {
  title: string
  author_name: string
  author_url: string
  thumbnail_url: string
  thumbnail_width: number
  thumbnail_height: number
  html: string
}

export interface TikTokVideoMetadata {
  tiktokId: string
  title: string | null
  caption: string | null
  thumbnail: string | null
  views: number
  likes: number
  comments: number
  shares: number
  duration: number
  authorName: string | null
  authorUsername: string | null
  authorAvatar: string | null
  musicTitle: string | null
}

/**
 * Fetch rich TikTok metadata (views, likes, comments, shares, thumbnail, title)
 * via TikWM with fallback to TikTok oEmbed.
 */
export async function fetchTikTokMetadata(urlOrId: string): Promise<TikTokVideoMetadata | null> {
  const tiktokId = extractTikTokId(urlOrId)
  if (!tiktokId) return null

  const canonicalUrl = `https://www.tiktok.com/@ezedinmoh/video/${tiktokId}`

  // 1. Try TikWM API with 6s timeout
  try {
    const tikwmPromise = new Promise<any>((resolve) => {
      const req = https.get(
        `https://www.tikwm.com/api/?url=${encodeURIComponent(canonicalUrl)}`,
        { timeout: 6000 },
        (res) => {
          let data = ""
          res.on("data", (chunk) => (data += chunk))
          res.on("end", () => {
            try {
              const parsed = JSON.parse(data)
              resolve(parsed.code === 0 && parsed.data ? parsed.data : null)
            } catch {
              resolve(null)
            }
          })
        }
      )
      req.on("error", () => resolve(null))
      req.on("timeout", () => {
        req.destroy()
        resolve(null)
      })
    })

    const data = await tikwmPromise

    if (data) {
      const cover = data.cover || data.origin_cover || data.ai_dynamic_cover || null
      return {
        tiktokId,
        title: data.title || null,
        caption: data.title || null,
        thumbnail: cover,
        views: Number(data.play_count) || 0,
        likes: Number(data.digg_count) || 0,
        comments: Number(data.comment_count) || 0,
        shares: Number(data.share_count) || 0,
        duration: Number(data.duration) || 0,
        authorName: data.author?.nickname || "Ezedin Moh",
        authorUsername: data.author?.unique_id || "ezedinmoh",
        authorAvatar: data.author?.avatar || null,
        musicTitle: data.music_info?.title || null,
      }
    }
  } catch (err) {
    console.error("[TikTok API] TikWM error:", err)
  }

  // 2. Fallback to TikTok oEmbed
  const oembed = await fetchTikTokOEmbed(canonicalUrl)
  if (oembed) {
    return {
      tiktokId,
      title: oembed.title || null,
      caption: oembed.title || null,
      thumbnail: oembed.thumbnail_url || null,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      duration: 0,
      authorName: oembed.author_name || "Ezedin Moh",
      authorUsername: "ezedinmoh",
      authorAvatar: null,
      musicTitle: null,
    }
  }

  return null
}

/** Fetch TikTok oEmbed metadata. Returns null on any error. */
export async function fetchTikTokOEmbed(url: string): Promise<TikTokOEmbed | null> {
  try {
    const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    const res = await fetch(endpoint, {
      next: { revalidate: 86400 }, // cache 24h
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data as TikTokOEmbed
  } catch {
    return null
  }
}
