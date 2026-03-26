// Falls back to in-memory map when Upstash env vars are not set
const inMemory = new Map<string, { count: number; reset: number }>()

export async function rateLimit(
  ip: string,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean }> {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Ratelimit } = await import("@upstash/ratelimit")
    const { Redis } = await import("@upstash/redis")
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    })
    const result = await limiter.limit(`${key}:${ip}`)
    return { success: result.success }
  }

  // In-memory fallback
  const mapKey = `${key}:${ip}`
  const now = Date.now()
  const entry = inMemory.get(mapKey)

  if (!entry || now > entry.reset) {
    inMemory.set(mapKey, { count: 1, reset: now + windowSeconds * 1000 })
    return { success: true }
  }

  if (entry.count >= limit) return { success: false }

  entry.count++
  return { success: true }
}
