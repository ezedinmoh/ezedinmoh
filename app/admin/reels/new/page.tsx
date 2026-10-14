import { ReelForm } from "@/components/admin/ReelForm"

export default function NewReelPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add Reel</h1>
        <p className="text-sm text-muted-foreground mt-1">Register a TikTok video to your Reels feed</p>
      </div>
      <ReelForm />
    </div>
  )
}
