import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { validateBody } from "@/lib/api/validate"
import { sanitize } from "@/lib/api/sanitize"
import { rateLimit } from "@/lib/rate-limit"
import { ContactCreateSchema } from "@/lib/validations"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  const { success } = await rateLimit(ip, "contact", 2, 3600)
  if (!success) return NextResponse.json({ message: "Too many requests" }, { status: 429 })

  try {
    const body = await validateBody(req, ContactCreateSchema)
    const clean = sanitize(body as Record<string, unknown>)

    const message = await prisma.contactMessage.create({
      data: {
        name:    clean.name    as string,
        email:   clean.email   as string,
        subject: clean.subject as string,
        message: clean.message as string,
      },
    })

    // Send email notification — non-blocking, failure doesn't affect response
    resend.emails.send({
      from:    "Portfolio Contact <onboarding@resend.dev>",
      to:      process.env.ADMIN_EMAIL!,
      subject: `New message: ${clean.subject}`,
      html: `
        <p><strong>From:</strong> ${clean.name} (${clean.email})</p>
        <p><strong>Subject:</strong> ${clean.subject}</p>
        <hr/>
        <p>${(clean.message as string).replace(/\n/g, "<br/>")}</p>
      `,
    }).catch((err) => console.error("Email send failed:", err))

    return NextResponse.json(message, { status: 201 })
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
