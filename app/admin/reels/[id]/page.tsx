import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { ReelForm } from "@/components/admin/ReelForm"

export const dynamic = "force-dynamic"

export default async function EditReelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let reel: any = null
  try {
    reel = await prisma.reel.findUnique({
      where: { id },
      include: { _count: { select: { likes: true, comments: true } } },
    })
  } catch {}

  if (!reel) notFound()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Reel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {reel._count.likes} website likes · {reel._count.comments} comments
        </p>
      </div>
      <ReelForm reel={reel} />
    </div>
  )
}
