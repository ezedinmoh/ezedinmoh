import { ProjectForm } from "@/components/admin/ProjectForm"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Project</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new project to your portfolio</p>
      </div>
      <ProjectForm />
    </div>
  )
}
