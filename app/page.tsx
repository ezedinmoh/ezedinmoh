import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { StatsBar } from "@/components/stats-bar"
import { AboutSection } from "@/components/about-section"
import { FeaturedProjects } from "@/components/featured-projects"
import { SkillsSection } from "@/components/skills-section"
import { ExperienceSection } from "@/components/experience-section"
import { Testimonials } from "@/components/testimonials"
import { ContactCTA } from "@/components/contact-cta"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"

export const metadata: Metadata = {
  title: "Ezedin Mohammed | Software Engineer & Full-Stack Developer",
  description: "Portfolio of Ezedin Mohammed — Software Engineer & Full-Stack Developer specializing in React, Next.js, TypeScript, and modern web applications.",
  alternates: {
    canonical: "https://ezedinmoh.pro.et",
  },
  openGraph: {
    title: "Ezedin Mohammed | Software Engineer & Full-Stack Developer",
    description: "Portfolio of Ezedin Mohammed — Software Engineer & Full-Stack Developer specializing in React, Next.js, TypeScript, and modern web applications.",
    url: "https://ezedinmoh.pro.et",
    siteName: "Ezedin Mohammed",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ezedin Mohammed Portfolio" }],
    type: "website",
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <AnimatedCursor />
      <Navigation />
      <Hero />
      <StatsBar />
      <AboutSection />
      <FeaturedProjects />
      <SkillsSection />
      <ExperienceSection />
      <Testimonials />
      <ContactCTA />
      <Footer />
    </main>
  )
}
