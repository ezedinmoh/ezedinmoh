import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects & Selected Work",
  description: "Explore web development projects, full-stack web applications, AI tools, and open source work created by Ezedin Mohammed.",
  alternates: {
    canonical: "https://ezedinmoh.vercel.app/projects",
  },
  openGraph: {
    title: "Projects & Selected Work | Ezedin Mohammed",
    description: "Explore web development projects, full-stack web applications, AI tools, and open source work created by Ezedin Mohammed.",
    url: "https://ezedinmoh.vercel.app/projects",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ezedin Mohammed Projects" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects & Selected Work | Ezedin Mohammed",
    description: "Explore full-stack applications, AI tools, and open-source software built by Ezedin Mohammed.",
    images: ["/opengraph-image"],
  },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
