"use client"

import { useState, useEffect } from "react"
import { Upload, Loader2, Save, Image as ImageIcon, User, MapPin, Calendar, CheckCircle, AlertCircle, BarChart3, Briefcase, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"

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

  const removeExperience = (index: number) => {
    setForm((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }))
  }

  const moveExperience = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= form.experiences.length) return
    setForm((prev) => {
      const newExps = [...prev.experiences]
      const temp = newExps[index]
      newExps[index] = newExps[targetIndex]
      newExps[targetIndex] = temp
      return { ...prev, experiences: newExps }
    })
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

      setMessage({ type: "success", text: "✓ Profile, Stats & Career Path saved successfully!" })
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save settings" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile & Career Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your headshot, cover image, stats counters, and work experience timeline saved in your database.
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" /> Cover Image
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Background banner photo for your profile card
                </p>
              </div>
            </div>

            {/* Cover Image Preview */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden bg-secondary/30 border border-border/60 flex items-center justify-center group">
              {form.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No cover image uploaded yet</p>
                </div>
              )}
            </div>

            {/* Upload Input */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.coverImageUrl}
                onChange={(e) => setForm((p) => ({ ...p, coverImageUrl: e.target.value }))}
                placeholder="Cloudinary Cover Image URL (or upload file)"
                className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
              />
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium rounded-xl border border-border transition-all">
                {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-4 h-4 text-primary" />}
                <span>Upload Cover</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingCover}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUpload(e.target.files[0], "cover")
                  }}
                />
              </label>
            </div>
          </div>

          {/* ── Profile Picture Section ── */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Profile Picture (Avatar)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your main headshot photo shown on the website and loading screen
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Preview */}
              <div className="relative w-36 h-36 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/40 flex items-center justify-center shrink-0 shadow-lg">
                {form.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-primary">EM</span>
                )}
              </div>

              <div className="flex-1 space-y-3 w-full">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Profile Picture URL
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={form.avatarUrl}
                    onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))}
                    placeholder="https://res.cloudinary.com/.../profile.jpg"
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-all shrink-0">
                    {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingAvatar}
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleUpload(e.target.files[0], "avatar")
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: Square aspect ratio (500x500px). Uploads automatically to your Cloudinary storage.
                </p>
              </div>
            </div>
          </div>

          {/* ── Stats Bar Section ── */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Stats Bar Counters
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage the 4 key stat counter metrics displayed on the home page
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {form.stats.map((stat, idx) => (
                <div key={idx} className="bg-background border border-border p-4 rounded-xl space-y-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Stat Card #{idx + 1}</span>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Number Value</label>
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Suffix (e.g. +)</label>
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => handleStatChange(idx, "suffix", e.target.value)}
                      placeholder="+"
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Stat Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                      placeholder="Label"
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Work Experience / Career Path Section ── */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" /> Career Path & Work Experience
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage your professional journey timeline items displayed on your site
                </p>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-primary/10 text-primary border border-primary/30 rounded-xl text-xs font-semibold hover:bg-primary/20 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>

            <div className="space-y-6">
              {form.experiences.map((exp, idx) => (
                <div key={idx} className="bg-background border border-border rounded-xl p-5 space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-sm font-semibold text-primary">Experience #{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveExperience(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExperience(idx, "down")}
                        disabled={idx === form.experiences.length - 1}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExperience(idx)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ml-2"
                        title="Delete Experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => handleExpChange(idx, "title", e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleExpChange(idx, "company", e.target.value)}
                        placeholder="e.g. TechCorp"
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Company URL
                      </label>
                      <input
                        type="text"
                        value={exp.companyUrl}
                        onChange={(e) => handleExpChange(idx, "companyUrl", e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Period / Timeline
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => handleExpChange(idx, "period", e.target.value)}
                        placeholder="2024 - Present"
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => handleExpChange(idx, "description", e.target.value)}
                      placeholder="Key achievements and role summary..."
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(exp.technologies) ? exp.technologies.join(", ") : exp.technologies}
                      onChange={(e) =>
                        handleExpChange(
                          idx,
                          "technologies",
                          e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                        )
                      }
                      placeholder="React, TypeScript, GraphQL, Storybook"
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Personal Info Section ── */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Full Name / Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Experience Badge Text
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={form.yearsExperience}
                  onChange={(e) => setForm((p) => ({ ...p, yearsExperience: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile & Experience</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
