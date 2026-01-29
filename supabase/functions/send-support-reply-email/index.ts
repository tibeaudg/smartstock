import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer@6.9.14'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}

function sanitizeMessage(str: string, maxLength = 10000): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .substring(0, maxLength)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await userClient.auth.getUser(token)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: profile } = await userClient
      .from('profiles')
      .select('role, is_owner')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || profile?.is_owner === true
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json().catch(() => ({}))
    const { chatId, message } = body

    if (!chatId || typeof chatId !== 'string' || !chatId.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'chatId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const trimmedMessage = sanitizeMessage(message.trim(), 10000)
    if (!trimmedMessage) {
      return new Response(
        JSON.stringify({ success: false, error: 'message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: chat, error: chatError } = await adminClient
      .from('chats')
      .select('id, user_id')
      .eq('id', chatId.trim())
      .single()

    if (chatError || !chat) {
      return new Response(
        JSON.stringify({ success: false, error: 'Chat not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: userProfile, error: profileError } = await adminClient
      .from('profiles')
      .select('email')
      .eq('id', chat.user_id)
      .single()

    if (profileError || !userProfile?.email) {
      return new Response(
        JSON.stringify({ success: false, error: 'User email not found for this chat' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const toEmail = userProfile.email.trim().toLowerCase()
    if (!validateEmail(toEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid recipient email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: smtpRow, error: smtpError } = await adminClient
      .from('smtp_settings')
      .select('smtp_host, smtp_port, smtp_username, smtp_password, from_email, from_name, use_tls')
      .eq('user_id', user.id)
      .single()

    if (smtpError || !smtpRow?.smtp_host || !smtpRow?.smtp_username || !smtpRow?.from_email) {
      return new Response(
        JSON.stringify({ success: false, error: 'SMTP not configured. Configure E-mail / SMTP in Admin first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!smtpRow.smtp_password || String(smtpRow.smtp_password).trim() === '') {
      return new Response(
        JSON.stringify({ success: false, error: 'SMTP password not set. Enter and save your password in Admin SMTP settings.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const port = Number(smtpRow.smtp_port) || 587
    const secure = smtpRow.use_tls && port === 465

    const transporter = nodemailer.createTransport({
      host: smtpRow.smtp_host,
      port,
      secure,
      auth: {
        user: smtpRow.smtp_username,
        pass: smtpRow.smtp_password || undefined,
      },
      tls: {
        rejectUnauthorized: Deno.env.get('DENO_ENV') === 'production',
        ...(Deno.env.get('DENO_ENV') !== 'production' && {
          rejectUnauthorized: false,
          servername: smtpRow.smtp_host,
        }),
      },
    })

    const fromName = smtpRow.from_name || 'StockFlow Support'
    const subject = 'Re: StockFlow support'
    const escaped = trimmedMessage
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <p style="white-space: pre-wrap; line-height: 1.6;">${escaped}</p>
        <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">This is a reply from StockFlow support. You can also view and reply in the app.</p>
      </div>
    `

    await transporter.sendMail({
      from: { name: fromName, address: smtpRow.from_email },
      to: toEmail,
      subject,
      html: htmlBody,
      text: trimmedMessage,
    })

    return new Response(
      JSON.stringify({ success: true, message: 'Reply sent and email sent to user' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[send-support-reply-email]', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
