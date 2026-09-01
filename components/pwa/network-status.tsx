"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine)
    }

    const handleOnline = () => {
      setIsOnline(true)
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 4000)
      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowToast(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showToast || isOnline === null) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl text-sm font-medium transition-all ${
          isOnline
            ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
            : "bg-amber-950/90 border-amber-500/40 text-amber-200"
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Connection restored. You are back online.</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>You are offline. Working in offline mode.</span>
          </>
        )}
      </div>
    </div>
  )
}
