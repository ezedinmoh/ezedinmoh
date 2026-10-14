"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Menu, X, Home, User, FolderOpen, Clapperboard,
  FileText, MessageSquareHeart, Mail, ArrowRight, ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/reels", label: "Reels", icon: Clapperboard, featured: true },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/guestbook", label: "Guestbook", icon: MessageSquareHeart },
  { href: "/contact", label: "Contact", icon: Mail },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen])

  // close on route change
  useEffect(() => { setIsOpen(false) }, [pathname])

  const isReels = pathname?.startsWith("/reels")

  return (
    <header
      suppressHydrationWarning
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        atTop
          ? "py-5 bg-transparent"
          : "py-3 bg-background/95 backdrop-blur-md border-b border-border/40"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight group shrink-0">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/40 ring-2 ring-primary/20 shrink-0">
            <Image
              src="/profile.jpg"
              alt="Ezedin Mohammed"
              fill
              sizes="32px"
              priority
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-gradient">E</span>
            <span className="text-foreground group-hover:text-primary transition-colors">zedin</span>
            <span className="text-muted-foreground opacity-40">.</span>
          </div>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon, featured }) => {
            const isActive = pathname === href

            /* ── Reels featured pill ── */
            if (featured) {
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95",
                      "border",
                      isActive
                        ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                        : "bg-cyan-500/8 border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/18 hover:border-cyan-500/55 hover:shadow-[0_0_10px_rgba(6,182,212,0.25)] dark:text-cyan-400"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {/* animated record/play indicator */}
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500" />
                    </span>
                    <Clapperboard className="w-3.5 h-3.5" strokeWidth={2} />
                    {label}
                  </Link>
                </li>
              )
            }

            /* ── Regular link ── */
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:text-primary hover:bg-primary/8",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* ── Desktop right actions ── */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Reels icon button — always visible, active state when on /reels */}
          <Link
            href="/reels"
            aria-label="Watch Reels"
            title="Watch Reels"
            className={cn(
              "group relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 active:scale-95",
              isReels
                ? "border-cyan-500/70 bg-cyan-500/20 text-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.4)]"
                : "border-cyan-500/40 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/65 hover:shadow-[0_0_14px_rgba(6,182,212,0.4)]"
            )}
          >
            <Clapperboard className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={2} />
            {/* live dot */}
            <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 border border-background" />
            </span>
          </Link>
          <ThemeToggle />
          <Link
            href="/admin"
            aria-label="Admin Portal"
            title="Admin Portal"
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 active:scale-95",
              pathname?.startsWith("/admin")
                ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_12px_rgba(var(--primary),0.25)]"
                : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-primary/40"
            )}
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium hover:bg-emerald-500/20 transition-all"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Hire Me
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all hover:scale-105 active:scale-95"
          >
            Let's Talk
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Mobile/Tablet right actions — consistent on every page ── */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
          {/* Reels icon button — always visible, active state when on /reels */}
          <Link
            href="/reels"
            aria-label="Watch Reels"
            title="Watch Reels"
            className={cn(
              "group relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 active:scale-95",
              isReels
                ? "border-cyan-500/70 bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                : "border-cyan-500/40 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/60"
            )}
          >
            <Clapperboard className="w-4 h-4" strokeWidth={2} />
            {/* live dot */}
            <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 border border-background" />
            </span>
          </Link>
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium hover:bg-emerald-500/20 transition-all"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Hire Me
          </Link>
          <Link
            href="/contact"
            className="inline-flex sm:hidden items-center gap-1 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Hire
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* ── Tablet/Mobile dropdown menu ── */}
      <div
        ref={menuRef}
        className={cn(
          "lg:hidden absolute top-full right-4 w-72 sm:w-80 transition-all duration-200 origin-top-right",
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden mt-2">
          {/* Nav links */}
          <ul className="p-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    pathname === href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary hover:text-primary"
                  )}
                >
                  <span className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-lg",
                    pathname === href ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  {label}
                  {pathname === href && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            ))}

            {/* Divider */}
            <li className="my-1.5 px-2">
              <div className="h-px bg-border/60" />
            </li>

            {/* Admin shortcut */}
            <li>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  pathname?.startsWith("/admin")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-lg",
                  pathname?.startsWith("/admin") ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                )}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
                Admin Portal
                {pathname?.startsWith("/admin") && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
