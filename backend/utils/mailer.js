import nodemailer from 'nodemailer'

export function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 465)
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) return null

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
  return transporter
}

export async function sendNewsletterEmails(emails, subject, message) {
  const transporter = getTransporter()
  if (!transporter) return { sent: 0, errors: ['SMTP not configured'] }

  const fromName = process.env.SMTP_FROM_NAME || 'techblog'
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
  const from = `${fromName} <${fromEmail}>`

  let sent = 0
  const errors = []
  for (const to of emails) {
    try {
      await transporter.sendMail({
        from,
        to,
        subject: subject || 'Announcement from techblog',
        text: message,
        html: `<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6">
                 <p>${message.replace(/\n/g, '<br/>')}</p>
                 <hr/>
                 <p style="font-size:12px;color:#666">You are receiving this because you subscribed to techblog.</p>
               </div>`
      })
      sent++
    } catch (e) {
      errors.push({ to, error: e?.message || String(e) })
    }
  }
  return { sent, errors }
}