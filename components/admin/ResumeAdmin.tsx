"use client"

import { useState, useCallback } from "react"
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { ResumeData, ExperienceItem, EducationItem, CertItem } from "@/app/admin/resume/page"

// Stable input component — never loses focus
function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40"
      />
    </div>
  )
}

function TextArea({ label, value, onChange, rows = 3, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-muted-foreground/40"
      />
    </div>
  )
}

function Section({ id, title, open, onToggle, children }: {
  id: string; title: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/20 transition-colors">
        <span className="font-semibold text-foreground text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">{children}</div>}
    </div>
  )
}

export function ResumeAdmin({ initial }: { initial: ResumeData }) {
  const [data, setData] = useState<ResumeData>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [openSection, setOpenSection] = useState("basics")

  const toggle = (s: string) => setOpenSection(o => o === s ? "" : s)

  // Stable updaters — use functional updates to avoid stale closures
  const setBasic = useCallback((field: string, value: string) => {
    setData(d => ({ ...d, [field]: value }))
  }, [])

  const setSummary = useCallback((v: string) => setData(d => ({ ...d, summary: v })), [])

  const updateExp = useCallback((i: number, field: string, value: string | string[]) => {
    setData(d => ({
      ...d,
      experience: d.experience.map((e, j) => j === i ? { ...e, [field]: value } : e)
    }))
  }, [])

  const addExp = useCallback(() => {
    setData(d => ({
      ...d,
      experience: [...d.experience, { title: "", company: "", period: "", location: "", bullets: [], tech: [] }]
    }))
  }, [])

  const removeExp = useCallback((i: number) => {
    setData(d => ({ ...d, experience: d.experience.filter((_, j) => j !== i) }))
  }, [])

  const updateEdu = useCallback((i: number, field: string, value: string) => {
    setData(d => ({
      ...d,
      education: d.education.map((e, j) => j === i ? { ...e, [field]: value } : e)
    }))
  }, [])

  const addEdu = useCallback(() => {
    setData(d => ({ ...d, education: [...d.education, { degree: "", school: "", period: "", note: "" }] }))
  }, [])

  const removeEdu = useCallback((i: number) => {
    setData(d => ({ ...d, education: d.education.filter((_, j) => j !== i) }))
  }, [])

  const updateSkillValue = useCallback((cat: string, value: string) => {
    setData(d => ({ ...d, skills: { ...d.skills, [cat]: value.split(",").map(s => s.trim()).filter(Boolean) } }))
  }, [])

  const updateSkillKey = useCallback((oldCat: string, newCat: string) => {
    setData(d => {
      const entries = Object.entries(d.skills).map(([k, v]) => [k === oldCat ? newCat : k, v])
      return { ...d, skills: Object.fromEntries(entries) }
    })
  }, [])

  const addSkill = useCallback(() => {
    setData(d => ({ ...d, skills: { ...d.skills, "New Category": [] } }))
  }, [])

  const removeSkill = useCallback((cat: string) => {
    setData(d => { const s = { ...d.skills }; delete s[cat]; return { ...d, skills: s } })
  }, [])

  const updateCert = useCallback((i: number, field: string, value: string) => {
    setData(d => ({
      ...d,
      certifications: d.certifications.map((c, j) => j === i ? { ...c, [field]: value } : c)
    }))
  }, [])

  const addCert = useCallback(() => {
    setData(d => ({ ...d, certifications: [...d.certifications, { name: "", year: "" }] }))
  }, [])

  const removeCert = useCallback((i: number) => {
    setData(d => ({ ...d, certifications: d.certifications.filter((_, j) => j !== i) }))
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch("/api/resume", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-4">

      {/* Basics */}
      <Section id="basics" title="Basic Info" open={openSection === "basics"} onToggle={() => toggle("basics")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name"  value={data.name}     onChange={v => setBasic("name", v)}     placeholder="Ezedin Mohammed" />
          <Field label="Job Title"  value={data.title}    onChange={v => setBasic("title", v)}    placeholder="Software Engineer" />
          <Field label="Location"   value={data.location} onChange={v => setBasic("location", v)} placeholder="Kombolcha, Ethiopia" />
          <Field label="Email"      value={data.email}    onChange={v => setBasic("email", v)}    placeholder="you@example.com" />
          <Field label="Website"    value={data.website}  onChange={v => setBasic("website", v)}  placeholder="yoursite.dev" />
          <Field label="GitHub"     value={data.github}   onChange={v => setBasic("github", v)}   placeholder="github.com/username" />
          <Field label="LinkedIn"   value={data.linkedin} onChange={v => setBasic("linkedin", v)} placeholder="linkedin.com/in/username" />
        </div>
        <TextArea label="Summary" value={data.summary} onChange={setSummary} rows={4}
          placeholder="Brief professional summary — who you are, what you specialize in, and what you bring to the table." />
      </Section>

      {/* Experience */}
      <Section id="experience" title={`Experience (${data.experience.length})`} open={openSection === "experience"} onToggle={() => toggle("experience")}>
        {data.experience.map((exp, i) => (
          <div key={i} className="border border-border rounded-lg p-4 space-y-3 relative">
            <button onClick={() => removeExp(i)}
              className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Job Title" value={exp.title}    onChange={v => updateExp(i, "title", v)}    placeholder="Senior Frontend Engineer" />
              <Field label="Company"   value={exp.company}  onChange={v => updateExp(i, "company", v)}  placeholder="Acme Corp" />
              <Field label="Period"    value={exp.period}   onChange={v => updateExp(i, "period", v)}   placeholder="2022 – Present" />
              <Field label="Location"  value={exp.location} onChange={v => updateExp(i, "location", v)} placeholder="Remote" />
            </div>
            <TextArea label="Bullets (one per line)" value={exp.bullets.join("\n")}
              onChange={v => updateExp(i, "bullets", v.split("\n").filter(Boolean))} rows={4}
              placeholder={"Led a team of 5 engineers\nReduced load time by 40%\nShipped 3 major features"} />
            <Field label="Tech (comma-separated)" value={exp.tech.join(", ")}
              onChange={v => updateExp(i, "tech", v.split(",").map(s => s.trim()).filter(Boolean))}
              placeholder="React, TypeScript, Node.js" />
          </div>
        ))}
        <button onClick={addExp}
          className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all w-full justify-center">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </Section>

      {/* Education */}
      <Section id="education" title={`Education (${data.education.length})`} open={openSection === "education"} onToggle={() => toggle("education")}>
        {data.education.map((edu, i) => (
          <div key={i} className="border border-border rounded-lg p-4 space-y-3 relative">
            <button onClick={() => removeEdu(i)}
              className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Degree"  value={edu.degree} onChange={v => updateEdu(i, "degree", v)} placeholder="B.Sc. Computer Science" />
              <Field label="School"  value={edu.school} onChange={v => updateEdu(i, "school", v)} placeholder="Addis Ababa University" />
              <Field label="Period"  value={edu.period} onChange={v => updateEdu(i, "period", v)} placeholder="2015 – 2019" />
              <Field label="Note"    value={edu.note}   onChange={v => updateEdu(i, "note", v)}   placeholder="Graduated with Distinction" />
            </div>
          </div>
        ))}
        <button onClick={addEdu}
          className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all w-full justify-center">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Skills" open={openSection === "skills"} onToggle={() => toggle("skills")}>
        {Object.entries(data.skills).map(([cat, items]) => (
          <div key={cat} className="flex gap-2 items-start">
            <input value={cat} onChange={e => updateSkillKey(cat, e.target.value)} placeholder="Category"
              className="w-32 shrink-0 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <input value={items.join(", ")} onChange={e => updateSkillValue(cat, e.target.value)} placeholder="Skill1, Skill2, ..."
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <button onClick={() => removeSkill(cat)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button onClick={addSkill}
          className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all w-full justify-center">
          <Plus className="w-4 h-4" /> Add Skill Category
        </button>
      </Section>

      {/* Certifications */}
      <Section id="certs" title={`Certifications (${data.certifications.length})`} open={openSection === "certs"} onToggle={() => toggle("certs")}>
        {data.certifications.map((cert, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={cert.name} onChange={e => updateCert(i, "name", e.target.value)} placeholder="Certification name"
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <input value={cert.year} onChange={e => updateCert(i, "year", e.target.value)} placeholder="Year"
              className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <button onClick={() => removeCert(i)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button onClick={addCert}
          className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all w-full justify-center">
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </Section>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-all disabled:opacity-60">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Resume
        </button>
        {saved && <span className="text-sm text-emerald-500">Saved successfully</span>}
      </div>
    </div>
  )
}
