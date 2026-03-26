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
  tags: string[]
  stack: string[]
  category: string[]
  link?: string
  github?: string
  featured?: boolean
  liveUrl?: string
  caseStudy?: CaseStudy
  year: string
}

export const allProjects: Project[] = [
  {
    id: "gym-house",
    title: "Gym House",
    description: "A fully responsive fitness website with interactive calculators (BMI, TDEE, body fat, water intake), workout planners, filterable class schedules, and a dark mode toggle.",
    image: "/placeholder.jpg",
    tags: ["HTML5", "CSS3", "JavaScript"],
    stack: ["HTML5", "CSS3", "JavaScript", "Font Awesome", "LocalStorage"],
    category: ["Frontend"],
    link: "https://gym-house-website.netlify.app",
    github: "https://github.com/ezedinmoh/gym-house-website",
    liveUrl: "https://gym-house-website.netlify.app",
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
    image: "/placeholder.jpg",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    stack: ["Next.js", "React 19", "Tailwind CSS 4", "Framer Motion", "shadcn/ui", "Embla Carousel"],
    category: ["Full-Stack", "Frontend"],
    link: "https://ar-soap-website.vercel.app",
    github: "https://github.com/ezedinmoh/ar-soap-website",
    liveUrl: "https://ar-soap-website.vercel.app",
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
    image: "/placeholder.jpg",
    tags: ["React", "PWA", "Quran API", "LocalStorage"],
    stack: ["React 18", "CSS3", "Service Worker", "Quran.com API", "EveryAyah API", "LocalStorage"],
    category: ["Frontend"],
    link: "https://ramadanly.netlify.app",
    github: "https://github.com/ezedinmoh/ramadanly",
    liveUrl: "https://ramadanly.netlify.app",
    featured: true,
    year: "2025",
    caseStudy: {
      problem: "Muslims during Ramadan lacked a single focused tool to track Quran reading goals, maintain daily streaks, and monitor their progress across the full 30 days.",
      solution: "Built a PWA with React that integrates the Quran.com API for full Arabic text and EveryAyah for audio recitations. All data persists in localStorage — no backend, no account. Includes gamified streaks, 12 unlockable achievements, a 30-day calendar view, and smart browser notifications.",
      outcome: "Live at ramadanly.netlify.app. Installable as a native app on mobile. API responses cached for 7 days for offline use.",
    },
  },
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory, Stripe payments, and AI-powered recommendations.",
    image: "/placeholder.jpg",
    tags: ["Next.js", "TypeScript", "Stripe", "AI", "PostgreSQL"],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Prisma"],
    category: ["Full-Stack", "AI"],
    link: "https://example.com",
    github: "https://github.com",
    liveUrl: "https://example.com",
    featured: true,
    year: "2024",
    caseStudy: {
      problem: "A retail client needed a modern e-commerce platform to replace their legacy system that couldn't handle traffic spikes and had no AI personalization.",
      solution: "Built a Next.js App Router platform with Stripe for payments, Prisma + PostgreSQL for data, and an OpenAI-powered recommendation engine that analyzes purchase history.",
      outcome: "40% increase in average order value, 99.9% uptime during peak sales, and 3x faster page loads compared to the old system.",
    },
  },
  {
    id: "2",
    title: "Task Management App",
    description: "Beautiful kanban board with drag-and-drop, real-time collaboration, and smart scheduling powered by machine learning.",
    image: "/placeholder.jpg",
    tags: ["React", "Node.js", "WebSocket", "MongoDB"],
    stack: ["React", "Node.js", "MongoDB", "Socket.io"],
    category: ["Full-Stack"],
    link: "https://example.com",
    github: "https://github.com",
    liveUrl: "https://example.com",
    year: "2024",
    caseStudy: {
      problem: "Remote teams struggled with task visibility and real-time updates across time zones, leading to duplicated work and missed deadlines.",
      solution: "Developed a WebSocket-powered kanban board with optimistic UI updates, conflict resolution, and an ML model that predicts task completion times.",
      outcome: "Teams reported 35% fewer missed deadlines and reduced standup meeting time by half.",
    },
  },
  {
    id: "3",
    title: "AI Writing Assistant",
    description: "GPT-powered writing tool with grammar checking, tone adjustment, and multi-language support.",
    image: "/placeholder.jpg",
    tags: ["OpenAI", "Next.js", "TailwindCSS", "AI"],
    stack: ["Next.js", "OpenAI API", "TypeScript", "TailwindCSS"],
    category: ["AI", "Frontend"],
    link: "https://example.com",
    liveUrl: "https://example.com",
    year: "2023",
    caseStudy: {
      problem: "Content creators spent hours editing drafts and struggled with writer's block, especially when writing in a second language.",
      solution: "Integrated GPT-4 with a custom prompt system for tone detection, grammar correction, and multilingual rewriting with a clean streaming UI.",
      outcome: "Beta users reduced editing time by 60% and the tool reached 500 active users within the first month.",
    },
  },
  {
    id: "4",
    title: "Real-time Chat Application",
    description: "End-to-end encrypted messaging platform with file sharing, video calls, and group chat functionality.",
    image: "/placeholder.jpg",
    tags: ["React", "WebRTC", "Socket.io", "Node.js"],
    stack: ["React", "WebRTC", "Socket.io", "Node.js", "Redis"],
    category: ["Full-Stack"],
    link: "https://example.com",
    github: "https://github.com",
    liveUrl: "https://example.com",
    year: "2023",
    caseStudy: {
      problem: "A startup needed a secure internal communication tool that worked offline-first and supported video calls without third-party dependencies.",
      solution: "Built a WebRTC peer-to-peer video system with Socket.io for signaling, end-to-end encryption using the Web Crypto API, and IndexedDB for offline message storage.",
      outcome: "Successfully deployed for a 200-person team with sub-100ms message latency and zero third-party data sharing.",
    },
  },
  {
    id: "5",
    title: "Portfolio Analytics Dashboard",
    description: "Investment tracking platform with real-time market data, portfolio visualization, and performance analytics.",
    image: "/placeholder.jpg",
    tags: ["Next.js", "D3.js", "Finance API", "TypeScript"],
    stack: ["Next.js", "D3.js", "TypeScript", "PostgreSQL"],
    category: ["Frontend", "Full-Stack"],
    link: "https://example.com",
    year: "2023",
    caseStudy: {
      problem: "Individual investors had no unified view of their portfolio across multiple brokers and struggled to visualize performance over time.",
      solution: "Created a dashboard that aggregates data from multiple broker APIs, renders interactive D3.js charts, and sends daily performance digest emails.",
      outcome: "Used by 150+ investors with an average session time of 12 minutes, indicating high engagement.",
    },
  },
  {
    id: "6",
    title: "Social Media Scheduler",
    description: "Multi-platform social media management tool with AI-powered content suggestions and analytics.",
    image: "/placeholder.jpg",
    tags: ["React", "Python", "AWS", "AI"],
    stack: ["React", "Python", "FastAPI", "AWS Lambda", "OpenAI"],
    category: ["Full-Stack", "AI"],
    link: "https://example.com",
    github: "https://github.com",
    year: "2022",
    caseStudy: {
      problem: "Small businesses were spending 10+ hours per week manually posting to social media with inconsistent branding and no performance tracking.",
      solution: "Built a scheduler with a Python/FastAPI backend on AWS Lambda, OpenAI for caption generation, and a React dashboard with engagement analytics.",
      outcome: "Clients saved an average of 8 hours per week and saw a 25% increase in engagement from AI-optimized posting times.",
    },
  },
  {
    id: "7",
    title: "Learning Management System",
    description: "Interactive online learning platform with video courses, quizzes, and progress tracking.",
    image: "/placeholder.jpg",
    tags: ["Next.js", "PostgreSQL", "Stripe", "Video"],
    stack: ["Next.js", "PostgreSQL", "Stripe", "Cloudflare Stream"],
    category: ["Full-Stack"],
    link: "https://example.com",
    year: "2022",
    caseStudy: {
      problem: "An education startup needed a scalable LMS that could handle video streaming, payments, and progress tracking without expensive off-the-shelf solutions.",
      solution: "Developed a custom LMS with Cloudflare Stream for video delivery, Stripe for subscriptions, and a gamified progress system with certificates.",
      outcome: "Launched with 300 students in the first cohort, achieving a 78% course completion rate — well above the industry average of 15%.",
    },
  },
  {
    id: "8",
    title: "Weather Visualization App",
    description: "Beautiful weather application with 3D visualizations, forecasts, and severe weather alerts.",
    image: "/placeholder.jpg",
    tags: ["React", "Three.js", "Weather API", "WebGL"],
    stack: ["React", "Three.js", "WebGL", "OpenWeather API"],
    category: ["Frontend"],
    link: "https://example.com",
    github: "https://github.com",
    year: "2022",
    caseStudy: {
      problem: "Existing weather apps were either too data-dense for casual users or too simplified for enthusiasts who wanted immersive visualizations.",
      solution: "Created a Three.js-powered 3D globe with real-time weather overlays, particle systems for precipitation, and WebGL shaders for atmospheric effects.",
      outcome: "Featured on Product Hunt with 800+ upvotes and 2,000 users in the first week.",
    },
  },
]

export const allTechStacks = Array.from(
  new Set(allProjects.flatMap((p) => p.stack))
).sort()
