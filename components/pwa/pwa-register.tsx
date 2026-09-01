"use client"

import { useEffect } from "react"

export function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            if (reg.waiting) {
              window.dispatchEvent(new CustomEvent("swWaiting", { detail: reg }))
            }

            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    window.dispatchEvent(new CustomEvent("swWaiting", { detail: reg }))
                  }
                })
              }
            })
          })
          .catch((err) => {
            console.warn("[PWA] ServiceWorker registration:", err.message)
          })
      })
    }
  }, [])

  return null
}
