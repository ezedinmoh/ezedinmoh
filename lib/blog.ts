export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  featured?: boolean
  content: string // MDX string
}

// Reading time estimator (avg 200 wpm)
export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

// Extract headings from MDX content for TOC
export interface TocItem {
  id: string
  text: string
  level: number
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const items: TocItem[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].replace(/[*_`]/g, "")
    const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
    items.push({ id, text, level })
  }
  return items
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable React Applications with Modern Architecture",
    excerpt: "Explore the best practices for structuring large-scale React applications, from state management to component composition patterns.",
    date: "March 15, 2026",
    category: "React",
    tags: ["React", "Architecture", "TypeScript"],
    featured: true,
    content: `
## Introduction

Building scalable React applications requires careful consideration of architecture, state management, and component design. In this article, we'll explore the best practices that have emerged from building large-scale applications.

## Folder Structure

The foundation of any scalable React application starts with a well-organized folder structure. I recommend organizing by **feature** rather than by type, which makes it easier to understand the codebase as it grows.

\`\`\`
src/
  features/
    auth/
      components/
      hooks/
      store.ts
    dashboard/
  shared/
    components/
    hooks/
    utils/
\`\`\`

## State Management

State management is another crucial aspect. While Redux has been the go-to solution for years, modern alternatives like **Zustand**, **Jotai**, and **React Query** have emerged as lighter-weight options that can handle most use cases effectively.

\`\`\`ts
// Simple Zustand store
import { create } from 'zustand'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
\`\`\`

## Component Composition

Component composition is where React truly shines. By building small, focused components that do one thing well, you create a library of reusable pieces that can be combined in countless ways.

## Performance Optimization

Performance optimization should be considered from the start. Code splitting, lazy loading, and proper memoization can make the difference between a snappy application and one that feels sluggish.

\`\`\`tsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyComponent />
    </Suspense>
  )
}
\`\`\`

## Testing Strategy

Testing is non-negotiable for scalable applications. A combination of unit tests, integration tests, and end-to-end tests provides confidence when making changes or adding new features.

## Conclusion

Scalability is not a feature you add later — it's a mindset you adopt from day one. Start with clean architecture, embrace composition, and let your tooling do the heavy lifting.
    `.trim(),
  },
  {
    id: "2",
    title: "The Art of CSS Animations: Creating Smooth Micro-interactions",
    excerpt: "Learn how to craft delightful user experiences with performant CSS animations and transitions.",
    date: "March 8, 2026",
    category: "CSS",
    tags: ["CSS", "Animation", "UX"],
    featured: true,
    content: `
## What Are Micro-interactions?

Micro-interactions are the small, subtle animations that bring interfaces to life. They provide feedback, guide users, and create a sense of polish that separates great products from good ones.

## Cheap vs Expensive Properties

The key to smooth animations lies in understanding what properties are cheap to animate. **Transform** and **opacity** are hardware-accelerated and can run at 60fps, while properties like \`width\` and \`height\` trigger layout recalculations.

\`\`\`css
/* ✅ Cheap — GPU accelerated */
.card { transition: transform 0.3s ease, opacity 0.3s ease; }
.card:hover { transform: translateY(-4px); }

/* ❌ Expensive — triggers layout */
.card:hover { height: 200px; margin-top: -4px; }
\`\`\`

## Timing Functions

Timing functions play a crucial role in how animations feel. Linear animations often feel mechanical, while easing functions like \`ease-out\` or custom cubic-beziers create more natural movement.

\`\`\`css
/* Natural spring-like feel */
.button { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
\`\`\`

## CSS Custom Properties for Animation Systems

CSS custom properties have revolutionized how we build animation systems. They allow us to create consistent, maintainable animation tokens.

\`\`\`css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
\`\`\`

## Accessibility

The \`prefers-reduced-motion\` media query is essential for accessibility. Some users experience motion sickness from animations.

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

## Conclusion

Animation is a powerful tool, but it should enhance the user experience, not distract from it. The best animations are ones users don't consciously notice but would miss if they were gone.
    `.trim(),
  },
  {
    id: "3",
    title: "TypeScript Tips That Will Make You a Better Developer",
    excerpt: "Advanced TypeScript patterns and tricks that I use daily to write safer, more maintainable code.",
    date: "February 28, 2026",
    category: "TypeScript",
    tags: ["TypeScript", "JavaScript", "Best Practices"],
    content: `
## Why TypeScript?

TypeScript has become the de-facto standard for large JavaScript projects. Beyond catching bugs at compile time, it serves as living documentation for your codebase.

## Discriminated Unions

One of the most powerful TypeScript patterns is discriminated unions — perfect for modeling state machines.

\`\`\`ts
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function render(state: RequestState<User>) {
  switch (state.status) {
    case 'success': return state.data.name // fully typed!
    case 'error': return state.error
  }
}
\`\`\`

## Template Literal Types

Template literal types let you create precise string types.

\`\`\`ts
type EventName = \`on\${Capitalize<string>}\`
type CSSUnit = \`\${number}px\` | \`\${number}rem\` | \`\${number}%\`
\`\`\`

## Satisfies Operator

The \`satisfies\` operator (TS 4.9+) validates a value against a type without widening it.

\`\`\`ts
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
} satisfies Record<string, string | number[]>

// palette.red is number[], not string | number[]
\`\`\`

## Conclusion

TypeScript's type system is incredibly expressive. The more you lean into it, the more it rewards you with safer, self-documenting code.
    `.trim(),
  },
  {
    id: "4",
    title: "Next.js 16: What's New and How to Upgrade",
    excerpt: "A comprehensive guide to the latest Next.js features and a step-by-step migration guide.",
    date: "February 20, 2026",
    category: "Next.js",
    tags: ["Next.js", "React", "Web Dev"],
    content: `
## What's New in Next.js 16

Next.js 16 brings significant improvements to performance, developer experience, and the App Router.

## Turbopack Stable

Turbopack is now stable and enabled by default for development. Expect dramatically faster HMR and cold start times.

\`\`\`bash
# Turbopack is now the default
next dev
\`\`\`

## Improved Caching

The caching model has been simplified. Fetch requests are no longer cached by default — you opt in explicitly.

\`\`\`ts
// Opt into caching
fetch('/api/data', { next: { revalidate: 3600 } })

// Always fresh
fetch('/api/data', { cache: 'no-store' })
\`\`\`

## React 19 Integration

Next.js 16 ships with React 19, bringing Server Actions improvements, the \`use\` hook, and better Suspense support.

## Migration Guide

1. Update your dependencies: \`npm install next@latest react@latest react-dom@latest\`
2. Review your fetch calls and add explicit cache options
3. Test your Server Components for any breaking changes
4. Update your \`next.config\` if using experimental flags that are now stable

## Conclusion

Next.js 16 is a solid release focused on stability and performance. The migration is straightforward for most projects.
    `.trim(),
  },
  {
    id: "5",
    title: "Designing APIs That Developers Love",
    excerpt: "Principles and best practices for creating intuitive, well-documented, and developer-friendly APIs.",
    date: "February 15, 2026",
    category: "Backend",
    tags: ["API", "Backend", "Design"],
    content: `
## What Makes an API Great?

A great API is one that developers can use without reading the docs. It's intuitive, consistent, and forgiving.

## Consistency is King

Use consistent naming conventions, response shapes, and error formats throughout your API.

\`\`\`json
// ✅ Consistent error shape
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "field": "email"
  }
}
\`\`\`

## Versioning Strategy

Always version your API from day one. URL versioning (\`/v1/users\`) is the most explicit and widely understood approach.

## Documentation

Auto-generate docs from your code using tools like OpenAPI/Swagger. Keep examples up to date — stale examples are worse than no examples.

## Conclusion

The best API is one that gets out of the developer's way. Invest in consistency, documentation, and clear error messages.
    `.trim(),
  },
  {
    id: "6",
    title: "Performance Optimization Techniques for Modern Web Apps",
    excerpt: "From code splitting to lazy loading — practical techniques to make your web applications lightning fast.",
    date: "February 10, 2026",
    category: "Performance",
    tags: ["Performance", "Web Dev", "Optimization"],
    content: `
## Why Performance Matters

A 1-second delay in page load time can reduce conversions by 7%. Performance is a feature.

## Core Web Vitals

Focus on the three Core Web Vitals: **LCP** (Largest Contentful Paint), **FID/INP** (Interaction to Next Paint), and **CLS** (Cumulative Layout Shift).

## Code Splitting

Split your bundle by route and by component. Next.js does this automatically, but you can go further with dynamic imports.

\`\`\`tsx
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})
\`\`\`

## Image Optimization

Images are often the biggest performance bottleneck. Use \`next/image\` for automatic WebP conversion, lazy loading, and proper sizing.

## Font Optimization

Use \`next/font\` to eliminate layout shift from web fonts and reduce network requests.

## Conclusion

Performance optimization is an ongoing process. Measure first with Lighthouse and Web Vitals, then optimize the biggest bottlenecks.
    `.trim(),
  },
]
