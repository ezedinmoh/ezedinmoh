"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Upload, Loader2, Save, Image as ImageIcon, User, MapPin, Calendar, CheckCircle, AlertCircle } from "lucide-react"

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

      setMessage({ type: "success", text: "✓ Profile & About settings saved successfully!" })
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save settings" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile & Cover Image</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your profile picture, cover photo, and personal bio displayed on the About page.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center gap-3 border ${
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
                  Your main headshot photo shown in the About page hero section
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
                <span>Save Profile Settings</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
