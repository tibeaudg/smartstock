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
    console.error('[create-email-campaign] Error fetching users:', error)
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

  // Product count filter would require additional query
  // For now, we'll skip it in the segment query
  // In production, you'd want to join with products table

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
    const {
      name,
      templateId,
      scheduledAt,
      recipientType, // 'all', 'segment', 'manual'
      segmentId,
      segmentFilters,
      recipientUserIds,
      recipientEmails,
    } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Campaign name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!templateId || typeof templateId !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Template ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify template exists
    const { data: template, error: templateError } = await adminClient
      .from('email_templates')
      .select('id, is_active')
      .eq('id', templateId)
      .single()

    if (templateError || !template) {
      return new Response(
        JSON.stringify({ success: false, error: 'Template not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!template.is_active) {
      return new Response(
        JSON.stringify({ success: false, error: 'Template is not active' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get recipients based on recipientType
    let recipients: Array<{ id: string; email: string }> = []

    if (recipientType === 'all') {
      const { data: allUsers, error: usersError } = await adminClient
        .from('profiles')
        .select('id, email')
        .not('email', 'is', null)

      if (usersError) {
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch users' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      recipients = (allUsers || []).filter((u: any) => u.email && u.email.trim())
    } else if (recipientType === 'segment') {
      if (segmentId) {
        const { data: segment, error: segmentError } = await adminClient
          .from('email_segments')
          .select('filters')
          .eq('id', segmentId)
          .single()

        if (segmentError || !segment) {
          return new Response(
            JSON.stringify({ success: false, error: 'Segment not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // It's valid for a segment to currently have 0 users.
        // We still persist the campaign so future users that match this segment
        // can be targeted via other flows (e.g. registration triggers or re-runs).
        recipients = await getUsersBySegment(adminClient, segment.filters as SegmentFilters)
      } else if (segmentFilters) {
        // Direct filters provided in the request (not via saved segment)
        recipients = await getUsersBySegment(adminClient, segmentFilters as SegmentFilters)
      } else {
        return new Response(
          JSON.stringify({ success: false, error: 'Segment ID or filters required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else if (recipientType === 'manual') {
      if (recipientUserIds && Array.isArray(recipientUserIds) && recipientUserIds.length > 0) {
        const { data: users, error: usersError } = await adminClient
          .from('profiles')
          .select('id, email')
          .in('id', recipientUserIds)

        if (usersError) {
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to fetch selected users' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        recipients = (users || []).filter((u: any) => u.email && u.email.trim())
      }

      if (recipientEmails && Array.isArray(recipientEmails) && recipientEmails.length > 0) {
        const emailRecipients = recipientEmails
          .filter((email: string) => typeof email === 'string' && email.trim())
          .map((email: string) => ({ id: '', email: email.trim().toLowerCase() }))
        
        recipients = [...recipients, ...emailRecipients]
      }

      // For regular campaigns (all/manual) we still require at least one recipient.
      // For segment-based campaigns it's valid to have 0 recipients at creation time;
      // the segment can match users later as data changes.
      if (recipientType !== 'segment' && recipients.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: 'No recipients selected' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid recipient type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Remove duplicates
    const uniqueRecipients = Array.from(
      new Map(recipients.map(r => [r.email, r])).values()
    )

    // For segment campaigns, it's allowed to end up with 0 unique recipients.
    // For other types we still require at least one valid recipient.
    if (recipientType !== 'segment' && uniqueRecipients.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No valid recipients found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create campaign
    const campaignData: any = {
      name: name.trim(),
      template_id: templateId,
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduled_at: scheduledAt || null,
      total_recipients: uniqueRecipients.length,
      created_by: user.id,
      recipient_type: recipientType,
      segment_id: recipientType === 'segment' ? (segmentId || null) : null,
      recipient_config: {
        recipient_type: recipientType,
        segment_id: recipientType === 'segment' ? segmentId : undefined,
        segment_filters: recipientType === 'segment' && segmentFilters ? segmentFilters : undefined,
        recipient_user_ids: recipientType === 'manual' ? recipientUserIds : undefined,
        recipient_emails: recipientType === 'manual' ? recipientEmails : undefined,
      },
    }

    const { data: campaign, error: campaignError } = await adminClient
      .from('email_campaigns')
      .insert(campaignData)
      .select()
      .single()

    if (campaignError || !campaign) {
      console.error('[create-email-campaign] Error creating campaign:', campaignError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create campaign' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create recipient records
    const recipientRecords = uniqueRecipients.map(recipient => ({
      campaign_id: campaign.id,
      user_id: recipient.id || null,
      email: recipient.email,
      status: 'pending',
      metadata: {},
    }))

    const { error: recipientsError } = await adminClient
      .from('email_recipients')
      .insert(recipientRecords)

    if (recipientsError) {
      console.error('[create-email-campaign] Error creating recipients:', recipientsError)
      // Don't fail the request, just log the error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        campaign: {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          total_recipients: campaign.total_recipients,
          scheduled_at: campaign.scheduled_at,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[create-email-campaign]', error)
    const message = error instanceof Error ? error.message : 'Failed to create campaign'
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
