import Link from "next/link"
import { ArrowRight, Briefcase } from "lucide-react"

export function OpenToWorkBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-500/10 via-primary/10 to-emerald-500/10 border-b border-emerald-500/20">
      <div className="container mx-auto px-6 py-2.5 flex items-center justify-center gap-3 text-sm">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-foreground font-medium flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
          Open to new opportunities — available for freelance & full-time roles
        </span>
        <Link href="/resume"
          className="hidden sm:inline-flex items-center gap-1 text-primary font-medium hover:underline text-xs">
          View Resume <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
