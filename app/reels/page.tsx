import { Navigation } from "@/components/navigation"
import { ReelsFeed } from "@/components/reels/ReelsFeed"
import { ReelData } from "@/components/reels/types"
import { Film, WifiOff } from "lucide-react"

export const dynamic = "force-dynamic"

async function getReels(): Promise<{ reels: ReelData[]; error: boolean }> {
  try {
    const { prisma } = await import("@/lib/db")
    const reels = await prisma.reel.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { likes: true, comments: { where: { hidden: false } } } },
      },
    })
    return { reels: reels as unknown as ReelData[], error: false }
  } catch (e) {
    console.error("[Reels] DB error:", e instanceof Error ? e.message : e)
    return { reels: [], error: true }
  }
}

export default async function ReelsPage() {
  const { reels, error } = await getReels()

  return (
    <main data-reels-page className="bg-black min-h-screen text-white" style={{ colorScheme: "dark" }}>
      <Navigation />

      {error ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-white/40 gap-4 px-6 text-center pt-16">
          <WifiOff className="w-14 h-14 text-rose-400" />
          <p className="text-lg font-medium text-white/80">Couldn't load reels right now</p>
          <p className="text-sm max-w-xs text-white/50">
            The database is temporarily unreachable. Please try again in a moment.
          </p>
        </div>
      ) : reels.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-white/40 gap-4 pt-16">
          <Film className="w-16 h-16 text-cyan-400/50" />
          <p className="text-lg font-medium text-white">No reels published yet</p>
          <p className="text-sm text-white/50">Check back soon for new coding & UI/UX reels.</p>
        </div>
      ) : (
        <ReelsFeed initialReels={reels} />
      )}
    </main>
  )
}
