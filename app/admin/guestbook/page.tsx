import { prisma } from "@/lib/db"
import { GuestbookAdmin } from "@/components/admin/GuestbookAdmin"

export default async function AdminGuestbook() {
  const entries = await prisma.guestbookEntry.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  })

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
