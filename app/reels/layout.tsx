import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reels | Ezedin Mohammed",
  description:
    "Watch short TikTok-style videos by Ezedin Mohammed — a software engineer from Ethiopia. Like and comment independently on my portfolio site.",
  alternates: { canonical: "https://ezedinmoh.pro.et/reels" },
  openGraph: {
    title: "Reels | Ezedin Mohammed",
    description: "TikTok-inspired video feed on my portfolio.",
    url: "https://ezedinmoh.pro.et/reels",
    type: "website",
  },
}

export default function ReelsLayout({ children }: { children: React.ReactNode }) {
  return children
}
