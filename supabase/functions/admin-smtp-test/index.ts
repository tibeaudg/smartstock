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
    const { action, toEmail } = body

    if (!action || (action !== 'test' && action !== 'send-test')) {
      return new Response(
        JSON.stringify({ success: false, error: 'action must be "test" or "send-test"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'send-test') {
      if (!toEmail || typeof toEmail !== 'string' || !validateEmail(toEmail.trim())) {
        return new Response(
          JSON.stringify({ success: false, error: 'Valid toEmail is required for send-test' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: smtpRow, error: smtpError } = await adminClient
      .from('smtp_settings')
      .select('smtp_host, smtp_port, smtp_username, smtp_password, from_email, from_name, use_tls')
      .eq('user_id', user.id)
      .single()

    if (smtpError || !smtpRow?.smtp_host || !smtpRow?.smtp_username || !smtpRow?.from_email) {
      return new Response(
        JSON.stringify({ success: false, error: 'SMTP not configured. Save your SMTP settings first.' }),
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

    await transporter.verify()

    if (action === 'test') {
      return new Response(
        JSON.stringify({ success: true, message: 'SMTP connection test successful' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const to = (toEmail as string).trim().toLowerCase()
    const fromName = smtpRow.from_name || 'StockFlow'
    await transporter.sendMail({
      from: { name: fromName, address: smtpRow.from_email },
      to,
      subject: 'StockFlow – test email',
      text: 'This is a test email from your StockFlow SMTP configuration.',
      html: '<p>This is a test email from your StockFlow SMTP configuration.</p>',
    })

    return new Response(
      JSON.stringify({ success: true, message: 'Test email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[admin-smtp-test]', error)
    const message = error instanceof Error ? error.message : 'Failed to test SMTP or send test email'
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
