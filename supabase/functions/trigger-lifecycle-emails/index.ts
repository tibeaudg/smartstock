import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer@6.9.14'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type LifecycleStage = 'welcome' | '24h_nudge' | '7d_inactive' | '14d_inactive' | '25d_warning' | '29d_final_warning'

interface StageConfig {
  emailType: 'welcome' | 'lifecycle' | 'deletion_warning'
  defaultSubject: string
  defaultHtml: string
}

const LIFECYCLE_CONFIG: Record<LifecycleStage, StageConfig> = {
  welcome: {
    emailType: 'welcome',
    defaultSubject: 'Welcome to StockFlow, {{first_name}}!',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p>Welcome to StockFlow! Your account is ready and we're excited to help you take control of your inventory.</p>
<p>Here's how to get started:</p>
<ol>
  <li><strong>Add your first product</strong> — Go to Products and add your inventory items</li>
  <li><strong>Set up a location</strong> — Create warehouses or storage locations</li>
  <li><strong>Invite your team</strong> — Add staff members under Settings → Users</li>
</ol>
<p><a href="https://app.stockflowsystems.com/dashboard">Log in and get started →</a></p>
<p>Questions? Just reply to this email — we're happy to help.</p>`,
  },
  '24h_nudge': {
    emailType: 'lifecycle',
    defaultSubject: 'Get started with StockFlow — your account is ready',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p>You created your StockFlow account but haven't had a chance to explore yet.</p>
<p>Getting started takes less than 5 minutes:</p>
<ul>
  <li>Add your first product to the inventory</li>
  <li>Set up a warehouse or storage location</li>
  <li>Invite a team member</li>
</ul>
<p><a href="https://app.stockflowsystems.com/dashboard">Log in and get started →</a></p>
<p>Have questions? Just reply to this email.</p>`,
  },
  '7d_inactive': {
    emailType: 'lifecycle',
    defaultSubject: 'We miss you at StockFlow',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p>It's been a week since your last visit. We wanted to check in.</p>
<p>StockFlow helps you:</p>
<ul>
  <li>Track stock levels in real-time across all locations</li>
  <li>Generate purchase orders automatically when stock runs low</li>
  <li>Reduce stockouts and overstocking by up to 30%</li>
</ul>
<p><a href="https://app.stockflowsystems.com/dashboard">Come back and pick up where you left off →</a></p>`,
  },
  '14d_inactive': {
    emailType: 'lifecycle',
    defaultSubject: 'Your StockFlow account is still here for you',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p>It's been two weeks. Life gets busy — we completely understand.</p>
<p>When you're ready, StockFlow will be here to help you take control of your inventory.</p>
<p>Not finding what you need? Reply to this email and tell us what's missing — we read every response.</p>
<p><a href="https://app.stockflowsystems.com/dashboard">Log back in →</a></p>`,
  },
  '25d_warning': {
    emailType: 'deletion_warning',
    defaultSubject: 'Action required: Your account will be deleted in 5 days',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p><strong>Important notice:</strong> Your StockFlow account (<strong>{{user_email}}</strong>) has been inactive for 25 days and will be automatically deleted in <strong>5 days</strong>.</p>
<p>To keep your account, simply log in at <a href="https://app.stockflowsystems.com/dashboard">app.stockflowsystems.com</a>.</p>
<p>If you'd like to export your data before deletion, log in and go to <strong>Settings → Export Data</strong>.</p>
<p>If you no longer need your account, no action is required — it will be removed automatically.</p>`,
  },
  '29d_final_warning': {
    emailType: 'deletion_warning',
    defaultSubject: 'Final notice: Your account will be deleted tomorrow',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p><strong>Final notice:</strong> Your StockFlow account will be <strong>permanently deleted tomorrow</strong> due to 29 days of inactivity.</p>
<p>To prevent deletion, log in now: <a href="https://app.stockflowsystems.com/dashboard">app.stockflowsystems.com</a></p>
<p>After deletion, your account and all associated data cannot be recovered. This is the last email we will send before permanent deletion.</p>`,
  },
}

function replaceVariables(text: string, vars: Record<string, string>): string {
  let result = text
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value || '')
  }
  return result
}

function matchesStage(profile: any, stage: LifecycleStage): boolean {
  const now = new Date()
  const createdAt = new Date(profile.created_at)
  const lastLogin = profile.last_login ? new Date(profile.last_login) : null
  const refDate = lastLogin || createdAt
  const daysSinceRef = (now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)
  const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
  const accountAgeDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

  switch (stage) {
    case 'welcome':
      // Send to all users created in the last 30 days who haven't received it yet.
      // Dedup via user_lifecycle_emails ensures it's sent only once.
      return accountAgeDays <= 30
    case '24h_nudge': {
      if (hoursSinceCreated < 24) return false
      if (!lastLogin) return true
      const hoursAfterSignup = (lastLogin.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
      return hoursAfterSignup < 2
    }
    case '7d_inactive': return daysSinceRef >= 7
    case '14d_inactive': return daysSinceRef >= 14
    case '25d_warning': return daysSinceRef >= 25
    case '29d_final_warning': return daysSinceRef >= 29
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders })
  if (req.method !== 'POST') return new Response(
    JSON.stringify({ success: false, error: 'Method not allowed' }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response(
      JSON.stringify({ success: false, error: 'Authorization required' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
    const isServiceRole = token === supabaseServiceKey

    const body = await req.json().catch(() => ({}))
    const stageFilter = body.stage as LifecycleStage | undefined
    // selfTrigger: true allows a newly signed-up user to send their own welcome email
    // without requiring admin role. The calling user must match their own session.
    const isSelfWelcome = stageFilter === 'welcome' && body.selfTrigger === true

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    let adminUserId: string | null = body.adminUserId || null
    let selfUserProfile: any = null

    if (!isServiceRole) {
      const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      })
      const { data: { user }, error: userErr } = await userClient.auth.getUser(token)
      if (userErr || !user) return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

      if (isSelfWelcome) {
        // Fetch their own profile to send the welcome email to themselves
        const { data: profile } = await adminClient
          .from('profiles')
          .select('id, email, first_name, last_name, created_at, last_login, role, is_owner')
          .eq('id', user.id)
          .single()
        if (!profile?.email) return new Response(
          JSON.stringify({ success: false, error: 'Profile not found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
        selfUserProfile = profile
        // SMTP will be looked up via first admin owner below
      } else {
        const { data: profile } = await adminClient
          .from('profiles').select('role, is_owner').eq('id', user.id).single()
        if (profile?.role !== 'admin' && !profile?.is_owner) return new Response(
          JSON.stringify({ success: false, error: 'Admin access required' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
        adminUserId = user.id
      }
    }

    // Fallback chain: find any SMTP-configured user when adminUserId is unknown
    // (cron runs, self-welcome triggers, etc.)
    let smtpRow: any = null
    if (adminUserId) {
      const { data } = await adminClient
        .from('smtp_settings')
        .select('smtp_host, smtp_port, smtp_username, smtp_password, from_email, from_name, use_tls')
        .eq('user_id', adminUserId)
        .maybeSingle()
      smtpRow = data
    }

    if (!smtpRow) {
      // Try any row in smtp_settings that has the required fields configured
      const { data } = await adminClient
        .from('smtp_settings')
        .select('smtp_host, smtp_port, smtp_username, smtp_password, from_email, from_name, use_tls')
        .not('smtp_host', 'is', null)
        .not('smtp_password', 'is', null)
        .not('from_email', 'is', null)
        .limit(1)
        .maybeSingle()
      smtpRow = data
    }

    if (!smtpRow?.smtp_host || !smtpRow?.smtp_username || !smtpRow?.from_email || !smtpRow?.smtp_password) {
      return new Response(
        JSON.stringify({ success: false, error: 'SMTP not configured. Configure it in the Settings tab first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Lifecycle settings for this admin
    const { data: lifecycleSettings } = await adminClient
      .from('lifecycle_email_settings')
      .select('stage, enabled, template_id, email_templates:template_id(id, subject, html_body, type, is_active)')
      .eq('user_id', adminUserId)

    const settingsMap = new Map<LifecycleStage, any>()
    ;(lifecycleSettings || []).forEach((s: any) => settingsMap.set(s.stage as LifecycleStage, s))

    // SMTP transporter
    const port = Number(smtpRow.smtp_port) || 587
    const secure = smtpRow.use_tls && port === 465
    const transporter = nodemailer.createTransport({
      host: smtpRow.smtp_host,
      port,
      secure,
      auth: { user: smtpRow.smtp_username, pass: smtpRow.smtp_password },
      tls: { rejectUnauthorized: Deno.env.get('DENO_ENV') === 'production' },
    })

    // --- Self-welcome: send to the calling user only ---
    if (isSelfWelcome && selfUserProfile) {
      const stage: LifecycleStage = 'welcome'
      const setting = settingsMap.get(stage)
      if (setting && setting.enabled === false) {
        return new Response(
          JSON.stringify({ success: true, results: [{ stage, enabled: false, sent: 0 }] }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Dedup check
      const { data: alreadySent } = await adminClient
        .from('user_lifecycle_emails')
        .select('id')
        .eq('user_id', selfUserProfile.id)
        .eq('lifecycle_stage', stage)
        .maybeSingle()

      if (alreadySent) {
        return new Response(
          JSON.stringify({ success: true, results: [{ stage, skipped: 1, reason: 'already_sent' }] }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const config = LIFECYCLE_CONFIG[stage]
      const template = setting?.email_templates?.is_active ? setting.email_templates : null
      const email = String(selfUserProfile.email).trim().toLowerCase()
      const vars = {
        user_email: email,
        user_name: `${selfUserProfile.first_name || ''} ${selfUserProfile.last_name || ''}`.trim() || email.split('@')[0],
        first_name: selfUserProfile.first_name || '',
        last_name: selfUserProfile.last_name || '',
      }

      const subject = replaceVariables(template?.subject || config.defaultSubject, vars)
      const html = replaceVariables(template?.html_body || config.defaultHtml, vars)

      let status: 'sent' | 'failed' = 'sent'
      let errorMsg: string | null = null
      let msgId: string | null = null

      try {
        const info = await transporter.sendMail({
          from: { name: smtpRow.from_name || 'StockFlow', address: smtpRow.from_email },
          to: email,
          subject,
          html,
          text: html.replace(/<[^>]*>/g, ''),
        })
        msgId = info.messageId || null
      } catch (e) {
        status = 'failed'
        errorMsg = e instanceof Error ? e.message : 'Unknown error'
      }

      await adminClient.from('user_lifecycle_emails').upsert({
        user_id: selfUserProfile.id,
        email,
        lifecycle_stage: stage,
        template_id: template?.id || null,
        status,
        error_message: errorMsg,
        metadata: { message_id: msgId },
      }, { onConflict: 'user_id,lifecycle_stage', ignoreDuplicates: true })

      await adminClient.from('email_logs').insert({
        recipient_email: email,
        recipient_user_id: selfUserProfile.id,
        subject,
        email_type: config.emailType,
        status: status === 'sent' ? 'delivered' : 'failed',
        error_message: errorMsg,
        sent_at: new Date().toISOString(),
        delivered_at: status === 'sent' ? new Date().toISOString() : null,
        metadata: { lifecycle_stage: stage, message_id: msgId },
      })

      return new Response(
        JSON.stringify({ success: true, results: [{ stage, sent: status === 'sent' ? 1 : 0, failed: status === 'failed' ? 1 : 0 }] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // --- Admin batch run: process all users for selected stage(s) ---
    const { data: profiles, error: profilesErr } = await adminClient
      .from('profiles')
      .select('id, email, first_name, last_name, created_at, last_login, role, is_owner')
      .neq('role', 'admin')
      .not('email', 'is', null)

    if (profilesErr || !profiles) return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch profiles' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

    const stages: LifecycleStage[] = stageFilter
      ? [stageFilter]
      : ['welcome', '24h_nudge', '7d_inactive', '14d_inactive', '25d_warning', '29d_final_warning']

    const results = []

    for (const stage of stages) {
      const setting = settingsMap.get(stage)
      if (setting && setting.enabled === false) {
        results.push({ stage, enabled: false, matching: 0, sent: 0, skipped: 0, failed: 0 })
        continue
      }

      const config = LIFECYCLE_CONFIG[stage]
      const template = setting?.email_templates?.is_active ? setting.email_templates : null

      const { data: alreadySent } = await adminClient
        .from('user_lifecycle_emails')
        .select('user_id')
        .eq('lifecycle_stage', stage)
      const alreadySentIds = new Set((alreadySent || []).map((r: any) => r.user_id))

      const matching = profiles.filter((p: any) => matchesStage(p, stage))
      const toProcess = matching.filter((p: any) => !alreadySentIds.has(p.id)).slice(0, 200)

      let sent = 0
      let failed = 0

      for (const profile of toProcess) {
        const email = String(profile.email).trim().toLowerCase()
        const vars = {
          user_email: email,
          user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || email.split('@')[0],
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
        }

        const subject = replaceVariables(template?.subject || config.defaultSubject, vars)
        const html = replaceVariables(template?.html_body || config.defaultHtml, vars)

        let status: 'sent' | 'failed' = 'sent'
        let errorMsg: string | null = null
        let msgId: string | null = null

        try {
          const info = await transporter.sendMail({
            from: { name: smtpRow.from_name || 'StockFlow', address: smtpRow.from_email },
            to: email,
            subject,
            html,
            text: html.replace(/<[^>]*>/g, ''),
          })
          msgId = info.messageId || null
        } catch (e) {
          status = 'failed'
          errorMsg = e instanceof Error ? e.message : 'Unknown error'
          failed++
        }

        if (status === 'sent') sent++

        await adminClient.from('user_lifecycle_emails').upsert({
          user_id: profile.id,
          email,
          lifecycle_stage: stage,
          template_id: template?.id || null,
          status,
          error_message: errorMsg,
          metadata: { message_id: msgId },
        }, { onConflict: 'user_id,lifecycle_stage', ignoreDuplicates: true })

        await adminClient.from('email_logs').insert({
          recipient_email: email,
          recipient_user_id: profile.id,
          subject,
          email_type: config.emailType,
          status: status === 'sent' ? 'delivered' : 'failed',
          error_message: errorMsg,
          sent_at: new Date().toISOString(),
          delivered_at: status === 'sent' ? new Date().toISOString() : null,
          metadata: { lifecycle_stage: stage, message_id: msgId },
        })
      }

      results.push({
        stage,
        enabled: true,
        matching: matching.length,
        sent,
        failed,
        skipped: matching.length - toProcess.length,
      })
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('[trigger-lifecycle-emails]', err)
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
