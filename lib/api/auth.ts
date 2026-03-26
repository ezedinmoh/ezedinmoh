import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { NextResponse } from "next/server"

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  return session
}
