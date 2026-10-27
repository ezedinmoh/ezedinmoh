import type { Metadata } from "next"
import Link from "next/link"
import { absoluteUrl } from "@/lib/site"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"
import {
  ShieldCheck,
  Lock,
  Database,
  Trash2,
  EyeOff,
  Server,
  FileCheck,
  Mail,
  ExternalLink,
  ArrowRight,
  UserCheck,
  Key,
  Globe,
  CheckCircle2
} from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for ezedinmoh.dev and authorized TikTok developer applications including TikTok Display API integrations for @ezedinmoh.",
  alternates: {
    canonical: absoluteUrl("/privacy"),
  },
  openGraph: {
    title: "Privacy Policy | Ezedin Mohammed",
    description: "Privacy Policy governing data collection, usage, and TikTok Display API integrations on ezedinmoh.dev.",
    url: absoluteUrl("/privacy"),
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ezedin Mohammed Privacy Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Ezedin Mohammed",
    description: "Privacy Policy governing data collection, usage, and TikTok Display API integrations on ezedinmoh.dev.",
    images: ["/opengraph-image"],
  },
}

export default function PrivacyPage() {
  const sections = [
    { id: "intro", title: "1. Overview & Data Controller" },
    { id: "data-collected", title: "2. Information We Collect via TikTok API" },
    { id: "how-used", title: "3. How We Use TikTok Data" },
    { id: "no-sale", title: "4. No Sale or Brokerage of Data" },
    { id: "sharing", title: "5. Third-Party Services & TikTok Policies" },
    { id: "security", title: "6. Data Storage, Retention & Security" },
    { id: "data-deletion", title: "7. User Rights & Data Deletion Instructions" },
    { id: "revocation", title: "8. How to Revoke TikTok App Permissions" },
    { id: "cookies", title: "9. Cookies & Web Analytics" },
    { id: "children", title: "10. Children's Privacy" },
    { id: "changes", title: "11. Changes to This Privacy Policy" },
    { id: "contact", title: "12. Contact & Inquiries" },
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
              <span>Privacy & Data Protection Compliance</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Privacy <span className="text-gradient">Policy</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mb-6">
              This Privacy Policy explains how <span className="text-foreground font-medium">ezedinmoh.dev</span> collects,
              handles, stores, and protects data when interacting with authorized developer tools, including the personal
              TikTok Display API application for <span className="text-foreground font-medium">@ezedinmoh</span>.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/40 pt-4">
              <span><strong>Effective Date:</strong> October 13, 2026</span>
              <span>•</span>
              <span><strong>Last Updated:</strong> October 13, 2026</span>
              <span>•</span>
              <span><strong>Domain:</strong> https://ezedinmoh.dev</span>
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
                    <FileCheck className="w-4 h-4 text-primary" /> Table of Contents
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

                {/* Key Commitments Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-secondary/30 border border-border/50 text-xs space-y-3">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Privacy Commitments
                  </span>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Zero data sale or commercial broker sharing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Used solely for authorized portfolio video display</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Instant self-service revocation via TikTok app</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Permanent data deletion upon request</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Document Body */}
            <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">

              {/* 1. Overview */}
              <div id="intro" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> 1. Overview & Data Controller
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This Privacy Policy applies to the personal developer portfolio website located at{" "}
                  <strong className="text-foreground">https://ezedinmoh.dev</strong> (the &quot;Website&quot;) and the personal developer
                  application registered with the <strong className="text-foreground">TikTok Developer Portal</strong> operated by{" "}
                  <strong className="text-foreground">Ezedin Mohammed</strong> (&quot;Developer&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We respect the privacy of our visitors and users. This document informs you of our policies regarding the collection,
                  use, storage, and disclosure of personal data when you use our website or interact with our authorized TikTok Display API
                  developer application.
                </p>
              </div>

              {/* 2. Data Collected via TikTok */}
              <div id="data-collected" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" /> 2. Information We Collect via TikTok Display API
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our developer application uses the official <strong className="text-foreground">TikTok Display API</strong> to connect
                  with the authorized personal TikTok account (<span className="text-primary font-medium">@ezedinmoh</span>). When granted
                  authorization via TikTok OAuth, the application only accesses the following permitted information:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-secondary/40 border border-border/40">
                    <span className="font-semibold text-xs text-foreground block mb-1">A. Profile Details (`user.info.basic`)</span>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>TikTok Open ID (unique application-specific identifier)</li>
                      <li>Display name and TikTok username</li>
                      <li>Profile avatar image URL</li>
                      <li>Public profile biography text</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/40 border border-border/40">
                    <span className="font-semibold text-xs text-foreground block mb-1">B. Video Content &amp; Metadata (`video.list`)</span>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Video unique identifier (ID)</li>
                      <li>Video title and caption description</li>
                      <li>Video cover thumbnail image URL</li>
                      <li>Public embed link or player URL</li>
                      <li>Upload creation timestamp and duration</li>
                      <li>Public interaction metrics (e.g., view count, like count)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/40 border border-border/40">
                    <span className="font-semibold text-xs text-foreground block mb-1">C. Technical &amp; Diagnostic Logs</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Standard web server logs collected automatically by our hosting platform (Vercel), such as client IP address,
                      browser type, device operating system, and request timestamps, used strictly for security monitoring and uptime diagnostics.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs mt-2">
                  <p className="text-muted-foreground">
                    <strong className="text-primary">What We DO NOT Collect:</strong> We never request, collect, or store private TikTok direct messages,
                    passwords, payment methods, contacts, location coordinates, or unauthorized private videos.
                  </p>
                </div>
              </div>

              {/* 3. How Used */}
              <div id="how-used" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" /> 3. How We Use TikTok Data
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use the authorized TikTok data strictly for the following legitimate purposes:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>
                    <strong className="text-foreground">Portfolio Showcase:</strong> To embed and display authorized developer videos, software
                    engineering tutorials, and tech demos created by <span className="text-primary font-medium">@ezedinmoh</span> on this portfolio.
                  </li>
                  <li>
                    <strong className="text-foreground">API Evaluation:</strong> To test, calibrate, and verify the performance of the TikTok
                    Display API within a modern Next.js React environment.
                  </li>
                  <li>
                    <strong className="text-foreground">Authentication:</strong> To authenticate account identity and securely verify API requests
                    using standard OAuth 2.0 protocols.
                  </li>
                </ul>
              </div>

              {/* 4. No Sale */}
              <div id="no-sale" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-primary" /> 4. No Sale or Brokerage of Data
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">We do not sell, rent, lease, or monetize your personal information or TikTok data.</strong>
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We do not share, disclose, or transfer any authorized profile details or video metadata to third-party data brokers,
                  marketing agencies, advertising exchanges, or analytics aggregators.
                </p>
              </div>

              {/* 5. Sharing */}
              <div id="sharing" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-primary" /> 5. Third-Party Services & TikTok Policies
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This website relies on trusted third-party service providers solely to maintain hosting and API communications:
                </p>
                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs space-y-1">
                    <strong className="text-foreground">TikTok (ByteDance Ltd.)</strong>
                    <p className="text-muted-foreground leading-relaxed">
                      Provider of the Display API and content hosting. All TikTok interactions are governed by the{" "}
                      <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        TikTok Privacy Policy
                      </a>.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs space-y-1">
                    <strong className="text-foreground">Vercel Inc.</strong>
                    <p className="text-muted-foreground leading-relaxed">
                      Provides global cloud hosting, edge CDN caching, and serverless execution for <strong className="text-foreground">ezedinmoh.dev</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* 6. Storage & Security */}
              <div id="security" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" /> 6. Data Storage, Retention & Security
                </h2>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Token Security:</strong> Any OAuth credentials, user access tokens, and refresh tokens
                    are encrypted at rest and in transit using modern cryptographic standards (AES-256 and TLS 1.3). Tokens are never exposed to
                    the public client-side bundle.
                  </p>
                  <p>
                    <strong className="text-foreground">Data Retention:</strong> Cached video lists and profile metadata are retained only for the
                    duration necessary to maintain fast page load times and will be refreshed or purged periodically.
                  </p>
                  <p>
                    <strong className="text-foreground">Security Safeguards:</strong> We implement administrative, physical, and technical safeguards
                    to protect against unauthorized access, loss, alteration, or disclosure of data.
                  </p>
                </div>
              </div>

              {/* 7. Data Deletion Instructions */}
              <div id="data-deletion" className="p-6 rounded-2xl bg-card border border-border/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-500" /> 7. User Rights & Data Deletion Instructions
                  </h2>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                    Compliance Requirement
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  In compliance with TikTok Developer policies, GDPR, and global data privacy standards, you have the right to request
                  the permanent deletion of any data associated with your TikTok account.
                </p>

                <div className="p-4 sm:p-5 rounded-xl bg-secondary/50 border border-border/60 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">How to Request Immediate Data Deletion:</p>
                  <ol className="text-xs sm:text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>
                      Send an email to <a href="mailto:ezedinmoh1@gmail.com?subject=TikTok%20Data%20Deletion%20Request" className="text-primary font-medium hover:underline">ezedinmoh1@gmail.com</a> with
                      the subject line: <code className="px-1.5 py-0.5 rounded bg-background border text-foreground">TikTok Data Deletion Request</code>.
                    </li>
                    <li>
                      Include your TikTok username (e.g., <code className="px-1.5 py-0.5 rounded bg-background border text-foreground">@yourhandle</code>) and open ID (if known).
                    </li>
                    <li>
                      Alternatively, submit your request through our online <Link href="/contact" className="text-primary hover:underline">Contact Form</Link>.
                    </li>
                  </ol>
                  <div className="pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <strong className="text-foreground">Processing Timeline:</strong> Upon receiving your request, all cached user tokens,
                    profile identifiers, and video metadata associated with your account will be permanently deleted from our servers within
                    30 days (or immediately upon verification). We will send an email confirmation once deletion is complete.
                  </div>
                </div>
              </div>

              {/* 8. Revocation */}
              <div id="revocation" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" /> 8. How to Revoke TikTok App Permissions
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You can revoke this application&apos;s access to your TikTok account at any time without contacting us. Follow these simple steps:
                </p>

                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 text-xs">
                    <strong className="text-foreground block">Via Mobile TikTok App</strong>
                    <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                      <li>Open the TikTok app and tap <strong className="text-foreground">Profile</strong>.</li>
                      <li>Tap the 3-line menu in the top right &gt; <strong className="text-foreground">Settings and Privacy</strong>.</li>
                      <li>Select <strong className="text-foreground">Security &amp; Permissions</strong> (or <strong className="text-foreground">Security</strong>).</li>
                      <li>Tap <strong className="text-foreground">Manage app permissions</strong>.</li>
                      <li>Select this application and tap <strong className="text-foreground">Remove Access</strong>.</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-1.5 text-xs">
                    <strong className="text-foreground block">Via Web Browser (tiktok.com)</strong>
                    <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                      <li>Log in to <strong className="text-foreground">tiktok.com</strong>.</li>
                      <li>Click your profile picture in the top-right corner.</li>
                      <li>Go to <strong className="text-foreground">Settings &gt; Security &gt; Manage Apps</strong>.</li>
                      <li>Locate this application and click <strong className="text-foreground">Revoke access</strong>.</li>
                    </ol>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Once revoked, our application can no longer access your TikTok profile or video content.
                </p>
              </div>

              {/* 9. Cookies */}
              <div id="cookies" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" /> 9. Cookies & Web Analytics
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our website uses standard browser storage (such as localStorage and session cookies) solely for essential website functionality:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Remembering your preferred visual theme (dark mode or light mode).</li>
                  <li>Privacy-respecting Vercel Web Analytics to track page visit counts without collecting personal identifiers or cross-site tracking cookies.</li>
                </ul>
              </div>

              {/* 10. Children */}
              <div id="children" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> 10. Children&apos;s Privacy
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our website and TikTok developer application are not directed to children under 13 years of age (or under 16 in the European Economic Area).
                  We do not knowingly solicit or collect personal information from children. If we discover that a child has provided us with
                  personal data, we will immediately delete such information from our records.
                </p>
              </div>

              {/* 11. Changes */}
              <div id="changes" className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" /> 11. Changes to This Privacy Policy
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We may periodically revise this Privacy Policy to reflect updates in our developer tools, TikTok API requirements,
                  or legal standards. Any revisions will be published on this page with an updated &quot;Last Updated&quot; date at the top.
                  We encourage you to review this page periodically.
                </p>
              </div>

              {/* 12. Contact */}
              <div id="contact" className="p-6 rounded-2xl bg-card border border-border/60 space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" /> 12. Contact & Inquiries
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For any privacy questions, data deletion requests, or developer compliance inquiries, please contact:
                </p>
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 text-xs space-y-2">
                  <p><strong className="text-foreground">Developer:</strong> Ezedin Mohammed</p>
                  <p><strong className="text-foreground">Email:</strong> <a href="mailto:ezedinmoh1@gmail.com" className="text-primary hover:underline">ezedinmoh1@gmail.com</a></p>
                  <p><strong className="text-foreground">Website:</strong> <a href="https://ezedinmoh.dev" className="text-primary hover:underline">https://ezedinmoh.dev</a></p>
                  <p><strong className="text-foreground">TikTok Handle:</strong> @ezedinmoh</p>
                  <p><strong className="text-foreground">Location:</strong> Ethiopia</p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:opacity-90 transition-all"
                  >
                    Contact Form <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/terms"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-foreground text-xs font-medium rounded-xl hover:bg-secondary/80 transition-all border border-border/50"
                  >
                    View Terms of Service <ExternalLink className="w-3.5 h-3.5" />
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
