"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const experiences = [
  {
    title: "Senior Frontend Engineer",
    company: "TechCorp",
    companyUrl: "https://example.com",
    period: "2024 - Present",
    description: "Leading frontend architecture for a suite of enterprise applications. Implemented design system used by 50+ developers.",
    technologies: ["React", "TypeScript", "GraphQL", "Storybook"],
  },
  {
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    companyUrl: "https://example.com",
    period: "2022 - 2024",
    description: "Built and scaled a SaaS platform from 0 to 100k users. Led migration to microservices architecture.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    title: "Frontend Developer",
    company: "Digital Agency Co",
    companyUrl: "https://example.com",
    period: "2020 - 2022",
    description: "Delivered 20+ client projects ranging from marketing sites to complex web applications.",
    technologies: ["React", "Vue.js", "SASS", "WordPress"],
  },
  {
    title: "Junior Developer",
    company: "CodeStart",
    companyUrl: "https://example.com",
    period: "2019 - 2020",
    description: "Started my professional journey building responsive websites and learning modern web technologies.",
    technologies: ["JavaScript", "HTML/CSS", "PHP", "MySQL"],
  },
]

export function ExperienceSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-2 block">
            Career Path
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Work Experience
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A timeline of my professional journey, from eager beginner to experienced engineer.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

          {experiences.map((exp, index) => (
            <div
              key={index}
              className={cn(
                "relative pl-8 md:pl-0 pb-12 last:pb-0",
                isVisible ? "animate-slide-up opacity-0" : "opacity-0"
              )}
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animationFillMode: 'forwards'
              }}
            >
              {/* Timeline dot */}
              <div className={cn(
                "absolute left-0 md:left-1/2 w-3 h-3 rounded-full bg-primary md:-translate-x-1/2 mt-2",
                "ring-4 ring-background"
              )} />

              {/* Content */}
              <div className={cn(
                "md:w-1/2",
                index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
              )}>
                <span className="text-sm text-muted-foreground mb-1 block">{exp.period}</span>
                <h3 className="text-xl font-semibold text-foreground mb-1">{exp.title}</h3>
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline mb-3"
                >
                  {exp.company}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {exp.description}
                </p>
                <div className={cn(
                  "flex flex-wrap gap-2",
                  index % 2 === 0 ? "md:justify-end" : ""
                )}>
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-secondary rounded text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
