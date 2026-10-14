import { prisma } from "@/lib/db"
import { ReelsSortClient } from "@/components/admin/ReelsSortClient"

export const dynamic = "force-dynamic"

export default async function SortReelsPage() {
  let reels: any[] = []
  try {
    reels = await prisma.reel.findMany({ orderBy: { order: "asc" } })
  } catch {
    console.warn("[DB Offline] Reels sort page")
  }

  return <ReelsSortClient reels={reels} />
}
