"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin, Calendar, Briefcase, Mail, Code2, Sparkles, UserCheck } from "lucide-react"

export function AboutSection() {
  const [avatarUrl, setAvatarUrl] = useState<string>("/profile.jpg")

  useEffect(() => {
    // Check localStorage cache or profile endpoint
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("profile_avatar_url")
      if (cached) setAvatarUrl(cached)
    }

    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data?.avatarUrl) {
          setAvatarUrl(data.avatarUrl)
          if (typeof window !== "undefined") {
            localStorage.setItem("profile_avatar_url", data.avatarUrl)
          }
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="about" className="py-24 md:py-32 bg-secondary/15 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-[0.85fr,1.15fr] gap-12 lg:gap-16 items-center">

          {/* Left Column: Circular Profile Frame with Rotating Dashed Rings */}
          <div className="relative mx-auto lg:mx-0 max-w-sm w-full aspect-square flex items-center justify-center">
            {/* Ambient glow behind circle */}
            <div className="absolute inset-4 rounded-full bg-primary/15 blur-2xl pointer-events-none" />

            {/* Spinning dashed ring 1 (clockwise) */}
            <div className="absolute -inset-5 rounded-full border-2 border-dashed border-primary/30 animate-[spin_24s_linear_infinite] pointer-events-none" />

            {/* Static outer ring */}
            <div className="absolute -inset-2 rounded-full border border-primary/20 pointer-events-none" />

            {/* Inner avatar circle */}
            <div className="relative z-10 w-[84%] aspect-square rounded-full overflow-hidden border-2 border-primary/40 shadow-2xl bg-card">
              <Image
                src={avatarUrl || "/profile.jpg"}
                alt="Ezedin Mohammed"
                fill
                sizes="(max-width: 768px) 320px, 380px"
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -top-3 -right-3 z-20 bg-card/95 border border-border/80 px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2">
              <span className="text-primary font-bold text-lg leading-none">5+</span>
              <div className="text-left">
                <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wide leading-none">Years of</p>
                <p className="font-mono text-[9px] text-foreground font-semibold uppercase tracking-wide leading-tight">Experience</p>
              </div>
            </div>

            {/* Floating Status Badge */}
            <div className="absolute -bottom-3 -left-3 z-20 bg-card/95 border border-border/80 px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2">
              <span className="relative flex w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-mono text-xs text-foreground font-medium">Open to Work</span>
            </div>
          </div>

          {/* Right Column: Bio & Info Table */}
          <div className="space-y-6">
            <div>
              <span className="text-primary font-mono text-xs uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                About Me
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                I&apos;m <span className="text-gradient">Ezedin Mohammed</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A passionate Software Engineer from Ethiopia specializing in crafting high-performance, accessible, and user-centric web applications. I bridge the gap between creative visual design and scalable engineering architecture.
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              With a deep focus on React, Next.js, TypeScript, and modern backend systems, I build seamless digital products that scale reliably and deliver unforgettable user experiences.
            </p>

            {/* Info Table matching reference design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-card/80 border border-border/70 rounded-xl">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider block mb-1">
                  Location
                </span>
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Kombolcha, Ethiopia
                </span>
              </div>

              <div className="p-3.5 bg-card/80 border border-border/70 rounded-xl">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider block mb-1">
                  Role
                </span>
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  Full-Stack Engineer
                </span>
              </div>

              <div className="p-3.5 bg-card/80 border border-border/70 rounded-xl">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider block mb-1">
                  Core Stack
                </span>
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-primary" />
                  React, Next.js, TypeScript
                </span>
              </div>

              <div className="p-3.5 bg-card/80 border border-border/70 rounded-xl">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider block mb-1">
                  Availability
                </span>
                <span className="text-sm font-semibold text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  Full-Time / Contract
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/25"
              >
                Read Full Story & Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
              >
                View Resume
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
