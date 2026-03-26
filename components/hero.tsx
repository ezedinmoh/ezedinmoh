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

          {/* Video — right column */}
          <div className="hidden lg:flex items-center justify-center self-stretch py-8">
            <div className="relative w-full">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/20 blur-2xl opacity-50 animate-morph" />
              <div className="relative rounded-3xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
                <video
                  src="/tech.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
