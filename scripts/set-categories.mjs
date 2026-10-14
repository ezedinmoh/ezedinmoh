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

const categories = {
  "7690214314351037717": "Ecommerce",
  "7682790473752186133": "Web Design",
  "7670064348332576021": "Case Studies",
  "7690919403667377460": "Ecommerce",
  "7683112730294865173": "Showcase",
  "7677198929301196052": "Showcase",
  "7671611191864675605": "UI/UX",
  "7668291336642645269": "Web Design",
}

async function main() {
  for (const [tiktokId, category] of Object.entries(categories)) {
    await prisma.reel.update({
      where: { tiktokId },
      data: { category },
    })
    console.log(`Set category ${category} for ${tiktokId}`)
  }
  await prisma.$disconnect()
}

main().catch(console.error)
