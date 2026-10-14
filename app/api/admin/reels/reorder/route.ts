import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/api/auth"

export async function POST(req: Request) {
  try { await requireAuth() } catch (e) { return e as Response }

  let body: { ids?: string[] }
  try { body = await req.json() } catch {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 })
  }

  if (!Array.isArray(body.ids)) {
    return NextResponse.json({ message: "ids must be an array" }, { status: 400 })
  }

  try {
    await Promise.all(
      body.ids.map((id, index) =>
        prisma.reel.update({ where: { id }, data: { order: index } })
      )
    )
    return NextResponse.json({ message: "Order updated" })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
