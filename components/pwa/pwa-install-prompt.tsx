"use client"

import { useState, useEffect } from "react"
import { Download, X, Smartphone } from "lucide-react"
import Image from "next/image"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa_install_dismissed")
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 7 * 24 * 60 * 60 * 1000) {
      return
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    const handleAppInstalled = () => {
      setIsVisible(false)
      setDeferredPrompt(null)
      console.log("[PWA] App successfully installed!")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    setIsVisible(false)
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`[PWA] Install prompt outcome: ${outcome}`)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("pwa_install_dismissed", Date.now().toString())
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in-up">
      <div className="bg-card/95 border border-primary/30 backdrop-blur-xl rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
          aria-label="Close install prompt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Image src="/icons/icon-192.png" alt="App Icon" width={32} height={32} className="rounded-lg" />
          </div>

          <div className="flex-1 pr-6">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-primary" />
              Install Ezedin Moh App
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Install to your home screen or desktop for fast offline access & a standalone app experience.
            </p>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg transition-all hover:opacity-90 active:scale-95 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
