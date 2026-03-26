"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"
import { Mail, MapPin, Send, Github, Linkedin, Twitter, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "ezedinmoh1@gmail.com",
    href: "mailto:ezedinmoh1@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kombolcha, Ethiopia",
    href: "#",
  },
]

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/ezedinmoh" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/ezedinmoh" },
  { icon: Twitter, label: "Twitter", href: "https://x.com/ezedinmoh" },
]

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formState),
    })

    setIsSubmitting(false)
    if (res.ok) {
      setIsSubmitted(true)
      setFormState({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <AnimatedCursor />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        {/* Mesh blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-morph" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "4s" }} />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(100,200,180,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,180,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl">
            <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block animate-fade-in">
              Contact
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              Let's <span className="text-gradient">Connect</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Have a project in mind or just want to chat? I'd love to hear from you. 
              Fill out the form below or reach out through any of my social channels.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "2s" }} />
        </div>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <h2 className="text-2xl font-bold text-foreground mb-8">Get in Touch</h2>
              
              {/* Contact Methods */}
              <div className="space-y-6 mb-12">
                {contactMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <a
                      key={method.label}
                      href={method.href}
                      className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{method.label}</p>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {method.value}
                        </p>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Follow Me</h3>
                <div className="flex gap-4">
                  {socialLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-card rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:scale-110 hover:shadow-md transition-all duration-300"
                        aria-label={link.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Availability */}
              <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span className="font-medium text-foreground">Currently Available</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  I'm open to freelance projects, full-time opportunities, and interesting collaborations. 
                  Response time is usually within 24 hours.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <div className="p-8 bg-card rounded-2xl border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
                
                {isSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thanks for reaching out. I'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="Project Inquiry"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium transition-all",
                        isSubmitting 
                          ? "opacity-70 cursor-not-allowed" 
                          : "hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Decorative) */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Timezone & response info */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
            {[
              { label: "Timezone", value: "EAT (UTC+3)", sub: "East Africa Time" },
              { label: "Response Time", value: "< 24 hours", sub: "Usually same day" },
              { label: "Availability", value: "Open", sub: "Freelance & full-time" },
            ].map(item => (
              <div key={item.label} className="text-center p-4 bg-card border border-border rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="font-semibold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8">
            <h3 className="font-semibold text-foreground text-lg mb-2">Connect on Social</h3>
            <p className="text-sm text-muted-foreground mb-6">Follow me for updates, projects, and dev content.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Github,   label: "GitHub",    sub: "@ezedinmoh",        href: "https://github.com/ezedinmoh",               color: "hover:border-gray-400/50" },
                { icon: Linkedin, label: "LinkedIn",  sub: "@ezedinmoh",        href: "https://www.linkedin.com/in/ezedinmoh",       color: "hover:border-blue-400/50" },
                { icon: Twitter,  label: "Twitter",   sub: "@ezedinmoh",        href: "https://x.com/ezedinmoh",                    color: "hover:border-sky-400/50"  },
                { icon: Mail,     label: "Gmail",     sub: "ezedinmoh1@gmail.com", href: "mailto:ezedinmoh1@gmail.com",             color: "hover:border-red-400/50"  },
                { icon: "telegram",  label: "Telegram",  sub: "@ezedinmoh",     href: "https://t.me/ezedinmoh",                     color: "hover:border-sky-500/50"  },
                { icon: "instagram", label: "Instagram", sub: "@ezedinmoh1",    href: "https://instagram.com/ezedinmoh1",            color: "hover:border-pink-400/50" },
              ].map(({ icon, label, sub, href, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className={cn("group flex items-center gap-4 p-5 bg-background border border-border rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg", color)}>
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    {icon === "telegram" ? (
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    ) : icon === "instagram" ? (
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                      </svg>
                    ) : (
                      (() => { const Icon = icon as React.ElementType; return <Icon className="w-5 h-5 text-primary" /> })()
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">{sub}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Decorative map */}
          <div className="relative h-[300px] rounded-2xl overflow-hidden bg-gradient-to-br from-card to-secondary/30 border border-border mt-10">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "linear-gradient(rgba(100,200,180,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,180,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-8 bg-primary/20 rounded-full animate-ping" />
                <div className="absolute -inset-4 bg-primary/30 rounded-full animate-pulse" />
                <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 bg-card/90 border border-border px-4 py-3 rounded-xl">
              <p className="font-medium text-foreground">Kombolcha, Ethiopia</p>
              <p className="text-sm text-muted-foreground">Available for remote work worldwide</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
