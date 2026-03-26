import { prisma } from "@/lib/db"
import { MessagesAdmin } from "@/components/admin/MessagesAdmin"

export default async function AdminMessages() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } })
  const unread = messages.filter(m => !m.read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">{messages.length} total · {unread} unread</p>
      </div>
      <MessagesAdmin messages={messages} />
    </div>
  )
}
