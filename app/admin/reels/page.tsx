import Link from "next/link"
import { prisma } from "@/lib/db"
import { Plus, ArrowUpDown, MessageSquare, Heart, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react"
import { ReelsAdminTable } from "@/components/admin/ReelsAdminTable"

export const dynamic = "force-dynamic"

export default async function AdminReelsPage() {
  let reels: any[] = []
  try {
    reels = await prisma.reel.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { likes: true, comments: true } } },
    })
  } catch {
    console.warn("[DB Offline] Admin Reels page")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reels</h1>
          <p className="text-sm text-muted-foreground mt-1">{reels.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/reels/sort"
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-lg text-sm font-medium hover:bg-secondary/80 transition-all"
          >
            <ArrowUpDown className="w-4 h-4" /> Sort
          </Link>
          <Link
            href="/admin/reels/comments"
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-lg text-sm font-medium hover:bg-secondary/80 transition-all"
          >
            <MessageSquare className="w-4 h-4" /> Comments
          </Link>
          <Link
            href="/admin/reels/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Reel
          </Link>
        </div>
      </div>
      <ReelsAdminTable reels={reels} />
    </div>
  )
}
