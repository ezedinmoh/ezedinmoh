"use client"

import { useState, useEffect } from "react"
import {
  Upload, Loader2, Save, Image as ImageIcon, User, MapPin, Calendar,
  CheckCircle, AlertCircle, BarChart3, Briefcase, Plus, Trash2,
  ArrowUp, ArrowDown, Sparkles, Smile, Heart, Zap
} from "lucide-react"

interface StatItem {
  value: number
  suffix: string
  label: string
}

interface ExperienceItem {
  title: string
  company: string
  companyUrl: string
  period: string
  description: string
  technologies: string[]
}

interface TimelineItem {
  year: string
  event: string
  description: string
  emoji: string
}

interface FunFactItem {
  emoji: string
  fact: string
}

interface WorkStyleItem {
  icon: string
  title: string
  desc: string
}

interface InterestItem {
  icon: string
  label: string
  description: string
}

const DEFAULT_STATS: StatItem[] = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 30, suffix: "+", label: "Projects Shipped" },
  { value: 20, suffix: "+", label: "Happy Clients" },
  { value: 8, suffix: "", label: "Countries Worked With" },
]

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    title: "Senior Frontend Engineer",
    company: "TechCorp",
    companyUrl: "https://example.com",
    period: "2024 - Present",
    description: "Leading frontend architecture for a suite of enterprise applications. Implemented design system used by 50+ developers.",
    technologies: ["React", "TypeScript", "GraphQL", "Storybook"],
  },
  {
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    companyUrl: "https://example.com",
    period: "2022 - 2024",
    description: "Built and scaled a SaaS platform from 0 to 100k users. Led migration to microservices architecture.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    title: "Frontend Developer",
    company: "Digital Agency Co",
    companyUrl: "https://example.com",
    period: "2020 - 2022",
    description: "Delivered 20+ client projects ranging from marketing sites to complex web applications.",
    technologies: ["React", "Vue.js", "SASS", "WordPress"],
  },
  {
    title: "Junior Developer",
    company: "CodeStart",
    companyUrl: "https://example.com",
    period: "2019 - 2020",
    description: "Started my professional journey building responsive websites and learning modern web technologies.",
    technologies: ["JavaScript", "HTML/CSS", "PHP", "MySQL"],
  },
]

const DEFAULT_TIMELINE: TimelineItem[] = [
  { year: "2019", event: "First Line of Code", description: "Wrote my first HTML page and got completely hooked on building things for the web.", emoji: "🌱" },
  { year: "2020", event: "Started Coding Journey", description: "Fell deep into JavaScript, built 10+ side projects, and discovered React.", emoji: "🚀" },
  { year: "2021", event: "First Developer Job", description: "Landed a junior developer role at a local agency. Shipped real products for real clients.", emoji: "💼" },
  { year: "2022", event: "Full-Stack Developer", description: "Expanded into backend with Node.js and PostgreSQL. Started contributing to open source.", emoji: "⚡" },
  { year: "2023", event: "Senior Engineer", description: "Led frontend architecture for enterprise apps. Mentored junior devs.", emoji: "🏆" },
  { year: "2024", event: "Software Engineer", description: "Working on cutting-edge products, exploring AI integrations, and building this portfolio.", emoji: "🌟" },
]

const DEFAULT_FUN_FACTS: FunFactItem[] = [
  { emoji: "☕", fact: "I've tried 40+ Ethiopian coffee varieties and can tell them apart by taste" },
  { emoji: "⌨️", fact: "I type at 95 WPM and have strong opinions about mechanical keyboards" },
  { emoji: "🌍", fact: "I've worked with clients from 8 different countries without leaving Ethiopia" },
  { emoji: "📚", fact: "I read at least one tech book per month — currently on 'Designing Data-Intensive Applications'" },
  { emoji: "🎯", fact: "I once fixed a production bug in under 3 minutes during a live demo" },
  { emoji: "🌙", fact: "My most productive hours are between 10pm and 2am" },
]

const DEFAULT_WORK_STYLE: WorkStyleItem[] = [
  { icon: "Zap", title: "Fast Learner", desc: "I pick up new technologies quickly and love diving into unfamiliar codebases." },
  { icon: "Heart", title: "Detail-Oriented", desc: "I care deeply about pixel-perfect UI, clean code, and thoughtful UX." },
  { icon: "Users", title: "Collaborative", desc: "I communicate clearly, give honest feedback, and love pair programming." },
  { icon: "Smile", title: "Low Ego", desc: "I'm always open to better ideas, regardless of where they come from." },
]

const DEFAULT_INTERESTS: InterestItem[] = [
  { icon: "Code2", label: "Open Source", description: "Contributing to the community" },
  { icon: "Coffee", label: "Ethiopian Coffee", description: "The best coffee in the world" },
  { icon: "Book", label: "Continuous Learning", description: "Always exploring new tech" },
  { icon: "Gamepad2", label: "Gaming", description: "Strategy games and RPGs" },
]

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [form, setForm] = useState({
    avatarUrl: "",
    coverImageUrl: "",
    title: "Ezedin Mohammed",
    location: "Kombolcha, Ethiopia",
    yearsExperience: "5+ Years Experience",
    bio: "",
    stats: DEFAULT_STATS,
    experiences: DEFAULT_EXPERIENCES,
    timeline: DEFAULT_TIMELINE,
    funFacts: DEFAULT_FUN_FACTS,
    workStyle: DEFAULT_WORK_STYLE,
    interests: DEFAULT_INTERESTS,
  })

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setForm({
            avatarUrl: data.avatarUrl || "",
            coverImageUrl: data.coverImageUrl || "",
            title: data.title || "Ezedin Mohammed",
            location: data.location || "Kombolcha, Ethiopia",
            yearsExperience: data.yearsExperience || "5+ Years Experience",
            bio: data.bio || "",
            stats: Array.isArray(data.stats) && data.stats.length > 0 ? data.stats : DEFAULT_STATS,
            experiences: Array.isArray(data.experiences) && data.experiences.length > 0 ? data.experiences : DEFAULT_EXPERIENCES,
            timeline: Array.isArray(data.timeline) && data.timeline.length > 0 ? data.timeline : DEFAULT_TIMELINE,
            funFacts: Array.isArray(data.funFacts) && data.funFacts.length > 0 ? data.funFacts : DEFAULT_FUN_FACTS,
            workStyle: Array.isArray(data.workStyle) && data.workStyle.length > 0 ? data.workStyle : DEFAULT_WORK_STYLE,
            interests: Array.isArray(data.interests) && data.interests.length > 0 ? data.interests : DEFAULT_INTERESTS,
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleUpload = async (file: File, type: "avatar" | "cover") => {
    const isAvatar = type === "avatar"
    if (isAvatar) setUploadingAvatar(true)
    else setUploadingCover(true)

    setMessage(null)

    try {
      const fd = new FormData()
      fd.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      if (data.url) {
        setForm((prev) => ({
          ...prev,
          [isAvatar ? "avatarUrl" : "coverImageUrl"]: data.url,
        }))
        setMessage({ type: "success", text: `${isAvatar ? "Profile picture" : "Cover image"} uploaded to Cloudinary!` })
      }
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to upload image" })
    } finally {
      if (isAvatar) setUploadingAvatar(false)
      else setUploadingCover(false)
    }
  }

  const handleStatChange = (index: number, key: keyof StatItem, val: string | number) => {
    setForm((prev) => {
      const newStats = [...prev.stats]
      newStats[index] = {
        ...newStats[index],
        [key]: key === "value" ? Number(val) || 0 : val,
      }
      return { ...prev, stats: newStats }
    })
  }

  const handleExpChange = (index: number, key: keyof ExperienceItem, val: string | string[]) => {
    setForm((prev) => {
      const newExps = [...prev.experiences]
      newExps[index] = {
        ...newExps[index],
        [key]: val,
      }
      return { ...prev, experiences: newExps }
    })
  }

  const handleTimelineChange = (index: number, key: keyof TimelineItem, val: string) => {
    setForm((prev) => {
      const newItems = [...prev.timeline]
      newItems[index] = { ...newItems[index], [key]: val }
      return { ...prev, timeline: newItems }
    })
  }

  const handleFunFactChange = (index: number, key: keyof FunFactItem, val: string) => {
    setForm((prev) => {
      const newFacts = [...prev.funFacts]
      newFacts[index] = { ...newFacts[index], [key]: val }
      return { ...prev, funFacts: newFacts }
    })
  }

  const handleWorkStyleChange = (index: number, key: keyof WorkStyleItem, val: string) => {
    setForm((prev) => {
      const newItems = [...prev.workStyle]
      newItems[index] = { ...newItems[index], [key]: val }
      return { ...prev, workStyle: newItems }
    })
  }

  const handleInterestChange = (index: number, key: keyof InterestItem, val: string) => {
    setForm((prev) => {
      const newItems = [...prev.interests]
      newItems[index] = { ...newItems[index], [key]: val }
      return { ...prev, interests: newItems }
    })
  }

  // Array Handlers
  const addExperience = () => {
    setForm((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          title: "New Role",
          company: "Company Name",
          companyUrl: "https://example.com",
          period: "2024 - Present",
          description: "Role description and key achievements.",
          technologies: ["React", "TypeScript"],
        },
      ],
    }))
  }

  const addTimeline = () => {
    setForm((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        { year: "2025", event: "Milestone Event", description: "Description of milestone...", emoji: "🚀" },
      ],
    }))
  }

  const addFunFact = () => {
    setForm((prev) => ({
      ...prev,
      funFacts: [...prev.funFacts, { emoji: "⚡", fact: "New fun fact about me..." }],
    }))
  }

  const addWorkStyle = () => {
    setForm((prev) => ({
      ...prev,
      workStyle: [...prev.workStyle, { icon: "Zap", title: "New Quality", desc: "Description of work style..." }],
    }))
  }

  const addInterest = () => {
    setForm((prev) => ({
      ...prev,
      interests: [...prev.interests, { icon: "Code2", label: "New Interest", description: "Description of interest..." }],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Failed to save profile settings")

      setMessage({ type: "success", text: "✓ All Profile, Journey, Fun Facts & Interests saved successfully to database!" })
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save settings" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile & About Page Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your profile picture, cover image, timeline journey, fun facts, work style, and interests saved in your database.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/40 border-red-500/30 text-red-300"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Cover Image Section ── */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Cover Image
            </h2>
            <div className="relative h-44 w-full rounded-xl overflow-hidden bg-secondary/30 border border-border/60 flex items-center justify-center">
              {form.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <p className="text-xs text-muted-foreground">No cover image uploaded yet</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.coverImageUrl}
                onChange={(e) => setForm((p) => ({ ...p, coverImageUrl: e.target.value }))}
                placeholder="Cloudinary Cover Image URL"
                className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
              />
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground text-sm font-medium rounded-xl border border-border">
                {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-4 h-4 text-primary" />}
                <span>Upload</span>
                <input type="file" accept="image/*" className="hidden" disabled={uploadingCover} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "cover")} />
              </label>
            </div>
          </div>

          {/* ── Profile Picture Section ── */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Profile Picture (Avatar)
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-36 h-36 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/40 flex items-center justify-center shrink-0">
                {form.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-primary">EM</span>
                )}
              </div>
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={form.avatarUrl}
                    onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))}
                    placeholder="https://res.cloudinary.com/.../profile.jpg"
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl">
                    {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Upload Avatar</span>
                    <input type="file" accept="image/*" className="hidden" disabled={uploadingAvatar} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "avatar")} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats Bar Counters ── */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Stats Bar Counters
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {form.stats.map((stat, idx) => (
                <div key={idx} className="bg-background border border-border p-4 rounded-xl space-y-3">
                  <span className="text-xs font-semibold text-primary">Card #{idx + 1}</span>
                  <input type="number" value={stat.value} onChange={(e) => handleStatChange(idx, "value", e.target.value)} className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm" />
                  <input type="text" value={stat.suffix} onChange={(e) => handleStatChange(idx, "suffix", e.target.value)} placeholder="Suffix (+)" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm" />
                  <input type="text" value={stat.label} onChange={(e) => handleStatChange(idx, "label", e.target.value)} placeholder="Label" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* ── My Journey / Timeline Section ── */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> My Journey / Timeline
              </h2>
              <button type="button" onClick={addTimeline} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-xl text-xs font-semibold">
                <Plus className="w-4 h-4" /> Add Timeline Item
              </button>
            </div>
            <div className="space-y-4">
              {form.timeline.map((item, idx) => (
                <div key={idx} className="bg-background border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">Milestone #{idx + 1}</span>
                    <button type="button" onClick={() => setForm((p) => ({ ...p, timeline: p.timeline.filter((_, i) => i !== idx) }))} className="p-1 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <input type="text" value={item.emoji} onChange={(e) => handleTimelineChange(idx, "emoji", e.target.value)} placeholder="Emoji (e.g. 🌱)" className="px-3 py-2 bg-card border border-border rounded-lg text-sm" />
                    <input type="text" value={item.year} onChange={(e) => handleTimelineChange(idx, "year", e.target.value)} placeholder="Year (2024)" className="px-3 py-2 bg-card border border-border rounded-lg text-sm" />
                    <input type="text" value={item.event} onChange={(e) => handleTimelineChange(idx, "event", e.target.value)} placeholder="Title / Event" className="px-3 py-2 bg-card border border-border rounded-lg text-sm" />
                  </div>
                  <textarea rows={2} value={item.description} onChange={(e) => handleTimelineChange(idx, "description", e.target.value)} placeholder="Description..." className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Fun Facts Section ── */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Smile className="w-5 h-5 text-primary" /> Fun Facts
              </h2>
              <button type="button" onClick={addFunFact} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-xl text-xs font-semibold">
                <Plus className="w-4 h-4" /> Add Fun Fact
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {form.funFacts.map((item, idx) => (
                <div key={idx} className="bg-background border border-border rounded-xl p-4 space-y-2 flex items-start gap-3">
                  <input type="text" value={item.emoji} onChange={(e) => handleFunFactChange(idx, "emoji", e.target.value)} placeholder="☕" className="w-12 text-center px-2 py-2 bg-card border border-border rounded-lg text-sm shrink-0" />
                  <input type="text" value={item.fact} onChange={(e) => handleFunFactChange(idx, "fact", e.target.value)} placeholder="Fun fact..." className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm" />
                  <button type="button" onClick={() => setForm((p) => ({ ...p, funFacts: p.funFacts.filter((_, i) => i !== idx) }))} className="p-1.5 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Collaboration / Work Style Section ── */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Collaboration / Work Style
              </h2>
              <button type="button" onClick={addWorkStyle} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-xl text-xs font-semibold">
                <Plus className="w-4 h-4" /> Add Work Style
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {form.workStyle.map((item, idx) => (
                <div key={idx} className="bg-background border border-border rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <input type="text" value={item.icon} onChange={(e) => handleWorkStyleChange(idx, "icon", e.target.value)} placeholder="Icon (Zap, Heart, Users, Smile)" className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs" />
                    <button type="button" onClick={() => setForm((p) => ({ ...p, workStyle: p.workStyle.filter((_, i) => i !== idx) }))} className="p-1 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input type="text" value={item.title} onChange={(e) => handleWorkStyleChange(idx, "title", e.target.value)} placeholder="Title (Fast Learner)" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm font-semibold" />
                  <textarea rows={2} value={item.desc} onChange={(e) => handleWorkStyleChange(idx, "desc", e.target.value)} placeholder="Description..." className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Beyond Code / Interests Section ── */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" /> Beyond Code / Interests
              </h2>
              <button type="button" onClick={addInterest} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-xl text-xs font-semibold">
                <Plus className="w-4 h-4" /> Add Interest
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {form.interests.map((item, idx) => (
                <div key={idx} className="bg-background border border-border rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <input type="text" value={item.icon} onChange={(e) => handleInterestChange(idx, "icon", e.target.value)} placeholder="Icon (Code2, Coffee, Book, Gamepad2)" className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs" />
                    <button type="button" onClick={() => setForm((p) => ({ ...p, interests: p.interests.filter((_, i) => i !== idx) }))} className="p-1 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input type="text" value={item.label} onChange={(e) => handleInterestChange(idx, "label", e.target.value)} placeholder="Label (Open Source)" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm font-semibold" />
                  <input type="text" value={item.description} onChange={(e) => handleInterestChange(idx, "description", e.target.value)} placeholder="Description..." className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-all shadow-lg"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save All Profile & About Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
