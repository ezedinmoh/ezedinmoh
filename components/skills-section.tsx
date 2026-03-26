"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const skills = [
  { name: "React", level: 95, category: "Frontend" },
  { name: "Next.js", level: 92, category: "Frontend" },
  { name: "TypeScript", level: 90, category: "Languages" },
  { name: "Node.js", level: 88, category: "Backend" },
  { name: "PostgreSQL", level: 85, category: "Database" },
  { name: "TailwindCSS", level: 95, category: "Frontend" },
  { name: "Python", level: 80, category: "Languages" },
  { name: "GraphQL", level: 82, category: "Backend" },
]

const technologies = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL",
  "MongoDB", "GraphQL", "REST API", "TailwindCSS", "Framer Motion", "Three.js",
  "Docker", "AWS", "Vercel", "Git", "Figma", "Prisma",
]

export function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(100, 200, 180, 0.5) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-2 block">
            Expertise
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Skills & Technologies
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit honed over years of building web applications and digital experiences.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className={cn(
                "group p-4 bg-card rounded-xl border border-border transition-all duration-500 hover:border-primary/50",
                isVisible ? "animate-slide-up" : "opacity-0"
              )}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'forwards'
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">{skill.name}</span>
                <span className="text-sm text-muted-foreground">{skill.level}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: isVisible ? `${skill.level}%` : "0%",
                    transitionDelay: `${index * 0.1}s`
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">{skill.category}</span>
            </div>
          ))}
        </div>

        {/* Technology Cloud */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-6">Technologies I Work With</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {technologies.map((tech, index) => (
              <span
                key={tech}
                className={cn(
                  "px-4 py-2 bg-card border border-border rounded-full text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-all cursor-default",
                  isVisible ? "animate-scale-in" : "opacity-0"
                )}
                style={{ 
                  animationDelay: `${0.5 + index * 0.05}s`,
                  animationFillMode: 'forwards'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
