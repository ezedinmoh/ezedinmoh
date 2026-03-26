export function parseDeviceType(ua: string): "mobile" | "tablet" | "desktop" {
  if (/mobile/i.test(ua)) return "mobile"
  if (/tablet|ipad/i.test(ua)) return "tablet"
  return "desktop"
}

export function isBot(ua: string): boolean {
  return /bot|crawler|spider|slurp|bingbot|googlebot|facebookexternalhit|twitterbot/i.test(ua)
}
