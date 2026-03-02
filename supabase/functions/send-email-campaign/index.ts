import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

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

async function getUsersBySegment(
  adminClient: any,
  filters: SegmentFilters
): Promise<Array<{ id: string; email: string }>> {
  // Get all users first, then filter in memory for complex date logic
  let query = adminClient
    .from('profiles')
    .select('id, email, created_at, last_login')

  // Apply simple filters that can be done in SQL
  if (filters.plan && filters.plan.length > 0) {
    query = query.in('selected_plan', filters.plan)
  }

  if (filters.organization && filters.organization.length > 0) {
    query = query.in('organization_name', filters.organization)
  }

  if (filters.role && filters.role.length > 0) {
    query = query.in('role', filters.role)
  }

  if (filters.isOwner !== undefined) {
    query = query.eq('is_owner', filters.isOwner)
  }

  // Legacy date filter support
  if (filters.signupDateFrom) {
    query = query.gte('created_at', filters.signupDateFrom)
  }
  if (filters.signupDateTo) {
    query = query.lte('created_at', filters.signupDateTo)
  }
  if (filters.lastLoginFrom) {
    query = query.gte('last_login', filters.lastLoginFrom)
  }
  if (filters.lastLoginTo) {
    query = query.lte('last_login', filters.lastLoginTo)
  }

  const { data, error } = await query

  if (error) {
    console.error('[send-email-campaign] Error fetching users for segment:', error)
    return []
  }

  if (!data) return []

  let filteredUsers = data.filter((user: any) => user.email && user.email.trim())
  const now = new Date()

  // Apply new date-based filters
  if (filters.accountCreated) {
    const f = filters.accountCreated
    filteredUsers = filteredUsers.filter((user: any) => {
      if (!user.created_at) return false
      const createdDate = new Date(user.created_at)
      const hoursAgo = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60)
      const daysAgo = hoursAgo / 24

      if (f.operator === 'less_than' && f.days !== undefined) {
        // Support both days and fractional days (hours)
        if (f.days < 1) {
          return hoursAgo < (f.days * 24)
        }
        return daysAgo < f.days
      }
      if (f.operator === 'greater_than' && f.days !== undefined) {
        if (f.days < 1) {
          return hoursAgo > (f.days * 24)
        }
        return daysAgo > f.days
      }
      if (f.operator === 'equal' && f.days !== undefined) {
        if (f.days < 1) {
          return Math.abs(hoursAgo - (f.days * 24)) < 1 // Within 1 hour
        }
        return Math.floor(daysAgo) === f.days
      }
      if (f.operator === 'between' && f.daysFrom !== undefined && f.daysTo !== undefined) {
        const fromHours = f.daysFrom < 1 ? f.daysFrom * 24 : f.daysFrom * 24
        const toHours = f.daysTo < 1 ? f.daysTo * 24 : f.daysTo * 24
        return hoursAgo >= fromHours && hoursAgo <= toHours
      }
      // If filter is defined but operator doesn't match, exclude the user
      return false
    })
  }

  if (filters.lastLogin) {
    const f = filters.lastLogin
    filteredUsers = filteredUsers.filter((user: any) => {
      if (f.operator === 'never') return !user.last_login
      if (!user.last_login) return false

      const loginDate = new Date(user.last_login)
      const daysAgo = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24))

      if (f.operator === 'less_than' && f.days !== undefined) return daysAgo < f.days
      if (f.operator === 'greater_than' && f.days !== undefined) return daysAgo > f.days
      if (f.operator === 'equal' && f.days !== undefined) return daysAgo === f.days
      if (f.operator === 'between' && f.daysFrom !== undefined && f.daysTo !== undefined) {
        return daysAgo >= f.daysFrom && daysAgo <= f.daysTo
      }
      // If filter is defined but operator doesn't match, exclude the user
      return false
    })
  }

  if (filters.accountAge) {
    const f = filters.accountAge
    filteredUsers = filteredUsers.filter((user: any) => {
      if (!user.created_at) return false
      const createdDate = new Date(user.created_at)
      const daysOld = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

      if (f.operator === 'less_than' && f.days !== undefined) return daysOld < f.days
      if (f.operator === 'greater_than' && f.days !== undefined) return daysOld > f.days
      if (f.operator === 'equal' && f.days !== undefined) return daysOld === f.days
      if (f.operator === 'between' && f.daysFrom !== undefined && f.daysTo !== undefined) {
        return daysOld >= f.daysFrom && daysOld <= f.daysTo
      }
      // If filter is defined but operator doesn't match, exclude the user
      return false
    })
  }

  return filteredUsers.map((user: any) => ({ id: user.id, email: user.email }))
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
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

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const body = await req.json().catch(() => ({}))
    const { campaignId, batchSize = 10 } = body

    if (!campaignId || typeof campaignId !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Campaign ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get campaign
    const { data: campaign, error: campaignError } = await adminClient
      .from('email_campaigns')
      .select('*, email_templates(*)')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      return new Response(
        JSON.stringify({ success: false, error: 'Campaign not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (campaign.status === 'completed') {
      return new Response(
        JSON.stringify({ success: false, error: 'Campaign already completed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (campaign.status === 'sending') {
      return new Response(
        JSON.stringify({ success: false, error: 'Campaign is already being sent' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For segment-based campaigns, dynamically resolve the latest matching users
    // and create recipient rows for users who don't yet have a record for this campaign.
    if ((campaign as any).recipient_type === 'segment') {
      let segmentFilters: SegmentFilters | null = null

      // Prefer stored recipient_config filters
      if ((campaign as any).recipient_config?.segment_filters) {
        segmentFilters = (campaign as any).recipient_config.segment_filters as SegmentFilters
      } else if ((campaign as any).segment_id) {
        // Fallback: load filters from the email_segments table
        const { data: segment, error: segmentError } = await adminClient
          .from('email_segments')
          .select('filters')
          .eq('id', (campaign as any).segment_id)
          .single()

        if (segmentError) {
          console.error('[send-email-campaign] Error loading segment filters:', segmentError)
        } else if (segment?.filters) {
          segmentFilters = segment.filters as SegmentFilters
        }
      }

      if (segmentFilters) {
        // Get all currently matching users
        const segmentRecipients = await getUsersBySegment(adminClient, segmentFilters)

        if (segmentRecipients.length > 0) {
          // Load existing recipients for this campaign to avoid duplicates
          const { data: existingRecipients, error: existingError } = await adminClient
            .from('email_recipients')
            .select('user_id, email')
            .eq('campaign_id', campaignId)

          if (existingError) {
            console.error('[send-email-campaign] Error loading existing recipients:', existingError)
          } else {
            const existingEmails = new Set<string>()
            const existingUserIds = new Set<string>()

            for (const rec of existingRecipients || []) {
              if (rec.email) existingEmails.add((rec.email as string).toLowerCase())
              if (rec.user_id) existingUserIds.add(rec.user_id as string)
            }

            const newRecipients = segmentRecipients.filter(r => {
              const emailLower = r.email.toLowerCase()
              // Avoid duplicates by either user_id or email
              return !existingEmails.has(emailLower) && !existingUserIds.has(r.id)
            })

            if (newRecipients.length > 0) {
              const recipientRecords = newRecipients.map(recipient => ({
                campaign_id: campaignId,
                user_id: recipient.id || null,
                email: recipient.email,
                status: 'pending',
                metadata: {},
              }))

              const { error: insertError } = await adminClient
                .from('email_recipients')
                .insert(recipientRecords)

              if (insertError) {
                console.error('[send-email-campaign] Error inserting new segment recipients:', insertError)
              } else {
                // Update total_recipients to reflect the expanded audience
                await adminClient
                  .from('email_campaigns')
                  .update({
                    total_recipients: (campaign.total_recipients || 0) + newRecipients.length,
                  })
                  .eq('id', campaignId)
              }
            }
          }
        }
      }
    }

    // Update campaign status to sending
    await adminClient
      .from('email_campaigns')
      .update({ 
        status: 'sending',
        sent_at: campaign.sent_at || new Date().toISOString(),
      })
      .eq('id', campaignId)

    // Get pending recipients
    const { data: recipients, error: recipientsError } = await adminClient
      .from('email_recipients')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('status', 'pending')
      .limit(batchSize)

    if (recipientsError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch recipients' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!recipients || recipients.length === 0) {
      // No more recipients, mark campaign as completed
      await adminClient
        .from('email_campaigns')
        .update({ status: 'completed' })
        .eq('id', campaignId)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Campaign completed',
          sent: 0,
          remaining: 0,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const template = campaign.email_templates
    if (!template) {
      return new Response(
        JSON.stringify({ success: false, error: 'Template not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user data for template variables
    const userIds = recipients
      .filter(r => r.user_id)
      .map(r => r.user_id)

    let userData: Record<string, any> = {}
    if (userIds.length > 0) {
      const { data: users } = await adminClient
        .from('profiles')
        .select('id, email, first_name, last_name, organization_name')
        .in('id', userIds)

      if (users) {
        userData = users.reduce((acc: any, u: any) => {
          acc[u.id] = u
          return acc
        }, {})
      }
    }

    // Send emails via the send-email function
    const sendEmailUrl = `${supabaseUrl}/functions/v1/send-email`
    let sentCount = 0
    let deliveredCount = 0
    let failedCount = 0

    for (const recipient of recipients) {
      const user = recipient.user_id ? userData[recipient.user_id] : null
      const variables: Record<string, string> = {
        user_email: recipient.email,
        user_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || recipient.email : recipient.email,
        organization_name: user?.organization_name || '',
      }

      const subject = template.subject.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        return variables[key] || match
      })

      const htmlBody = template.html_body.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        return variables[key] || match
      })

      try {
        const response = await fetch(sendEmailUrl, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toEmail: recipient.email,
            subject,
            htmlBody,
            textBody: template.text_body,
            emailType: template.type,
            templateId: template.id,
            campaignId: campaign.id,
            recipientUserId: recipient.user_id,
            variables,
          }),
        })

        const result = await response.json()

        if (result.success && result.status === 'delivered') {
          await adminClient
            .from('email_recipients')
            .update({ 
              status: 'delivered',
              sent_at: new Date().toISOString(),
              delivered_at: new Date().toISOString(),
            })
            .eq('id', recipient.id)

          sentCount++
          deliveredCount++
        } else {
          await adminClient
            .from('email_recipients')
            .update({ 
              status: 'failed',
              sent_at: new Date().toISOString(),
            })
            .eq('id', recipient.id)

          sentCount++
          failedCount++
        }
      } catch (error) {
        console.error(`[send-email-campaign] Error sending to ${recipient.email}:`, error)
        await adminClient
          .from('email_recipients')
          .update({ 
            status: 'failed',
            sent_at: new Date().toISOString(),
          })
          .eq('id', recipient.id)

        sentCount++
        failedCount++
      }
    }

    // Update campaign stats
    const { data: currentCampaign } = await adminClient
      .from('email_campaigns')
      .select('sent_count, delivered_count, failed_count')
      .eq('id', campaignId)
      .single()

    await adminClient
      .from('email_campaigns')
      .update({
        sent_count: (currentCampaign?.sent_count || 0) + sentCount,
        delivered_count: (currentCampaign?.delivered_count || 0) + deliveredCount,
        failed_count: (currentCampaign?.failed_count || 0) + failedCount,
      })
      .eq('id', campaignId)

    // Check if there are more recipients
    const { count: remainingCount } = await adminClient
      .from('email_recipients')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaignId)
      .eq('status', 'pending')

    if (remainingCount === 0) {
      await adminClient
        .from('email_campaigns')
        .update({ status: 'completed' })
        .eq('id', campaignId)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Batch sent',
        sent: sentCount,
        delivered: deliveredCount,
        failed: failedCount,
        remaining: remainingCount || 0,
        completed: remainingCount === 0,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[send-email-campaign]', error)
    const message = error instanceof Error ? error.message : 'Failed to send campaign'
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
