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
  title: 'Ezedin Mohammed | Software Engineer',
  description: 'Software Engineer from Ethiopia crafting immersive digital experiences with modern web technologies',
  keywords: ['developer', 'portfolio', 'react', 'nextjs', 'typescript', 'web development', 'software engineer', 'ethiopia', 'pwa'],
  authors: [{ name: 'Ezedin Mohammed' }],
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
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ezedin Mohammed",
              url: "https://ezedin.dev",
              jobTitle: "Software Engineer",
              worksFor: { "@type": "Organization", name: "Freelance" },
              address: { "@type": "PostalAddress", addressLocality: "Kombolcha", addressCountry: "ET" },
              sameAs: [
                "https://github.com/ezedinmoh",
                "https://www.linkedin.com/in/ezedinmoh",
                "https://x.com/ezedinmoh",
              ],
            }),
          }}
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
