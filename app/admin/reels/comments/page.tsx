import { prisma } from "@/lib/db"
import { ReelCommentsAdmin } from "@/components/admin/ReelCommentsAdmin"

export const dynamic = "force-dynamic"

export default async function ReelCommentsPage() {
  let comments: any[] = []
  try {
    comments = await prisma.reelComment.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { reel: { select: { title: true, tiktokId: true } } },
    })
  } catch {
    console.warn("[DB Offline] Reel comments admin")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reel Comments</h1>
        <p className="text-sm text-muted-foreground mt-1">{comments.length} comments</p>
      </div>
      <ReelCommentsAdmin comments={comments} />
    </div>
  )
}
