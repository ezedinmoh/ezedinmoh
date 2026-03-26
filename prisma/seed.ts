import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { allProjects } from "../lib/projects"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title)
  let slug = base
  let suffix = 1
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug }, select: { id: true } })
    if (!existing) return slug
    slug = `${base}-${suffix++}`
  }
}

async function main() {
  console.log("Seeding projects...")

  for (let i = 0; i < allProjects.length; i++) {
    const p = allProjects[i]
    const slug = await generateUniqueSlug(p.title)

    await prisma.project.upsert({
      where:  { slug },
      update: {},
      create: {
        slug,
        title:             p.title,
        description:       p.description,
        image:             p.image ?? "",
        tags:              p.tags,
        stack:             p.stack,
        category:          p.category,
        liveUrl:           p.liveUrl ?? p.link ?? null,
        githubUrl:         p.github ?? null,
        featured:          p.featured ?? false,
        year:              p.year,
        sortOrder:         i,
        caseStudyProblem:  p.caseStudy?.problem  ?? null,
        caseStudySolution: p.caseStudy?.solution ?? null,
        caseStudyOutcome:  p.caseStudy?.outcome  ?? null,
      },
    })
    console.log(`  ✓ ${p.title}`)
  }

  console.log("Seeding guestbook...")
  const seedEntries = [
    { name: "Alex Johnson",  message: "Amazing portfolio! The animations are so smooth." },
    { name: "Sarah Chen",    message: "Love the design. Really clean and professional."  },
    { name: "Marcus Rivera", message: "The projects section is impressive. Great work!"  },
  ]

  for (const entry of seedEntries) {
    const existing = await prisma.guestbookEntry.findFirst({ where: { name: entry.name, message: entry.message } })
    if (!existing) {
      await prisma.guestbookEntry.create({ data: { ...entry, avatar: "" } })
      console.log(`  ✓ ${entry.name}`)
    } else {
      console.log(`  ~ ${entry.name} (skipped, already exists)`)
    }
  }

  console.log("Done.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
