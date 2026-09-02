"use client"

import { useState, useEffect } from "react"

export default function Loading() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [name, setName]           = useState<string>("Ezedin Mohammed")

  useEffect(() => {
    // 1. Read cached avatar instantly from localStorage if present
    if (typeof window !== "undefined") {
      const cachedAvatar = localStorage.getItem("profile_avatar_url")
      if (cachedAvatar) setAvatarUrl(cachedAvatar)
    }

    // 2. Fetch fresh profile data
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data?.avatarUrl) {
          setAvatarUrl(data.avatarUrl)
          if (typeof window !== "undefined") {
            localStorage.setItem("profile_avatar_url", data.avatarUrl)
          }
        }
        if (data?.title) setName(data.title)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">

      {/* Ambient background blobs */}
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
          backgroundImage: "linear-gradient(rgba(100,200,180,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,180,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-8">

        {/* Logo / Profile Avatar mark */}
        <div className="relative">
          {/* Outer ring — slow spin */}
          <div
            className="absolute inset-0 rounded-full border border-primary/20 animate-spin"
            style={{ animation: "spin 8s linear infinite", margin: "-12px" }}
          />
          {/* Middle ring — counter spin */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-primary/10"
            style={{ animation: "spin 12s linear infinite reverse", margin: "-6px" }}
          />
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full animate-glow" style={{ margin: "-2px" }} />

          {/* Logo / Avatar Box */}
          <div
            className="relative w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center animate-scale-in border border-primary/30 shadow-xl bg-card"
            style={{
              boxShadow: "0 0 40px oklch(0.7 0.15 180 / 0.4), 0 0 80px oklch(0.7 0.15 180 / 0.15)",
            }}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span
                className="text-2xl font-black tracking-tight text-primary select-none"
              >
                EM
              </span>
            )}
          </div>
        </div>

        {/* Name + tagline */}
        <div className="text-center space-y-2 animate-slide-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          <p className="text-lg font-semibold text-foreground tracking-wide">{name}</p>
          <p className="text-sm text-muted-foreground">Software Engineer & Full-Stack Developer</p>
        </div>

        {/* Animated dots loader */}
        <div className="flex items-center gap-2 animate-slide-up opacity-0" style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              style={{
                animation: "loadingDot 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-48 h-px bg-border overflow-hidden rounded-full animate-slide-up opacity-0" style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}>
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, oklch(0.44 0.20 185), oklch(0.7 0.15 180))",
              animation: "loadingBar 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes loadingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.2); opacity: 1; }
        }
        @keyframes loadingBar {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 70%;  margin-left: 15%; }
          100% { width: 0%;   margin-left: 100%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
