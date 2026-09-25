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
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentRole = roles[roleIndex]
    const typingSpeed = isDeleting ? 40 : 85
    const pauseDuration = 1500

    if (!isDeleting && text === currentRole) {
      const timer = setTimeout(() => setIsDeleting(true), pauseDuration)
      return () => clearTimeout(timer)
    }

    if (isDeleting && text === "") {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % roles.length)
      return
    }

    const timer = setTimeout(() => {
      setText((prev) =>
        isDeleting
          ? currentRole.slice(0, prev.length - 1)
          : currentRole.slice(0, prev.length + 1)
      )
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [text, isDeleting, roleIndex])

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

          {/* Animated Role with Typewriter & Syntax Brackets */}
          <div className="h-10 mb-8 font-mono text-xl sm:text-2xl md:text-3xl flex items-center animate-slide-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
            <span className="text-muted-foreground/60 select-none">&lt;&nbsp;</span>
            <span className="text-primary font-semibold tracking-tight">{text}</span>
            <span className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle animate-blink" />
            <span className="text-muted-foreground/60 select-none">&nbsp;/&gt;</span>
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
            <div className="relative mx-auto max-w-sm lg:max-w-md w-full aspect-square flex items-center justify-center">

              {/* 1. Ambient Glow */}
              <div className="absolute inset-6 rounded-full bg-primary/20 blur-[70px] pointer-events-none" />

              {/* 2. Clockwise Dashed Orbital Ring (22s) */}
              <div className="absolute inset-0 rounded-full border border-dashed border-primary/30 animate-[spin_22s_linear_infinite] pointer-events-none" />

              {/* 3. Counter-Clockwise Outer Dashed Orbital Ring (32s) */}
              <div className="absolute -inset-6 rounded-full border border-dashed border-border/40 animate-[spin_32s_linear_infinite_reverse] pointer-events-none" />

              {/* 4. Center Developer Illustration Frame */}
              <div className="relative z-10 w-[80%] aspect-square flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/developer.png"
                  alt="Ezedin Mohammed"
                  className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] select-none pointer-events-none"
                  priority-hint="high"
                />
              </div>

              {/* 5. Left "</>" Chip with float-on-hover & neon glow */}
              <span className="absolute top-2 left-0 sm:-left-2 z-20 w-11 h-11 bg-card/90 border border-border/70 backdrop-blur-md rounded-2xl flex items-center justify-center font-mono text-xs font-bold text-primary animate-hero-float float-paused float-on-hover [animation-delay:0.3s] cursor-pointer hover:border-primary hover:shadow-[0_0_14px_rgba(79,227,194,0.5),inset_0_0_10px_rgba(79,227,194,0.2)] transition-all duration-300 shadow-lg">
                &lt;/&gt;
              </span>

              {/* 6. Right "{ }" Chip with float-on-hover & neon glow */}
              <span className="absolute top-16 right-0 sm:-right-3 z-20 w-11 h-11 bg-card/90 border border-border/70 backdrop-blur-md rounded-2xl flex items-center justify-center font-mono text-xs font-bold text-primary animate-hero-float float-paused float-on-hover [animation-delay:0.9s] cursor-pointer hover:border-primary hover:shadow-[0_0_14px_rgba(79,227,194,0.5),inset_0_0_10px_rgba(79,227,194,0.2)] transition-all duration-300 shadow-lg">
                &#123; &#125;
              </span>

              {/* 7. Top-Right "Available for work" pill with radar ping */}
              <div className="absolute -top-4 -right-4 sm:right-2 z-20 flex items-center gap-2 px-3.5 py-1.5 bg-card/95 border border-border/70 backdrop-blur-md rounded-full animate-hero-float float-paused float-on-hover cursor-pointer hover:border-primary hover:shadow-[0_0_14px_rgba(79,227,194,0.5),inset_0_0_10px_rgba(79,227,194,0.2)] transition-all duration-300 shadow-xl">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="font-mono text-[11px] text-foreground/90 font-medium select-none">
                  Available for work
                </span>
              </div>

              {/* 8. Bottom-Left "whoami.js" code snippet card with float-on-hover & neon glow */}
              <div className="absolute -bottom-10 -left-4 sm:-left-8 z-20 w-64 sm:w-72 bg-card/95 border border-border/70 backdrop-blur-md rounded-2xl p-4 shadow-2xl animate-hero-float float-paused float-on-hover [animation-delay:1s] cursor-pointer hover:border-primary hover:shadow-[0_0_16px_rgba(79,227,194,0.5),inset_0_0_12px_rgba(79,227,194,0.2)] transition-all duration-300">
                {/* Window chrome buttons */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2564C]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground select-none">whoami.js</span>
                </div>
                {/* Syntax-highlighted snippet */}
                <pre className="font-mono text-xs leading-relaxed select-none text-left">
                  <span className="text-amber-400 font-semibold">const</span> <span className="text-foreground">dev</span> = &#123;{"\n"}
                  &nbsp;&nbsp;<span className="text-muted-foreground">name:</span> <span className="text-primary font-medium">&quot;Ezedin Mohammed&quot;</span>,{"\n"}
                  &nbsp;&nbsp;<span className="text-muted-foreground">stack:</span> <span className="text-primary font-medium">&quot;React / Next.js&quot;</span>,{"\n"}
                  &nbsp;&nbsp;<span className="text-muted-foreground">status:</span> <span className="text-primary font-medium">&quot;Open to Work&quot;</span>{"\n"}
                  &#125;
                </pre>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
