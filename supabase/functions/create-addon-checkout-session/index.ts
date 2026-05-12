import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=denonext'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type AddonType = 'extra_branch' | 'extra_user'

function getPriceIdForAddon(addonType: AddonType): string | undefined {
  switch (addonType) {
    case 'extra_branch': return Deno.env.get('STRIPE_PRICE_EXTRA_BRANCH')
    case 'extra_user':   return Deno.env.get('STRIPE_PRICE_EXTRA_USER')
  }
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
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const siteUrl         = Deno.env.get('SITE_URL') || 'https://www.stockflowsystems.com'

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let addonType: AddonType = 'extra_branch'
    let quantity = 1
    try {
      const body = await req.json()
      if (body?.addonType === 'extra_user') addonType = 'extra_user'
      if (typeof body?.quantity === 'number' && body.quantity > 0) quantity = body.quantity
    } catch { /* use defaults */ }

    const priceId = getPriceIdForAddon(addonType)
    if (!priceId) {
      const envKey = addonType === 'extra_branch' ? 'STRIPE_PRICE_EXTRA_BRANCH' : 'STRIPE_PRICE_EXTRA_USER'
      return new Response(
        JSON.stringify({ error: `Stripe add-on price not configured. Set ${envKey} in function secrets.` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!priceId.startsWith('price_')) {
      return new Response(
        JSON.stringify({ error: `Invalid price ID format for addon ${addonType}. Must start with 'price_'.` }),
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

    const addonLabel = addonType === 'extra_branch' ? 'extra branch' : 'extra user'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity }],
      success_url: `${siteUrl}/dashboard/settings/billing?success=true`,
      cancel_url:  `${siteUrl}/dashboard/settings/billing?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        addon_type: addonType,
        quantity: String(quantity),
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          addon_type: addonType,
          plan_name: addonLabel,
        },
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('[create-addon-checkout-session]', err)
    const message = err instanceof Error ? err.message : 'Failed to create checkout session'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
