import { prisma } from "@/lib/db"

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title)
  let slug = base
  let suffix = 1

  while (true) {
    const existing = await prisma.project.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (!existing || existing.id === excludeId) return slug
    slug = `${base}-${suffix++}`
  }
}
