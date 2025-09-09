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

    // Get module details from database - try slug first, fallback to title, then direct ID
    let module, moduleError;
    
    try {
      const result = await supabase
        .from('modules')
        .select('*')
        .eq('slug', moduleId)
        .maybeSingle()
      
      module = result.data
      moduleError = result.error
    } catch (err) {
      // If slug column doesn't exist, try to find by title
      try {
        const titleMap: Record<string, string> = {
          'delivery-notes': 'Leveringsbonnen Beheer',
          'scanning': 'Barcode Scanner',
          'advanced-analytics': 'Geavanceerde Analytics',
          'auto-reorder': 'Automatische Herbestelling',
          'ecommerce-integration': 'E-commerce Integratie',
          'premium-support': 'Premium Support'
        };
        
        const title = titleMap[moduleId];
        if (title) {
          const result = await supabase
            .from('modules')
            .select('*')
            .eq('title', title)
            .maybeSingle()
          
          module = result.data
          moduleError = result.error
        } else {
          // Try hardcoded UUIDs as fallback
          const hardcodedIds: Record<string, string> = {
            'delivery-notes': '550e8400-e29b-41d4-a716-446655440000',
            'scanning': '550e8400-e29b-41d4-a716-446655440005',
            'advanced-analytics': '550e8400-e29b-41d4-a716-446655440001',
            'auto-reorder': '550e8400-e29b-41d4-a716-446655440002',
            'ecommerce-integration': '550e8400-e29b-41d4-a716-446655440003',
            'premium-support': '550e8400-e29b-41d4-a716-446655440004'
          };
          
          const hardcodedId = hardcodedIds[moduleId];
          if (hardcodedId) {
            const result = await supabase
              .from('modules')
              .select('*')
              .eq('id', hardcodedId)
              .maybeSingle()
            
            module = result.data
            moduleError = result.error
          } else {
            // Try direct ID lookup as last resort
            const result = await supabase
              .from('modules')
              .select('*')
              .eq('id', moduleId)
              .maybeSingle()
            
            module = result.data
            moduleError = result.error
          }
        }
      } catch (titleErr) {
        // Try direct ID lookup as last resort
        const result = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .maybeSingle()
        
        module = result.data
        moduleError = result.error
      }
    }

    if (moduleError) {
      console.error('Module error:', moduleError)
      console.error('ModuleId searched:', moduleId)
      return new Response(
        JSON.stringify({ 
          error: `Module error: ${moduleError.message}`,
          moduleId: moduleId,
          details: moduleError
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!module) {
      console.error('Module not found for moduleId:', moduleId)
      return new Response(
        JSON.stringify({ 
          error: 'Module not found',
          moduleId: moduleId,
          searchedMethods: ['slug', 'title', 'hardcoded-id', 'direct-id']
        }),
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

    // Calculate price - only monthly pricing for delivery-notes
    const price = module.price_monthly
    const interval = 'month'

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
