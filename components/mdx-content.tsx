"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple token-based syntax highlighting
  const highlighted = highlight(code, lang)

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang">{lang || "code"}</span>
        <button onClick={handleCopy} className="copy-btn" aria-label="Copy code">
          {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </button>
      </div>
      <pre className="code-block">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  )
}

// Minimal syntax highlighter — covers JS/TS/CSS/bash patterns
function highlight(code: string, lang: string): string {
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  if (["js", "jsx", "ts", "tsx", "javascript", "typescript"].includes(lang)) {
    escaped = escaped
      // Strings
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="sh-string">$1$2$1</span>')
      // Comments
      .replace(/(\/\/[^\n]*)/g, '<span class="sh-comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="sh-comment">$1</span>')
      // Keywords
      .replace(/\b(const|let|var|function|return|import|export|from|default|async|await|if|else|for|while|class|extends|new|typeof|interface|type|enum|implements|readonly|public|private|protected|static|void|null|undefined|true|false)\b/g,
        '<span class="sh-keyword">$1</span>')
      // Functions
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="sh-fn">$1</span>')
      // Numbers
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="sh-number">$1</span>')
  } else if (["css", "scss"].includes(lang)) {
    escaped = escaped
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="sh-comment">$1</span>')
      .replace(/([.#]?[a-zA-Z-]+)\s*\{/g, '<span class="sh-fn">$1</span>{')
      .replace(/([a-zA-Z-]+)\s*:/g, '<span class="sh-keyword">$1</span>:')
  } else if (["bash", "sh", "shell"].includes(lang)) {
    escaped = escaped
      .replace(/^(#[^\n]*)/gm, '<span class="sh-comment">$1</span>')
      .replace(/\b(npm|npx|yarn|pnpm|git|cd|ls|mkdir|rm|cp|mv|echo|export|source)\b/g,
        '<span class="sh-keyword">$1</span>')
  } else if (["json"].includes(lang)) {
    escaped = escaped
      .replace(/"([^"]+)":/g, '<span class="sh-string">"$1"</span>:')
      .replace(/:\s*("([^"]*)")/g, ': <span class="sh-string">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="sh-keyword">$1</span>')
      .replace(/:\s*(\d+)/g, ': <span class="sh-number">$1</span>')
  }

  return escaped
}

export function MdxContent({ content }: { content: string }) {
  const blocks = parseToBlocks(content)

  return (
    <div className="prose-content">
      {blocks.map((block, i) => {
        if (block.type === "code") return <CodeBlock key={i} code={block.content} lang={block.lang || ""} />
        return <div key={i} dangerouslySetInnerHTML={{ __html: block.content }} />
      })}
    </div>
  )
}

interface Block { type: "html" | "code"; content: string; lang?: string }

function parseToBlocks(md: string): Block[] {
  const blocks: Block[] = []
  const codeRegex = /```(\w*)\n([\s\S]*?)```/g
  let last = 0
  let match

  while ((match = codeRegex.exec(md)) !== null) {
    if (match.index > last) {
      blocks.push({ type: "html", content: parseMarkdown(md.slice(last, match.index)) })
    }
    blocks.push({ type: "code", content: match[2].trim(), lang: match[1] })
    last = match.index + match[0].length
  }
  if (last < md.length) {
    blocks.push({ type: "html", content: parseMarkdown(md.slice(last)) })
  }
  return blocks
}

function parseMarkdown(md: string): string {
  return md
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/^## (.+)$/gm, (_, t) => {
      const id = t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
      return `<h2 id="${id}">${t}</h2>`
    })
    .replace(/^### (.+)$/gm, (_, t) => {
      const id = t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
      return `<h3 id="${id}">${t}</h3>`
    })
    .replace(/^#### (.+)$/gm, (_, t) => `<h4>${t}</h4>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .split("\n\n")
    .map(b => {
      b = b.trim()
      if (!b) return ""
      if (b.startsWith("<")) return b
      return `<p>${b.replace(/\n/g, " ")}</p>`
    })
    .join("\n")
}
