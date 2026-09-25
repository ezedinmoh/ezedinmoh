"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react"
import { ThreeScene } from "./three-scene"

const roles = [
  "Software Engineer",
  "Full-Stack Developer",
  "React & Next.js Expert",
  "Open Source Contributor",
]

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(false)
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length)
        setIsTyping(true)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      
      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-morph" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "2s" }} />
      </div>

      {/* 3D Scene */}
      <ThreeScene />

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(100, 200, 180, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(100, 200, 180, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="max-w-4xl lg:max-w-none">
          {/* Greeting */}
          <div className="animate-slide-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Available for opportunities
            </span>
          </div>

          {/* Name */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
            <span className="text-foreground">Hi, I'm </span>
            <span className="text-gradient">Ezedin</span>
          </h1>

          {/* Animated Role */}
          <div className="h-16 md:h-20 mb-8 overflow-hidden animate-slide-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
            <p 
              className={`text-2xl md:text-4xl text-muted-foreground font-light transition-all duration-500 ${
                isTyping ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {roles[roleIndex]}
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-slide-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
            I craft beautiful, performant web experiences that blend thoughtful design with robust engineering. 
            Specializing in React, Next.js, and modern web technologies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-16 animate-slide-up opacity-0 stagger-5" style={{ animationFillMode: 'forwards' }}>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-105 active:scale-95"
            >
              View My Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
            >
              Get in Touch
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 animate-slide-up opacity-0 stagger-6" style={{ animationFillMode: 'forwards' }}>
            <span className="text-sm text-muted-foreground">Find me on</span>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ezedinmoh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary transition-colors hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/ezedinmoh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary transition-colors hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/ezedinmoh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary transition-colors hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

          {/* Right column — Orbital Developer Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-[520px] h-[520px] flex items-center justify-center">

              {/* Ambient radial glow behind the rings */}
              <div className="absolute inset-[60px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
              <div className="absolute inset-[120px] rounded-full bg-accent/10 blur-2xl pointer-events-none" />

              {/* Orbital ring 1 — outermost ring */}
              <div
                className="absolute inset-2 rounded-full border border-primary/20"
                style={{ animation: 'spin 30s linear infinite' }}
              >
                {/* Orbiting glowing dot */}
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_3px_hsl(var(--primary)/0.6)]" />
              </div>

              {/* Orbital ring 2 — dashed middle ring */}
              <div
                className="absolute inset-16 rounded-full border border-dashed border-primary/30"
                style={{ animation: 'spin 22s linear infinite reverse' }}
              >
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_2px_hsl(var(--accent)/0.5)]" />
              </div>

              {/* Orbital ring 3 — inner halo backdrop */}
              <div className="absolute inset-28 rounded-full bg-gradient-to-b from-primary/15 via-primary/5 to-transparent border border-primary/25 shadow-[inset_0_0_30px_hsl(var(--primary)/0.1)] pointer-events-none" />

              {/* Developer illustration — unclipped, sitting at desk */}
              <div className="relative z-10 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/developer.png"
                  alt="Ezedin Mohammed"
                  className="w-[360px] h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] select-none pointer-events-none"
                  priority-hint="high"
                />
              </div>

              {/* ── Floating badge: Available for work (top-right) ── */}
              <div
                className="absolute top-6 right-10 z-20 flex items-center gap-2 px-3.5 py-1.5 bg-card/95 border border-border/80 backdrop-blur-md rounded-full shadow-xl text-xs font-medium"
                style={{ animation: 'float 4s ease-in-out infinite' }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-foreground/90 font-mono text-[11px]">Available for work</span>
              </div>

              {/* ── Floating badge: </> (middle-left) ── */}
              <div
                className="absolute left-2 top-[30%] z-20 w-10 h-10 bg-card/95 border border-border/70 backdrop-blur-md rounded-xl flex items-center justify-center shadow-xl"
                style={{ animation: 'float 5s ease-in-out infinite 1.2s' }}
              >
                <span className="font-mono text-xs font-bold text-primary">&lt;/&gt;</span>
              </div>

              {/* ── Floating badge: {} (middle-right) ── */}
              <div
                className="absolute right-4 top-[35%] z-20 w-10 h-10 bg-card/95 border border-border/70 backdrop-blur-md rounded-xl flex items-center justify-center shadow-xl"
                style={{ animation: 'float 6s ease-in-out infinite 2.4s' }}
              >
                <span className="font-mono text-xs font-bold text-primary">&#123;&#125;</span>
              </div>

              {/* ── Code snippet card (bottom-left overlapping desk) ── */}
              <div className="absolute -bottom-2 -left-4 z-20">
                <div
                  className="w-[260px] bg-card/95 border border-border/70 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl"
                  style={{ animation: 'float 7s ease-in-out infinite 0.6s' }}
                >
                  {/* Window chrome dots */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-auto text-[10px] text-muted-foreground font-mono opacity-60">whoami.js</span>
                  </div>
                  {/* Syntax-highlighted snippet */}
                  <pre className="text-[11px] font-mono leading-[1.65] text-left select-none">
                    <span className="text-blue-400 font-semibold">const </span>
                    <span className="text-foreground font-medium">dev</span>
                    <span className="text-muted-foreground"> = {'{'}</span>{"\n"}
                    <span className="text-muted-foreground">  name: </span>
                    <span className="text-emerald-400">&apos;Ezedin Mohammed&apos;</span>
                    <span className="text-muted-foreground">,</span>{"\n"}
                    <span className="text-muted-foreground">  stack: </span>
                    <span className="text-emerald-400">&apos;React / Next.js&apos;</span>
                    <span className="text-muted-foreground">,</span>{"\n"}
                    <span className="text-muted-foreground">  status: </span>
                    <span className="text-emerald-400">&apos;Open to Work&apos;</span>{"\n"}
                    <span className="text-muted-foreground">{'}'}</span>
                  </pre>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
