import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Tables to wipe per user, in dependency order (children before parents).
// Mirrors the order in the delete-user function.
const TABLES_TO_DELETE = [
  // Analytics (leaf nodes referencing other tables)
  'analytics_api_usage',
  'analytics_api_keys',
  'analytics_export_jobs',
  'analytics_filters',
  'analytics_predictions',
  'analytics_reports',
  'analytics_queries',
  'analytics_cache',
  // Subscription & billing
  'user_subscriptions',
  'user_module_subscriptions',
  'usage_tracking',
  'invoices',
  'licenses',
  // Chat (messages before rooms)
  'chat_messages',
  'chats',
  // User-level data
  'branch_users',
  'notification_reads',
  'notifications',
  'feature_votes',
  'usage_overview',
  'company_types',
  'onboarding_answers',
  'scanner_settings',
  'user_feedback',
  // Orders & operational records
  'purchase_orders',
  'sales_orders',
  'stock_transfers',
  'cycle_counts',
  'customers',
  // Inventory
  'stock_transactions',
  'delivery_notes',
  'products',
  'categories',
  'suppliers',
  'warehouses',
  // Branches last (other tables reference them)
  'branches',
]

const INACTIVITY_DAYS = 30

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // Only allow invocation with the service role key (cron job / admin call)
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
    if (token !== supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const cutoffDate = new Date(Date.now() - INACTIVITY_DAYS * 24 * 60 * 60 * 1000).toISOString()

    // ── 1. Find inactive candidate profiles ─────────────────────────────────
    // A user is inactive when:
    //   a) last_login < cutoff, OR
    //   b) last_login IS NULL and the account was created before the cutoff
    //      (signed up but never returned)
    // We never touch admin accounts regardless of activity.
    const { data: candidateProfiles, error: profilesError } = await adminClient
      .from('profiles')
      .select('id, email, last_login, created_at, role, is_owner')
      .neq('role', 'admin')
      .or(
        `last_login.lt.${cutoffDate},and(last_login.is.null,created_at.lt.${cutoffDate})`,
      )

    if (profilesError) {
      console.error('[cleanup-inactive-users] Failed to fetch candidate profiles:', profilesError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch profiles' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (!candidateProfiles || candidateProfiles.length === 0) {
      console.log('[cleanup-inactive-users] No inactive candidates found.')
      return new Response(
        JSON.stringify({ success: true, deleted: 0, message: 'No inactive users found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const candidateIds = candidateProfiles.map((p) => p.id)

    // ── 2. Find which candidates have an active/trial subscription ───────────
    // "Paying user" = subscription with status 'active' or 'trial' that has
    // not yet expired (end_date is NULL meaning open-ended, or still in future).
    const { data: activeSubscriptions, error: subsError } = await adminClient
      .from('user_subscriptions')
      .select('user_id, status, end_date, stripe_subscription_id')
      .in('user_id', candidateIds)
      .in('status', ['active', 'trial'])

    if (subsError) {
      console.error('[cleanup-inactive-users] Failed to fetch subscriptions:', subsError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch subscriptions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const now = new Date()
    const protectedUserIds = new Set(
      (activeSubscriptions ?? [])
        .filter((sub) => {
          // Keep if end_date is null (open-ended) or still in the future
          if (!sub.end_date) return true
          return new Date(sub.end_date) > now
        })
        .map((sub) => sub.user_id),
    )

    const usersToDelete = candidateProfiles.filter((p) => !protectedUserIds.has(p.id))

    if (usersToDelete.length === 0) {
      console.log('[cleanup-inactive-users] All inactive candidates are paying users — nothing deleted.')
      return new Response(
        JSON.stringify({
          success: true,
          deleted: 0,
          skipped: candidateProfiles.length,
          message: 'All inactive users have active subscriptions',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    console.log(
      `[cleanup-inactive-users] Deleting ${usersToDelete.length} inactive accounts` +
        ` (${protectedUserIds.size} protected by active subscription)`,
    )

    // ── 3. Delete each user ──────────────────────────────────────────────────
    const results: Array<{ user_id: string; email: string; success: boolean; errors: string[] }> = []

    for (const profile of usersToDelete) {
      const userId = profile.id
      const errors: string[] = []

      // Delete from all tables in dependency order
      for (const table of TABLES_TO_DELETE) {
        try {
          const { error } = await adminClient
            .from(table)
            .delete()
            .eq('user_id', userId)

          if (error) {
            errors.push(`${table}: ${error.message}`)
            console.warn(`[cleanup-inactive-users] [${userId}] ${table}: ${error.message}`)
          }
        } catch (err) {
          // Table may not exist or have no matching rows — not fatal
          const msg = err instanceof Error ? err.message : 'unknown'
          errors.push(`${table}: ${msg}`)
        }
      }

      // Explicitly delete profile (FK cascade should handle it, but be explicit)
      try {
        const { error } = await adminClient.from('profiles').delete().eq('id', userId)
        if (error) errors.push(`profiles: ${error.message}`)
      } catch (err) {
        errors.push(`profiles: ${err instanceof Error ? err.message : 'unknown'}`)
      }

      // Remove the user from Supabase Auth — this is the definitive deletion
      const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

      if (authError) {
        console.error(`[cleanup-inactive-users] Failed to delete auth user ${userId}:`, authError)
        results.push({ user_id: userId, email: profile.email ?? '', success: false, errors: [...errors, `auth: ${authError.message}`] })
      } else {
        console.log(`[cleanup-inactive-users] Deleted user ${userId} (${profile.email})`)
        results.push({ user_id: userId, email: profile.email ?? '', success: true, errors })
      }
    }

    const deletedCount = results.filter((r) => r.success).length
    const failedCount = results.filter((r) => !r.success).length

    return new Response(
      JSON.stringify({
        success: true,
        deleted: deletedCount,
        failed: failedCount,
        skipped: protectedUserIds.size,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('[cleanup-inactive-users] Unexpected error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
