import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { prisma } from "../lib/db"
import { allProjects } from "../lib/projects"

async function main() {
  console.log("Syncing database with the 9 real projects...")

  const validIds = new Set(allProjects.map(p => p.id))

  // Remove any legacy / sample projects from DB
  const existing = await prisma.project.findMany()
  for (const p of existing) {
    if (!validIds.has(p.id) && !validIds.has(p.slug)) {
      await prisma.project.delete({ where: { id: p.id } })
      console.log(`  ✓ Removed extra project: ${p.title}`)
    }
  }

  // Upsert the 9 real projects, preserving user uploaded cover images in DB
  for (let i = 0; i < allProjects.length; i++) {
    const p = allProjects[i]
    const slug = p.id

    const existingRecord = await prisma.project.findUnique({ where: { slug } })
    const imageToUse = (existingRecord?.image && existingRecord.image !== "/placeholder.jpg")
      ? existingRecord.image
      : (p.image || "")

    await prisma.project.upsert({
      where:  { slug },
      update: {
        title:             p.title,
        description:       p.description,
        image:             imageToUse,
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
      create: {
        id:                slug,
        slug,
        title:             p.title,
        description:       p.description,
        image:             p.image || "",
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
    console.log(`  ✓ Real Project ${i + 1}/${allProjects.length}: ${p.title}`)
  }

  console.log("Database sync complete!")
  await prisma.$disconnect()
}

main().catch(console.error)
