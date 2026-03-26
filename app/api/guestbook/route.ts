import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { validateBody } from "@/lib/api/validate"
import { sanitize } from "@/lib/api/sanitize"
import { rateLimit } from "@/lib/rate-limit"
import { GuestbookCreateSchema } from "@/lib/validations"

export async function GET() {
  const entries = await prisma.guestbookEntry.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  })
  return NextResponse.json(entries)
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  const { success } = await rateLimit(ip, "guestbook", 3, 3600)
  if (!success) return NextResponse.json({ message: "Too many requests" }, { status: 429 })

  try {
    const body = await validateBody(req, GuestbookCreateSchema)
    const clean = sanitize(body as Record<string, unknown>)

    const entry = await prisma.guestbookEntry.create({
      data: {
        name:    clean.name as string,
        message: clean.message as string,
        avatar:  (clean.avatar as string) ?? "",
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
