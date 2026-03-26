import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { StatsBar } from "@/components/stats-bar"
import { FeaturedProjects } from "@/components/featured-projects"
import { SkillsSection } from "@/components/skills-section"
import { ExperienceSection } from "@/components/experience-section"
import { Testimonials } from "@/components/testimonials"
import { ContactCTA } from "@/components/contact-cta"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <AnimatedCursor />
      <Navigation />
      <Hero />
      <StatsBar />
      <FeaturedProjects />
      <SkillsSection />
      <ExperienceSection />
      <Testimonials />
      <ContactCTA />
      <Footer />
    </main>
  )
}
