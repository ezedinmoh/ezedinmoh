import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="text-center max-w-lg">
          {/* Glitchy 404 */}
          <div className="relative mb-8 select-none">
            <p className="text-[10rem] font-black leading-none text-gradient opacity-20 absolute inset-0 blur-sm">404</p>
            <p className="text-[10rem] font-black leading-none text-gradient relative">404</p>
          </div>

          <div className="mb-4 text-4xl">🌌</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Lost in the void</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            This page doesn't exist — or maybe it used to and got refactored out of existence.
            Either way, let's get you back on track.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-105">
              <Home className="w-4 h-4" /> Go Home
            </Link>
            <Link href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-all hover:scale-105">
              <ArrowLeft className="w-4 h-4" /> Read the Blog
            </Link>
          </div>

          {/* Fun terminal-style message */}
          <div className="mt-12 p-4 bg-card border border-border rounded-xl text-left font-mono text-sm">
            <span className="text-primary">$ </span>
            <span className="text-muted-foreground">find / -name "this-page" 2&gt;/dev/null</span>
            <br />
            <span className="text-red-400">find: no results found</span>
            <br />
            <span className="text-primary">$ </span>
            <span className="text-muted-foreground animate-pulse">_</span>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
