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
    const { tierId, billingCycle, userId, successUrl, cancelUrl } = await req.json()

    // Validate required fields
    if (!tierId || !billingCycle || !userId || !successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    // Get pricing tier details from database
    const { data: tier, error: tierError } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('id', tierId)
      .single()

    if (tierError || !tier) {
      return new Response(
        JSON.stringify({ error: 'Pricing tier not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Calculate price
    const price = billingCycle === 'monthly' ? tier.price_monthly : tier.price_yearly
    const interval = billingCycle === 'monthly' ? 'month' : 'year'

    // Create or get Stripe customer
    let customerId = user.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: userId,
        },
      })
      customerId = customer.id

      // Update user with Stripe customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Create Stripe price if it doesn't exist
    const priceId = `price_${tier.name}_${billingCycle}`
    let stripePrice
    
    try {
      stripePrice = await stripe.prices.retrieve(priceId)
    } catch (error) {
      // Price doesn't exist, create it
      stripePrice = await stripe.prices.create({
        unit_amount: Math.round(price * 100), // Convert to cents
        currency: 'eur',
        recurring: {
          interval: interval as 'month' | 'year',
        },
        product_data: {
          name: `${tier.display_name} Plan`,
          description: tier.description,
          metadata: {
            tierId: tier.id,
            billingCycle: billingCycle,
          },
        },
        metadata: {
          tierId: tier.id,
          billingCycle: billingCycle,
        },
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tierId: tier.id,
        userId: userId,
        billingCycle: billingCycle,
      },
      subscription_data: {
        metadata: {
          tierId: tier.id,
          userId: userId,
          billingCycle: billingCycle,
        },
      },
    })

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error creating subscription checkout session:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
