import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer@6.9.14'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type AutomationTrigger = 'inactivity'

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
  productCountMin?: number
  productCountMax?: number
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

  if (filters.lastLogin) {
    const f = filters.lastLogin
    if (f.operator === 'never') return !profile.last_login
    // For "greater_than" (inactivity): include users who never logged in (null = infinitely inactive)
    if (!profile.last_login) {
      return f.operator === 'greater_than' && f.days !== undefined
    }
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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

    // Allow invocation with service role key (cron) - no user context
    if (token !== supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const trigger: AutomationTrigger = 'inactivity'

    const { data: segments, error: segmentsError } = await adminClient
      .from('email_segments')
      .select(`
        id,
        name,
        filters,
        created_by,
        automation_enabled,
        automation_trigger,
        automation_template_id,
        email_templates:automation_template_id (
          id,
          name,
          subject,
          html_body,
          text_body,
          type,
          is_active
        )
      `)
      .eq('automation_enabled', true)
      .eq('automation_trigger', trigger)

    if (segmentsError) {
      console.error('[trigger-inactivity-automations] Error fetching segments:', segmentsError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch segment automations' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!segments || segments.length === 0) {
      return new Response(
        JSON.stringify({ success: true, processed: 0, message: 'No inactivity segment automations configured' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: profiles, error: profilesError } = await adminClient
      .from('profiles')
      .select('id, email, first_name, last_name, created_at, last_login, selected_plan, organization_name, role, is_owner')
      .not('email', 'is', null)

    if (profilesError || !profiles) {
      console.error('[trigger-inactivity-automations] Error fetching profiles:', profilesError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch profiles' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let totalProcessed = 0
    const results: Array<{ segment_id: string; segment_name: string; sent: number; skipped: number; failed: number; total_matching?: number }> = []
    const maxPerSegment = 500

    for (const segment of segments as any[]) {
      const template = segment.email_templates
      if (!template || template.is_active !== true) {
        results.push({ segment_id: segment.id, segment_name: segment.name, sent: 0, skipped: 0, failed: 0, total_matching: 0 })
        continue
      }

      const filters = (segment.filters || {}) as SegmentFilters
      const matchingProfiles = profiles.filter((p: any) => userMatchesSegment(p, filters))
      let sent = 0
      let skipped = 0
      let failed = 0

      const { data: smtpRow, error: smtpError } = await adminClient
        .from('smtp_settings')
        .select('smtp_host, smtp_port, smtp_username, smtp_password, from_email, from_name, use_tls')
        .eq('user_id', segment.created_by)
        .single()

      if (smtpError || !smtpRow?.smtp_host || !smtpRow?.smtp_username || !smtpRow?.from_email || !smtpRow?.smtp_password) {
        results.push({ segment_id: segment.id, segment_name: segment.name, sent: 0, skipped: 0, failed: 0, total_matching: matchingProfiles.length })
        continue
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

      const toProcess = matchingProfiles.slice(0, maxPerSegment)

      for (const profile of toProcess) {
        const recipientEmail = String(profile.email).trim().toLowerCase()
        if (!recipientEmail) {
          skipped++
          continue
        }

        const { data: existingSend } = await adminClient
          .from('email_segment_sends')
          .select('id, status')
          .eq('segment_id', segment.id)
          .eq('template_id', template.id)
          .or(`user_id.eq.${profile.id},email.eq.${recipientEmail}`)
          .limit(1)
          .maybeSingle()

        if (existingSend) {
          skipped++
          continue
        }

        const { data: sendRow, error: insertError } = await adminClient
          .from('email_segment_sends')
          .insert({
            segment_id: segment.id,
            template_id: template.id,
            user_id: profile.id,
            email: recipientEmail,
            trigger,
            status: 'pending',
            metadata: {},
          })
          .select('id')
          .single()

        if (insertError || !sendRow) {
          skipped++
          continue
        }

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
          console.error('[trigger-inactivity-automations] sendMail failed:', e)
          emailStatus = 'failed'
          errorMessage = e instanceof Error ? e.message : 'Unknown error'
          failed++
        }

        if (emailStatus === 'delivered') {
          sent++
          totalProcessed++
        }

        await adminClient
          .from('email_segment_sends')
          .update({
            status: emailStatus,
            error_message: errorMessage,
            delivered_at: emailStatus === 'delivered' ? new Date().toISOString() : null,
            metadata: { message_id: messageId },
          })
          .eq('id', sendRow.id)

        await adminClient
          .from('email_logs')
          .insert({
            campaign_id: null,
            template_id: template.id,
            recipient_email: recipientEmail,
            recipient_user_id: profile.id,
            subject: finalSubject,
            email_type: template.type,
            status: emailStatus,
            error_message: errorMessage,
            sent_at: new Date().toISOString(),
            delivered_at: emailStatus === 'delivered' ? new Date().toISOString() : null,
            metadata: {
              segment_id: segment.id,
              segment_name: segment.name,
              automation_trigger: trigger,
              message_id: messageId,
            },
          })
      }

      const skippedCount = toProcess.length - sent - failed
      results.push({
        segment_id: segment.id,
        segment_name: segment.name,
        sent,
        skipped: skippedCount,
        failed,
        total_matching: matchingProfiles.length,
      })
    }

    return new Response(
      JSON.stringify({ success: true, processed: totalProcessed, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[trigger-inactivity-automations]', error)
    const message = error instanceof Error ? error.message : 'Failed to trigger inactivity automations'
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
