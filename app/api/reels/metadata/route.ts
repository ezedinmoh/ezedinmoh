import { NextResponse } from "next/server"
import { fetchTikTokMetadata } from "@/lib/tiktok-oembed"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ message: "URL parameter is required" }, { status: 400 })
  }

  const data = await fetchTikTokMetadata(url)
  if (!data) {
    return NextResponse.json({ message: "Could not fetch TikTok metadata" }, { status: 404 })
  }

  return NextResponse.json(data)
}
