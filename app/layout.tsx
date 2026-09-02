import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { BackToTop } from '@/components/back-to-top'
import { AnalyticsTracker } from '@/components/analytics-tracker'
import { PageLoader } from '@/components/page-loader'
import { PwaRegister } from '@/components/pwa/pwa-register'
import { NetworkStatus } from '@/components/pwa/network-status'
import { PwaInstallPrompt } from '@/components/pwa/pwa-install-prompt'
import { PwaUpdatePrompt } from '@/components/pwa/pwa-update-prompt'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ezedinmoh.vercel.app'),
  title: {
    default: 'Ezedin Mohammed | Software Engineer & Full-Stack Developer',
    template: '%s | Ezedin Mohammed',
  },
  description: 'Portfolio of Ezedin Mohammed — Software Engineer & Full-Stack Developer specializing in React, Next.js, TypeScript, Node.js, and AI web applications.',
  keywords: [
    'Ezedin Mohammed',
    'Software Engineer',
    'Full-Stack Developer',
    'Frontend Engineer',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Portfolio',
    'Web Developer Ethiopia',
    'Kombolcha',
    'Addis Ababa',
  ],
  authors: [{ name: 'Ezedin Mohammed', url: 'https://ezedinmoh.vercel.app' }],
  creator: 'Ezedin Mohammed',
  publisher: 'Ezedin Mohammed',
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'Ezedin Mohammed | Software Engineer & Full-Stack Developer',
    description: 'Explore selected full-stack projects, interactive web applications, career journey, and technical insights by Ezedin Mohammed.',
    url: 'https://ezedinmoh.vercel.app',
    siteName: 'Ezedin Mohammed Portfolio',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Ezedin Mohammed Portfolio Cover',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ezedin Mohammed | Software Engineer & Full-Stack Developer',
    description: 'Explore selected full-stack projects, interactive web applications, career journey, and technical insights by Ezedin Mohammed.',
    images: ['/opengraph-image'],
    creator: '@ezedinmoh',
  },
  verification: {
    google: 'UlRnEDKTyZXpHnPuIQTJn64LKDr4sZ8Tp3zPAZKJR-A',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ezedin Moh',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f4f8' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ezedin Mohammed",
    url: "https://ezedinmoh.vercel.app",
    jobTitle: "Software Engineer",
    description: "Software Engineer & Full-Stack Developer specializing in React, Next.js, TypeScript, and AI applications.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kombolcha",
      addressCountry: "ET",
    },
    sameAs: [
      "https://github.com/ezedinmoh",
      "https://www.linkedin.com/in/ezedinmoh",
      "https://x.com/ezedinmoh",
    ],
  }

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ezedin Mohammed Portfolio",
    url: "https://ezedinmoh.vercel.app",
    author: {
      "@type": "Person",
      name: "Ezedin Mohammed",
    },
  }

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          {children}
          <PageLoader />
          <BackToTop />
          <AnalyticsTracker />
          <PwaRegister />
          <NetworkStatus />
          <PwaInstallPrompt />
          <PwaUpdatePrompt />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
