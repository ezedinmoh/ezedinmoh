"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Github } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  link?: string
  github?: string
  featured?: boolean
}

interface ProjectCardProps {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500",
        "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5",
        "animate-slide-up opacity-0",
        project.featured && "md:col-span-2 md:row-span-2"
      )}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Morph Effect */}
      <div className="relative aspect-video overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-700",
            isHovered ? "scale-110 animate-morph" : "scale-100"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-card-foreground/5 transition-opacity duration-500",
            isHovered ? "opacity-0" : "opacity-100"
          )}
        />
        
        {/* Placeholder pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-2 p-8 opacity-20">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-8 h-8 rounded-lg bg-primary transition-all duration-500",
                  isHovered && "animate-pulse-3d"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-60"
          )}
        />

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-card-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {project.link && (
            <Link
              href={project.link}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View Project
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              Source
            </a>
          )}
        </div>
      </div>

      {/* Hover border glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "linear-gradient(135deg, transparent 40%, rgba(100, 200, 180, 0.1) 50%, transparent 60%)",
          backgroundSize: "200% 200%",
          animation: isHovered ? "gradientShift 3s ease infinite" : "none",
        }}
      />
    </article>
  )
}
