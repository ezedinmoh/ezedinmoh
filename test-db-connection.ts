import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { prisma } from "./lib/db"

async function main() {
  console.log("Testing Neon DB connection...")
  const start = Date.now()
  const projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } })
  const elapsed = Date.now() - start
  console.log(`CONNECTED IN ${elapsed}ms! Total projects: ${projects.length}`)
  projects.forEach((p, i) => {
    console.log(`${i + 1}. [${p.id}] ${p.title}`)
    console.log(`   Live: ${p.liveUrl}`)
    console.log(`   Github: ${p.githubUrl}`)
    console.log(`   Image: ${p.image}`)
  })
  await prisma.$disconnect()
}

main().catch(console.error)
