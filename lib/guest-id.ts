import { cookies } from "next/headers"

const COOKIE_NAME = "gid"
const MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/**
 * Returns the server-issued anonymous guest ID from the HttpOnly cookie.
 * If none exists, creates a new one and includes it in `responseHeaders`.
 *
 * Usage in a Route Handler:
 *   const { guestId, headers } = await getOrCreateGuestId()
 *   return NextResponse.json(data, { headers })
 */
export async function getOrCreateGuestId(): Promise<{
  guestId: string
  headers: Headers
}> {
  const cookieStore = await cookies()
  const existing = cookieStore.get(COOKIE_NAME)?.value
  const guestId = existing ?? crypto.randomUUID()

  const headers = new Headers()
  if (!existing) {
    const secure = process.env.NODE_ENV === "production"
    headers.set(
      "Set-Cookie",
      `${COOKIE_NAME}=${guestId}; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}; Path=/${secure ? "; Secure" : ""}`
    )
  }

  return { guestId, headers }
}
