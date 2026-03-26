"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactCTA } from "@/components/contact-cta"
import { SpotifyNowPlaying } from "@/components/spotify-now-playing"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"
import { Github, Linkedin, Twitter, MapPin, Calendar, Coffee, Book, Code2, Gamepad2, Zap, Heart, Users, Smile } from "lucide-react"
import { cn } from "@/lib/utils"

const timeline = [
  { year: "2019", event: "First Line of Code", description: "Wrote my first HTML page and got completely hooked on building things for the web.", emoji: "🌱" },
  { year: "2020", event: "Started Coding Journey", description: "Fell deep into JavaScript, built 10+ side projects, and discovered React.", emoji: "🚀" },
  { year: "2021", event: "First Developer Job", description: "Landed a junior developer role at a local agency. Shipped real products for real clients.", emoji: "💼" },
  { year: "2022", event: "Full-Stack Developer", description: "Expanded into backend with Node.js and PostgreSQL. Started contributing to open source.", emoji: "⚡" },
  { year: "2023", event: "Senior Engineer", description: "Led frontend architecture for enterprise apps. Mentored junior devs.", emoji: "🏆" },
  { year: "2024", event: "Software Engineer", description: "Working on cutting-edge products, exploring AI integrations, and building this portfolio.", emoji: "🌟" },
]

const interests = [
  { icon: Code2, label: "Open Source", description: "Contributing to the community" },
  { icon: Coffee, label: "Ethiopian Coffee", description: "The best coffee in the world" },
  { icon: Book, label: "Continuous Learning", description: "Always exploring new tech" },
  { icon: Gamepad2, label: "Gaming", description: "Strategy games and RPGs" },
]

const funFacts = [
  { emoji: "☕", fact: "I've tried 40+ Ethiopian coffee varieties and can tell them apart by taste" },
  { emoji: "⌨️", fact: "I type at 95 WPM and have strong opinions about mechanical keyboards" },
  { emoji: "🌍", fact: "I've worked with clients from 8 different countries without leaving Ethiopia" },
  { emoji: "📚", fact: "I read at least one tech book per month — currently on 'Designing Data-Intensive Applications'" },
  { emoji: "🎯", fact: "I once fixed a production bug in under 3 minutes during a live demo" },
  { emoji: "🌙", fact: "My most productive hours are between 10pm and 2am" },
]

const workStyle = [
  { icon: Zap, title: "Fast Learner", desc: "I pick up new technologies quickly and love diving into unfamiliar codebases." },
  { icon: Heart, title: "Detail-Oriented", desc: "I care deeply about pixel-perfect UI, clean code, and thoughtful UX." },
  { icon: Users, title: "Collaborative", desc: "I communicate clearly, give honest feedback, and love pair programming." },
  { icon: Smile, title: "Low Ego", desc: "I'm always open to better ideas, regardless of where they come from." },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <AnimatedCursor />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        {/* Mesh blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-morph" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "4s" }} />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(100,200,180,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,180,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo placeholder */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 animate-glow flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-primary/20 animate-morph flex items-center justify-center">
                  <span className="text-6xl font-bold text-gradient">EM</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-card border border-border px-4 py-2 rounded-full shadow-lg animate-float">
                <span className="text-sm font-medium text-foreground">React Expert</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border px-4 py-2 rounded-full shadow-lg animate-float" style={{ animationDelay: "2s" }}>
                <span className="text-sm font-medium text-foreground">TypeScript Lover</span>
              </div>
              <div className="absolute bottom-16 -right-4">
                <SpotifyNowPlaying />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">About Me</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                I'm <span className="text-gradient">Ezedin Mohammed</span>
              </h1>
              <div className="flex flex-wrap gap-4 mb-6 text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> Kombolcha, Ethiopia</span>
                <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" /> 5+ Years Experience</span>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>I'm a passionate Software Engineer from Ethiopia who believes in the power of clean code and thoughtful design. My journey started with a simple curiosity about how websites work and evolved into a deep love for crafting digital experiences.</p>
                <p>I specialize in React, TypeScript, and Next.js, but I'm always eager to explore new technologies. Currently focused on AI-powered web applications and developer tooling.</p>
                <p>When I'm not coding, you'll find me enjoying Ethiopian coffee, contributing to open-source, or playing strategy games.</p>
              </div>
              <div className="flex gap-4 mt-8">
                {[
                  { href: "https://github.com/ezedinmoh", icon: Github, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/ezedinmoh", icon: Linkedin, label: "LinkedIn" },
                  { href: "https://x.com/ezedinmoh", icon: Twitter, label: "Twitter" },
                ].map(({ href, icon: Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="p-3 bg-secondary rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all" aria-label={label}>
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "1s" }} />
        </div>        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-medium uppercase tracking-wider mb-2 block">My Journey</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">The Path So Far</h2>
          </div>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
            {timeline.map((item, i) => (
              <div key={item.year} className="relative pl-20 pb-10 last:pb-0 animate-slide-up opacity-0"
                style={{ animationDelay: `${i * 0.15}s`, animationFillMode: "forwards" }}>
                <div className="absolute left-0 w-16 h-16 rounded-full bg-card border border-border flex flex-col items-center justify-center shadow-sm transition-all duration-300 hover:border-primary/50 hover:scale-110">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-xs font-bold text-primary">{item.year}</span>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300">
                  <h3 className="font-semibold text-foreground mb-1">{item.event}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "3s" }} />
        </div>        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-medium uppercase tracking-wider mb-2 block">Get to Know Me</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Fun Facts</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {funFacts.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300 animate-scale-in opacity-0"
                style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "forwards" }}>
                <span className="text-2xl shrink-0 transition-transform duration-300 group-hover:scale-125">{f.emoji}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What I'm like to work with */}
      <section className="py-24 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "2s" }} />
        </div>        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-medium uppercase tracking-wider mb-2 block">Collaboration</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">What I'm Like to Work With</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Straight from people who've worked with me — and my own honest self-assessment.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {workStyle.map((w, i) => {
              const Icon = w.icon
              return (
                <div key={w.title} className="p-6 bg-card border border-border rounded-2xl text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300 animate-scale-in opacity-0"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{w.title}</h3>
                  <p className="text-sm text-muted-foreground">{w.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interests */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "5s" }} />
        </div>        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-medium uppercase tracking-wider mb-2 block">Beyond Code</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Things I Love</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {interests.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300 text-center animate-scale-in opacity-0"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}>
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <ContactCTA />
      <Footer />
    </main>
  )
}
