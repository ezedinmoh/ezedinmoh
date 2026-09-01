import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { allProjects } from "@/lib/projects"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)

  try {
    const body = await req.json()
    const rating = Number(body?.rating)

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be a number between 1 and 5" }, { status: 400 })
    }

    const userIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1"

    // 1. Locate project in database
    let dbProject = await prisma.project.findFirst({
      where: { OR: [{ id: decodedId }, { slug: decodedId }] },
    })

    // If static item not yet in database, upsert it first
    if (!dbProject) {
      const staticItem = allProjects.find((p) => p.id === decodedId || p.title.toLowerCase().replace(/\s+/g, "-") === decodedId.toLowerCase())
      const slug = decodedId

      dbProject = await prisma.project.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
          title: staticItem?.title || "Untitled Project",
          description: staticItem?.description || "",
          image: staticItem?.image || "",
          tags: staticItem?.tags || [],
          stack: staticItem?.stack || [],
          category: staticItem?.category || [],
          screenshots: staticItem?.screenshots || [],
          liveUrl: staticItem?.liveUrl || null,
          githubUrl: staticItem?.github || null,
          featured: Boolean(staticItem?.featured),
          year: staticItem?.year || "2026",
          previewMode: staticItem?.previewMode || "slideshow",
        },
      })
    }

    const projectId = dbProject.id

    // 2. Check for existing rating from this IP
    const existingRating = await prisma.projectRating.findUnique({
      where: {
        projectId_userIp: {
          projectId,
          userIp,
        },
      },
    })

    let updatedProject

    if (existingRating) {
      const diff = rating - existingRating.rating

      if (diff !== 0) {
        // Update existing rating record
        await prisma.projectRating.update({
          where: { id: existingRating.id },
          data: { rating },
        })

        // Adjust project aggregate sum
        updatedProject = await prisma.project.update({
          where: { id: projectId },
          data: {
            ratingSum: { increment: diff },
          },
        })
      } else {
        updatedProject = dbProject
      }
    } else {
      // Create new rating record
      await prisma.projectRating.create({
        data: {
          projectId,
          userIp,
          rating,
        },
      })

      // Increment count and sum
      updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          ratingCount: { increment: 1 },
          ratingSum: { increment: rating },
        },
      })
    }

    const ratingCount = updatedProject.ratingCount
    const averageRating = ratingCount > 0 ? Number((updatedProject.ratingSum / ratingCount).toFixed(1)) : 0

    return NextResponse.json({
      projectId,
      averageRating,
      ratingCount,
      userRating: rating,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("POST /api/projects/[id]/rate error:", msg)
    return NextResponse.json({ message: `Failed to record rating: ${msg}` }, { status: 500 })
  }
}
