import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Skeleton */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-card border border-border/80 p-2">
              <Skeleton className="w-full h-full rounded-2xl" />
            </div>

            <div className="space-y-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-36" />
              </div>
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Skeleton */}
      <section className="py-24 bg-secondary/20 relative">
        <div className="container mx-auto px-6 max-w-3xl space-y-6">
          <div className="text-center space-y-2 mb-12">
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-10 w-64 mx-auto" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6 items-start">
              <Skeleton className="w-16 h-16 rounded-full shrink-0" />
              <div className="flex-1 p-5 bg-card border border-border rounded-2xl space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
