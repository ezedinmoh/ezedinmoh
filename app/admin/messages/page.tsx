import { prisma } from "@/lib/db"
import { MessagesAdmin } from "@/components/admin/MessagesAdmin"

export const dynamic = "force-dynamic"

const DEFAULT_MESSAGES = [
  { id: "m1", name: "Hassan Ali", email: "hassan@techventures.io", subject: "Full-Stack Opportunity", message: "Hi Ezedin, we loved your Smart Library & WEARIFY projects. Are you open to contract projects?", read: false, createdAt: new Date().toISOString() },
  { id: "m2", name: "Elena Rostova", email: "elena@designstudio.co", subject: "Collaboration Inquiry", message: "Hello! Would love to partner on an upcoming 3D web experience project.", read: true, createdAt: new Date().toISOString() },
]

export default async function AdminMessages() {
  let messages: any[] = []
  try {
    messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } })
  } catch (err) {
    console.warn("Admin Messages using static fallback due to DB connection timeout:", err)
  }

  if (!messages || messages.length === 0) {
    messages = DEFAULT_MESSAGES
  }

  const unread = messages.filter((m) => !m.read).length

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
