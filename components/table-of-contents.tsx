"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { List } from "lucide-react"
import type { TocItem } from "@/lib/blog"

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    if (items.length === 0) return
    const ids = items.map((i) => i.id)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-20% 0% -70% 0%" }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav className="sticky top-28 w-56 shrink-0 hidden xl:block">
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <List className="w-3.5 h-3.5" />
          On this page
        </div>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block text-sm py-1 transition-colors hover:text-primary truncate",
                  item.level === 3 && "pl-3",
                  item.level === 4 && "pl-6",
                  active === item.id ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
