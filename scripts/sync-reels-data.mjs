import https from "https"
import dns from "dns"
import dotenv from "dotenv"
import { createRequire } from "module"

dns.setDefaultResultOrder("ipv4first")
dotenv.config({ path: ".env.local", override: false })
dotenv.config({ path: ".env", override: false })

const require = createRequire(import.meta.url)
const { PrismaClient } = require("@prisma/client")
const { PrismaNeonHttp } = require("@prisma/adapter-neon")
const { neonConfig } = require("@neondatabase/serverless")

function ipv4Fetch(input, init) {
  return new Promise((resolve, reject) => {
    const u = new URL(typeof input === "string" ? input : (input.url ?? String(input)))
    const body = init?.body
    const req = https.request(
      {
        hostname: u.hostname,
        port: Number(u.port) || 443,
        path: u.pathname + u.search,
        method: (init?.method || "GET").toUpperCase(),
        headers: init?.headers || {},
        family: 4,
      },
      (res) => {
        const chunks = []
        res.on("data", (c) => chunks.push(c))
        res.on("end", () => {
          const buf = Buffer.concat(chunks)
          const text = buf.toString("utf8")
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: res.statusMessage ?? "",
            headers: { get: (k) => res.headers[k.toLowerCase()] ?? null },
            text: () => Promise.resolve(text),
            json: () => Promise.resolve(JSON.parse(text)),
            arrayBuffer: () => Promise.resolve(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)),
          })
        })
      }
    )
    req.on("error", reject)
    if (body) req.write(body)
    req.end()
  })
}

neonConfig.fetchFunction = ipv4Fetch

function getDbUrl() {
  let url = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "")
  url = url.replace(/([?&])channel_binding=[^&]*(&|$)/g, (_, pre, post) => post === "&" ? pre : "")
  return url
}

const adapter = new PrismaNeonHttp(getDbUrl(), {})
const prisma = new PrismaClient({ adapter })

async function fetchTikwm(tiktokId) {
  return new Promise((resolve) => {
    https.get(`https://www.tikwm.com/api/?url=https://www.tiktok.com/@ezedinmoh/video/${tiktokId}`, (res) => {
      let data = ""
      res.on("data", (c) => (data += c))
      res.on("end", () => {
        try {
          const json = JSON.parse(data)
          if (json.code === 0 && json.data) {
            resolve(json.data)
          } else {
            resolve(null)
          }
        } catch {
          resolve(null)
        }
      })
    }).on("error", () => resolve(null))
  })
}

async function main() {
  const reels = await prisma.reel.findMany({ orderBy: { order: "asc" } })
  console.log(`Found ${reels.length} reels in database. Fetching metadata and syncing...`)

  for (const r of reels) {
    console.log(`\nFetching metadata for reel ${r.tiktokId}...`)
    const data = await fetchTikwm(r.tiktokId)
    if (data) {
      const cover = data.cover || data.origin_cover || data.ai_dynamic_cover || null
      const title = data.title || r.title || "Portfolio Reel"
      const caption = data.title || r.caption || ""
      const views = data.play_count || 0
      const likes = data.digg_count || 0
      const comments = data.comment_count || 0
      const shares = data.share_count || 0
      const duration = data.duration || 0
      const authorName = data.author?.nickname || "Ezedin Moh"
      const authorAvatar = data.author?.avatar || null
      const musicTitle = data.music_info?.title || null

      await prisma.reel.update({
        where: { id: r.id },
        data: {
          title,
          caption,
          thumbnail: cover,
          views,
          tiktokLikes: likes,
          tiktokComments: comments,
          tiktokShares: shares,
          duration,
          authorName,
          authorAvatar,
          musicTitle,
          published: true,
        },
      })
      console.log(`  ✓ Updated reel ${r.tiktokId}: "${title.slice(0, 35)}..." | ${views} views | ${likes} likes | ${comments} comments`)
    } else {
      console.log(`  ⚠ TikWM failed for ${r.tiktokId}`)
    }
    await new Promise((res) => setTimeout(res, 800))
  }

  console.log("\nAll reels synced successfully with real TikTok metrics!")
  await prisma.$disconnect()
}

main().catch(console.error)
