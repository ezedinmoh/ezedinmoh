/**
 * prisma/seed.mjs
 *
 * Standalone ES module seed — runs with plain `node prisma/seed.mjs`.
 * No ts-node, no tsx, no path aliases.
 *
 * Run after every `prisma db push` / schema change to keep project data
 * and sort orders in sync:
 *
 *   node prisma/seed.mjs
 *
 * Or use the npm script:
 *
 *   pnpm run db:seed
 */

import { createRequire } from "module"
import { readFileSync, existsSync } from "fs"
import { resolve } from "path"

const require = createRequire(import.meta.url)

// ── 1. Load env ─────────────────────────────────────────────────────────────
function loadEnv() {
    for (const file of [".env.local", ".env"]) {
        const p = resolve(process.cwd(), file)
        if (!existsSync(p)) continue
        const lines = readFileSync(p, "utf8").split("\n")
        for (const line of lines) {
            const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)=["']?(.+?)["']?\s*$/)
            if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
        }
    }
}
loadEnv()

// ── 2. Build Prisma client with Neon adapter ────────────────────────────────
const { PrismaClient } = require("@prisma/client")
const { PrismaNeonHttp } = require("@prisma/adapter-neon")

function getDbUrl() {
    let url = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "")
    // Strip channel_binding param — Neon HTTP adapter doesn't support it
    url = url.replace(/([?&])channel_binding=[^&]*&?/g, "$1").replace(/[?&]$/, "")
    if (!url) throw new Error("DATABASE_URL not set")
    return url
}

const adapter = new PrismaNeonHttp(getDbUrl(), {})
const prisma = new PrismaClient({ adapter })

// ── 3. Project data (mirrors lib/projects.ts — single source of truth) ──────
const projects = [
    {
        id: "wearify-next",
        title: "WEARIFY — Premium Oversized Streetwear (Next.js)",
        description: "A Next.js 16 App Router oversized streetwear e-commerce brand suite with Neon Cloud PostgreSQL, independent live 50/50 split-screen admin section managers, dual Stripe & Chapa payments, and Google/GitHub OAuth.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1785324937/portfolio/nj7ndxbrbspqtatjyz0a.png",
        tags: ["Next.js", "TypeScript", "PostgreSQL", "Neon Cloud", "Prisma", "Stripe", "Chapa"],
        stack: ["Next.js 16", "TypeScript", "Prisma", "Neon Cloud PostgreSQL", "NextAuth.js", "Framer Motion", "Tailwind CSS", "Stripe API", "Chapa API"],
        category: ["Full-Stack", "E-Commerce"],
        liveUrl: "https://wearify-et.vercel.app",
        githubUrl: "https://github.com/ezedinmoh/wearify",
        previewMode: "iframe", featured: true, year: "2026",
        caseStudyProblem: "Big & tall fashion buyers lacked an immersive streetwear store with real live-editing capabilities and dual international/local payment gateways.",
        caseStudySolution: "Engineered a Next.js 16 platform backed by Neon Cloud PostgreSQL. Designed 8 independent split-screen live section managers and integrated both Stripe and Ethiopian Chapa checkout options.",
        caseStudyOutcome: "Deployed on Vercel with zero build errors across 50 routes, full guest checkout, and dual OAuth login.",
    },
    {
        id: "smart-nextjs",
        title: "Smart Library Management System (Next.js)",
        description: "A Next.js 16 full-stack library platform featuring role-based dashboards (Admin, Librarian, Student), Supabase PostgreSQL, Stripe & Chapa payment gateways, book reservations, QR code verification, and automated email notifications.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1785325413/portfolio/kzb7f8s6f2qrygzdqtgr.png",
        tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "Chapa"],
        stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma", "Supabase", "NextAuth.js", "Tailwind CSS", "Stripe API", "Chapa API"],
        category: ["Full-Stack"],
        liveUrl: "https://smart-library-et.vercel.app",
        githubUrl: "https://github.com/ezedinmoh/smart-library",
        previewMode: "iframe", featured: true, year: "2026",
        caseStudyProblem: "Educational institutions needed a modern digital library system to replace legacy desktop tools with automated borrowing, fine payments, and role-based access.",
        caseStudySolution: "Built a Next.js 16 App Router application with Supabase PostgreSQL and Prisma ORM. Implemented role dashboards for Admin, Librarian, and Student, automated fine calculation with Stripe & Chapa payment integration, and QR code verification.",
        caseStudyOutcome: "Compiled 90 dynamic and static routes seamlessly, supporting multi-currency fine settlement and real-time email reminders.",
    },
    {
        id: "smart-django",
        title: "Smart Library System (Django)",
        description: "A full-stack enterprise digital library platform built with Next.js 15 App Router frontend and Django REST Framework backend with PostgreSQL, JWT Auth, Swagger API docs, Celery async background tasks, and Docker containerization.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1778451067/portfolio/bh20prd8msndh8pxjlpp.png",
        tags: ["Next.js", "Django", "Python", "PostgreSQL", "REST API", "Docker"],
        stack: ["Next.js 15", "Django 5", "Django REST Framework", "Python 3.12", "PostgreSQL", "Celery", "Redis", "Docker", "Tailwind CSS"],
        category: ["Full-Stack"],
        liveUrl: "https://smart-library-system-dy3a.onrender.com/",
        githubUrl: "https://github.com/ezedinmoh/smart-library-django",
        previewMode: "iframe", featured: true, year: "2026",
        caseStudyProblem: "Universities required a scalable backend with robust Python data processing, automated PDF indexing, async Celery background jobs, and JWT token authentication paired with a sleek Next.js UI.",
        caseStudySolution: "Built Django REST Framework APIs connected to PostgreSQL with Redis-backed Celery worker tasks for email dispatch and PDF thumbnail generation. Designed a responsive Next.js frontend with SWR data fetching and Swagger UI interactive docs.",
        caseStudyOutcome: "Production-ready decoupled web architecture supporting high concurrency, automated schema documentation, and containerized deployment.",
    },
    {
        id: "apple-website",
        title: "Apple iPhone 15 Pro Showcase",
        description: "An immersive 3D Apple web experience featuring 3D iPhone models, interactive color switches, GSAP scroll animations, dynamic video carousel, and responsive layout.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1785325440/portfolio/cqp9b8l2zz9a2tydznya.png",
        tags: ["React", "Three.js", "GSAP", "Tailwind CSS"],
        stack: ["React", "Three.js", "React Three Fiber", "GSAP", "Tailwind CSS", "Vite"],
        category: ["Frontend", "3D / Animation"],
        liveUrl: "https://apple-clone-new.vercel.app",
        githubUrl: "https://github.com/ezedinmoh/apple-clone",
        previewMode: "iframe", featured: true, year: "2026",
        caseStudyProblem: "Showcasing high-tech hardware interactive 3D models online often suffers from poor frame rates and sluggish scroll performance.",
        caseStudySolution: "Utilized Three.js and React Three Fiber with GSAP Timeline animations to render lighting, reflections, and 3D camera transitions smoothly on scroll.",
        caseStudyOutcome: "Achieved 60fps 3D canvas rendering with zero lag across desktop and mobile devices.",
    },
    {
        id: "netflix-clone",
        title: "Netflix Streaming Interface Clone",
        description: "A high-performance Netflix web application clone featuring live TMDB API movie browsing, video trailers, category filtering, custom watchlist, and smooth animations.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1785357399/portfolio/udb7q2owixct1yfoyw2u.png",
        tags: ["React", "JavaScript", "TMDB API", "Tailwind CSS"],
        stack: ["React 19", "JavaScript", "TMDB API", "Tailwind CSS", "Framer Motion", "Vite"],
        category: ["Frontend"],
        liveUrl: "https://netflix-clone-new-app.vercel.app",
        githubUrl: "https://github.com/ezedinmoh/Netflix-Clone",
        previewMode: "iframe", featured: true, year: "2026",
        caseStudyProblem: "Creating an authentic streaming media client requires handling dynamic API data, video preview modals, and fluid responsive carousels.",
        caseStudySolution: "Integrated TMDB API with React custom hooks and Framer Motion layout transitions for live video trailers and category sliders.",
        caseStudyOutcome: "Delivered a pixel-perfect Netflix user interface with fast response times and offline local watchlist storage.",
    },
    {
        id: "gym-house",
        title: "Gym House",
        description: "A fully responsive fitness website with interactive calculators (BMI, TDEE, body fat, water intake), workout planners, filterable class schedules, and a dark mode toggle.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1776977998/portfolio/kcjm517oqqsodlcynz70.png",
        tags: ["HTML5", "CSS3", "JavaScript"],
        stack: ["HTML5", "CSS3", "JavaScript", "Font Awesome", "LocalStorage"],
        category: ["Frontend"],
        liveUrl: "https://gym-house-website.netlify.app",
        githubUrl: "https://github.com/ezedinmoh/gym-house-website",
        previewMode: "slideshow", featured: true, year: "2026",
        caseStudyProblem: "Fitness enthusiasts needed a single platform combining workout planning, fitness calculators, and class scheduling without requiring an account or app install.",
        caseStudySolution: "Built a fully static multi-page website with 6 interactive fitness calculators, a workout planner with pre-made routines, a filterable class schedule, and a favorites system — all powered by vanilla JS and localStorage.",
        caseStudyOutcome: "Deployed on Netlify with zero build process. Fully responsive across all browsers with smooth animations and a dark mode toggle.",
    },
    {
        id: "ar-soap",
        title: "AR Soap & Detergent",
        description: "A modern eco-friendly soap and detergent e-commerce site built with Next.js 16. Features full-screen video backgrounds, animated product cards, a shopping cart with promo codes, and 12 products across 4 categories.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1776937351/portfolio/dlatqa0ytkmt3ww7tykm.png",
        tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
        stack: ["Next.js", "React 19", "Tailwind CSS 4", "Framer Motion", "shadcn/ui", "Embla Carousel"],
        category: ["Full-Stack", "Frontend"],
        liveUrl: "https://arsoap.vercel.app",
        githubUrl: "https://github.com/ezedinmoh/ar-soap",
        previewMode: "iframe", featured: true, year: "2025",
        caseStudyProblem: "A local soap and detergent brand needed a modern e-commerce presence showcasing eco-friendly products in a visually compelling way without a heavy backend.",
        caseStudySolution: "Built with Next.js 16 App Router and Framer Motion. Each product has a dedicated video, category pages have dynamic video backgrounds, and the cart supports promo codes and a free shipping threshold — all managed via React Context.",
        caseStudyOutcome: "Video-first product presentation across 12 products and 4 categories. Fully responsive with dark/light mode, deployed on Vercel.",
    },
    {
        id: "ramadanly",
        title: "Ramadanly",
        description: "A PWA Ramadan companion app built with React. Includes a full Quran viewer with audio recitations, daily habit tracking, streak system, 12 achievements, a 30-day calendar, and analytics — all offline, no account needed.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1776981064/portfolio/aldvnowgbouc6niwplbn.png",
        tags: ["React", "PWA", "Quran API", "LocalStorage"],
        stack: ["React 18", "CSS3", "Service Worker", "Quran.com API", "EveryAyah API", "LocalStorage"],
        category: ["Frontend"],
        liveUrl: "https://ramadanly.netlify.app",
        githubUrl: "https://github.com/ezedinmoh/ramadanly",
        previewMode: "iframe", featured: true, year: "2025",
        caseStudyProblem: "Muslims during Ramadan lacked a single focused tool to track Quran reading goals, maintain daily streaks, and monitor their progress across the full 30 days.",
        caseStudySolution: "Built a PWA with React that integrates the Quran.com API for full Arabic text and EveryAyah for audio recitations. All data persists in localStorage — no backend, no account. Includes gamified streaks, 12 unlockable achievements, a 30-day calendar view, and smart browser notifications.",
        caseStudyOutcome: "Live at ramadanly.netlify.app. Installable as a native app on mobile. API responses cached for 7 days for offline use.",
    },
    {
        id: "swiftbus-online-bus-booking-platform",
        title: "SwiftBus – Online Bus Booking Platform",
        description: "A comprehensive digital transportation platform for online bus ticket reservations, seat selection, and real-time route scheduling.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1779130852/portfolio/luywk48hgiojpioujvec.png",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
        category: ["Full-Stack", "Web Development"],
        liveUrl: "https://swiftbuset.vercel.app",
        githubUrl: "https://github.com/ezedinmoh/swiftbus",
        previewMode: "iframe", featured: true, year: "2026",
        caseStudyProblem: "Bus passengers faced long queues at physical station counters without real-time seat availability visibility.",
        caseStudySolution: "Engineered a web application with interactive seat maps, schedule filtering, and instant booking confirmation.",
        caseStudyOutcome: "Reduced ticketing processing time by 80% with real-time seat locks and automated PDF ticket generation.",
    },
    {
        id: "holland-dairy-ethiopia-premium-brand-website",
        title: "Holland Dairy Ethiopia — Premium Brand Website",
        description: "A modern, premium, and performance-focused corporate website for Holland Dairy Ethiopia. Designed to showcase the brand, products, nutrition, sustainability, and customer experience through immersive storytelling, smooth interactions, and responsive design.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1785679070/portfolio/jjzwamcbnwtqbf1vwm7p.png",
        tags: ["Holland Dairy", "Dairy", "Brand Website", "Corporate Website", "Premium Design", "Modern UI", "UI/UX", "SEO"],
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "NextAuth", "Motion", "Shadcn UI", "Cloudinary", "Stripe", "Chapa", "i18next"],
        category: ["Web Development", "Frontend", "Full Stack", "UI/UX Design", "Corporate Website"],
        liveUrl: "https://holland-dairy.vercel.app",
        githubUrl: "https://github.com/ezedinmoh/holland-dairy",
        previewMode: "iframe", featured: true, year: "2026",
        caseStudyProblem: "Holland Dairy needed a modern digital experience reflecting its premium brand identity while providing an engaging platform for showcasing products, nutrition, sustainability initiatives, and company information.",
        caseStudySolution: "Designed and developed a premium Next.js website with reusable component architecture, responsive layouts, interactive animations, optimized media handling, multilingual support, secure authentication, and performance-first engineering.",
        caseStudyOutcome: "A fast, scalable, and visually polished website delivering a premium user experience across all devices, combining modern UI/UX, SEO best practices, accessibility standards, and maintainable architecture.",
    },
]

// ── 4. Seed ──────────────────────────────────────────────────────────────────
async function main() {
    console.log(`\n🌱  Seeding ${projects.length} projects...\n`)

    const validIds = new Set(projects.map(p => p.id))

    // Remove DB rows not in our project list
    const existing = await prisma.project.findMany()
    for (const p of existing) {
        if (!validIds.has(p.id) && !validIds.has(p.slug)) {
            await prisma.project.delete({ where: { id: p.id } })
            console.log(`  🗑  Removed stale project: ${p.title}`)
        }
    }

    // Upsert all projects, preserving any admin-edited images/urls
    for (let i = 0; i < projects.length; i++) {
        const p = projects[i]
        const existing = await prisma.project.findUnique({ where: { slug: p.id } })

        // Prefer whatever the admin saved over the static fallback
        const image = existing?.image || p.image
        const liveUrl = existing?.liveUrl || p.liveUrl || null
        const githubUrl = existing?.githubUrl || p.githubUrl || null

        const data = {
            title: p.title,
            description: p.description,
            image,
            tags: p.tags,
            stack: p.stack,
            category: p.category,
            liveUrl,
            githubUrl,
            featured: p.featured ?? false,
            year: p.year,
            previewMode: p.previewMode ?? "slideshow",
            sortOrder: i,
            featuredSortOrder: i,       // ← always set — prevents random ordering on new columns
            caseStudyProblem: p.caseStudyProblem ?? null,
            caseStudySolution: p.caseStudySolution ?? null,
            caseStudyOutcome: p.caseStudyOutcome ?? null,
        }

        await prisma.project.upsert({
            where: { slug: p.id },
            update: data,
            create: { id: p.id, slug: p.id, ...data },
        })

        console.log(`  ✓  [${i + 1}/${projects.length}] ${p.title}`)
    }

    console.log("\n✅  Seed complete!\n")
    await prisma.$disconnect()
}

main().catch(async err => {
    console.error("\n❌  Seed failed:", err.message)
    await prisma.$disconnect()
    process.exit(1)
})
