import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"

export async function GET() {
  try { await requireAuth() } catch (e) { return e as Response }

  const now = new Date()
  const d7  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000)
  const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [total, last7, last30, allEvents] = await Promise.all([
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: d7  } } }),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: d30 } } }),
    prisma.analyticsEvent.findMany({
      where:   { createdAt: { gte: d30 } },
      select:  { path: true, referrer: true, deviceType: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  // Per-page breakdown
  const pageCounts: Record<string, number> = {}
  const referrerCounts: Record<string, number> = {}
  const deviceCounts: Record<string, number> = {}
  const dailyCounts: Record<string, number> = {}

  for (const e of allEvents) {
    pageCounts[e.path] = (pageCounts[e.path] ?? 0) + 1
    if (e.referrer) referrerCounts[e.referrer] = (referrerCounts[e.referrer] ?? 0) + 1
    deviceCounts[e.deviceType] = (deviceCounts[e.deviceType] ?? 0) + 1
    const day = e.createdAt.toISOString().slice(0, 10)
    dailyCounts[day] = (dailyCounts[day] ?? 0) + 1
  }

  const sortDesc = (obj: Record<string, number>) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }))

  return NextResponse.json({
    totals:   { total, last7, last30 },
    pages:    sortDesc(pageCounts),
    devices:  sortDesc(deviceCounts),
    referrers: sortDesc(referrerCounts),
    daily:    Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
  })
}
