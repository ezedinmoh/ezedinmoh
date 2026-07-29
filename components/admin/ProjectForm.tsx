"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, Plus, CheckCircle, AlertCircle } from "lucide-react"

interface ProjectFormProps {
  initial?: Record<string, unknown>
  projectId?: string
}

export function ProjectForm({ initial, projectId }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)
  const [error, setError]         = useState("")
  const [success, setSuccess]     = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    title:             (initial?.title             as string) ?? "",
    description:       (initial?.description       as string) ?? "",
    image:             (initial?.image             as string) ?? "",
    screenshots:       ((initial?.screenshots as string[]) ?? []),
    tags:              ((initial?.tags as string[]) ?? []).join(", "),
    stack:             ((initial?.stack as string[]) ?? []).join(", "),
    category:          ((initial?.category as string[]) ?? []).join(", "),
    liveUrl:           (initial?.liveUrl           as string) ?? "",
    githubUrl:         (initial?.githubUrl         as string) ?? "",
    featured:          (initial?.featured          as boolean) ?? false,
    year:              (initial?.year              as string) ?? new Date().getFullYear().toString(),
    previewMode:       ((initial?.previewMode      as string) ?? "iframe") as "slideshow" | "iframe",
    caseStudyProblem:  (initial?.caseStudyProblem  as string) ?? "",
    caseStudySolution: (initial?.caseStudySolution as string) ?? "",
    caseStudyOutcome:  (initial?.caseStudyOutcome  as string) ?? "",
  })

  function set(field: string, value: string | boolean | string[]) {
    setForm(f => ({ ...f, [field]: value }))
    setFieldErrors(e => ({ ...e, [field]: "" }))
    setError("")
    setSuccess("")
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      setUploading(false)
      if (res.ok) set("image", data.url)
      else setError(data.message ?? "Upload failed")
    } catch {
      setUploading(false)
      setError("Failed to upload image")
    }
  }

  async function handleScreenshotUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadingScreenshot(true)
    setError("")
    const urls: string[] = []

    for (const file of files) {
      try {
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: fd })
        const data = await res.json()
        if (res.ok) urls.push(data.url)
        else setError(data.message ?? "Upload failed")
      } catch {
        setError("Upload failed")
      }
    }

    setForm(f => ({ ...f, screenshots: [...f.screenshots, ...urls] }))
    setUploadingScreenshot(false)
    e.target.value = ""
  }

  function removeScreenshot(idx: number) {
    setForm(f => ({ ...f, screenshots: f.screenshots.filter((_, i) => i !== idx) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    setFieldErrors({})

    const payload = {
      ...form,
      tags:        form.tags.split(",").map(s => s.trim()).filter(Boolean),
      stack:       form.stack.split(",").map(s => s.trim()).filter(Boolean),
      category:    form.category.split(",").map(s => s.trim()).filter(Boolean),
      screenshots: form.screenshots,
      previewMode: form.previewMode,
    }

    const url    = projectId ? `/api/projects/${encodeURIComponent(projectId)}` : "/api/projects"
    const method = projectId ? "PUT" : "POST"

    try {
      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const data = await res.json()
      setLoading(false)

      if (res.ok) {
        setSuccess(projectId ? "✓ Project updated successfully! Redirecting..." : "✓ Project created successfully! Redirecting...")
        setTimeout(() => {
          router.push("/admin/projects")
          router.refresh()
        }, 1200)
      } else if (res.status === 422 && data.errors) {
        const errs: Record<string, string> = {}
        for (const err of data.errors) {
          errs[err.field] = err.message
        }
        setFieldErrors(errs)
        setError("Please fix the validation errors listed below.")
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        setError(data.message ?? "Failed to save project. Please try again.")
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    } catch {
      setLoading(false)
      setError("Network error while saving project. Please check your connection.")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const field = (label: string, key: string, type = "text", placeholder = "") => {
    const hasErr = Boolean(fieldErrors[key])
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
        <input
          type={type}
          value={form[key as keyof typeof form] as string}
          onChange={e => set(key, e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-background border ${
            hasErr ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"
          } rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 placeholder:text-muted-foreground/40`}
        />
        {hasErr && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors[key]}</p>}
      </div>
    )
  }

  const textarea = (label: string, key: string, rows = 3, placeholder = "") => {
    const hasErr = Boolean(fieldErrors[key])
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
        <textarea
          value={form[key as keyof typeof form] as string}
          onChange={e => set(key, e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-background border ${
            hasErr ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"
          } rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 resize-none placeholder:text-muted-foreground/40`}
        />
        {hasErr && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors[key]}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Success Notification Banner */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Error Notification Banner with Detailed Field List */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm animate-in fade-in slide-in-from-top-2 space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          {Object.keys(fieldErrors).length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-xs pl-2 text-red-400">
              {Object.entries(fieldErrors).map(([f, msg]) => (
                <li key={f}>
                  <strong className="capitalize">{f}</strong>: {msg}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {field("Title", "title", "text", "e.g. AR Soap & Detergent")}
      {textarea("Description", "description", 4, "Brief description of what the project does and its key features...")}

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Image</label>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={form.image}
            onChange={e => set("image", e.target.value)}
            placeholder="https://... or upload below"
            className={`flex-1 px-3 py-2 bg-background border ${
              fieldErrors.image ? "border-red-500" : "border-border"
            } rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          <label className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm cursor-pointer hover:bg-secondary/80 transition-colors">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Image / Video
            <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mov" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        {fieldErrors.image && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.image}</p>}
      </div>

      {/* Preview Mode Selector */}
      <div className="border border-border rounded-xl p-5 bg-secondary/20">
        <label className="block text-sm font-semibold text-foreground mb-3">
          Preview Display Mode
        </label>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="radio"
              name="previewMode"
              value="slideshow"
              checked={form.previewMode === "slideshow"}
              onChange={e => set("previewMode", e.target.value)}
              className="mt-0.5 w-4 h-4 accent-primary"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                Slideshow (Images/Videos)
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Display uploaded screenshots and videos as a slideshow in the preview modal
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="radio"
              name="previewMode"
              value="iframe"
              checked={form.previewMode === "iframe"}
              onChange={e => set("previewMode", e.target.value)}
              className="mt-0.5 w-4 h-4 accent-primary"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                Live Website (iframe)
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Display the actual live website using an iframe in the preview modal
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Screenshots / preview media - Only show if slideshow mode */}
      {form.previewMode === "slideshow" && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Preview Media <span className="text-xs text-muted-foreground">(images or video shown in the preview modal)</span>
          </label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.screenshots.map((url, idx) => {
              const isVid = /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/video/upload/")
              return (
                <div key={idx} className="relative w-24 h-16 rounded-lg overflow-hidden border border-border group bg-gradient-to-br from-secondary/40 via-background to-secondary/20">
                  <div className="absolute inset-0 pointer-events-none">
                    {isVid ? (
                      <video src={url} muted aria-hidden="true" className="w-full h-full object-cover scale-110 blur-md opacity-40" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt="" aria-hidden="true" className="w-full h-full object-cover scale-110 blur-md opacity-40" />
                    )}
                  </div>
                  {isVid
                    ? <video src={url} muted className="w-full h-full object-contain object-center" />
                    // eslint-disable-next-line @next/next/no-img-element
                    : <img src={url} alt="" className="w-full h-full object-contain object-center" />
                  }
                  <button
                    type="button"
                    onClick={() => removeScreenshot(idx)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
            <label className="w-24 h-16 rounded-lg border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors text-muted-foreground hover:text-primary">
              {uploadingScreenshot ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
              <span className="text-xs mt-1">Add</span>
              <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mov" multiple className="hidden" onChange={handleScreenshotUpload} />
            </label>
          </div>
        </div>
      )}

      {/* Live URL - Highlight when iframe mode is selected */}
      {form.previewMode === "iframe" && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-primary font-medium mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            iframe mode: The Live URL below will be displayed in the preview modal
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Tags (comma-separated)",  "tags",  "text", "Next.js, React, Tailwind CSS")}
        {field("Stack (comma-separated)", "stack", "text", "Next.js, Prisma, PostgreSQL")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Category (comma-separated)", "category", "text", "Full-Stack, Frontend")}
        {field("Year", "year", "text", "2026")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Live URL",   "liveUrl",   "text", "https://yourproject.vercel.app")}
        {field("GitHub URL", "githubUrl", "text", "https://github.com/ezedinmoh/project-name")}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={e => set("featured", e.target.checked)}
          className="w-4 h-4 accent-primary"
        />
        <label htmlFor="featured" className="text-sm text-foreground">Featured project</label>
      </div>

      <div className="border-t border-border pt-4 space-y-4">
        <p className="text-sm font-semibold text-foreground">Case Study (optional)</p>
        {textarea("Problem",  "caseStudyProblem",  3, "What problem did this project solve? What was the pain point or challenge?")}
        {textarea("Solution", "caseStudySolution", 3, "How did you solve it? What approach, architecture, or technology did you use?")}
        {textarea("Outcome",  "caseStudyOutcome",  3, "What was the result? Metrics, impact, or key achievements.")}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-all disabled:opacity-60 shadow-md hover:shadow-lg"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {projectId ? "Save Changes" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm hover:bg-secondary/80 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
