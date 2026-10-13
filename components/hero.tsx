"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
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

          {/* Right column — Developer Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-[620px] flex items-end justify-center">

              {/* Soft cyan glow behind figure */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-sky-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[30%] bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

              {/* Transparent hero image — no mask, full blend */}
              <div className="relative z-10 w-full">
                <Image
                  src="/hero-image.png"
                  alt="Ezedin Mohammed — Full-Stack Developer"
                  width={620}
                  height={520}
                  priority
                  className="w-full h-auto object-contain select-none pointer-events-none
                    drop-shadow-[0_0_60px_rgba(56,189,248,0.15)]"
                />
              </div>

              {/* "Available for work" pill — top right */}
              <div className="absolute top-8 -right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 bg-card/95 border border-border/70 backdrop-blur-md rounded-full animate-hero-float float-paused float-on-hover cursor-pointer hover:border-primary hover:shadow-[0_0_14px_rgba(79,227,194,0.5),inset_0_0_10px_rgba(79,227,194,0.2)] transition-all duration-300 shadow-xl">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="font-mono text-[11px] text-foreground/90 font-medium select-none">
                  Available for work
                </span>
              </div>

              {/* "</>" chip — top left */}
              <span className="absolute top-12 -left-4 z-20 w-11 h-11 bg-card/90 border border-border/70 backdrop-blur-md rounded-2xl flex items-center justify-center font-mono text-xs font-bold text-primary animate-hero-float float-paused float-on-hover [animation-delay:0.3s] cursor-pointer hover:border-primary hover:shadow-[0_0_14px_rgba(79,227,194,0.5),inset_0_0_10px_rgba(79,227,194,0.2)] transition-all duration-300 shadow-lg">
                &lt;/&gt;
              </span>

              {/* whoami.js card — bottom left */}
              <div className="absolute -bottom-8 -left-6 z-20 w-64 sm:w-72 bg-card/95 border border-border/70 backdrop-blur-md rounded-2xl p-4 shadow-2xl animate-hero-float float-paused float-on-hover [animation-delay:1s] cursor-pointer hover:border-primary hover:shadow-[0_0_16px_rgba(79,227,194,0.5),inset_0_0_12px_rgba(79,227,194,0.2)] transition-all duration-300">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2564C]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground select-none">whoami.js</span>
                </div>
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
