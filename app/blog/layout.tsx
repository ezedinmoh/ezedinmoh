import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog & Technical Articles",
  description: "Read articles and insights on React, Next.js, TypeScript, web performance, and software engineering by Ezedin Mohammed.",
  alternates: {
    canonical: "https://ezedinmoh.pro.et/blog",
  },
  openGraph: {
    title: "Blog & Technical Articles | Ezedin Mohammed",
    description: "Read articles and insights on React, Next.js, TypeScript, web performance, and software engineering by Ezedin Mohammed.",
    url: "https://ezedinmoh.pro.et/blog",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ezedin Mohammed Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Technical Articles | Ezedin Mohammed",
    description: "Technical articles, guides, and thoughts on frontend architecture and web development.",
    images: ["/opengraph-image"],
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
