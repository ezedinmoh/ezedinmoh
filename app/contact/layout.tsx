import type { Metadata } from "next"
import { absoluteUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact & Get in Touch",
  description: "Get in touch with Ezedin Mohammed for software engineering roles, full-stack development projects, or freelance inquiries.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
  openGraph: {
    title: "Contact Ezedin Mohammed | Software Engineer",
    description: "Get in touch with Ezedin Mohammed for software engineering roles, full-stack development projects, or freelance inquiries.",
    url: absoluteUrl("/contact"),
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Contact Ezedin Mohammed" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Ezedin Mohammed | Software Engineer",
    description: "Send a message or get in touch with Ezedin Mohammed.",
    images: ["/opengraph-image"],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
