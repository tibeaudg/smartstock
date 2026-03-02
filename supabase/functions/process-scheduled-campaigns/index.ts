import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Get scheduled campaigns that are due
    const { data: scheduledCampaigns, error: checkError } = await adminClient
      .rpc('check_and_send_scheduled_campaigns')

    if (checkError) {
      console.error('[process-scheduled-campaigns] Error checking campaigns:', checkError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to check scheduled campaigns' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!scheduledCampaigns || scheduledCampaigns.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No scheduled campaigns to process',
          processed: 0 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let processed = 0
    const errors: string[] = []

    // Process each scheduled campaign
    for (const campaign of scheduledCampaigns) {
      try {
        // Invoke the send-email-campaign function
        const { data: sendData, error: sendError } = await adminClient.functions.invoke('send-email-campaign', {
          body: { campaignId: campaign.campaign_id, batchSize: 10 },
        })

        if (sendError || !sendData?.success) {
          console.error(`[process-scheduled-campaigns] Failed to send campaign ${campaign.campaign_id}:`, sendError || sendData?.error)
          errors.push(`Campaign ${campaign.campaign_name}: ${sendError?.message || sendData?.error || 'Unknown error'}`)
        } else {
          processed++
        }
      } catch (error) {
        console.error(`[process-scheduled-campaigns] Error processing campaign ${campaign.campaign_id}:`, error)
        errors.push(`Campaign ${campaign.campaign_name}: ${error.message}`)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed,
        total: scheduledCampaigns.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[process-scheduled-campaigns]', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
