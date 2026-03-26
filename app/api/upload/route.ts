import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/api/auth"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"]

function checkConfig() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Missing Cloudinary env vars")
  }
}

function uploadStream(buffer: Buffer, options: Record<string, unknown>): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err || !result) return reject(err ?? new Error("No result"))
      resolve(result as { secure_url: string })
    }).end(buffer)
  })
}

export async function POST(req: Request) {
  try { await requireAuth() } catch (e) { return e as Response }

  try {
    checkConfig()

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 })

    const ext = ("." + file.name.split(".").pop()?.toLowerCase()) as string
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ message: "File type not allowed" }, { status: 400 })
    }

    const isVideo = [".mp4", ".webm", ".mov"].includes(ext)
    const buffer  = Buffer.from(await file.arrayBuffer())

    const result = await uploadStream(buffer, {
      folder:        "portfolio",
      resource_type: isVideo ? "video" : "image",
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("Upload error:", msg)
    return NextResponse.json({ message: `Upload failed: ${msg}` }, { status: 500 })
  }
}
