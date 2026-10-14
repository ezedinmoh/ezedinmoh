import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { prisma } from "../lib/db"
import { allProjects } from "../lib/projects"

async function main() {
  console.log("Syncing database with the 9 real projects, preserving DB fields...")

  // Upsert all projects preserving any DB user edits and custom sort orders
  for (let i = 0; i < allProjects.length; i++) {
    const p = allProjects[i]
    const slug = p.id

    const existingRecord = await prisma.project.findUnique({ where: { slug } })
    const imageToUse = existingRecord?.image || p.image || ""
    const liveUrlToUse = existingRecord?.liveUrl || p.liveUrl || p.link || null
    const githubUrlToUse = existingRecord?.githubUrl || p.github || null
    const sortOrder = (existingRecord?.sortOrder !== undefined && existingRecord?.sortOrder !== null) ? existingRecord.sortOrder : i
    const featuredSortOrder = (existingRecord?.featuredSortOrder !== undefined && existingRecord?.featuredSortOrder !== null) ? existingRecord.featuredSortOrder : i
    const featured = existingRecord ? existingRecord.featured : (p.featured ?? false)

    await prisma.project.upsert({
      where: { slug },
      update: {
        title: p.title,
        description: p.description,
        image: imageToUse,
        tags: p.tags,
        stack: p.stack,
        category: p.category,
        liveUrl: liveUrlToUse,
        githubUrl: githubUrlToUse,
        featured,
        year: p.year,
        previewMode: p.previewMode ?? "iframe",
        sortOrder,
        featuredSortOrder,
        caseStudyProblem: p.caseStudy?.problem ?? null,
        caseStudySolution: p.caseStudy?.solution ?? null,
        caseStudyOutcome: p.caseStudy?.outcome ?? null,
      },
      create: {
        id: slug,
        slug,
        title: p.title,
        description: p.description,
        image: imageToUse,
        tags: p.tags,
        stack: p.stack,
        category: p.category,
        liveUrl: liveUrlToUse,
        githubUrl: githubUrlToUse,
        featured: p.featured ?? false,
        year: p.year,
        sortOrder: i,
        featuredSortOrder: i,
        caseStudyProblem: p.caseStudy?.problem ?? null,
        caseStudySolution: p.caseStudy?.solution ?? null,
        caseStudyOutcome: p.caseStudy?.outcome ?? null,
      },
    })
    console.log(`  ✓ Project ${i + 1}/${allProjects.length}: ${p.title}`)
  }

  console.log("Database sync complete!")
  await prisma.$disconnect()
}

main().catch(console.error)
