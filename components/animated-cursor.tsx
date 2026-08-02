"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  // Start hidden — only reveal after the first real mousemove on the client
  const [isHidden, setIsHidden] = useState(true)
  const [isClicking, setIsClicking] = useState(false)
  // Whether we should render at all — determined entirely on the client
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Only show the custom cursor on non-touch, pointer-capable devices.
    // Checking inside useEffect ensures this runs only on the client,
    // so both server and client initially render nothing (no hydration mismatch).
    if (window.matchMedia("(pointer: fine)").matches && !("ontouchstart" in window)) {
      setShouldRender(true)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsHidden(false)
      const target = e.target as HTMLElement
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "A" ||
        target.tagName === "BUTTON"
      )
    }
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsHidden(true)
    const handleMouseEnter = () => setIsHidden(false)

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  // Return null on SSR and on touch-only devices — same output on both passes
  if (!shouldRender) return null

  return (
    <>
      {/* Main cursor dot */}
      <div
        className={cn(
          "fixed top-0 left-0 w-3 h-3 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100",
          isHidden && "opacity-0",
          isClicking && "scale-75"
        )}
        style={{ transform: `translate(${position.x - 6}px, ${position.y - 6}px)` }}
      />
      {/* Follower ring */}
      <div
        className={cn(
          "fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/50 pointer-events-none z-[9999] transition-all duration-300 ease-out",
          isHidden && "opacity-0",
          isPointer && "w-12 h-12 border-primary bg-primary/10",
          isClicking && "scale-90 bg-primary/20"
        )}
        style={{
          transform: `translate(${position.x - (isPointer ? 24 : 16)}px, ${position.y - (isPointer ? 24 : 16)}px)`,
        }}
      />
    </>
  )
}
