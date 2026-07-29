export interface CaseStudy {
  problem: string
  solution: string
  outcome: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  screenshots?: string[]
  tags: string[]
  stack: string[]
  category: string[]
  link?: string
  github?: string
  featured?: boolean
  liveUrl?: string
  previewMode?: "slideshow" | "iframe"
  caseStudy?: CaseStudy
  year: string
}

export const allProjects: Project[] = [
  {
    id: "wearify-next",
    title: "WEARIFY — Premium Oversized Streetwear (Next.js)",
    description: "A Next.js 16 App Router oversized streetwear e-commerce brand suite with Neon Cloud PostgreSQL, independent live 50/50 split-screen admin section managers, dual Stripe & Chapa payments, and Google/GitHub OAuth.",
    image: "",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Neon Cloud", "Prisma", "Stripe", "Chapa"],
    stack: ["Next.js 16", "TypeScript", "Prisma", "Neon Cloud PostgreSQL", "NextAuth.js", "Framer Motion", "Tailwind CSS", "Stripe API", "Chapa API"],
    category: ["Full-Stack", "E-Commerce"],
    link: "https://wearify-et.vercel.app",
    github: "https://github.com/ezedinmoh/wearify-next",
    liveUrl: "https://wearify-et.vercel.app",
    previewMode: "iframe",
    featured: true,
    year: "2026",
    caseStudy: {
      problem: "Big & tall fashion buyers lacked an immersive streetwear store with real live-editing capabilities and dual international/local payment gateways.",
      solution: "Engineered a Next.js 16 platform backed by Neon Cloud PostgreSQL. Designed 8 independent split-screen live section managers for administrators and integrated both Stripe and Ethiopian Chapa checkout options.",
      outcome: "Deployed on Vercel with zero build errors across 50 routes, full guest checkout, and dual OAuth login.",
    },
  },
  {
    id: "smart-nextjs",
    title: "Smart Library Management System (Next.js)",
    description: "A Next.js 16 full-stack library platform featuring role-based dashboards (Admin, Librarian, Student), Supabase PostgreSQL, Stripe & Chapa payment gateways, book reservations, QR code verification, and automated email notifications.",
    image: "",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "Chapa"],
    stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma", "Supabase", "NextAuth.js", "Tailwind CSS", "Stripe API", "Chapa API"],
    category: ["Full-Stack"],
    link: "https://smart-library-et.vercel.app",
    github: "https://github.com/ezedinmoh/smart-nextjs",
    liveUrl: "https://smart-library-et.vercel.app",
    previewMode: "iframe",
    featured: true,
    year: "2026",
    caseStudy: {
      problem: "Educational institutions needed a modern digital library system to replace legacy desktop tools with automated borrowing, fine payments, and role-based access.",
      solution: "Built a Next.js 16 App Router application with Supabase PostgreSQL and Prisma ORM. Implemented role dashboards for Admin, Librarian, and Student, automated fine calculation with Stripe & Chapa payment integration, and QR code verification.",
      outcome: "Compiled 90 dynamic and static routes seamlessly, supporting multi-currency fine settlement and real-time email reminders.",
    },
  },
  {
    id: "smart-django",
    title: "Smart Library System (Django)",
    description: "A full-stack enterprise digital library platform built with Next.js 15 App Router frontend and Django REST Framework backend with PostgreSQL, JWT Auth, Swagger API docs, Celery async background tasks, and Docker containerization.",
    image: "",
    tags: ["Next.js", "Django", "Python", "PostgreSQL", "REST API", "Docker"],
    stack: ["Next.js 15", "Django 5", "Django REST Framework", "Python 3.12", "PostgreSQL", "Celery", "Redis", "Docker", "Tailwind CSS"],
    category: ["Full-Stack"],
    link: "https://smart-library-django.vercel.app",
    github: "https://github.com/ezedinmoh/smart-library-django",
    liveUrl: "https://smart-library-django.vercel.app",
    previewMode: "iframe",
    featured: true,
    year: "2026",
    caseStudy: {
      problem: "Universities required a scalable backend with robust Python data processing, automated PDF indexing, async Celery background jobs, and JWT token authentication paired with a sleek Next.js UI.",
      solution: "Built Django REST Framework APIs connected to PostgreSQL with Redis-backed Celery worker tasks for email dispatch and PDF thumbnail generation. Designed a responsive Next.js frontend with SWR data fetching and Swagger UI interactive docs.",
      outcome: "Production-ready decoupled web architecture supporting high concurrency, automated schema documentation, and containerized deployment.",
    },
  },
  {
    id: "apple-website",
    title: "Apple iPhone 15 Pro Showcase",
    description: "An immersive 3D Apple web experience featuring 3D iPhone models, interactive color switches, GSAP scroll animations, dynamic video carousel, and responsive layout.",
    image: "",
    tags: ["React", "Three.js", "GSAP", "Tailwind CSS"],
    stack: ["React", "Three.js", "React Three Fiber", "GSAP", "Tailwind CSS", "Vite"],
    category: ["Frontend", "3D / Animation"],
    link: "https://apple-website-ezedin.vercel.app",
    github: "https://github.com/ezedinmoh/apple-website",
    liveUrl: "https://apple-website-ezedin.vercel.app",
    previewMode: "iframe",
    featured: true,
    year: "2026",
    caseStudy: {
      problem: "Showcasing high-tech hardware interactive 3D models online often suffers from poor frame rates and sluggish scroll performance.",
      solution: "Utilized Three.js and React Three Fiber with GSAP Timeline animations to render lighting, reflections, and 3D camera transitions smoothly on scroll.",
      outcome: "Achieved 60fps 3D canvas rendering with zero lag across desktop and mobile devices.",
    },
  },
  {
    id: "netflix-clone",
    title: "Netflix Streaming Interface Clone",
    description: "A high-performance Netflix web application clone featuring live TMDB API movie browsing, video trailers, category filtering, custom watchlist, and smooth animations.",
    image: "",
    tags: ["React", "JavaScript", "TMDB API", "Tailwind CSS"],
    stack: ["React 19", "JavaScript", "TMDB API", "Tailwind CSS", "Framer Motion", "Vite"],
    category: ["Frontend"],
    link: "https://netflix-clone-ezedin.vercel.app",
    github: "https://github.com/ezedinmoh/Netflix-Clone",
    liveUrl: "https://netflix-clone-ezedin.vercel.app",
    previewMode: "iframe",
    featured: true,
    year: "2026",
    caseStudy: {
      problem: "Creating an authentic streaming media client requires handling dynamic API data, video preview modals, and fluid responsive carousels.",
      solution: "Integrated TMDB API with React custom hooks and Framer Motion layout transitions for live video trailers and category sliders.",
      outcome: "Delivered a pixel-perfect Netflix user interface with fast response times and offline local watchlist storage.",
    },
  },
  {
    id: "gym-house",
    title: "Gym House",
    description: "A fully responsive fitness website with interactive calculators (BMI, TDEE, body fat, water intake), workout planners, filterable class schedules, and a dark mode toggle.",
    image: "",
    tags: ["HTML5", "CSS3", "JavaScript"],
    stack: ["HTML5", "CSS3", "JavaScript", "Font Awesome", "LocalStorage"],
    category: ["Frontend"],
    link: "https://gym-house-website.netlify.app",
    github: "https://github.com/ezedinmoh/gym-house-website",
    liveUrl: "https://gym-house-website.netlify.app",
    previewMode: "iframe",
    featured: true,
    year: "2026",
    caseStudy: {
      problem: "Fitness enthusiasts needed a single platform that combined workout planning, fitness calculators, and class scheduling without requiring an account or app install.",
      solution: "Built a fully static multi-page website with 6 interactive fitness calculators, a workout planner with pre-made routines, a filterable class schedule, and a favorites system — all powered by vanilla JS and localStorage.",
      outcome: "Deployed on Netlify with zero build process. Fully responsive across all browsers with smooth animations and a dark mode toggle.",
    },
  },
  {
    id: "ar-soap",
    title: "AR Soap & Detergent",
    description: "A modern eco-friendly soap and detergent e-commerce site built with Next.js 16. Features full-screen video backgrounds, animated product cards, a shopping cart with promo codes, and 12 products across 4 categories.",
    image: "",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    stack: ["Next.js", "React 19", "Tailwind CSS 4", "Framer Motion", "shadcn/ui", "Embla Carousel"],
    category: ["Full-Stack", "Frontend"],
    link: "https://ar-soap-website.vercel.app",
    github: "https://github.com/ezedinmoh/ar-soap-website",
    liveUrl: "https://ar-soap-website.vercel.app",
    previewMode: "iframe",
    featured: true,
    year: "2025",
    caseStudy: {
      problem: "A local soap and detergent brand needed a modern e-commerce presence that showcased their eco-friendly products in a visually compelling way without a heavy backend.",
      solution: "Built with Next.js 16 App Router and Framer Motion. Each product has a dedicated video, category pages have dynamic video backgrounds, and the cart supports promo codes and a free shipping threshold — all managed via React Context.",
      outcome: "Video-first product presentation across 12 products and 4 categories. Fully responsive with dark/light mode, deployed on Vercel.",
    },
  },
  {
    id: "ramadanly",
    title: "Ramadanly",
    description: "A PWA Ramadan companion app built with React. Includes a full Quran viewer with audio recitations, daily habit tracking, streak system, 12 achievements, a 30-day calendar, and analytics — all offline, no account needed.",
    image: "",
    tags: ["React", "PWA", "Quran API", "LocalStorage"],
    stack: ["React 18", "CSS3", "Service Worker", "Quran.com API", "EveryAyah API", "LocalStorage"],
    category: ["Frontend"],
    link: "https://ramadanly.netlify.app",
    github: "https://github.com/ezedinmoh/ramadanly",
    liveUrl: "https://ramadanly.netlify.app",
    previewMode: "iframe",
    featured: true,
    year: "2025",
    caseStudy: {
      problem: "Muslims during Ramadan lacked a single focused tool to track Quran reading goals, maintain daily streaks, and monitor their progress across the full 30 days.",
      solution: "Built a PWA with React that integrates the Quran.com API for full Arabic text and EveryAyah for audio recitations. All data persists in localStorage — no backend, no account. Includes gamified streaks, 12 unlockable achievements, a 30-day calendar view, and smart browser notifications.",
      outcome: "Live at ramadanly.netlify.app. Installable as a native app on mobile. API responses cached for 7 days for offline use.",
    },
  },
  {
    id: "swiftbus-online-bus-booking-platform",
    title: "SwiftBus – Online Bus Booking Platform",
    description: "A comprehensive digital transportation platform for online bus ticket reservations, seat selection, and real-time route scheduling.",
    image: "",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
    category: ["Full-Stack", "Web Development"],
    link: "https://swiftbus-et.vercel.app",
    github: "https://github.com/ezedinmoh/swiftbus",
    liveUrl: "https://swiftbus-et.vercel.app",
    previewMode: "iframe",
    featured: true,
    year: "2026",
    caseStudy: {
      problem: "Bus passengers faced long queues at physical station counters without real-time seat availability visibility.",
      solution: "Engineered a web application with interactive seat maps, schedule filtering, and instant booking confirmation.",
      outcome: "Reduced ticketing processing time by 80% with real-time seat locks and automated PDF ticket generation.",
    },
  },
]

export const allTechStacks = Array.from(
  new Set(allProjects.flatMap((p) => p.stack))
).sort()
