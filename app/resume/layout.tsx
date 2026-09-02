import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume & Curriculum Vitae",
  description: "View and download the professional resume and CV of Ezedin Mohammed — Software Engineer & Full-Stack Developer.",
  alternates: {
    canonical: "https://ezedinmoh.vercel.app/resume",
  },
  openGraph: {
    title: "Resume & Curriculum Vitae | Ezedin Mohammed",
    description: "View and download the professional resume and CV of Ezedin Mohammed — Software Engineer & Full-Stack Developer.",
    url: "https://ezedinmoh.vercel.app/resume",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ezedin Mohammed Resume" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume & CV | Ezedin Mohammed",
    description: "Professional software engineering resume, work experience, skills, and accomplishments.",
    images: ["/opengraph-image"],
  },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children
}
