import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "sw.js")
    const fileContent = fs.readFileSync(filePath, "utf-8")

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch {
    return new NextResponse("// Service Worker not found", {
      status: 404,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
      },
    })
  }
}
