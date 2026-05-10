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
  if (!success) return NextResponse.json({ message: "Too many requests. Please wait an hour before trying again." }, { status: 429 })

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
      to:      [process.env.ADMIN_EMAIL!, clean.email as string],
      replyTo: clean.email as string,
      subject: `New message: ${clean.subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#333">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold;color:#555">From:</td><td style="padding:8px">${clean.name} (${clean.email})</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#555">Subject:</td><td style="padding:8px">${clean.subject}</td></tr>
          </table>
          <hr style="margin:16px 0"/>
          <p style="color:#333;line-height:1.6">${(clean.message as string).replace(/\n/g, "<br/>")}</p>
          <hr style="margin:16px 0"/>
          <p style="color:#999;font-size:12px">Sent from your portfolio contact form</p>
        </div>
      `,
    }).catch((err) => console.error("Email send failed:", err))

    return NextResponse.json(message, { status: 201 })
  } catch (e) {
    if (e instanceof Response || (e as { status?: number })?.status) return e as Response
    const msg = e instanceof Error ? e.message : String(e)
    console.error("POST /api/contact error:", msg)
    return NextResponse.json({ message: `Server error: ${msg}` }, { status: 500 })
  }
}
