import sanitizeHtml from "sanitize-html"

export function sanitizeString(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
}

export function sanitize<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = sanitizeString(value)
    } else if (Array.isArray(value)) {
      result[key] = value.map((v) => (typeof v === "string" ? sanitizeString(v) : v))
    } else {
      result[key] = value
    }
  }
  return result as T
}
