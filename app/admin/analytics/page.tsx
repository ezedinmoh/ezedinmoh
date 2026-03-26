import { prisma } from "@/lib/db"
import { BarChart2, Monitor, Smartphone, Tablet } from "lucide-react"
import { StatCard } from "@/components/admin/StatCard"
import { AnalyticsChart } from "@/components/admin/AnalyticsChart"

export const dynamic = "force-dynamic"

export default async function AdminAnalytics() {
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

  const pageCounts:     Record<string, number> = {}
  const referrerCounts: Record<string, number> = {}
  const deviceCounts:   Record<string, number> = {}
  const dailyCounts:    Record<string, number> = {}

  for (const e of allEvents) {
    pageCounts[e.path] = (pageCounts[e.path] ?? 0) + 1
    if (e.referrer) referrerCounts[e.referrer] = (referrerCounts[e.referrer] ?? 0) + 1
    deviceCounts[e.deviceType] = (deviceCounts[e.deviceType] ?? 0) + 1
    const day = e.createdAt.toISOString().slice(0, 10)
    dailyCounts[day] = (dailyCounts[day] ?? 0) + 1
  }

  const sortDesc = (obj: Record<string, number>) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1])

  const dailyData = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }))
  const deviceIcon = { desktop: Monitor, mobile: Smartphone, tablet: Tablet }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="All Time Views" value={total}  icon={BarChart2} />
        <StatCard label="Last 30 Days"   value={last30} icon={BarChart2} />
        <StatCard label="Last 7 Days"    value={last7}  icon={BarChart2} />
      </div>

      <AnalyticsChart data={dailyData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Top Pages</h2>
          <div className="space-y-2">
            {sortDesc(pageCounts).slice(0, 10).map(([path, count]) => (
              <div key={path} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground truncate">{path}</span>
                <span className="font-medium text-foreground ml-2">{count}</span>
              </div>
            ))}
            {Object.keys(pageCounts).length === 0 && <p className="text-sm text-muted-foreground">No data yet</p>}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Devices</h2>
          <div className="space-y-3">
            {sortDesc(deviceCounts).map(([type, count]) => {
              const Icon = deviceIcon[type as keyof typeof deviceIcon] ?? Monitor
              return (
                <div key={type} className="flex items-center gap-3 text-sm">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground capitalize flex-1">{type}</span>
                  <span className="font-medium text-foreground">{count}</span>
                </div>
              )
            })}
            {Object.keys(deviceCounts).length === 0 && <p className="text-sm text-muted-foreground">No data yet</p>}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Top Referrers</h2>
          <div className="space-y-2">
            {sortDesc(referrerCounts).slice(0, 10).map(([ref, count]) => (
              <div key={ref} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground truncate">{ref}</span>
                <span className="font-medium text-foreground ml-2">{count}</span>
              </div>
            ))}
            {Object.keys(referrerCounts).length === 0 && <p className="text-sm text-muted-foreground">No referrers yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
