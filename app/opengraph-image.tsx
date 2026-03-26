import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Ezedin Mohammed — Software Engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f1117 0%, #1a1a2e 50%, #0f2027 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative circle */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100,200,180,0.15) 0%, transparent 70%)",
        }} />

        {/* Available badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 999, padding: "6px 16px", marginBottom: 32,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ color: "#10b981", fontSize: 14, fontWeight: 600 }}>Available for opportunities</span>
        </div>

        {/* Name */}
        <div style={{ fontSize: 72, fontWeight: 800, color: "white", lineHeight: 1.1, marginBottom: 16 }}>
          Ezedin{" "}
          <span style={{ background: "linear-gradient(135deg, #64c8b4, #4db8a8)", WebkitBackgroundClip: "text", color: "transparent" }}>
            Mohammed
          </span>
        </div>

        {/* Title */}
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", marginBottom: 48 }}>
          Software Engineer · React · Next.js · TypeScript
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 48 }}>
          {[["5+", "Years Exp."], ["30+", "Projects"], ["8", "Countries"]].map(([val, label]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: "#64c8b4" }}>{val}</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{ position: "absolute", bottom: 48, right: 80, fontSize: 18, color: "rgba(255,255,255,0.3)" }}>
          ezedin.dev
        </div>
      </div>
    ),
    { ...size }
  )
}
