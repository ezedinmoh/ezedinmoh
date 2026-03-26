"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, Plus } from "lucide-react"

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
    caseStudyProblem:  (initial?.caseStudyProblem  as string) ?? "",
    caseStudySolution: (initial?.caseStudySolution as string) ?? "",
    caseStudyOutcome:  (initial?.caseStudyOutcome  as string) ?? "",
  })

  function set(field: string, value: string | boolean | string[]) {
    setForm(f => ({ ...f, [field]: value }))
    setFieldErrors(e => ({ ...e, [field]: "" }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    setUploading(false)
    if (res.ok) set("image", data.url)
    else setError(data.message ?? "Upload failed")
  }

  async function handleScreenshotUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadingScreenshot(true)
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
    setFieldErrors({})

    const payload = {
      ...form,
      tags:        form.tags.split(",").map(s => s.trim()).filter(Boolean),
      stack:       form.stack.split(",").map(s => s.trim()).filter(Boolean),
      category:    form.category.split(",").map(s => s.trim()).filter(Boolean),
      screenshots: form.screenshots,
    }

    const url    = projectId ? `/api/projects/${projectId}` : "/api/projects"
    const method = projectId ? "PUT" : "POST"

    const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      router.push("/admin/projects")
      router.refresh()
    } else if (res.status === 422 && data.errors) {
      const errs: Record<string, string> = {}
      for (const err of data.errors) errs[err.field] = err.message
      setFieldErrors(errs)
    } else {
      setError(data.message ?? "Something went wrong")
    }
  }

  const field = (label: string, key: string, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input
        type={type}
        value={form[key as keyof typeof form] as string}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {fieldErrors[key] && <p className="text-xs text-red-500 mt-1">{fieldErrors[key]}</p>}
    </div>
  )

  const textarea = (label: string, key: string, rows = 3) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <textarea
        value={form[key as keyof typeof form] as string}
        onChange={e => set(key, e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
      {fieldErrors[key] && <p className="text-xs text-red-500 mt-1">{fieldErrors[key]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {field("Title", "title")}
      {textarea("Description", "description", 4)}

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Image</label>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={form.image}
            onChange={e => set("image", e.target.value)}
            placeholder="https://... or upload below"
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <label className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm cursor-pointer hover:bg-secondary/80 transition-colors">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Image / Video
            <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mov" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      {/* Screenshots / preview media */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Preview Media <span className="text-xs text-muted-foreground">(images or video shown in the preview modal)</span>
        </label>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.screenshots.map((url, idx) => {
            const isVid = /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/video/upload/")
            return (
              <div key={idx} className="relative w-24 h-16 rounded-lg overflow-hidden border border-border group">
                {isVid
                  ? <video src={url} muted className="w-full h-full object-cover" />
                  // eslint-disable-next-line @next/next/no-img-element
                  : <img src={url} alt="" className="w-full h-full object-cover" />
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

      <div className="grid grid-cols-2 gap-4">
        {field("Tags (comma-separated)",  "tags",  "text", "React, Next.js")}
        {field("Stack (comma-separated)", "stack", "text", "Next.js, Prisma")}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field("Category (comma-separated)", "category", "text", "Full-Stack, Frontend")}
        {field("Year", "year", "text", "2025")}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field("Live URL",   "liveUrl",   "url")}
        {field("GitHub URL", "githubUrl", "url")}
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
        {textarea("Problem",  "caseStudyProblem",  3)}
        {textarea("Solution", "caseStudySolution", 3)}
        {textarea("Outcome",  "caseStudyOutcome",  3)}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-all disabled:opacity-60"
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
