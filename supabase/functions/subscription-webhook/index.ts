import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!signature || !endpointSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing signature or webhook secret' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const body = await req.text()
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Received webhook event:', event.type)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, supabase, stripe)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, supabase, stripe)
        break
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, supabase, stripe)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, supabase: any, stripe: Stripe) {
  const { tierId, userId, billingCycle } = session.metadata || {}
  
  if (!tierId || !userId || !billingCycle) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  // Get subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
  
  // Create user subscription record
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      tier_id: tierId,
      status: 'active',
      billing_cycle: billingCycle,
      start_date: new Date().toISOString(),
      end_date: new Date(subscription.current_period_end * 1000).toISOString(),
      stripe_subscription_id: subscription.id,
    })

  if (error) {
    console.error('Error creating subscription record:', error)
  }

  // Initialize usage tracking
  const { error: usageError } = await supabase
    .from('usage_tracking')
    .upsert({
      user_id: userId,
      tier_id: tierId,
      current_products: 0,
      current_users: 1, // User themselves
      current_branches: 1, // Default branch
      orders_this_month: 0,
      last_reset_date: new Date().toISOString(),
    })

  if (usageError) {
    console.error('Error creating usage tracking record:', usageError)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  const { tierId, userId, billingCycle } = subscription.metadata || {}
  
  if (!tierId || !userId || !billingCycle) {
    console.error('Missing metadata in subscription creation:', subscription.id)
    return
  }

  // Update subscription record
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      tier_id: tierId,
      status: 'active',
      billing_cycle: billingCycle,
      start_date: new Date().toISOString(),
      end_date: new Date(subscription.current_period_end * 1000).toISOString(),
      stripe_subscription_id: subscription.id,
    })

  if (error) {
    console.error('Error updating subscription record:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  const { tierId, userId } = subscription.metadata || {}
  
  if (!tierId || !userId) {
    console.error('Missing metadata in subscription update:', subscription.id)
    return
  }

  // Update subscription record
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: subscription.status === 'active' ? 'active' : 'cancelled',
      end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription record:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  const { userId } = subscription.metadata || {}
  
  if (!userId) {
    console.error('Missing userId in subscription deletion:', subscription.id)
    return
  }

  // Cancel subscription in database
  const { error } = await supabase
    .from('user_subscriptions')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error cancelling subscription:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any, stripe: Stripe) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
  const { tierId, userId } = subscription.metadata || {}
  
  if (!tierId || !userId) {
    console.error('Missing metadata in invoice payment:', invoice.id)
    return
  }

  // Update subscription end date
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription after payment:', error)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, supabase: any, stripe: Stripe) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
  const { userId } = subscription.metadata || {}
  
  if (!userId) {
    console.error('Missing userId in invoice payment failure:', invoice.id)
    return
  }

  // Mark subscription as expired
  const { error } = await supabase
    .from('user_subscriptions')
    .update({ status: 'expired' })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error marking subscription as expired:', error)
  }
}
