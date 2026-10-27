import type { Metadata } from "next"
import { absoluteUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Guestbook & Messages",
  description: "Leave a message, feedback, or friendly hello on Ezedin Mohammed's portfolio guestbook.",
  alternates: {
    canonical: absoluteUrl("/guestbook"),
  },
  openGraph: {
    title: "Guestbook | Ezedin Mohammed",
    description: "Leave a message, feedback, or friendly hello on Ezedin Mohammed's portfolio guestbook.",
    url: absoluteUrl("/guestbook"),
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ezedin Mohammed Guestbook" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guestbook | Ezedin Mohammed",
    description: "Sign the guestbook and leave a message for Ezedin Mohammed.",
    images: ["/opengraph-image"],
  },
}

export default function GuestbookLayout({ children }: { children: React.ReactNode }) {
  return children
}
