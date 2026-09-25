"use client"

import { useState } from "react"
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Clock, Loader2 } from "lucide-react"

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to send message. Please try again.")
      }

      setSubmitted(true)
      setFormState({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-[0.9fr,1.1fr] gap-12 lg:gap-16 items-start">

          {/* Left Column: Heading & Contact Info */}
          <div className="space-y-6">
            <div>
              <span className="text-primary font-mono text-xs uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Contact
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Let&apos;s Build <span className="text-gradient">Something.</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Have an ambitious web project in mind, an open role on your engineering team, or simply want to connect? Send me a message and let&apos;s make it happen.
            </p>

            <div className="space-y-4 pt-4">
              <a
                href="mailto:ezedinmoh1@gmail.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-card/80 border border-border/70 hover:border-primary/50 hover:bg-card transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Direct Email</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    ezedinmoh1@gmail.com
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/80 border border-border/70">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Location</p>
                  <p className="text-sm font-semibold text-foreground">
                    Kombolcha, Ethiopia · Remote Worldwide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/80 border border-border/70">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Response Time</p>
                  <p className="text-sm font-semibold text-foreground">
                    Usually replies within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="bg-card/90 border border-border/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Message Delivered!</h3>
                <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                  Thank you for reaching out. I&apos;ve received your message and will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hp-name" className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                      Your Name *
                    </label>
                    <input
                      id="hp-name"
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Connor"
                      className="w-full px-4 py-3 bg-secondary/40 border border-border/70 rounded-xl text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="hp-email" className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                      Your Email *
                    </label>
                    <input
                      id="hp-email"
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="sarah@example.com"
                      className="w-full px-4 py-3 bg-secondary/40 border border-border/70 rounded-xl text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hp-subject" className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                    Subject / Topic *
                  </label>
                  <input
                    id="hp-subject"
                    type="text"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-4 py-3 bg-secondary/40 border border-border/70 rounded-xl text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="hp-message" className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                    Message *
                  </label>
                  <textarea
                    id="hp-message"
                    name="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, timeline, or idea..."
                    className="w-full px-4 py-3 bg-secondary/40 border border-border/70 rounded-xl text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm shadow-lg shadow-primary/25 hover:opacity-90 hover:scale-[1.01] active:scale-98 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
