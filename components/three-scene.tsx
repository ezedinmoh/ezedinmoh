"use client"

import { useEffect, useRef } from "react"

export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create floating geometric shapes with CSS 3D transforms
    const shapes = [
      { type: "cube", size: 60, x: 20, y: 30, delay: 0 },
      { type: "sphere", size: 80, x: 70, y: 20, delay: 0.5 },
      { type: "pyramid", size: 50, x: 80, y: 60, delay: 1 },
      { type: "torus", size: 70, x: 15, y: 70, delay: 1.5 },
      { type: "octahedron", size: 55, x: 60, y: 75, delay: 2 },
    ]

    shapes.forEach((shape) => {
      const el = document.createElement("div")
      el.className = `absolute preserve-3d animate-float`
      el.style.cssText = `
        left: ${shape.x}%;
        top: ${shape.y}%;
        width: ${shape.size}px;
        height: ${shape.size}px;
        animation-delay: ${shape.delay}s;
        opacity: 0.6;
      `

      const inner = document.createElement("div")
      inner.className = "w-full h-full preserve-3d animate-rotate-3d"
      inner.style.animationDuration = `${15 + Math.random() * 10}s`

      if (shape.type === "cube") {
        inner.innerHTML = createCube(shape.size)
      } else if (shape.type === "sphere") {
        inner.innerHTML = createSphere(shape.size)
      } else if (shape.type === "pyramid") {
        inner.innerHTML = createPyramid(shape.size)
      } else if (shape.type === "torus") {
        inner.innerHTML = createTorus(shape.size)
      } else {
        inner.innerHTML = createOctahedron(shape.size)
      }

      el.appendChild(inner)
      containerRef.current?.appendChild(el)
    })

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 perspective overflow-hidden pointer-events-none"
      style={{ perspective: "1000px" }}
    />
  )
}

function createCube(size: number) {
  const half = size / 2
  return `
    <div class="absolute preserve-3d" style="width: ${size}px; height: ${size}px; transform-style: preserve-3d;">
      <div class="absolute w-full h-full border border-primary/30 bg-primary/5" style="transform: translateZ(${half}px)"></div>
      <div class="absolute w-full h-full border border-primary/30 bg-primary/5" style="transform: rotateY(180deg) translateZ(${half}px)"></div>
      <div class="absolute w-full h-full border border-primary/30 bg-primary/5" style="transform: rotateY(90deg) translateZ(${half}px)"></div>
      <div class="absolute w-full h-full border border-primary/30 bg-primary/5" style="transform: rotateY(-90deg) translateZ(${half}px)"></div>
      <div class="absolute w-full h-full border border-primary/30 bg-primary/5" style="transform: rotateX(90deg) translateZ(${half}px)"></div>
      <div class="absolute w-full h-full border border-primary/30 bg-primary/5" style="transform: rotateX(-90deg) translateZ(${half}px)"></div>
    </div>
  `
}

function createSphere(size: number) {
  return `
    <div class="w-full h-full rounded-full border-2 border-primary/30 animate-morph" 
         style="background: radial-gradient(circle at 30% 30%, rgba(100, 200, 180, 0.2), transparent 70%);">
    </div>
  `
}

function createPyramid(size: number) {
  return `
    <div class="w-full h-full" style="transform-style: preserve-3d;">
      <div class="absolute inset-0" style="
        width: 0;
        height: 0;
        border-left: ${size / 2}px solid transparent;
        border-right: ${size / 2}px solid transparent;
        border-bottom: ${size}px solid rgba(100, 200, 180, 0.2);
        border-bottom-color: rgba(100, 200, 180, 0.1);
      "></div>
    </div>
  `
}

function createTorus(size: number) {
  return `
    <div class="w-full h-full rounded-full border-4 border-primary/20 animate-morph"
         style="box-shadow: inset 0 0 ${size / 3}px rgba(100, 200, 180, 0.1);">
    </div>
  `
}

function createOctahedron(size: number) {
  return `
    <div class="w-full h-full relative" style="transform: rotate(45deg);">
      <div class="absolute inset-2 border-2 border-primary/30 bg-primary/5 animate-pulse-3d"></div>
    </div>
  `
}
