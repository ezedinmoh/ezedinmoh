"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Layers, FileText, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/",         label: "Home",     icon: Home },
  { href: "/about",    label: "About",    icon: User },
  { href: "/projects", label: "Projects", icon: Layers, featured: true },
  { href: "/resume",   label: "Resume",   icon: FileText },
  { href: "/contact",  label: "Contact",  icon: Mail },
] as const

export function BottomNav() {
  const pathname = usePathname()

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12)
      } catch {}
    }
  }

  // Never show on admin dashboard
  if (pathname.startsWith("/admin")) return null

  return (
    <div
      className="lg:hidden fixed left-1/2 -translate-x-1/2 z-50"
      style={{ bottom: "max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))" }}
    >
      <nav
        className={cn(
          "flex items-center gap-0.5",
          "bg-card/90 backdrop-blur-2xl",
          "border border-border/60",
          "rounded-2xl shadow-2xl shadow-black/25",
          "px-2 py-2"
        )}
        aria-label="Site navigation"
      >
        {navItems.map(({ href, label, icon: Icon, featured }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/")

          /* ── Featured Projects button — icon chip, same height as others ── */
          if (featured) {
            return (
              <Link
                key={href}
                href={href}
                onClick={triggerHaptic}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-transform duration-150 active:scale-90"
              >
                {/* Icon inside a coloured badge chip */}
                <span
                  className={cn(
                    "flex items-center justify-center rounded-xl transition-all duration-300",
                    "w-12 h-8",
                    isActive
                      ? "bg-primary shadow-md shadow-primary/35 text-primary-foreground"
                      : "bg-primary/12 text-primary hover:bg-primary/20"
                  )}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </span>
                <span
                  className={cn(
                    "text-[10px] font-semibold leading-none",
                    isActive ? "text-primary" : "text-primary/70"
                  )}
                >
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
              onClick={triggerHaptic}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-xl",
                "transition-all duration-150 active:scale-90",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {/* small active dot above icon */}
              <span
                className={cn(
                  "block h-1 w-4 rounded-full transition-all duration-300 mb-0.5",
                  isActive ? "bg-primary opacity-100 scale-100" : "opacity-0 scale-50"
                )}
              />
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
