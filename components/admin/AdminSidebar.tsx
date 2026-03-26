"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, FolderKanban, MessageSquare, Mail, BarChart2, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/admin",           label: "Overview",   icon: LayoutDashboard },
  { href: "/admin/projects",  label: "Projects",   icon: FolderKanban    },
  { href: "/admin/guestbook", label: "Guestbook",  icon: MessageSquare   },
  { href: "/admin/messages",  label: "Messages",   icon: Mail            },
  { href: "/admin/analytics", label: "Analytics",  icon: BarChart2       },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-56 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <span className="font-bold text-foreground text-lg">Admin Panel</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === href
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
