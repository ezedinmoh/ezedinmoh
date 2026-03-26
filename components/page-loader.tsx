"use client"

import { useEffect, useState } from "react"

export function PageLoader() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem("loader_shown")) return

    sessionStorage.setItem("loader_shown", "1")
    setVisible(true)

    const fadeTimer = setTimeout(() => setFading(true), 6000)
    const hideTimer = setTimeout(() => setVisible(false), 6500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
      style={{
        transition: "opacity 0.4s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 animate-morph"
          style={{ background: "radial-gradient(circle, oklch(0.7 0.15 180), transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-15 animate-morph"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.12 200), transparent 70%)", animationDelay: "4s" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,200,180,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,180,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-8">

        {/* Logo mark with orbiting rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer slow spin ring */}
          <div
            className="absolute rounded-full border border-primary/20"
            style={{ width: 136, height: 136, animation: "loaderSpin 8s linear infinite" }}
          />
          {/* Inner counter-spin dashed ring */}
          <div
            className="absolute rounded-full border border-dashed border-primary/15"
            style={{ width: 118, height: 118, animation: "loaderSpin 12s linear infinite reverse" }}
          />
          {/* Glow pulse */}
          <div
            className="absolute rounded-full"
            style={{ width: 104, height: 104, animation: "loaderGlow 3s ease-in-out infinite" }}
          />

          {/* Logo image */}
          <div
            style={{
              animation: "loaderScaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
              filter: "drop-shadow(0 0 24px oklch(0.7 0.15 180 / 0.6)) drop-shadow(0 0 60px oklch(0.7 0.15 180 / 0.25))",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="Ezedin Mohammed logo" width={96} height={96} style={{ borderRadius: "22px" }} />
          </div>
        </div>

        {/* Name + role */}
        <div
          className="text-center space-y-1.5"
          style={{ animation: "loaderSlideUp 0.5s ease-out 0.2s both" }}
        >
          <p className="text-lg font-semibold text-foreground tracking-wide">Ezedin Mohammed</p>
          <p className="text-sm text-muted-foreground">Full-Stack Developer</p>
        </div>

        {/* Bouncing dots */}
        <div
          className="flex items-center gap-2"
          style={{ animation: "loaderSlideUp 0.5s ease-out 0.35s both" }}
        >
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              style={{ animation: `loaderDot 1.4s ease-in-out ${i * 0.18}s infinite` }}
            />
          ))}
        </div>

        {/* Sweeping progress bar */}
        <div
          className="w-48 h-px bg-border overflow-hidden rounded-full"
          style={{ animation: "loaderSlideUp 0.5s ease-out 0.45s both" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, oklch(0.44 0.20 185), oklch(0.7 0.15 180))",
              animation: "loaderBar 1.6s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loaderSpin      { to { transform: rotate(360deg); } }
        @keyframes loaderScaleIn   { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
        @keyframes loaderSlideUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes loaderDot       { 0%,80%,100% { transform:scale(0.6); opacity:0.4; } 40% { transform:scale(1.3); opacity:1; } }
        @keyframes loaderBar       { 0% { width:0%; margin-left:0%; } 50% { width:65%; margin-left:17%; } 100% { width:0%; margin-left:100%; } }
        @keyframes loaderGlow      { 0%,100% { box-shadow:0 0 20px oklch(0.7 0.15 180 / 0.25); } 50% { box-shadow:0 0 50px oklch(0.7 0.15 180 / 0.5); } }
      `}</style>
    </div>
  )
}
