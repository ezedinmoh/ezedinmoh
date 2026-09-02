import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Me & Career Journey",
  description: "Learn more about Ezedin Mohammed — Software Engineer & Full-Stack Developer from Ethiopia. Explore work experience, career path timeline, and values.",
  alternates: {
    canonical: "https://ezedinmoh.vercel.app/about",
  },
  openGraph: {
    title: "About Ezedin Mohammed | Software Engineer",
    description: "Learn more about Ezedin Mohammed — Software Engineer & Full-Stack Developer from Ethiopia. Explore work experience, career path timeline, and values.",
    url: "https://ezedinmoh.vercel.app/about",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "About Ezedin Mohammed" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ezedin Mohammed | Software Engineer",
    description: "Learn more about Ezedin Mohammed — Software Engineer & Full-Stack Developer from Ethiopia.",
    images: ["/opengraph-image"],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
