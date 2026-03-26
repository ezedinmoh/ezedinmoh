"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Skip admin and API routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return

    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path:      pathname,
        referrer:  document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {/* fire and forget */})
  }, [pathname])

  return null
}
