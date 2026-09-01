"use client"

import { useEffect, useRef, useState } from "react"

const DEFAULT_STATS = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 30, suffix: "+", label: "Projects Shipped" },
  { value: 20, suffix: "+", label: "Happy Clients" },
  { value: 8, suffix: "", label: "Countries Worked With" },
]

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = 0
    const duration = 1800
    const step = Math.ceil(target / (duration / 16)) || 1
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [active, target])

  return <span>{count}{suffix}</span>
}

export function StatsBar() {
  const [visible, setVisible] = useState(false)
  const [stats, setStats] = useState(DEFAULT_STATS)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.stats) && data.stats.length > 0) {
          setStats(data.stats)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={`${stat.label}-${i}`} className="text-center group" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2 tabular-nums">
                <CountUp target={Number(stat.value) || 0} suffix={stat.suffix || ""} active={visible} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
