import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the webhook signature
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('Missing stripe-signature header', { status: 400 })
    }

    // Get the raw body
    const body = await req.text()
    
    // Verify the webhook signature
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not set')
      return new Response('Webhook secret not configured', { status: 500 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Invalid signature', { status: 400 })
    }

    console.log('Received webhook event:', event.type)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
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

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, supabase: any) {
  console.log('Processing checkout session completed:', session.id)
  
  const { moduleId, userId, billingCycle } = session.metadata || {}
  
  if (!moduleId || !userId) {
    console.error('Missing metadata in checkout session:', session.metadata)
    return
  }

  // Get the actual module ID - try slug first, fallback to title, then direct ID
  let actualModuleId = moduleId;
  
  try {
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('id')
      .eq('slug', moduleId)
      .single()

    if (!moduleError && module) {
      actualModuleId = module.id
    }
  } catch (err) {
    // If slug column doesn't exist, try to find by title
    try {
      const titleMap: Record<string, string> = {
        'delivery-notes': 'Leveringsbonnen Beheer',
        'advanced-analytics': 'Geavanceerde Analytics',
        'auto-reorder': 'Automatische Herbestelling',
        'ecommerce-integration': 'E-commerce Integratie',
        'premium-support': 'Premium Support'
      };
      
      const title = titleMap[moduleId];
      if (title) {
        const { data: module, error: moduleError } = await supabase
          .from('modules')
          .select('id')
          .eq('title', title)
          .single()

        if (!moduleError && module) {
          actualModuleId = module.id
        }
      }
    } catch (titleErr) {
      // Try hardcoded UUIDs as fallback
      const hardcodedIds: Record<string, string> = {
        'delivery-notes': '550e8400-e29b-41d4-a716-446655440000',
        'advanced-analytics': '550e8400-e29b-41d4-a716-446655440001',
        'auto-reorder': '550e8400-e29b-41d4-a716-446655440002',
        'ecommerce-integration': '550e8400-e29b-41d4-a716-446655440003',
        'premium-support': '550e8400-e29b-41d4-a716-446655440004'
      };
      
      const hardcodedId = hardcodedIds[moduleId];
      if (hardcodedId) {
        actualModuleId = hardcodedId;
        console.log('Using hardcoded UUID for module:', moduleId, actualModuleId);
      } else {
        console.log('No hardcoded UUID found, using moduleId directly:', moduleId);
      }
    }
  }

  // Get subscription details
  const subscription = session.subscription as string
  if (!subscription) {
    console.error('No subscription found in checkout session')
    return
  }

  // Calculate end date - only monthly billing for delivery-notes
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + 1)

  // Create or update user subscription
  const { error } = await supabase
    .from('user_module_subscriptions')
    .upsert({
      user_id: userId,
      module_id: actualModuleId,
      stripe_subscription_id: subscription,
      stripe_customer_id: session.customer,
      status: 'active',
      billing_cycle: billingCycle,
      start_date: new Date().toISOString(),
      end_date: endDate.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error creating subscription:', error)
    throw error
  }

  console.log(`Subscription created for user ${userId}, module ${actualModuleId} (slug: ${moduleId})`)
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing invoice payment succeeded:', invoice.id)
  
  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  // Update subscription status to active
  const { error } = await supabase
    .from('user_module_subscriptions')
    .update({ 
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId)

  if (error) {
    console.error('Error updating subscription status:', error)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing invoice payment failed:', invoice.id)
  
  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  // Update subscription status to expired
  const { error } = await supabase
    .from('user_module_subscriptions')
    .update({ 
      status: 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId)

  if (error) {
    console.error('Error updating subscription status:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription updated:', subscription.id)
  
  const status = subscription.status === 'active' ? 'active' : 'expired'
  
  const { error } = await supabase
    .from('user_module_subscriptions')
    .update({ 
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription deleted:', subscription.id)
  
  const { error } = await supabase
    .from('user_module_subscriptions')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error cancelling subscription:', error)
  }
}
