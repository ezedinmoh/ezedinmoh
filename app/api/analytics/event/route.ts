import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { validateBody } from "@/lib/api/validate"
import { rateLimit } from "@/lib/rate-limit"
import { parseDeviceType, isBot } from "@/lib/analytics"
import { AnalyticsEventSchema } from "@/lib/validations"

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  const ua = req.headers.get("user-agent") ?? ""

  if (isBot(ua)) return NextResponse.json({ ok: true })

  // Only rate limit in production to avoid dev friction
  if (process.env.NODE_ENV === "production") {
    const { success } = await rateLimit(ip, "analytics", 10, 60)
    if (!success) return NextResponse.json({ message: "Too many requests" }, { status: 429 })
  }

  try {
    const body = await validateBody(req, AnalyticsEventSchema)

    const deviceType = parseDeviceType(body.userAgent ?? ua)
    const country = req.headers.get("x-vercel-ip-country") ?? undefined

    // Extract referrer domain only — no full URL stored
    let referrer: string | undefined
    if (body.referrer) {
      try { referrer = new URL(body.referrer).hostname } catch { /* ignore */ }
    }

    await prisma.analyticsEvent.create({
      data: {
        path:       body.path,
        referrer:   referrer ?? null,
        deviceType,
        country:    country ?? null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
