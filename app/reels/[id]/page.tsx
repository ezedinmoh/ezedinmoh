import { notFound } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { ReelsFeed } from "@/components/reels/ReelsFeed"
import { ReelData } from "@/components/reels/types"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  let title = "Reel | Ezedin Mohammed"
  let description = "Watch this reel by Ezedin Mohammed — Software Engineer."

  try {
    const { prisma } = await import("@/lib/db")
    const reel = await prisma.reel.findFirst({ where: { id, published: true } })
    if (reel?.title) title = `${reel.title.slice(0, 50)} | Ezedin Mohammed`
    if (reel?.caption) description = reel.caption.slice(0, 160)
  } catch {}

  return {
    title,
    description,
    alternates: { canonical: `https://ezedinmoh.pro.et/reels/${id}` },
    openGraph: { title, description, url: `https://ezedinmoh.pro.et/reels/${id}` },
  }
}

export default async function SingleReelPage({ params }: Props) {
  const { id } = await params

  let allReels: ReelData[] = []
  try {
    const { prisma } = await import("@/lib/db")
    const dbReels = await prisma.reel.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { likes: true, comments: { where: { hidden: false } } } },
      },
    })
    allReels = dbReels as unknown as ReelData[]
  } catch {}

  // Find requested reel
  const targetReel = allReels.find((r) => r.id === id || r.tiktokId === id)
  if (!targetReel) notFound()

  // Put target reel first in the list so it loads as activeIndex 0
  const sortedReels = [targetReel, ...allReels.filter((r) => r.id !== targetReel.id)]

  return (
    <main data-reels-page className="bg-black min-h-screen text-white" style={{ colorScheme: "dark" }}>
      <Navigation />
      <ReelsFeed initialReels={sortedReels} />
    </main>
  )
}
