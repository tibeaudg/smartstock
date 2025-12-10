import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header to verify the user is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create a client with the user's token to verify their identity
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the request body
    const body = await req.json()
    const { user_id } = body

    // Verify the user is deleting their own account or is an admin/owner
    if (user_id !== user.id) {
      // Check if the user is an admin or owner
      const { data: profile } = await userClient
        .from('profiles')
        .select('role, is_owner')
        .eq('id', user.id)
        .single()

      const isAdmin = profile?.role === 'admin'
      const isOwner = profile?.is_owner === true

      if (!isAdmin && !isOwner) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: You can only delete your own account' }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Create admin client with service role key to delete the user
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Delete from related tables in order (before deleting auth user)
    // This ensures all foreign key constraints are satisfied
    // Order matters: delete child records before parent records
    const tablesToDelete = [
      // Analytics tables (delete first as they might reference other tables)
      'analytics_api_usage',
      'analytics_api_keys',
      'analytics_export_jobs',
      'analytics_filters',
      'analytics_predictions',
      'analytics_reports',
      'analytics_queries',
      'analytics_cache',
      // Subscription and billing
      'user_subscriptions',
      'user_module_subscriptions', // In case it still exists
      'usage_tracking',
      'invoices',
      'licenses',
      // Chat tables (delete messages before chats)
      'chat_messages',
      'chats',
      // User data
      'branch_users',
      'notification_reads',
      'notifications',
      'feature_votes',
      'usage_overview',
      'company_types',
      'onboarding_answers',
      'scanner_settings',
      'user_feedback',
      // Inventory and products (delete transactions before products)
      'stock_transactions',
      'delivery_notes',
      'products',
      'categories',
      'suppliers',
      // Branches (delete last as other tables might reference them)
      'branches', // Delete branches owned by user
    ]

    // Delete from each table
    const deletionErrors: string[] = []
    for (const table of tablesToDelete) {
      try {
        const { error } = await adminClient
          .from(table)
          .delete()
          .eq('user_id', user_id)
        
        if (error) {
          // Log but continue - some tables might not exist or might be empty
          const errorMsg = `Could not delete from ${table}: ${error.message}`
          console.log(`Note: ${errorMsg}`)
          deletionErrors.push(errorMsg)
        } else {
          console.log(`Successfully processed ${table}`)
        }
      } catch (err) {
        // Table might not exist, continue
        const errorMsg = `Table ${table} might not exist or has no matching records: ${err instanceof Error ? err.message : 'Unknown error'}`
        console.log(`Note: ${errorMsg}`)
        deletionErrors.push(errorMsg)
      }
    }

    // Also delete from profiles explicitly (though it should cascade)
    try {
      const { error: profileError } = await adminClient
        .from('profiles')
        .delete()
        .eq('id', user_id)
      
      if (profileError) {
        const errorMsg = `Could not delete from profiles: ${profileError.message}`
        console.log(`Note: ${errorMsg}`)
        deletionErrors.push(errorMsg)
      } else {
        console.log('Successfully deleted from profiles')
      }
    } catch (err) {
      const errorMsg = `Could not delete from profiles: ${err instanceof Error ? err.message : 'Unknown error'}`
      console.log(`Note: ${errorMsg}`)
      deletionErrors.push(errorMsg)
    }

    // Finally, delete the user from auth.users
    // This should work now that all related data is deleted
    console.log(`Attempting to delete user ${user_id} from auth.users`)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user_id)

    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError)
      console.error('Deletion errors from tables:', deletionErrors)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to delete user account',
          details: deleteError.message,
          code: deleteError.status || deleteError.code || 'unknown',
          tableErrors: deletionErrors.length > 0 ? deletionErrors : undefined
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Successfully deleted user ${user_id}`)

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Delete user error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

