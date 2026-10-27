import type { Metadata } from "next"
import { blogPosts } from "@/lib/blog"
import { SITE_URL, absoluteUrl } from "@/lib/site"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = blogPosts.find((p) => p.id === id)

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found on Ezedin Mohammed's portfolio.",
      robots: { index: false, follow: true },
    }
  }

  const title = post.title
  const description = post.excerpt
  const url = absoluteUrl(`/blog/${post.id}`)

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Ezedin Mohammed`,
      description,
      url,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [SITE_URL],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Ezedin Mohammed`,
      description,
      images: ["/opengraph-image"],
    },
  }
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children
}
