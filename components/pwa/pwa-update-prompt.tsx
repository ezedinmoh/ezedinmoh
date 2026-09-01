"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Sparkles, X } from "lucide-react"

export function PwaUpdatePrompt() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleSwWaiting = (e: Event) => {
      const customEvent = e as CustomEvent<ServiceWorkerRegistration>
      if (customEvent.detail && customEvent.detail.waiting) {
        setWaitingWorker(customEvent.detail.waiting)
        setIsVisible(true)
      }
    }

    window.addEventListener("swWaiting", handleSwWaiting)
    return () => window.removeEventListener("swWaiting", handleSwWaiting)
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" })
    }
    setIsVisible(false)
    window.location.reload()
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in-up">
      <div className="bg-card/95 border border-primary/40 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex items-center gap-4 max-w-sm">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1">
          <h4 className="text-xs font-semibold text-foreground">New Version Available</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            An update is available. Reload to get the latest features.
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleUpdate}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-all active:scale-95"
          >
            <RefreshCw className="w-3 h-3" />
            Update
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            aria-label="Dismiss update"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
