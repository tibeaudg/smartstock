import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer@6.9.14'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}

function parseEmails(input: string): string[] {
  return input
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => validateEmail(e))
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader ?? ''

  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const body = await req.json().catch(() => ({}))
  const { product_id, branch_id, alert_type, test, toEmail } = body

  const isServiceRoleCall = token === supabaseServiceKey && supabaseServiceKey.length > 0
  const isTriggerCall = isServiceRoleCall && product_id && branch_id && alert_type
  const isTestCall = test === true && toEmail

  if (isTriggerCall) {
    // Invoked by database trigger via pg_net
    return handleTriggerAlert(adminClient, body)
  }

  if (isTestCall) {
    // Invoked by user from General Settings - need auth
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: userError } = await adminClient.auth.getUser(token)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: profile } = await adminClient
      .from('profiles')
      .select('role, is_owner')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || profile?.is_owner === true
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required to send test alert' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!validateEmail(String(toEmail).trim())) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid toEmail is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return handleTestAlert(adminClient, user.id, String(toEmail).trim())
  }

  return new Response(
    JSON.stringify({ success: false, error: 'Invalid request. Provide product_id, branch_id, alert_type (trigger) or test: true, toEmail (test).' }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})

async function handleTriggerAlert(
  adminClient: ReturnType<typeof createClient>,
  body: { product_id: string; branch_id: string; alert_type: string }
): Promise<Response> {
  const { product_id, branch_id, alert_type } = body

  const { data: product, error: productError } = await adminClient
    .from('products')
    .select('id, name, sku, quantity_in_stock, minimum_stock_level')
    .eq('id', product_id)
    .single()

  if (productError || !product) {
    console.error('[send-stock-alert] Product not found:', product_id, productError)
    return new Response(
      JSON.stringify({ success: false, error: 'Product not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data: branchSettings, error: bsError } = await adminClient
    .from('branch_settings')
    .select('stock_alert_email')
    .eq('branch_id', branch_id)
    .single()

  if (bsError || !branchSettings?.stock_alert_email) {
    console.error('[send-stock-alert] Branch settings or alert email missing:', branch_id)
    return new Response(
      JSON.stringify({ success: false, error: 'Alert email not configured' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data: branch, error: branchError } = await adminClient
    .from('branches')
    .select('user_id')
    .eq('id', branch_id)
    .single()

  if (branchError || !branch?.user_id) {
    console.error('[send-stock-alert] Branch not found:', branch_id)
    return new Response(
      JSON.stringify({ success: false, error: 'Branch not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data: smtpRow, error: smtpError } = await adminClient
    .from('smtp_settings')
    .select('smtp_host, smtp_port, smtp_username, smtp_password, from_email, from_name, use_tls')
    .eq('user_id', branch.user_id)
    .single()

  if (smtpError || !smtpRow?.smtp_host || !smtpRow?.smtp_username || !smtpRow?.from_email || !smtpRow?.smtp_password) {
    console.error('[send-stock-alert] SMTP not configured for branch owner:', branch.user_id)
    return new Response(
      JSON.stringify({ success: false, error: 'SMTP not configured. Configure E-mail / SMTP in Admin.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const recipients = parseEmails(branchSettings.stock_alert_email)
  if (recipients.length === 0) {
    return new Response(
      JSON.stringify({ success: false, error: 'No valid alert email addresses' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const alertLabel = alert_type === 'empty' ? 'Out of Stock' : 'Low Stock'
  const subject = `StockFlow: ${alertLabel} – ${product.name}${product.sku ? ` (${product.sku})` : ''}`
  const qty = Number(product.quantity_in_stock) ?? 0
  const min = Number(product.minimum_stock_level) ?? 0

  const htmlBody = `
    <h2>Stock Alert: ${alertLabel}</h2>
    <p>Product <strong>${escapeHtml(product.name)}</strong>${product.sku ? ` (SKU: ${escapeHtml(product.sku)})` : ''} has reached ${alert_type === 'empty' ? 'zero stock' : 'low stock'}.</p>
    <ul>
      <li>Current quantity: <strong>${qty}</strong></li>
      <li>Minimum level: <strong>${min}</strong></li>
    </ul>
    <p>Please replenish stock to avoid stockouts.</p>
    <p><em>This is an automated message from StockFlow.</em></p>
  `

  return sendEmailAndLog(
    adminClient,
    smtpRow,
    recipients,
    subject,
    htmlBody,
    'stock_alert',
    null
  )
}

async function handleTestAlert(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
  toEmail: string
): Promise<Response> {
  const { data: smtpRow, error: smtpError } = await adminClient
    .from('smtp_settings')
    .select('smtp_host, smtp_port, smtp_username, smtp_password, from_email, from_name, use_tls')
    .eq('user_id', userId)
    .single()

  if (smtpError || !smtpRow?.smtp_host || !smtpRow?.smtp_username || !smtpRow?.from_email || !smtpRow?.smtp_password) {
    return new Response(
      JSON.stringify({ success: false, error: 'SMTP not configured. Configure E-mail / SMTP in Admin first.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const subject = 'StockFlow: Test Stock Alert'
  const htmlBody = `
    <h2>Test Stock Alert</h2>
    <p>This is a test email to verify your stock alert configuration.</p>
    <p>When products go below their minimum level or run out of stock, you will receive similar alerts at this address.</p>
    <p><em>This is an automated message from StockFlow.</em></p>
  `

  return sendEmailAndLog(
    adminClient,
    smtpRow,
    [toEmail],
    subject,
    htmlBody,
    'stock_alert_test',
    userId
  )
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function sendEmailAndLog(
  adminClient: ReturnType<typeof createClient>,
  smtpRow: { smtp_host: string; smtp_port: number; smtp_username: string; smtp_password: string; from_email: string; from_name?: string; use_tls: boolean },
  recipients: string[],
  subject: string,
  htmlBody: string,
  emailType: string,
  recipientUserId: string | null
): Promise<Response> {
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

  const fromName = smtpRow.from_name || 'StockFlow'
  const textBody = htmlBody.replace(/<[^>]*>/g, '')

  let emailStatus = 'sent'
  let errorMessage: string | null = null

  try {
    await transporter.sendMail({
      from: { name: fromName, address: smtpRow.from_email },
      to: recipients,
      subject,
      html: htmlBody,
      text: textBody,
    })
    emailStatus = 'delivered'
  } catch (err) {
    console.error('[send-stock-alert] Send error:', err)
    emailStatus = 'failed'
    errorMessage = err instanceof Error ? err.message : 'Unknown error'
  }

  for (const to of recipients) {
    await adminClient.from('email_logs').insert({
      recipient_email: to,
      recipient_user_id: recipientUserId,
      subject,
      email_type: emailType,
      status: emailStatus,
      error_message: errorMessage,
      sent_at: new Date().toISOString(),
      delivered_at: emailStatus === 'delivered' ? new Date().toISOString() : null,
    })
  }

  if (emailStatus === 'failed') {
    return new Response(
      JSON.stringify({ success: false, error: errorMessage || 'Failed to send email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Email sent successfully' }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
