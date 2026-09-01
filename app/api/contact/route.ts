import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { validateBody } from "@/lib/api/validate"
import { sanitize } from "@/lib/api/sanitize"
import { rateLimit } from "@/lib/rate-limit"
import { ContactCreateSchema } from "@/lib/validations"
import { sendContactNotification, sendClientAutoReply } from "@/lib/email"

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  const { success } = await rateLimit(ip, "contact", 2, 3600)
  if (!success) return NextResponse.json({ message: "Too many requests. Please wait an hour before trying again." }, { status: 429 })

  try {
    const body = await validateBody(req, ContactCreateSchema)
    const clean = sanitize(body as Record<string, unknown>)

    const contactData = {
      name:    clean.name    as string,
      email:   clean.email   as string,
      subject: clean.subject as string,
      message: clean.message as string,
    }

    const message = await prisma.contactMessage.create({
      data: contactData,
    })

    // Await email delivery in serverless environment to prevent premature function container termination
    const emailResults = await Promise.allSettled([
      sendContactNotification(contactData),
      sendClientAutoReply(contactData),
    ])

    emailResults.forEach((res, idx) => {
      if (res.status === "rejected") {
        console.error(`[SMTP Error] Email ${idx === 0 ? "Admin Notification" : "Client Auto-Reply"} failed:`, res.reason)
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    const msg = e instanceof Error ? e.message : String(e)
    console.error("POST /api/contact error:", msg)
    return NextResponse.json({ message: `Server error: ${msg}` }, { status: 500 })
  }
}
