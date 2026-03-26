"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import type { Project } from "@prisma/client"

export function ProjectsTable({ projects: initial }: { projects: Project[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return
    setDeleting(id)
    await fetch(`/api/projects/${id}`, { method: "DELETE" })
    setProjects(p => p.filter(x => x.id !== id))
    setDeleting(null)
    router.refresh()
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-secondary/30">
          <tr>
            <th className="text-left px-4 py-3 text-muted-foreground font-medium">Title</th>
            <th className="text-left px-4 py-3 text-muted-foreground font-medium">Category</th>
            <th className="text-left px-4 py-3 text-muted-foreground font-medium">Year</th>
            <th className="text-left px-4 py-3 text-muted-foreground font-medium">Featured</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.category.join(", ")}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.year}</td>
              <td className="px-4 py-3">
                {p.featured && <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Featured</span>}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 justify-end">
                  <Link href={`/admin/projects/${p.id}`} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No projects yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
