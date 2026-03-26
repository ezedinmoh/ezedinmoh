import { prisma } from "@/lib/db"
import { StatCard } from "@/components/admin/StatCard"
import { FolderKanban, MessageSquare, Mail, BarChart2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminOverview() {
  const now = new Date()
  const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [projectCount, guestbookCount, totalMessages, unreadCount, pageViews, recentGuests, recentMessages] =
    await Promise.all([
      prisma.project.count(),
      prisma.guestbookEntry.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.analyticsEvent.count({ where: { createdAt: { gte: d30 } } }),
      prisma.guestbookEntry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Your portfolio at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Projects"    value={projectCount}   icon={FolderKanban} />
        <StatCard label="Guestbook Entries" value={guestbookCount} icon={MessageSquare} />
        <StatCard label="Messages"          value={totalMessages}  icon={Mail} sub={`${unreadCount} unread`} />
        <StatCard label="Page Views (30d)"  value={pageViews}      icon={BarChart2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Recent Guestbook</h2>
          <div className="space-y-3">
            {recentGuests.length === 0 && <p className="text-sm text-muted-foreground">No entries yet</p>}
            {recentGuests.map(g => (
              <div key={g.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {g.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{g.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{g.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Recent Messages</h2>
          <div className="space-y-3">
            {recentMessages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet</p>}
            {recentMessages.map(m => (
              <div key={m.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${m.read ? "bg-muted-foreground" : "bg-primary"}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{m.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
