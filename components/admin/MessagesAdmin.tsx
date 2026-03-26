"use client"

import { useState } from "react"
import type { ContactMessage } from "@prisma/client"

export function MessagesAdmin({ messages: initial }: { messages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initial)
  const [open, setOpen] = useState<string | null>(null)

  async function markRead(id: string) {
    await fetch(`/api/messages/${id}/read`, { method: "PATCH" })
    setMessages(m => m.map(x => x.id === id ? { ...x, read: true } : x))
  }

  function toggle(id: string, read: boolean) {
    setOpen(o => o === id ? null : id)
    if (!read) markRead(id)
  }

  return (
    <div className="space-y-3">
      {messages.length === 0 && <p className="text-muted-foreground text-sm">No messages yet</p>}
      {messages.map(m => (
        <div key={m.id} className="bg-card border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => toggle(m.id, m.read)}
            className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-secondary/20 transition-colors"
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${m.read ? "bg-muted-foreground/30" : "bg-primary"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground text-sm">{m.name}</span>
                <span className="text-xs text-muted-foreground">{m.email}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{m.subject}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{new Date(m.createdAt).toLocaleDateString()}</span>
          </button>

          {open === m.id && (
            <div className="px-5 pb-5 border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-1">{m.subject}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
              <a
                href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-all"
              >
                Reply via Email
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
