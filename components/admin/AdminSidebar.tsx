"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, FolderKanban, MessageSquare, Mail, BarChart2, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/admin",           label: "Overview",   icon: LayoutDashboard },
  { href: "/admin/projects",  label: "Projects",   icon: FolderKanban    },
  { href: "/admin/guestbook", label: "Guestbook",  icon: MessageSquare   },
  { href: "/admin/messages",  label: "Messages",   icon: Mail            },
  { href: "/admin/analytics", label: "Analytics",  icon: BarChart2       },
]

function NavLinks({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex-1 p-4 space-y-1">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNav}
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
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar — only on lg+ */}
      <aside className="hidden lg:flex w-56 min-h-screen bg-card border-r border-border flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <span className="font-bold text-foreground text-lg">Admin Panel</span>
        </div>
        <NavLinks />
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

      {/* Mobile/tablet top bar — hidden on lg+ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <span className="font-bold text-foreground">Admin Panel</span>
        <button onClick={() => setOpen(true)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile/tablet drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-card border-r border-border flex flex-col h-full z-10">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-bold text-foreground">Admin Panel</span>
              <button onClick={() => setOpen(false)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavLinks onNav={() => setOpen(false)} />
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
        </div>
      )}
    </>
  )
}
