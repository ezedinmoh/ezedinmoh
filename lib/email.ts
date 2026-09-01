import nodemailer from "nodemailer"

const smtpUser = (process.env.SMTP_USER || "ezedinmoh1@gmail.com").trim()
const smtpPass = (process.env.SMTP_PASS || "").replace(/\s+/g, "")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  // Ensure connection timeout settings for serverless environments
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
})

export interface ContactMailData {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * Send notification email to Admin (ezedinmoh1@gmail.com)
 */
export async function sendContactNotification(data: ContactMailData) {
  const adminEmail = (process.env.ADMIN_EMAIL || "ezedinmoh1@gmail.com").trim()

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #f1f5f9; margin: 0; padding: 24px 16px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1f293d; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 24px 32px; text-align: left; }
          .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 4px 0 0 0; color: #ccfbf1; font-size: 13px; opacity: 0.9; }
          .content { padding: 32px; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .info-table td { padding: 12px 16px; border-bottom: 1px solid #1f293d; font-size: 14px; }
          .info-label { width: 90px; font-weight: 600; color: #94a3b8; }
          .info-val { color: #f8fafc; font-weight: 500; }
          .message-box { background-color: #0b1120; border: 1px solid #1e293b; border-left: 4px solid #14b8a6; padding: 20px; border-radius: 8px; color: #e2e8f0; font-size: 15px; line-height: 1.6; margin-top: 16px; }
          .footer { background-color: #0b0f19; padding: 20px 32px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px; }
          .reply-btn { display: inline-block; margin-top: 24px; padding: 12px 24px; background-color: #14b8a6; color: #0f172a; font-weight: 600; font-size: 14px; text-decoration: none; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Portfolio Contact Message</h1>
            <p>You received a new message from your website contact form.</p>
          </div>
          <div class="content">
            <table class="info-table">
              <tr>
                <td class="info-label">From:</td>
                <td class="info-val"><strong>${data.name}</strong> (&lt;<a href="mailto:${data.email}" style="color: #2dd4bf; text-decoration: none;">${data.email}</a>&gt;)</td>
              </tr>
              <tr>
                <td class="info-label">Subject:</td>
                <td class="info-val">${data.subject}</td>
              </tr>
            </table>

            <p style="color: #94a3b8; font-size: 13px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Message Payload:</p>
            <div class="message-box">${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}</div>

            <div style="text-align: center;">
              <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" class="reply-btn">Reply to ${data.name}</a>
            </div>
          </div>
          <div class="footer">
            <p>Sent directly from your portfolio website system via Google SMTP.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return transporter.sendMail({
    from: `"Portfolio Contact System" <${smtpUser}>`,
    to: adminEmail,
    replyTo: data.email,
    subject: `[Portfolio Contact] ${data.subject}`,
    html,
  })
}

/**
 * Send automated confirmation / thank you email to Client (user who submitted)
 */
export async function sendClientAutoReply(data: ContactMailData) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #f1f5f9; margin: 0; padding: 24px 16px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1f293d; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 32px; text-align: left; }
          .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0 0; color: #ccfbf1; font-size: 14px; }
          .content { padding: 32px; font-size: 15px; line-height: 1.7; color: #cbd5e1; }
          .content h2 { color: #f8fafc; font-size: 18px; margin-top: 0; font-weight: 600; }
          .quote-box { background-color: #0b1120; border: 1px solid #1e293b; border-left: 4px solid #14b8a6; padding: 18px; border-radius: 8px; color: #94a3b8; font-size: 14px; margin: 20px 0; }
          .signature { margin-top: 32px; padding-top: 24px; border-top: 1px solid #1e293b; }
          .sig-name { font-size: 16px; font-weight: 700; color: #f8fafc; margin: 0; }
          .sig-title { font-size: 13px; color: #14b8a6; margin: 2px 0 12px 0; font-weight: 500; }
          .social-links a { color: #2dd4bf; text-decoration: none; font-size: 13px; margin-right: 14px; font-weight: 500; }
          .social-links a:hover { text-decoration: underline; }
          .footer { background-color: #0b0f19; padding: 20px 32px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Me!</h1>
            <p>Your message has been successfully received.</p>
          </div>
          <div class="content">
            <h2>Hi ${data.name},</h2>
            <p>Thank you for reaching out through my portfolio website! I have received your message regarding <strong>"${data.subject}"</strong> and appreciate you getting in touch.</p>
            <p>I review incoming messages regularly and will get back to you as soon as possible (usually within 24 hours).</p>

            <p style="font-size: 13px; font-weight: 600; color: #94a3b8; margin-top: 24px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">A copy of your message:</p>
            <div class="quote-box">
              ${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}
            </div>

            <div class="signature">
              <p class="sig-name">Ezedin Moh</p>
              <p class="sig-title">Software Engineer & Full-Stack Web Developer</p>
              <div class="social-links">
                <a href="https://github.com/ezedinmoh" target="_blank">GitHub</a>
                <a href="https://www.linkedin.com/in/ezedinmoh" target="_blank">LinkedIn</a>
                <a href="https://x.com/ezedinmoh" target="_blank">Twitter</a>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Ezedin Moh. All rights reserved.<br/>This is an automated confirmation email sent to ${data.email}.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return transporter.sendMail({
    from: `"Ezedin Moh" <${smtpUser}>`,
    to: data.email,
    subject: `Thank you for contacting Ezedin Moh!`,
    html,
  })
}
