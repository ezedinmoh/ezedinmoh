import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { prisma } from "../lib/db"
import { allProjects } from "../lib/projects"

async function main() {
  console.log("Seeding all 15 projects into Neon database...")

  for (let i = 0; i < allProjects.length; i++) {
    const p = allProjects[i]
    const slug = p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    await prisma.project.upsert({
      where:  { slug },
      update: {
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
    console.log(`  ✓ Project ${i + 1}/${allProjects.length}: ${p.title}`)
  }

  console.log("Seeding guestbook...")
  const seedGuestEntries = [
    { name: "Alex Johnson",  message: "Amazing portfolio! The animations are so smooth." },
    { name: "Sarah Chen",    message: "Love the design. Really clean and professional."  },
    { name: "Marcus Rivera", message: "The projects section is impressive. Great work!"  },
    { name: "David Kim",     message: "Inspiring work on WEARIFY and Smart Library!"     },
  ]

  for (const entry of seedGuestEntries) {
    const existing = await prisma.guestbookEntry.findFirst({ where: { name: entry.name, message: entry.message } })
    if (!existing) {
      await prisma.guestbookEntry.create({ data: { ...entry, avatar: "" } })
      console.log(`  ✓ Guestbook: ${entry.name}`)
    }
  }

  console.log("Seeding contact messages...")
  const seedMessages = [
    { name: "Hassan Ali",    email: "hassan@techventures.io", subject: "Full-Stack Opportunity", message: "Hi Ezedin, we loved your Smart Library & WEARIFY projects. Are you open to contract projects?", read: false },
    { name: "Elena Rostova", email: "elena@designstudio.co",  subject: "Collaboration Inquiry",  message: "Hello! Would love to partner on an upcoming 3D web experience project.", read: true },
  ]

  for (const msg of seedMessages) {
    const existing = await prisma.contactMessage.findFirst({ where: { email: msg.email, subject: msg.subject } })
    if (!existing) {
      await prisma.contactMessage.create({ data: msg })
      console.log(`  ✓ Contact Message: ${msg.subject}`)
    }
  }

  console.log("Seeding analytics events...")
  const samplePaths = ["/", "/projects", "/about", "/contact", "/resume", "/projects/wearify-next"]
  const devices = ["desktop", "mobile", "tablet"]

  const existingCount = await prisma.analyticsEvent.count()
  if (existingCount < 20) {
    for (let i = 0; i < 25; i++) {
      const path = samplePaths[Math.floor(Math.random() * samplePaths.length)]
      const deviceType = devices[Math.floor(Math.random() * devices.length)]
      await prisma.analyticsEvent.create({
        data: {
          path,
          deviceType,
          referrer: "https://google.com",
          country: "ET",
        },
      })
    }
    console.log("  ✓ Analytics Events seeded")
  }

  console.log("Database seed complete.")
  await prisma.$disconnect()
}

main().catch(console.error)
