"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Code2, FileText, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/",        label: "Home",     icon: Home },
  { href: "/about",   label: "About",    icon: User },
  { href: "/projects",label: "Projects", icon: Code2, featured: true },
  { href: "/resume",  label: "Resume",   icon: FileText },
  { href: "/contact", label: "Contact",  icon: Mail },
] as const

export function BottomNav() {
  const pathname = usePathname()

  // Hide entirely on admin dashboard
  if (pathname.startsWith("/admin")) return null

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto flex items-end gap-1",
          "bg-card/75 backdrop-blur-2xl",
          "border border-border/50",
          "rounded-2xl shadow-2xl shadow-black/20",
          "px-2 py-2"
        )}
        aria-label="Site navigation"
      >
        {navItems.map(({ href, label, icon: Icon, featured }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/")

          /* ── Centre focal Projects button ── */
          if (featured) {
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  // elevate above the bar
                  "-mt-7 mx-1",
                  "relative flex flex-col items-center gap-1.5",
                  "px-5 py-3.5 rounded-2xl",
                  // gradient fill
                  "bg-gradient-to-br from-primary via-primary to-primary/70",
                  "text-primary-foreground",
                  // glow
                  "shadow-lg shadow-primary/50",
                  // interaction
                  "transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/60 active:scale-95",
                  // active ring
                  isActive && "ring-2 ring-white/30 ring-offset-2 ring-offset-card"
                )}
              >
                {/* subtle inner highlight */}
                <span className="absolute inset-x-3 top-1.5 h-px rounded-full bg-white/30" />
                {/* animated pulse dot when active */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary animate-pulse" />
                )}
                <Icon className="w-6 h-6 drop-shadow-sm" strokeWidth={2.5} />
                <span className="text-[10px] font-bold tracking-wide leading-none">
                  {label}
                </span>
              </Link>
            )
          }

          /* ── Regular nav items ── */
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl",
                "transition-all duration-200",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              {/* active indicator dot */}
              <span
                className={cn(
                  "w-1 h-1 rounded-full mb-0.5 transition-all duration-300",
                  isActive ? "bg-primary scale-100" : "bg-transparent scale-0"
                )}
              />
              <Icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
