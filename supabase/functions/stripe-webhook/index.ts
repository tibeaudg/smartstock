import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe } from '../_shared/stripe.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') || ''
    )

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const { userId, planType } = session.metadata

        if (!userId || !planType) {
          throw new Error('Missing metadata')
        }

        // Get license limits
        const { data: limits } = await supabase.rpc('get_license_limits', {
          license_type: planType
        })

        if (!limits) {
          throw new Error('Could not get license limits')
        }

        // Update license
        await supabase
          .from('licenses')
          .update({
            license_type: planType,
            max_products: limits.max_products,
            base_price: limits.base_price,
            stripe_subscription_id: session.subscription,
            updated_at: new Date().toISOString()
          })
          .eq('admin_user_id', userId)
          .eq('is_active', true)

        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        
        // Record successful payment in billing history
        await supabase
          .from('billing_history')
          .insert({
            admin_user_id: invoice.customer.metadata.supabaseUid,
            amount: invoice.amount_paid / 100, // Convert from cents
            currency: invoice.currency,
            stripe_payment_intent_id: invoice.payment_intent,
            status: 'succeeded',
            description: invoice.description || 'Monthly subscription payment'
          })
        
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        
        // Record failed payment and notify user
        await supabase
          .from('billing_history')
          .insert({
            admin_user_id: invoice.customer.metadata.supabaseUid,
            amount: invoice.amount_due / 100,
            currency: invoice.currency,
            stripe_payment_intent_id: invoice.payment_intent,
            status: 'failed',
            description: 'Failed payment attempt'
          })
        
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        // Downgrade to free plan
        await supabase
          .from('licenses')
          .update({
            license_type: 'free',
            stripe_subscription_id: null,
            max_products: 30,
            base_price: 0,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)
        
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
