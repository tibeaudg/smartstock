import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import nodemailer from 'npm:nodemailer@6.9.14'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name, x-posthog-distinct-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const CONTACT_TO = Deno.env.get('CONTACT_TO_EMAIL') || 'info@stockflow.be'

function getSmtpConfig() {
  const smtp_host = Deno.env.get('SMTP_host') ?? ''
  const smtp_port = Number(Deno.env.get('SMTP_port')) || 587
  const smtp_username = Deno.env.get('username') ?? ''
  const smtp_password = Deno.env.get('SMTP_password') ?? ''
  const from_name = Deno.env.get('From_name') || 'StockFlow'
  return {
    smtp_host,
    smtp_port,
    smtp_username,
    smtp_password,
    from_email: smtp_username,
    from_name,
  }
}

function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

function sanitizeEmailText(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br>')
}

function sanitizeEmailAddress(email: string): string {
  return email.replace(/[<>"']/g, '').trim().toLowerCase()
}

type ContactPayload = {
  name?: string
  email?: string
  description?: string
  message?: string
  subject?: string
}

function validateContactForm(body: ContactPayload) {
  const errors: string[] = []

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = (
    typeof body.message === 'string' ? body.message :
    typeof body.description === 'string' ? body.description :
    ''
  ).trim()
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''

  if (name.length < 2 || name.length > 100) errors.push('name: must be between 2 and 100 characters')
  if (!validateEmail(email)) errors.push('email: must be a valid email address')
  if (message.length < 10 || message.length > 5000) errors.push('message: must be between 10 and 5000 characters')
  if (subject.length > 200) errors.push('subject: must be at most 200 characters')

  if (errors.length > 0) {
    return { valid: false as const, errors }
  }

  return {
    valid: true as const,
    data: { name, email, message, subject },
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  try {
    const body = await req.json().catch(() => ({})) as ContactPayload
    const validation = validateContactForm(body)

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Validation failed', details: validation.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { name, email, message, subject } = validation.data
    const smtp = getSmtpConfig()

    if (!smtp.smtp_host || !smtp.smtp_username || !smtp.smtp_password) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Email not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const sanitizedName = escapeHtml(name)
    const sanitizedEmail = sanitizeEmailAddress(email)
    const sanitizedMessage = sanitizeEmailText(message)
    const sanitizedSubject = subject ? escapeHtml(subject) : ''

    let emailSubject = `Contact Form: ${sanitizedName}`
    if (sanitizedSubject) {
      emailSubject = sanitizedSubject === 'business-tier'
        ? `Business Tier Inquiry from ${sanitizedName}`
        : `${sanitizedSubject} - ${sanitizedName}`
    }

    const port = smtp.smtp_port
    const secure = port === 465

    const transporter = nodemailer.createTransport({
      host: smtp.smtp_host,
      port,
      secure,
      auth: {
        user: smtp.smtp_username,
        pass: smtp.smtp_password,
      },
      tls: {
        rejectUnauthorized: Deno.env.get('DENO_ENV') === 'production',
        ...(Deno.env.get('DENO_ENV') !== 'production' && {
          rejectUnauthorized: false,
          servername: smtp.smtp_host,
        }),
      },
    })

    const info = await transporter.sendMail({
      from: { name: smtp.from_name, address: smtp.from_email },
      to: CONTACT_TO,
      replyTo: sanitizedEmail,
      subject: emailSubject,
      text: `Name: ${name}\nEmail: ${sanitizedEmail}\n${subject ? `Subject: ${subject}\n` : ''}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4F46E5; margin-bottom: 20px;">New Contact Form Submission</h2>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${sanitizedName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #4F46E5;">${sanitizedEmail}</a></p>
            ${sanitizedSubject ? `<p style="margin: 8px 0;"><strong>Subject:</strong> ${sanitizedSubject}</p>` : ''}
          </div>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #4F46E5;">
            <h3 style="margin-top: 0; color: #374151;">Description:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #4B5563;">${sanitizedMessage}</p>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #9CA3AF; font-size: 12px;">
            <p>This email was sent from the StockFlow contact form</p>
          </div>
        </div>
      `,
    })

    return new Response(
      JSON.stringify({ ok: true, id: info.messageId ?? null }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('[contact]', error)
    return new Response(
      JSON.stringify({ ok: false, error: 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
