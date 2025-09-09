import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { moduleId, billingCycle, userId, successUrl, cancelUrl } = await req.json()

    // Validate required fields
    if (!moduleId || !billingCycle || !userId || !successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get module details from database
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('*')
      .eq('id', moduleId)
      .single()

    if (moduleError) {
      console.error('Module error:', moduleError)
      return new Response(
        JSON.stringify({ error: `Module error: ${moduleError.message}` }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!module) {
      return new Response(
        JSON.stringify({ error: 'Module not found' }),
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
    const price = billingCycle === 'monthly' ? module.price_monthly : module.price_yearly
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

    // Create Stripe product and price if they don't exist
    const productId = `prod_${module.id}`
    const priceId = `price_${module.id}_${billingCycle}`
    let stripePrice
    
    try {
      stripePrice = await stripe.prices.retrieve(priceId)
    } catch (error) {
      // Price doesn't exist, create product first, then price
      let product
      try {
        product = await stripe.products.retrieve(productId)
      } catch (productError) {
        // Product doesn't exist, create it
        product = await stripe.products.create({
          id: productId,
          name: module.title,
          metadata: {
            moduleId: module.id,
            description: module.description,
          },
        })
      }
      
      // Create price for the product
      stripePrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(price * 100), // Convert to cents
        currency: 'eur',
        recurring: {
          interval: interval as 'month' | 'year',
        },
        metadata: {
          moduleId: module.id,
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
        moduleId: module.id,
        userId: userId,
        billingCycle: billingCycle,
      },
      subscription_data: {
        metadata: {
          moduleId: module.id,
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
    console.error('Error creating checkout session:', error)
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
    })
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        type: error.type,
        code: error.code,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
