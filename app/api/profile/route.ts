import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"

const DEFAULT_PROFILE = {
  id: "singleton",
  avatarUrl: "",
  coverImageUrl: "",
  title: "Ezedin Mohammed",
  location: "Kombolcha, Ethiopia",
  yearsExperience: "5+ Years Experience",
  bio: "I'm a passionate Software Engineer from Ethiopia who believes in the power of clean code and thoughtful design. My journey started with a simple curiosity about how websites work and evolved into a deep love for crafting digital experiences.",
}

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: "singleton" },
    })

    if (profile) {
      return NextResponse.json(profile)
    }
  } catch (e) {
    console.warn("GET /api/profile DB error:", e)
  }

  return NextResponse.json(DEFAULT_PROFILE)
}

export async function PUT(req: Request) {
  try { await requireAuth() } catch (e) { return e as Response }

  try {
    const body = await req.json()

    const avatarUrl       = typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : ""
    const coverImageUrl   = typeof body.coverImageUrl === "string" ? body.coverImageUrl.trim() : ""
    const title           = typeof body.title === "string" ? body.title.trim() : DEFAULT_PROFILE.title
    const location        = typeof body.location === "string" ? body.location.trim() : DEFAULT_PROFILE.location
    const yearsExperience = typeof body.yearsExperience === "string" ? body.yearsExperience.trim() : DEFAULT_PROFILE.yearsExperience
    const bio             = typeof body.bio === "string" ? body.bio.trim() : DEFAULT_PROFILE.bio

    const updated = await prisma.profile.upsert({
      where: { id: "singleton" },
      update: {
        avatarUrl,
        coverImageUrl,
        title,
        location,
        yearsExperience,
        bio,
      },
      create: {
        id: "singleton",
        avatarUrl,
        coverImageUrl,
        title,
        location,
        yearsExperience,
        bio,
      },
    })

    return NextResponse.json(updated)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("PUT /api/profile error:", msg)
    return NextResponse.json({ message: `Failed to update profile: ${msg}` }, { status: 500 })
  }
}
