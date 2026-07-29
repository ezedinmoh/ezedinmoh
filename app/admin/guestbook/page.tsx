import { prisma } from "@/lib/db"
import { GuestbookAdmin } from "@/components/admin/GuestbookAdmin"

export const dynamic = "force-dynamic"

const DEFAULT_GUESTBOOK = [
  { id: "g1", name: "Alex Johnson", message: "Amazing portfolio! The animations are so smooth.", avatar: "", pinned: true, createdAt: new Date().toISOString() },
  { id: "g2", name: "Sarah Chen", message: "Love the design. Really clean and professional.", avatar: "", pinned: false, createdAt: new Date().toISOString() },
  { id: "g3", name: "Marcus Rivera", message: "The projects section is impressive. Great work!", avatar: "", pinned: false, createdAt: new Date().toISOString() },
  { id: "g4", name: "David Kim", message: "Inspiring work on WEARIFY and Smart Library!", avatar: "", pinned: false, createdAt: new Date().toISOString() },
]

export default async function AdminGuestbook() {
  let entries: any[] = []
  try {
    entries = await prisma.guestbookEntry.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    })
  } catch (err) {
    console.warn("Admin Guestbook using static fallback due to DB connection timeout:", err)
  }

  if (!entries || entries.length === 0) {
    entries = DEFAULT_GUESTBOOK
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Guestbook</h1>
        <p className="text-sm text-muted-foreground mt-1">{entries.length} entries</p>
      </div>
      <GuestbookAdmin entries={entries} />
    </div>
  )
}
