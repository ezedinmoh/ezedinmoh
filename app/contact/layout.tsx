import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact & Get in Touch",
  description: "Get in touch with Ezedin Mohammed for software engineering roles, full-stack development projects, or freelance inquiries.",
  alternates: {
    canonical: "https://ezedinmoh.vercel.app/contact",
  },
  openGraph: {
    title: "Contact Ezedin Mohammed | Software Engineer",
    description: "Get in touch with Ezedin Mohammed for software engineering roles, full-stack development projects, or freelance inquiries.",
    url: "https://ezedinmoh.vercel.app/contact",
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
