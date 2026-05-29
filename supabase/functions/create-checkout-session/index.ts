import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=denonext'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Active plans available for new subscriptions (monthly only)
const VALID_PLANS = ['professional', 'business', 'enterprise'] as const
type PlanName = (typeof VALID_PLANS)[number]

function getPriceIdForPlan(planName: PlanName): string | undefined {
  switch (planName) {
    case 'professional': return Deno.env.get('STRIPE_PRICE_PROFESSIONAL')
    case 'business':     return Deno.env.get('STRIPE_PRICE_BUSINESS')
    case 'enterprise':   return Deno.env.get('STRIPE_PRICE_ENTERPRISE')
  }
}

type ExistingSubscription = {
  trial_end_date?: string | null
  status?: string | null
  stripe_subscription_id?: string | null
  trial_stage_override?: string | null
}

/** User already used their free trial — charge immediately (override Stripe price default trial too). */
function shouldSkipTrial(sub: ExistingSubscription | null): boolean {
  if (!sub) return false
  if (sub.trial_stage_override === 'trial_expired') return true
  if (sub.trial_end_date && new Date(sub.trial_end_date).getTime() <= Date.now()) return true
  if (['expired', 'cancelled'].includes(sub.status ?? '')) return true
  return false
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl     = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const siteUrl         = Deno.env.get('SITE_URL') || 'https://www.stockflowsystems.com'

    if (!stripeSecretKey) {
      console.error('Missing STRIPE_SECRET_KEY')
      return new Response(
        JSON.stringify({ error: 'Stripe not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse plan from request body; default to professional
    let planName: PlanName = 'professional'
    try {
      const body = await req.json()
      if (body?.planName && VALID_PLANS.includes(body.planName)) {
        planName = body.planName as PlanName
      }
    } catch {
      // empty or invalid body — use default
    }

    const priceId = getPriceIdForPlan(planName)
    if (!priceId) {
      console.error('No Stripe price ID configured for plan:', planName)
      return new Response(
        JSON.stringify({ error: `Stripe price not configured for plan: ${planName}. Set STRIPE_PRICE_${planName.toUpperCase()} in function secrets.` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate that priceId looks like a valid Stripe price ID (starts with 'price_')
    if (!priceId.startsWith('price_')) {
      console.error('Invalid Stripe price ID format:', priceId)
      return new Response(
        JSON.stringify({ error: `Invalid price ID format for plan: ${planName}. Price ID must start with 'price_'. Check STRIPE_PRICE_${planName.toUpperCase()} secret.` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
    )

    if (userError || !user?.email) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-11-20.acacia' })

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    const adminSupabase = supabaseServiceKey
      ? createClient(supabaseUrl, supabaseServiceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        })
      : supabase

    const { data: existingSub } = await adminSupabase
      .from('user_subscriptions')
      .select('trial_end_date, status, stripe_subscription_id, trial_stage_override')
      .eq('user_id', user.id)
      .maybeSingle()

    const skipTrial = shouldSkipTrial(existingSub)
    console.log('[create-checkout-session] trial decision', {
      userId: user.id,
      skipTrial,
      status: existingSub?.status ?? null,
      trialEndDate: existingSub?.trial_end_date ?? null,
      trialStageOverride: existingSub?.trial_stage_override ?? null,
    })

    let customerId = profile?.stripe_customer_id as string | undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const subscriptionMetadata = {
      supabase_user_id: user.id,
      plan_name: planName,
    }

    // Stripe rejects trial_period_days: 0 (min is 1). For returning users, build the
    // line item from price_data so we don't inherit the catalog Price's default trial.
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
    let subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData

    if (skipTrial) {
      const price = await stripe.prices.retrieve(priceId)
      if (!price.unit_amount || !price.recurring?.interval) {
        throw new Error('Configured Stripe price is missing amount or recurring interval')
      }
      lineItems = [{
        price_data: {
          currency: price.currency,
          unit_amount: price.unit_amount,
          product: typeof price.product === 'string' ? price.product : price.product.id,
          recurring: { interval: price.recurring.interval },
        },
        quantity: 1,
      }]
      subscriptionData = { metadata: subscriptionMetadata }
    } else {
      lineItems = [{ price: priceId, quantity: 1 }]
      subscriptionData = {
        trial_period_days: 14,
        metadata: subscriptionMetadata,
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: lineItems,
      success_url: `${siteUrl}/dashboard/settings/billing?success=true`,
      cancel_url:  `${siteUrl}/dashboard/settings/billing?canceled=true`,
      metadata: { supabase_user_id: user.id },
      subscription_data: subscriptionData,
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('[create-checkout-session]', err)
    const message = err instanceof Error ? err.message : 'Failed to create checkout session'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
