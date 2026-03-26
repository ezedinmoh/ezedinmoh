"use client"

import { useEffect, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsTransitioning(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div className="relative">
      {/* Transition overlay */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-transform duration-500 ease-out ${
          isTransitioning ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-background translate-y-1/2" />
      </div>

      {/* Page content */}
      <div
        className={`transition-all duration-500 ${
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {displayChildren}
      </div>
    </div>
  )
}

// Morph transition component for elements
export function MorphTransition({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-8 blur-sm"
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Stagger container for list items
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <MorphTransition key={index} delay={index * staggerDelay}>
          {child}
        </MorphTransition>
      ))}
    </div>
  )
}
