import { PrismaClient } from "@prisma/client"
import { PrismaNeonHttp } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import https from "https"
import dns from "dns"
import fs from "fs"
import path from "path"

// Force IPv4 for DNS resolution — Node v24 prefers IPv6 by default which
// causes fetch to hang on AWS-hosted Neon endpoints that don't respond on IPv6.
dns.setDefaultResultOrder("ipv4first")

/**
 * Custom fetch implementation using Node's https.request with family:4.
 * Node v24's built-in fetch ignores dns.setDefaultResultOrder, so we bypass
 * it entirely and force IPv4 at the socket level.
 */
function ipv4Fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    const u = new URL(
      typeof input === "string" ? input : (input as Request).url ?? String(input)
    )
    const body = init?.body as string | undefined
    const reqOptions: https.RequestOptions = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: (init?.method ?? "GET").toUpperCase(),
      headers: (init?.headers ?? {}) as Record<string, string>,
      family: 4, // IPv4 only
    }

    const req = https.request(reqOptions, (res) => {
      const chunks: Buffer[] = []
      res.on("data", (c: Buffer) => chunks.push(c))
      res.on("end", () => {
        const buf = Buffer.concat(chunks)
        const text = buf.toString("utf8")
        resolve({
          ok: (res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 300,
          status: res.statusCode ?? 0,
          statusText: res.statusMessage ?? "",
          headers: new Headers(res.headers as Record<string, string>),
          text: () => Promise.resolve(text),
          json: () => Promise.resolve(JSON.parse(text)),
          arrayBuffer: () => Promise.resolve(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer),
          blob: () => Promise.resolve(new Blob([buf])),
          clone: () => { throw new Error("clone not implemented") },
          body: null,
          bodyUsed: false,
          formData: () => Promise.reject(new Error("formData not implemented")),
          redirected: false,
          type: "default",
          url: u.href,
        } as unknown as Response)
      })
    })

    req.on("error", reject)
    if (body) req.write(body)
    req.end()
  })
}

function getDatabaseUrl(): string {
  let url = process.env.DATABASE_URL || ""
  if (!url) {
    try {
      const envPath = path.resolve(process.cwd(), ".env.local")
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf8")
        const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)
        if (match) url = match[1]
      }
    } catch {
      // ignore
    }
  }

  url = url.trim().replace(/^["']|["']$/g, "")
  if (url.includes("channel_binding=")) {
    url = url.replace(/([?&])channel_binding=[^&]*&?/g, "$1").replace(/[?&]$/, "")
  }
  return url
}

function createPrismaClient() {
  const url = getDatabaseUrl()
  // Inject IPv4-only fetch into the Neon adapter
  neonConfig.fetchFunction = ipv4Fetch as unknown as typeof fetch
  const adapter = new PrismaNeonHttp(url, {})
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
