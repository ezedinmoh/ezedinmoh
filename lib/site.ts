/**
 * Canonical Site Configuration for Ezedin Mohammed's Portfolio
 * Single source of truth for canonical production origin, metadata, and absolute URL generation.
 */

export const PRODUCTION_ORIGIN = "https://ezedinmoh.dev"
export const SITE_DOMAIN = "ezedinmoh.dev"
export const SITE_NAME = "Ezedin Mohammed"

/**
 * Resolves the primary site URL.
 * Falls back strictly to PRODUCTION_ORIGIN to prevent canonical tag leaks
 * from preview deployments, PR builds, or deprecated domains.
 */
function resolveSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, "")
    // Safeguard: Never allow vercel.app preview URLs or old domain as canonical site URL
    if (
      !trimmed.includes("vercel.app") &&
      !trimmed.includes("ezedinmoh.pro.et") &&
      (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    ) {
      return trimmed
    }
  }
  return PRODUCTION_ORIGIN
}

export const SITE_URL = resolveSiteUrl()

/**
 * Generates an absolute canonical URL with leading slash normalization.
 * Strips query parameters or hashes to maintain strict canonical URL hygiene.
 */
export function absoluteUrl(path: string = ""): string {
  if (!path || path === "/") {
    return SITE_URL
  }

  // Ensure path starts with a single slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  // Strip query parameters and trailing slashes to maintain canonical purity
  const cleanPath = normalizedPath.split("?")[0].split("#")[0].replace(/\/+$/, "")

  return `${SITE_URL}${cleanPath}`
}
