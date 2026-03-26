import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/api/auth"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: Request) {
  try { await requireAuth() } catch (e) { return e as Response }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ message: "File size must not exceed 5MB" }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ message: "Only image files are accepted" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`

    const result = await cloudinary.uploader.upload(dataUri, { folder: "portfolio" })
    return NextResponse.json({ url: result.secure_url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Image upload failed" }, { status: 500 })
  }
}
