import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Skeleton */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </section>

      {/* Filter Bar Skeleton */}
      <section className="pb-8 sticky top-16 z-30 bg-background/95 border-b border-border/40 py-4">
        <div className="container mx-auto px-6 flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl bg-card border border-border/60 overflow-hidden flex flex-col h-full min-h-[380px]">
                <Skeleton className="h-52 w-full rounded-none" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="mt-auto flex justify-between items-center pt-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
