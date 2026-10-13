import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"
import {
  FileText,
  ShieldCheck,
  Video,
  ExternalLink,
  AlertCircle,
  Code2,
  Lock,
  RefreshCw,
  Mail,
  ArrowRight,
  Globe,
  UserCheck
} from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for ezedinmoh.pro.et and authorized developer integrations including the TikTok Display API application for @ezedinmoh.",
  alternates: {
    canonical: "https://ezedinmoh.pro.et/terms",
  },
  openGraph: {
    title: "Terms of Service | Ezedin Mohammed",
    description: "Terms of Service governing the use of ezedinmoh.pro.et and authorized TikTok developer integrations.",
    url: "https://ezedinmoh.pro.et/terms",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ezedin Mohammed Terms of Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Ezedin Mohammed",
    description: "Terms of Service governing the use of ezedinmoh.pro.et and authorized TikTok developer integrations.",
    images: ["/opengraph-image"],
  },
}

export default function TermsPage() {
  const sections = [
    { id: "intro", title: "1. Introduction & Purpose" },
    { id: "eligibility", title: "2. Eligibility & Acceptable Use" },
    { id: "tiktok", title: "3. TikTok Display API Integration" },
    { id: "third-party", title: "4. Third-Party Services & TikTok Terms" },
    { id: "ip", title: "5. Content & Intellectual Property" },
    { id: "availability", title: "6. Availability, Changes & API Deprecation" },
    { id: "disclaimer", title: "7. Disclaimer of Warranties" },
    { id: "liability", title: "8. Limitation of Liability" },
    { id: "termination", title: "9. Termination & Access Revocation" },
    { id: "contact", title: "10. Contact Information" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <AnimatedCursor />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-8 sm:pb-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-morph" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "3s" }} />
        </div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(100,200,180,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,180,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Legal & Developer Compliance</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Terms of <span className="text-gradient">Service</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mb-6">
              These Terms of Service govern your access to <span className="text-foreground font-medium">ezedinmoh.pro.et</span> and
              our authorized developer applications, including the personal TikTok Display API integration created for{" "}
              <span className="text-foreground font-medium">@ezedinmoh</span>.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/40 pt-4">
              <span><strong>Effective Date:</strong> October 13, 2026</span>
              <span>•</span>
              <span><strong>Last Updated:</strong> October 13, 2026</span>
              <span>•</span>
              <span><strong>Domain:</strong> https://ezedinmoh.pro.et</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Quick Navigation / Table of Contents */}
            <aside className="lg:col-span-4 order-2 lg:order-1">
              <div className="sticky top-24 space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Table of Contents
                  </h2>
                  <nav className="space-y-1.5 text-xs">
                    {sections.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className="block py-1 px-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/60 transition-colors"
                      >
                        {s.title}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Application Profile Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-secondary/30 border border-border/50 text-xs space-y-2.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-primary" /> Application Info
                  </span>
                  <div className="space-y-1 text-muted-foreground">
                    <p><strong className="text-foreground">App Purpose:</strong> TikTok Display API Testing</p>
                    <p><strong className="text-foreground">Developer:</strong> Ezedin Mohammed</p>
                    <p><strong className="text-foreground">Authorized Account:</strong> @ezedinmoh</p>
                    <p><strong className="text-foreground">Privacy Policy:</strong> <Link href="/privacy" className="text-primary hover:underline">/privacy</Link></p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Document Body */}
            <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">

              {/* 1. Introduction */}
              <div id="intro" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> 1. Introduction & Purpose
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Welcome to <strong className="text-foreground">ezedinmoh.pro.et</strong> (the &quot;Website&quot;), operated by{" "}
                  <strong className="text-foreground">Ezedin Mohammed</strong> (&quot;Developer&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                  By accessing, browsing, or using this Website and our associated software applications, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service (&quot;Terms&quot;).
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The primary purpose of this website is to serve as a personal software engineering portfolio, showcasing technical
                  projects, software demonstrations, and developer integrations. This includes a dedicated developer application built to
                  test and evaluate the <strong className="text-foreground">TikTok Display API</strong> with the developer&apos;s personal authorized
                  TikTok account, <span className="text-primary font-medium">@ezedinmoh</span>, allowing public display of verified profile
                  details and video showcases on this portfolio.
                </p>
              </div>

              {/* 2. Eligibility & Acceptable Use */}
              <div id="eligibility" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" /> 2. Eligibility & Acceptable Use
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You must be at least 13 years of age (or the minimum legal age required in your jurisdiction) to access this Website.
                  By using this Website, you represent and warrant that you meet these eligibility criteria.
                </p>
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Prohibited Activities</p>
                  <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                    <li>Engaging in unauthorized scraping, automated data extraction, or bulk downloading of content.</li>
                    <li>Attempting to probe, scan, or compromise website security or circumvent API rate limits.</li>
                    <li>Interfering with, disrupting, or imposing an unreasonable burden on our servers and networks.</li>
                    <li>Reverse engineering, decompiling, or attempting to extract proprietary source code or access tokens.</li>
                    <li>Using the Website or any displayed media for any illegal, infringing, or defamatory purpose.</li>
                  </ul>
                </div>
              </div>

              {/* 3. TikTok Display API Integration */}
              <div id="tiktok" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" /> 3. TikTok Display API Integration
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our developer application utilizes the official <strong className="text-foreground">TikTok Display API</strong> provided by
                  TikTok Pte. Ltd. / ByteDance Ltd. to interact with authorized TikTok accounts. Specifically:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/40">
                    <span className="font-semibold text-xs text-foreground block mb-1">Authorized Profile Retrieval</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      With explicit account authorization, the app retrieves basic profile attributes (display name, username, avatar image, and bio)
                      for presentation on this portfolio.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/40">
                    <span className="font-semibold text-xs text-foreground block mb-1">Video Showcases</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The application accesses authorized public video metadata and embed URLs to render interactive video previews for developer
                      demonstrations.
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary-foreground mt-2">
                  <span className="font-semibold text-primary block mb-0.5">Strict API Scope Adherence</span>
                  <p className="text-muted-foreground">
                    This integration operates solely within the approved permissions granted by the account owner and does not request
                    or access private direct messages, payment data, or unauthorized account settings.
                  </p>
                </div>
              </div>

              {/* 4. Third-Party Services */}
              <div id="third-party" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-primary" /> 4. Third-Party Services & TikTok Terms
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  TikTok is an independent third-party platform. Your interactions with TikTok, including account login, content creation,
                  and permissions, are governed by TikTok&apos;s own legal agreements, including:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>
                    <a href="https://www.tiktok.com/legal/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      TikTok Terms of Service <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      TikTok Privacy Policy <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a href="https://developer.tiktok.com/doc/developer-terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      TikTok Developer Terms of Service <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground pt-1">
                  We are not responsible or liable for TikTok&apos;s policies, service uptime, account suspensions, or any changes TikTok makes to
                  its platforms, services, or APIs.
                </p>
              </div>

              {/* 5. Intellectual Property */}
              <div id="ip" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" /> 5. Content & Intellectual Property
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Creator Content Rights:</strong> Content creators retain all pre-existing ownership,
                  copyrights, and intellectual property rights in their respective videos, audio tracks, and profile media. Displaying video
                  embeds or profile details through TikTok&apos;s authorized API does not transfer, assign, or license ownership to this website
                  or its visitors.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Website Rights:</strong> All website design, branding, code, logos, styling, and original
                  articles on <strong className="text-foreground">ezedinmoh.pro.et</strong> are the exclusive property of Ezedin Mohammed and
                  are protected by applicable copyright, trademark, and intellectual property laws.
                </p>
              </div>

              {/* 6. Availability & Changes */}
              <div id="availability" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary" /> 6. Availability, Changes & API Deprecation
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This Website and the TikTok developer integration are maintained for personal developer testing and professional demonstration.
                  We reserve the right to modify, suspend, update, or discontinue any feature, endpoint, or page at any time without prior notice.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Functionality that relies on TikTok APIs may become temporarily or permanently unavailable if TikTok modifies its API protocols,
                  alters rate limits, deprecates endpoints, or changes developer access requirements. We assume no obligation to maintain
                  uninterrupted integration functionality.
                </p>
              </div>

              {/* 7. Disclaimer */}
              <div id="disclaimer" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" /> 7. Disclaimer of Warranties
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  THE WEBSITE, ITS CONTENT, AND ALL DEVELOPER INTEGRATIONS ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT
                  WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE EXPRESSLY DISCLAIM ALL WARRANTIES,
                  INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                </p>
                <p className="text-xs text-muted-foreground">
                  WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, ACCURATE, OR ERROR-FREE, OR THAT ANY DEFECTS WILL BE CORRECTED.
                </p>
              </div>

              {/* 8. Limitation of Liability */}
              <div id="liability" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> 8. Limitation of Liability
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL EZEDIN MOHAMMED BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                  CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, REVENUE, PROFITS, OR GOODWILL,
                  ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF (OR INABILITY TO USE) THIS WEBSITE OR ITS TIKTOK INTEGRATION.
                </p>
              </div>

              {/* 9. Termination & Access Revocation */}
              <div id="termination" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" /> 9. Termination & Access Revocation
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We reserve the right to restrict or terminate access to this Website for any user violating these Terms.
                </p>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 space-y-1.5 text-xs">
                  <span className="font-semibold text-foreground block">How to Revoke TikTok App Authorization:</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Account owners may revoke this application&apos;s permissions at any time directly through TikTok:
                    Navigate to your <strong className="text-foreground">TikTok App &gt; Profile &gt; Settings &amp; Privacy &gt; Security &amp; Permissions &gt; Manage App Permissions</strong>,
                    select this application, and tap <strong className="text-foreground">Remove Access</strong>.
                  </p>
                  <p className="text-muted-foreground">
                    For details on requesting data removal, see our{" "}
                    <Link href="/privacy#data-deletion" className="text-primary hover:underline">
                      Privacy Policy Data Deletion Instructions
                    </Link>.
                  </p>
                </div>
              </div>

              {/* 10. Contact */}
              <div id="contact" className="p-6 rounded-2xl bg-card border border-border/60 space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" /> 10. Contact Information
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you have any questions, inquiries, or feedback regarding these Terms of Service or our TikTok developer integration,
                  please reach out through the following channels:
                </p>
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 text-xs space-y-2">
                  <p><strong className="text-foreground">Developer:</strong> Ezedin Mohammed</p>
                  <p><strong className="text-foreground">Email:</strong> <a href="mailto:ezedinmoh1@gmail.com" className="text-primary hover:underline">ezedinmoh1@gmail.com</a></p>
                  <p><strong className="text-foreground">Website:</strong> <a href="https://ezedinmoh.pro.et" className="text-primary hover:underline">https://ezedinmoh.pro.et</a></p>
                  <p><strong className="text-foreground">TikTok Handle:</strong> @ezedinmoh</p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:opacity-90 transition-all"
                  >
                    Contact Form <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-foreground text-xs font-medium rounded-xl hover:bg-secondary/80 transition-all border border-border/50"
                  >
                    View Privacy Policy <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
