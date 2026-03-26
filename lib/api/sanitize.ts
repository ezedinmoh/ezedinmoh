import sanitizeHtml from "sanitize-html"

export function sanitizeString(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
}

export function sanitize<T extends Record<string, unknown>>(obj: T): T {
  // Fields that are URLs — don't sanitize, they contain valid special chars
  const urlFields = new Set(["image", "liveUrl", "githubUrl", "avatar"])
  // Fields that should never be HTML-encoded (plain text that may contain & etc.)
  const plainFields = new Set(["title", "description", "name", "subject", "message",
    "caseStudyProblem", "caseStudySolution", "caseStudyOutcome", "hostReply", "year"])

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (urlFields.has(key) || plainFields.has(key)) {
      result[key] = value // pass through as-is
    } else if (typeof value === "string") {
      result[key] = sanitizeString(value)
    } else if (Array.isArray(value)) {
      // screenshots and other URL arrays — pass through as-is
      if (key === "screenshots" || key === "tags" || key === "stack" || key === "category") {
        result[key] = value.map((v) => (typeof v === "string" ? (key === "screenshots" ? v : sanitizeString(v)) : v))
      } else {
        result[key] = value.map((v) => (typeof v === "string" ? sanitizeString(v) : v))
      }
    } else {
      result[key] = value
    }
  }
  return result as T
}
