import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer@6.9.14'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type AutomationTrigger = 'user_signup'

interface DateFilter {
  operator: 'less_than' | 'greater_than' | 'equal' | 'between' | 'never'
  days?: number
  daysFrom?: number
  daysTo?: number
}

interface SegmentFilters {
  plan?: string[]
  organization?: string[]
  role?: string[]
  isOwner?: boolean
  accountCreated?: DateFilter
  lastLogin?: DateFilter
  accountAge?: DateFilter
  productCountMin?: number
  productCountMax?: number
  // Legacy support
  signupDateFrom?: string
  signupDateTo?: string
  lastLoginFrom?: string
  lastLoginTo?: string
}

function replaceTemplateVariables(text: string, variables: Record<string, string>): string {
  let result = text
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(regex, value || '')
  }
  return result
}

function userMatchesSegment(profile: any, filters: SegmentFilters): boolean {
  // Simple filters
  if (filters.plan && Array.isArray(filters.plan) && filters.plan.length > 0) {
    if (!filters.plan.includes(profile.selected_plan)) return false
  }
  if (filters.organization && Array.isArray(filters.organization) && filters.organization.length > 0) {
    if (!filters.organization.includes(profile.organization_name)) return false
  }
  if (filters.role && Array.isArray(filters.role) && filters.role.length > 0) {
    if (!filters.role.includes(profile.role)) return false
  }
  if (filters.isOwner !== undefined) {
    if (Boolean(profile.is_owner) !== Boolean(filters.isOwner)) return false
  }

  const now = new Date()

  // Legacy date filters
  if (filters.signupDateFrom) {
    if (!profile.created_at) return false
    if (new Date(profile.created_at) < new Date(filters.signupDateFrom)) return false
  }
  if (filters.signupDateTo) {
    if (!profile.created_at) return false
    if (new Date(profile.created_at) > new Date(filters.signupDateTo)) return false
  }
  if (filters.lastLoginFrom) {
    if (!profile.last_login) return false
    if (new Date(profile.last_login) < new Date(filters.lastLoginFrom)) return false
  }
  if (filters.lastLoginTo) {
    if (!profile.last_login) return false
    if (new Date(profile.last_login) > new Date(filters.lastLoginTo)) return false
  }

  // accountCreated relative logic (supports fractional days for hours)
  if (filters.accountCreated) {
    const f = filters.accountCreated
    if (!profile.created_at) return false
    const createdDate = new Date(profile.created_at)
    const hoursAgo = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60)
    const daysAgo = hoursAgo / 24

    if (f.operator === 'less_than' && f.days !== undefined) {
      return f.days < 1 ? hoursAgo < (f.days * 24) : daysAgo < f.days
    }
    if (f.operator === 'greater_than' && f.days !== undefined) {
      return f.days < 1 ? hoursAgo > (f.days * 24) : daysAgo > f.days
    }
    if (f.operator === 'equal' && f.days !== undefined) {
      return f.days < 1 ? Math.abs(hoursAgo - (f.days * 24)) < 1 : Math.floor(daysAgo) === f.days
    }
    if (f.operator === 'between' && f.daysFrom !== undefined && f.daysTo !== undefined) {
      const fromHours = f.daysFrom * 24
      const toHours = f.daysTo * 24
      return hoursAgo >= fromHours && hoursAgo <= toHours
    }
    return false
  }

  // lastLogin relative logic
  if (filters.lastLogin) {
    const f = filters.lastLogin
    if (f.operator === 'never') return !profile.last_login
    if (!profile.last_login) return false
    const loginDate = new Date(profile.last_login)
    const daysAgo = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24))

    if (f.operator === 'less_than' && f.days !== undefined) return daysAgo < f.days
    if (f.operator === 'greater_than' && f.days !== undefined) return daysAgo > f.days
    if (f.operator === 'equal' && f.days !== undefined) return daysAgo === f.days
    if (f.operator === 'between' && f.daysFrom !== undefined && f.daysTo !== undefined) {
      return daysAgo >= f.daysFrom && daysAgo <= f.daysTo
    }
    return false
  }

  // accountAge relative logic
  if (filters.accountAge) {
    const f = filters.accountAge
    if (!profile.created_at) return false
    const createdDate = new Date(profile.created_at)
    const daysOld = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

    if (f.operator === 'less_than' && f.days !== undefined) return daysOld < f.days
    if (f.operator === 'greater_than' && f.days !== undefined) return daysOld > f.days
    if (f.operator === 'equal' && f.days !== undefined) return daysOld === f.days
    if (f.operator === 'between' && f.daysFrom !== undefined && f.daysTo !== undefined) {
      return daysOld >= f.daysFrom && daysOld <= f.daysTo
    }
    return false
  }

  return true
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

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Load caller profile (the newly registered user)
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('id, email, first_name, last_name, created_at, last_login, selected_plan, organization_name, role, is_owner')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Profile not found or email missing' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find automated welcome campaigns that should trigger on signup
    const trigger: AutomationTrigger = 'user_signup'
    const { data: campaigns, error: campaignsError } = await adminClient
      .from('email_campaigns')
      .select(`
        id,
        name,
        status,
        template_id,
        created_by,
        total_recipients,
        sent_count,
        delivered_count,
        failed_count,
        recipient_type,
        segment_id,
        recipient_config,
        email_templates (
          id,
          name,
          subject,
          html_body,
          text_body,
          type,
          is_active
        )
      `)
      .eq('recipient_type', 'segment')
      .neq('status', 'cancelled')

    if (campaignsError) {
      console.error('[trigger-signup-campaigns] Error fetching campaigns:', campaignsError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch campaigns' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const automatedWelcomeCampaigns = (campaigns || []).filter((c: any) => {
      const cfg = c.recipient_config || {}
      return (
        cfg.automation_enabled === true &&
        cfg.automation_trigger === trigger &&
        c.email_templates?.type === 'welcome' &&
        c.email_templates?.is_active === true
      )
    })

    if (automatedWelcomeCampaigns.length === 0) {
      return new Response(
        JSON.stringify({ success: true, processed: 0, message: 'No automated welcome campaigns configured' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let processed = 0
    const results: Array<{ campaign_id: string; sent: boolean; reason?: string }> = []

    for (const campaign of automatedWelcomeCampaigns) {
      const template = campaign.email_templates
      if (!template) {
        results.push({ campaign_id: campaign.id, sent: false, reason: 'Template missing' })
        continue
      }

      // Resolve filters (prefer recipient_config.segment_filters, fallback to saved segment)
      let filters: SegmentFilters | null = campaign.recipient_config?.segment_filters || null
      if (!filters && campaign.segment_id) {
        const { data: seg } = await adminClient
          .from('email_segments')
          .select('filters')
          .eq('id', campaign.segment_id)
          .single()
        filters = (seg?.filters as SegmentFilters) || null
      }

      if (!filters) {
        results.push({ campaign_id: campaign.id, sent: false, reason: 'No segment filters' })
        continue
      }

      // Match the newly created user against the segment
      if (!userMatchesSegment(profile, filters)) {
        results.push({ campaign_id: campaign.id, sent: false, reason: 'User does not match segment' })
        continue
      }

      const recipientEmail = String(profile.email).trim().toLowerCase()

      // Dedup: if a recipient row already exists for this campaign+user/email, do nothing.
      const { data: existingRecipient } = await adminClient
        .from('email_recipients')
        .select('id, status')
        .eq('campaign_id', campaign.id)
        .or(`user_id.eq.${profile.id},email.eq.${recipientEmail}`)
        .maybeSingle()

      if (existingRecipient) {
        results.push({ campaign_id: campaign.id, sent: false, reason: `Already queued/sent (${existingRecipient.status})` })
        continue
      }

      // SMTP settings from secrets
      const smtpRow = {
        smtp_host: Deno.env.get('SMTP_host') ?? '',
        smtp_port: Number(Deno.env.get('SMTP_port')) || 587,
        smtp_username: Deno.env.get('username') ?? '',
        smtp_password: Deno.env.get('SMTP_password') ?? '',
        from_email: Deno.env.get('username') ?? '',
        from_name: Deno.env.get('From_name') || 'StockFlow',
        use_tls: (Number(Deno.env.get('SMTP_port')) || 587) === 465,
      }

      if (!smtpRow.smtp_host || !smtpRow.smtp_username || !smtpRow.smtp_password) {
        results.push({ campaign_id: campaign.id, sent: false, reason: 'SMTP not configured in Supabase secrets' })
        continue
      }

      // Insert recipient row (pending)
      const { data: insertedRecipient, error: insertRecipientError } = await adminClient
        .from('email_recipients')
        .insert({
          campaign_id: campaign.id,
          user_id: profile.id,
          email: recipientEmail,
          status: 'pending',
          metadata: {
            automation_trigger: trigger,
          },
        })
        .select('id')
        .single()

      if (insertRecipientError || !insertedRecipient) {
        // Unique index will also protect us; treat conflicts as dedup success.
        results.push({ campaign_id: campaign.id, sent: false, reason: 'Failed to insert recipient (possibly duplicate)' })
        continue
      }

      // Render variables
      const variables: Record<string, string> = {
        user_email: recipientEmail,
        user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || recipientEmail.split('@')[0],
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        organization_name: profile.organization_name || '',
      }

      const finalSubject = replaceTemplateVariables(template.subject, variables)
      const finalHtmlBody = replaceTemplateVariables(template.html_body, variables)
      const finalTextBody = template.text_body ? replaceTemplateVariables(template.text_body, variables) : undefined

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

      let emailStatus: 'delivered' | 'failed' = 'delivered'
      let errorMessage: string | null = null
      let messageId: string | null = null

      try {
        const info = await transporter.sendMail({
          from: { name: smtpRow.from_name || 'StockFlow', address: smtpRow.from_email },
          to: recipientEmail,
          subject: finalSubject,
          html: finalHtmlBody,
          text: finalTextBody || finalHtmlBody.replace(/<[^>]*>/g, ''),
        })
        messageId = info.messageId || null
      } catch (e) {
        console.error('[trigger-signup-campaigns] sendMail failed:', e)
        emailStatus = 'failed'
        errorMessage = e instanceof Error ? e.message : 'Unknown error'
      }

      // Update recipient status
      await adminClient
        .from('email_recipients')
        .update({
          status: emailStatus,
          sent_at: new Date().toISOString(),
          delivered_at: emailStatus === 'delivered' ? new Date().toISOString() : null,
        })
        .eq('id', insertedRecipient.id)

      // Log email
      await adminClient
        .from('email_logs')
        .insert({
          campaign_id: campaign.id,
          template_id: template.id,
          recipient_email: recipientEmail,
          recipient_user_id: profile.id,
          subject: finalSubject,
          email_type: 'welcome',
          status: emailStatus,
          error_message: errorMessage,
          sent_at: new Date().toISOString(),
          delivered_at: emailStatus === 'delivered' ? new Date().toISOString() : null,
          metadata: {
            message_id: messageId,
            automation_trigger: trigger,
          },
        })

      // Update campaign stats (continuous campaigns never complete)
      await adminClient
        .from('email_campaigns')
        .update({
          total_recipients: (Number(campaign.total_recipients) || 0) + 1,
          sent_count: (Number(campaign.sent_count) || 0) + 1,
          delivered_count: (Number(campaign.delivered_count) || 0) + (emailStatus === 'delivered' ? 1 : 0),
          failed_count: (Number(campaign.failed_count) || 0) + (emailStatus === 'failed' ? 1 : 0),
        })
        .eq('id', campaign.id)

      processed++
      results.push({ campaign_id: campaign.id, sent: emailStatus === 'delivered', reason: emailStatus === 'failed' ? errorMessage || 'Failed' : undefined })
    }

    return new Response(
      JSON.stringify({ success: true, processed, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[trigger-signup-campaigns]', error)
    const message = error instanceof Error ? error.message : 'Failed to trigger campaigns'
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

