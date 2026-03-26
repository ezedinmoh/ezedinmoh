"use client"

import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react"

const footerLinks = {
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  social: [
    { label: "GitHub", href: "https://github.com/ezedinmoh", icon: Github },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ezedinmoh", icon: Linkedin },
    { label: "Twitter", href: "https://x.com/ezedinmoh", icon: Twitter },
    { label: "Email", href: "mailto:ezedinmoh1@gmail.com", icon: Mail },
  ],
}

export function Footer() {
  return (
    <footer className="py-16 bg-card border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold mb-4 inline-block">
              <span className="text-gradient">E</span>
              <span className="text-foreground">zedin</span>
              <span className="text-muted-foreground opacity-50">.</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Software Engineer from Ethiopia, passionate about crafting beautiful, performant web experiences.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex gap-4">
              {footerLinks.social.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    aria-label={link.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ezedin Mohammed. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Crafted with <Heart className="w-4 h-4 text-primary fill-primary" /> using Next.js & TailwindCSS
          </p>
        </div>
      </div>
    </footer>
  )
}
