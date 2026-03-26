"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedCursor } from "@/components/animated-cursor"
import { MdxContent } from "@/components/mdx-content"
import { TableOfContents } from "@/components/table-of-contents"
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Twitter, Linkedin, Tag, ArrowRight, Eye, ThumbsUp, ThumbsDown } from "lucide-react"
import { blogPosts, readingTime, extractToc } from "@/lib/blog"
import { cn } from "@/lib/utils"

function useViewCount(postId: string) {
  const [views, setViews] = useState<number | null>(null)
  useEffect(() => {
    const key = `blog_views_${postId}`
    const current = parseInt(localStorage.getItem(key) || "0") + 1
    localStorage.setItem(key, String(current))
    setViews(current)
  }, [postId])
  return views
}

function HelpfulVote({ postId }: { postId: string }) {
  const key = `blog_helpful_${postId}`
  const [vote, setVote] = useState<"up" | "down" | null>(null)
  const [counts, setCounts] = useState({ up: 24, down: 2 })

  useEffect(() => {
    const saved = localStorage.getItem(key) as "up" | "down" | null
    setVote(saved)
  }, [key])

  const handleVote = (v: "up" | "down") => {
    if (vote === v) return
    setCounts(prev => ({
      up: prev.up + (v === "up" ? 1 : vote === "up" ? -1 : 0),
      down: prev.down + (v === "down" ? 1 : vote === "down" ? -1 : 0),
    }))
    setVote(v)
    localStorage.setItem(key, v)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Was this helpful?</span>
      <button onClick={() => handleVote("up")}
        className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all",
          vote === "up" ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-500" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
        <ThumbsUp className="w-3.5 h-3.5" /> {counts.up}
      </button>
      <button onClick={() => handleVote("down")}
        className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all",
          vote === "down" ? "bg-red-500/15 border-red-500/40 text-red-400" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
        <ThumbsDown className="w-3.5 h-3.5" /> {counts.down}
      </button>
    </div>
  )
}

function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // Replace with Resend/EmailJS integration
    setDone(true)
  }

  return (
    <div className="mt-12 p-6 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl">
      <h3 className="font-semibold text-foreground mb-1">Enjoyed this article?</h3>
      <p className="text-sm text-muted-foreground mb-4">Get new posts delivered to your inbox. No spam, unsubscribe anytime.</p>
      {done ? (
        <p className="text-sm text-primary font-medium">🎉 You're subscribed!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" required
            className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
          <button type="submit"
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all">
            Subscribe
          </button>
        </form>
      )}
    </div>
  )
}

export default function BlogPostPage() {
  const params = useParams()
  const postId = params?.id as string
  const post = blogPosts.find((p) => p.id === postId) ?? blogPosts[0]
  const toc = extractToc(post.content)
  const time = readingTime(post.content)
  const views = useViewCount(postId)

  // Related: same category, excluding current
  const related = blogPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3)

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <AnimatedCursor />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        {/* Mesh blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-morph" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: "3s" }} />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(100,200,180,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,180,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 animate-fade-in opacity-0 stagger-1" style={{ animationFillMode: "forwards" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <div className="flex flex-wrap gap-2 mb-4 animate-slide-up opacity-0 stagger-2" style={{ animationFillMode: "forwards" }}>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{post.category}</span>
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-secondary text-muted-foreground rounded-full text-xs">{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight animate-slide-up opacity-0 stagger-3" style={{ animationFillMode: "forwards" }}>{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm animate-slide-up opacity-0 stagger-4" style={{ animationFillMode: "forwards" }}>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{post.date}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{time}</span>
              {views !== null && (
                <span className="flex items-center gap-2"><Eye className="w-4 h-4" />{views} view{views !== 1 ? "s" : ""}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content + TOC */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="flex gap-12 max-w-5xl mx-auto">
            {/* Article */}
            <div className="flex-1 min-w-0">
              {/* Author */}
              <div className="flex items-center gap-4 pb-8 mb-8 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-gradient">E</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Ezedin Mohammed</p>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                </div>
              </div>

              {/* MDX Content */}
              <article>
                <MdxContent content={post.content} />
              </article>

              {/* Share */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <HelpfulVote postId={postId} />
                  <div className="flex items-center gap-3">
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all" aria-label="Share on Twitter">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all" aria-label="Share on LinkedIn">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <button onClick={handleShare}
                      className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all" aria-label="Copy link">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all" aria-label="Bookmark">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <NewsletterSignup />

              {/* Related Posts */}
              {related.length > 0 && (
                <div className="mt-16">
                  <div className="flex items-center gap-3 mb-6">
                    <Tag className="w-4 h-4 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Related Articles</h2>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {related.map((rel) => (
                      <Link key={rel.id} href={`/blog/${rel.id}`}
                        className="group block p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md">
                        <span className="text-xs text-primary font-medium mb-2 block">{rel.category}</span>
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">{rel.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />{readingTime(rel.content)}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs text-primary mt-3">
                          Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* TOC sidebar */}
            <TableOfContents items={toc} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
