"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"
import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  const [isChecking, setIsChecking] = useState(false)
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleRetry = () => {
    setIsChecking(true)
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.reload()
      } else {
        setIsChecking(false)
      }
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      <ScrollProgress />
      <AnimatedCursor />
      <Navigation />

      <div className="container mx-auto px-6 py-24 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-card/80 border border-border/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative">
          {/* Animated glow background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50 -z-10" />

          <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-10 h-10 text-primary animate-pulse" />
          </div>

          <h1 className="text-2xl font-bold font-heading text-foreground mb-3">
            You&apos;re Currently Offline
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            It looks like your internet connection went offline. Don&apos;t worry — cached pages are still available, and your connection will restore automatically when back online.
          </p>

          {isOnline ? (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl mb-6 text-sm text-primary font-medium">
              🎉 Connection restored! Reloading...
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetry}
              disabled={isChecking}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl transition-all duration-300 hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
              {isChecking ? "Checking..." : "Try Again"}
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-xl border border-border transition-all duration-300 hover:bg-secondary/80"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
