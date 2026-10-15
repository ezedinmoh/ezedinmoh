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
import https from "https"
import dns from "dns"

// Force IPv4 — Node v24 prefers IPv6 which hangs on Neon's AWS endpoints
dns.setDefaultResultOrder("ipv4first")

const require = createRequire(import.meta.url)

// ── 1. Load env ───────────────────────────────────────────────────────────────
const dotenv = require("dotenv")
dotenv.config({ path: ".env.local", override: false })
dotenv.config({ path: ".env", override: false })


// ── 2. IPv4-only fetch + Prisma client ───────────────────────────────────────
function ipv4Fetch(input, init) {
    return new Promise((resolve, reject) => {
        const u = new URL(typeof input === "string" ? input : (input.url ?? String(input)))
        const body = init?.body
        const req = https.request(
            {
                hostname: u.hostname, port: Number(u.port) || 443, path: u.pathname + u.search,
                method: (init?.method || "GET").toUpperCase(),
                headers: init?.headers || {}, family: 4
            },
            (res) => {
                const chunks = []
                res.on("data", c => chunks.push(c))
                res.on("end", () => {
                    const buf = Buffer.concat(chunks)
                    const text = buf.toString("utf8")
                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode, statusText: res.statusMessage ?? "",
                        headers: { get: (k) => res.headers[k.toLowerCase()] ?? null },
                        text: () => Promise.resolve(text),
                        json: () => Promise.resolve(JSON.parse(text)),
                        arrayBuffer: () => Promise.resolve(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)),
                    })
                })
            }
        )
        req.on("error", reject)
        if (body) req.write(body)
        req.end()
    })
}

const { PrismaClient } = require("@prisma/client")
const { PrismaNeonHttp } = require("@prisma/adapter-neon")
const { neonConfig } = require("@neondatabase/serverless")
neonConfig.fetchFunction = ipv4Fetch

function getDbUrl() {
    let url = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "")
    url = url.replace(/([?&])channel_binding=[^&]*(&|$)/g, (_, pre, post) => post === "&" ? pre : "")
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
        id: "anbessa-footwear",
        title: "ANBESSA — Premium Footwear Shop",
        description: "A modern, full-featured sneaker storefront built with React 19, TanStack Start, and Tailwind CSS v4. Cinematic brand loader, depth-push hero carousel, bidirectional scroll-reveal animations, PWA-ready.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1790514736/portfolio/i5vtnbhksh447bxpofdb.png",
        tags: ["React 19", "TanStack Start", "Tailwind CSS v4", "TypeScript", "E-Commerce", "PWA"],
        stack: ["React 19", "TanStack Start", "Tailwind CSS 4", "TypeScript", "GSAP", "Radix UI", "PWA"],
        category: ["Frontend", "E-Commerce", "Full-Stack"],
        liveUrl: "https://anbessa-et.vercel.app",
        githubUrl: "https://github.com/ezedinmoh/anbessa",
        previewMode: "iframe", featured: true, year: "2026",
        caseStudyProblem: "Modern sneaker enthusiasts needed an immersive digital storefront with fluid animations, tactile shoe physics, and instant page transitions.",
        caseStudySolution: "Engineered a high-performance storefront with React 19, TanStack Start SSR, and Tailwind CSS v4 featuring depth-push physics, bidirectional scroll reveals, and a cinematic brand intro.",
        caseStudyOutcome: "Sub-second transitions, fluid 60fps animations across all viewports, and seamless PWA installation.",
    },
    {
        id: "amore-cafe",
        title: "Amore Cafe & Restaurant — Modern PWA & Digital Dining",
        description: "A modern, high-performance Progressive Web App (PWA) & table QR dining experience crafted for Kombolcha's premier cafe. Features bilingual English/Amharic menus, fasting specials, and online ordering.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1788777091/portfolio/jf7glekgmu87dgnpgvqz.png",
        tags: ["React", "TanStack Start", "Tailwind CSS", "TypeScript", "PWA", "Bilingual"],
        stack: ["React 19", "TanStack Start", "Tailwind CSS", "TypeScript", "PWA", "Cloudinary"],
        category: ["Full-Stack", "Web Development", "UI/UX Design"],
        liveUrl: "https://amore-cafe-restaurant.vercel.app",
        githubUrl: "https://github.com/ezedinmoh/amore-cafe",
        previewMode: "iframe", featured: true, year: "2026",
        caseStudyProblem: "Traditional dining required paper menus with outdated pricing and lacked support for table QR ordering, bilingual Amharic/English navigation, and seasonal fasting menus.",
        caseStudySolution: "Crafted a production-grade Progressive Web App with 131 interactive catalog items, intelligent Amore AI assistant, table QR integration, and dual-language switching.",
        caseStudyOutcome: "Instant table-side QR menu access, zero load latency on mobile devices, and automated offline caching.",
    },
    {
        id: "byd-ethiopia",
        title: "BYD Ethiopia — Electric Mobility & Digital Showroom",
        description: "A premium, high-performance digital showroom showcasing the next generation of Pure Electric (BEV) and Super DM-i Plug-in Hybrid vehicles in Ethiopia.",
        image: "https://res.cloudinary.com/dzni6h38z/image/upload/v1787499097/portfolio/a4jgczoiv9hbzbuogfjo.png",
        tags: ["React 19", "TanStack Start", "Tailwind CSS v4", "TypeScript", "Showroom"],
        stack: ["React 19", "TanStack Start", "Tailwind CSS 4", "TypeScript", "Vite"],
        category: ["Web Development", "Frontend", "UI/UX Design"],
        liveUrl: "https://byd-ethiopia.vercel.app",
        githubUrl: "https://github.com/ezedinmoh/byd-ethiopia",
        previewMode: "iframe", featured: true, year: "2026",
        caseStudyProblem: "Prospective EV buyers in Ethiopia lacked an interactive, specs-rich digital showroom to compare electric and hybrid models, ranges, and battery technologies.",
        caseStudySolution: "Developed a luxury digital showroom with interactive model visualizers, full technical specification comparisons (CLTC range, Blade Battery, acceleration), and test-drive booking.",
        caseStudyOutcome: "A high-conversion automotive digital hub providing rapid vehicle exploration and mobile-first responsiveness.",
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

    // Upsert all projects safely — preserving admin-edited fields and custom sort orders
    for (let i = 0; i < projects.length; i++) {
        const p = projects[i]
        const existing = await prisma.project.findUnique({ where: { slug: p.id } })

        // Prefer whatever the admin saved over the static fallback
        const image = existing?.image || p.image
        const liveUrl = existing?.liveUrl || p.liveUrl || null
        const githubUrl = existing?.githubUrl || p.githubUrl || null

        // Preserve existing sortOrder and featuredSortOrder if already customized in DB
        const sortOrder = (existing?.sortOrder !== undefined && existing?.sortOrder !== null) ? existing.sortOrder : i
        const featuredSortOrder = (existing?.featuredSortOrder !== undefined && existing?.featuredSortOrder !== null) ? existing.featuredSortOrder : i
        const featured = existing ? existing.featured : (p.featured ?? false)

        const data = {
            title: p.title,
            description: p.description,
            image,
            tags: p.tags,
            stack: p.stack,
            category: p.category,
            liveUrl,
            githubUrl,
            featured,
            year: p.year,
            previewMode: p.previewMode ?? "iframe",
            sortOrder,
            featuredSortOrder,
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

    // ── 5. Seed initial Reels ─────────────────────────────────────────────────
    const reels = [
        {
            tiktokId: "7690214314351037717",
            tiktokUrl: "https://www.tiktok.com/@ezedinmoh/video/7690214314351037717",
            title: "From concept to interactive ecommerce experience. 🦁💻 Built with React, TanStack Start & GSAP.",
            caption: "From concept to interactive ecommerce experience. 🦁💻 Built with React, TanStack Start & GSAP. 🔗Like . Share . Repost #UIUX #Ecommerce #WebDesign",
            thumbnail: "https://p16-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/ooT5I1ZwXSLiCIMyAAImK26fWIbwTiIBBOqALI~tplv-tiktokx-cropcenter-q:300:400:q70.jpeg?dr=8596&refresh_token=c1d00fc8&x-expires=1792054800&x-signature=WYZGTH1R0%2FJPYvOklMc954MHG6E%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&biz_tag=tt_video&s=AWEME_DETAIL&sc=cover",
            category: "Ecommerce",
            views: 349,
            tiktokLikes: 39,
            tiktokComments: 8,
            tiktokShares: 2,
            duration: 20,
            authorName: "Ezedin Moh",
            authorAvatar: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-avt-0068/26e572e342b6f05e711781c157a51849~tplv-tiktokx-cropcenter-q:300:300:q70.jpeg?dr=8834&refresh_token=aff22ae6&x-expires=1792054800&x-signature=KwwjE7biRQJ3vnI1gG%2BE3vH9D8M%3D&t=223449c4&ps=87d6e48a&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&s=AWEME_DETAIL&sc=avatar",
            musicTitle: "original sound - tenlyedits",
            order: 0,
        },
        {
            tiktokId: "7682790473752186133",
            tiktokUrl: "https://www.tiktok.com/@ezedinmoh/video/7682790473752186133",
            title: "Did I cook? 👨‍💻🔥 📱 Modern • Responsive • Performance-focused @Amore Cafe",
            caption: "Did I cook? 👨‍💻🔥 📱 Modern • Responsive • Performance-focused @Amore Cafe Share & repost ❤️🚀 #AmoreCafe #WebDevelopment #WebsiteDesign",
            thumbnail: "https://p16-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/o8BwIAAyqEBwIC5eCjFEgCDEEnARxQAQICf8Us~tplv-tiktokx-cropcenter-q:300:400:q70.jpeg?dr=8596&refresh_token=2b286684&x-expires=1792054800&x-signature=TLvsM2RvYk70S%2BGT0vevuSfkD6k%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&biz_tag=tt_video&s=AWEME_DETAIL&sc=cover",
            category: "Web Design",
            views: 404,
            tiktokLikes: 51,
            tiktokComments: 10,
            tiktokShares: 6,
            duration: 84,
            authorName: "Ezedin Moh",
            authorAvatar: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-avt-0068/26e572e342b6f05e711781c157a51849~tplv-tiktokx-cropcenter-q:300:300:q70.jpeg?dr=8834&refresh_token=aff22ae6&x-expires=1792054800&x-signature=KwwjE7biRQJ3vnI1gG%2BE3vH9D8M%3D&t=223449c4&ps=87d6e48a&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&s=AWEME_DETAIL&sc=avatar",
            order: 1,
        },
        {
            tiktokId: "7670064348332576021",
            tiktokUrl: "https://www.tiktok.com/@ezedinmoh/video/7670064348332576021",
            title: "What if Holland Dairy had a modern premium website? So I built one from scratch!",
            caption: "What if Holland Dairy had a modern premium website? So I built one from scratch! @Holland Dairy Website Link 🖇️ https://holland-dairy.vercel.app #HollandDairy #WebDevelopment",
            thumbnail: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/osdAbIn3v114AAiiilGEBxvGYEBaBVINu3Xu3~tplv-tiktokx-cropcenter-q:300:400:q70.jpeg?dr=8596&refresh_token=6b8ac214&x-expires=1792054800&x-signature=wOWoBtLsSmSv1iT958LzkG5nt80%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&biz_tag=tt_video&s=AWEME_DETAIL&sc=cover",
            category: "Case Studies",
            views: 487,
            tiktokLikes: 41,
            tiktokComments: 4,
            tiktokShares: 60,
            duration: 153,
            authorName: "Ezedin Moh",
            authorAvatar: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-avt-0068/26e572e342b6f05e711781c157a51849~tplv-tiktokx-cropcenter-q:300:300:q70.jpeg?dr=8834&refresh_token=aff22ae6&x-expires=1792054800&x-signature=KwwjE7biRQJ3vnI1gG%2BE3vH9D8M%3D&t=223449c4&ps=87d6e48a&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&s=AWEME_DETAIL&sc=avatar",
            order: 2,
        },
        {
            tiktokId: "7690919403667377460",
            tiktokUrl: "https://www.tiktok.com/@ezedinmoh/video/7690919403667377460",
            title: "🦁 You’ll come for the shoes. You’ll stay for the experience. A modern, premium footwear experience.",
            caption: "🦁 You’ll come for the shoes. You’ll stay for the experience. A modern, premium footwear experience. ✨ #Ecommerce #WebDesign #creatorsearchinsights",
            thumbnail: "https://p16-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/oQEi7qJEyB68ygR23TIAOFEBHoDCMuAsSfeWnU~tplv-tiktokx-cropcenter-q:300:400:q70.jpeg?dr=8596&refresh_token=fe055e87&x-expires=1792054800&x-signature=s5LLZFmlri5VUJAIHzcGXcHcJew%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&s=AWEME_DETAIL&sc=cover&biz_tag=tt_video",
            category: "Ecommerce",
            views: 442,
            tiktokLikes: 27,
            tiktokComments: 8,
            tiktokShares: 1,
            duration: 53,
            authorName: "Ezedin Moh",
            authorAvatar: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-avt-0068/26e572e342b6f05e711781c157a51849~tplv-tiktokx-cropcenter-q:300:300:q70.jpeg?dr=8834&refresh_token=aff22ae6&x-expires=1792054800&x-signature=KwwjE7biRQJ3vnI1gG%2BE3vH9D8M%3D&t=223449c4&ps=87d6e48a&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&s=AWEME_DETAIL&sc=avatar",
            order: 3,
        },
        {
            tiktokId: "7683112730294865173",
            tiktokUrl: "https://www.tiktok.com/@ezedinmoh/video/7683112730294865173",
            title: "🔥 One of my top works! 💻 Need a modern website for your business? Contact Me 💬 @Amore Cafe",
            caption: "🔥 One of my top works! 💻 Need a modern website for your business? Contact Me 💬 @Amore Cafe #WebDeveloper #WebDevelopment #FullStackDeveloper",
            thumbnail: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/oEADAcYfTYVQeE4AWEG8RIJVoP5jIuLAA92Icf~tplv-tiktokx-cropcenter-q:300:400:q70.jpeg?dr=8596&refresh_token=e92408c1&x-expires=1792054800&x-signature=BsCG1Jx2tAhCbp5VRfDWDCvsAdc%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&biz_tag=tt_video&s=AWEME_DETAIL&sc=cover",
            category: "Showcase",
            views: 254,
            tiktokLikes: 21,
            tiktokComments: 5,
            tiktokShares: 2,
            duration: 70,
            authorName: "Ezedin Moh",
            authorAvatar: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-avt-0068/26e572e342b6f05e711781c157a51849~tplv-tiktokx-cropcenter-q:300:300:q70.jpeg?dr=8834&refresh_token=aff22ae6&x-expires=1792054800&x-signature=KwwjE7biRQJ3vnI1gG%2BE3vH9D8M%3D&t=223449c4&ps=87d6e48a&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&s=AWEME_DETAIL&sc=avatar",
            order: 4,
        },
        {
            tiktokId: "7677198929301196052",
            tiktokUrl: "https://www.tiktok.com/@ezedinmoh/video/7677198929301196052",
            title: "Looking for a website for your business? DM me 📩 @BYD @byd ethiopia",
            caption: "Looking for a website for your business? DM me 📩 🖇️ Website Link In Bio @BYD @byd ethiopia #WebDevelopment #Ethiopia #BYD #WebDesign",
            thumbnail: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/oAif85X1RAQ4A8XAi5nWCI4AqZKvIzZlCCCwEB~tplv-tiktokx-cropcenter-q:300:400:q70.jpeg?dr=8596&refresh_token=ad35a890&x-expires=1792054800&x-signature=sPaqFar%2BtRcxcYmn4CPYahvN3Aw%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&biz_tag=tt_video&s=AWEME_DETAIL&sc=cover",
            category: "Showcase",
            views: 622,
            tiktokLikes: 38,
            tiktokComments: 12,
            tiktokShares: 1,
            duration: 37,
            authorName: "Ezedin Moh",
            authorAvatar: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-avt-0068/26e572e342b6f05e711781c157a51849~tplv-tiktokx-cropcenter-q:300:300:q70.jpeg?dr=8834&refresh_token=aff22ae6&x-expires=1792054800&x-signature=KwwjE7biRQJ3vnI1gG%2BE3vH9D8M%3D&t=223449c4&ps=87d6e48a&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&s=AWEME_DETAIL&sc=avatar",
            order: 5,
        },
        {
            tiktokId: "7671611191864675605",
            tiktokUrl: "https://www.tiktok.com/@ezedinmoh/video/7671611191864675605",
            title: "Smooth animations Clean UI Premium feel. ✨ Built with modern web technologies. 🚀",
            caption: "Smooth animations Clean UI Premium feel. ✨ Built with modern web technologies. 🚀 #iPhone15 #Apple #WebDevelopment #NextJS #React",
            thumbnail: "https://p16-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/oIEA3qEEpCwAqgRae6IABFEBmCDVFdArOfL6bc~tplv-tiktokx-cropcenter-q:300:400:q70.jpeg?dr=8596&refresh_token=c66363b9&x-expires=1792054800&x-signature=URfRimvk%2F%2B0LzsdE0fAjAW2wSJA%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&biz_tag=tt_video&s=AWEME_DETAIL&sc=cover",
            category: "UI/UX",
            views: 568,
            tiktokLikes: 49,
            tiktokComments: 9,
            tiktokShares: 0,
            duration: 30,
            authorName: "Ezedin Moh",
            authorAvatar: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-avt-0068/26e572e342b6f05e711781c157a51849~tplv-tiktokx-cropcenter-q:300:300:q70.jpeg?dr=8834&refresh_token=aff22ae6&x-expires=1792054800&x-signature=KwwjE7biRQJ3vnI1gG%2BE3vH9D8M%3D&t=223449c4&ps=87d6e48a&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&s=AWEME_DETAIL&sc=avatar",
            order: 6,
        },
        {
            tiktokId: "7668291336642645269",
            tiktokUrl: "https://www.tiktok.com/@ezedinmoh/video/7668291336642645269",
            title: "📩 DM me for work. 🔗 Website Link in bio 🎨 Inspired by @Haliyung",
            caption: "📩 DM me for work. 🔗 Website Link in bio 🎨 Inspired by @Haliyung #WebDesign #UIUX #NextJS #TailwindCSS",
            thumbnail: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/oI77gkG5QLAmgvC1wDI4CfItDcnfejZsUaLGAg~tplv-tiktokx-cropcenter-q:300:400:q70.jpeg?dr=8596&refresh_token=5d90b6bb&x-expires=1792054800&x-signature=wDwcAHAYVRaEWXo5%2B2zxByST%2BtY%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&biz_tag=tt_video&s=AWEME_DETAIL&sc=cover",
            category: "Web Design",
            views: 565,
            tiktokLikes: 48,
            tiktokComments: 6,
            tiktokShares: 61,
            duration: 113,
            authorName: "Ezedin Moh",
            authorAvatar: "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-avt-0068/26e572e342b6f05e711781c157a51849~tplv-tiktokx-cropcenter-q:300:300:q70.jpeg?dr=8834&refresh_token=aff22ae6&x-expires=1792054800&x-signature=KwwjE7biRQJ3vnI1gG%2BE3vH9D8M%3D&t=223449c4&ps=87d6e48a&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&s=AWEME_DETAIL&sc=avatar",
            order: 7,
        },
    ]

    console.log(`\n🎬  Seeding ${reels.length} reels with real TikTok metrics...\n`)
    for (const r of reels) {
        await prisma.reel.upsert({
            where: { tiktokId: r.tiktokId },
            update: {
                tiktokUrl: r.tiktokUrl,
                title: r.title,
                caption: r.caption,
                thumbnail: r.thumbnail,
                category: r.category,
                views: r.views,
                tiktokLikes: r.tiktokLikes,
                tiktokComments: r.tiktokComments,
                tiktokShares: r.tiktokShares,
                duration: r.duration,
                authorName: r.authorName,
                authorAvatar: r.authorAvatar,
                musicTitle: r.musicTitle || null,
                order: r.order,
            },
            create: {
                tiktokId: r.tiktokId,
                tiktokUrl: r.tiktokUrl,
                title: r.title,
                caption: r.caption,
                thumbnail: r.thumbnail,
                category: r.category,
                views: r.views,
                tiktokLikes: r.tiktokLikes,
                tiktokComments: r.tiktokComments,
                tiktokShares: r.tiktokShares,
                duration: r.duration,
                authorName: r.authorName,
                authorAvatar: r.authorAvatar,
                musicTitle: r.musicTitle || null,
                order: r.order,
                published: true,
            },
        })
        console.log(`  ✓  Reel ${r.order + 1}/8: ${r.tiktokId} (${r.views} views, ${r.tiktokLikes} likes)`)
    }

    console.log("\n✅  Seed complete!\n")
    await prisma.$disconnect()
}

main().catch(async err => {
    console.error("\n❌  Seed failed:", err.message)
    await prisma.$disconnect()
    process.exit(1)
})
