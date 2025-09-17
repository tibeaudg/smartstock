import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16'
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { tierId, billingCycle, userId, successUrl, cancelUrl } = await req.json();

    if (!tierId || !billingCycle || !userId || !successUrl || !cancelUrl) {
      return new Response(JSON.stringify({
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Get tier details from database by name
    const { data: tier, error: tierError } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('name', tierId)
      .maybeSingle();

    if (tierError || !tier) {
      console.error('Tier not found or database error:', tierError);
      return new Response(JSON.stringify({
        error: `Tier not found for id: ${tierId}`
      }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userError || !user) {
      console.error('User not found or database error:', userError);
      return new Response(JSON.stringify({
        error: 'User not found'
      }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Create or get Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: userId
        }
      });
      customerId = customer.id;
      
      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customerId
        })
        .eq('id', userId);
    }

    // Determine price based on billing cycle
    const priceAmount = billingCycle === 'yearly' ? tier.price_yearly : tier.price_monthly;
    
    if (priceAmount === null || priceAmount === undefined) {
      return new Response(JSON.stringify({
        error: `Price for ${billingCycle} cycle not found for this tier.`
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Create Stripe product and price
    const productId = `prod_${tier.name}`;
    const priceId = `price_${tier.name}_${billingCycle}`;
    
    let stripePrice;
    try {
      stripePrice = await stripe.prices.retrieve(priceId);
    } catch (error) {
      // Product doesn't exist, create it
      let product;
      try {
        product = await stripe.products.retrieve(productId);
      } catch (productError) {
        product = await stripe.products.create({
          id: productId,
          name: tier.display_name,
          description: tier.description,
          metadata: {
            tierId: tier.id,
            tierName: tier.name
          }
        });
      }

      // Create price
      stripePrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(priceAmount * 100), // Convert to cents
        currency: 'eur',
        recurring: {
          interval: billingCycle === 'yearly' ? 'year' : 'month'
        },
        metadata: {
          tierId: tier.id,
          tierName: tier.name,
          billingCycle: billingCycle
        }
      });
    }

    // Create checkout session with 14-day trial
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tierId: tier.id,
        userId: userId,
        billingCycle: billingCycle
      },
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          tierId: tier.id,
          userId: userId,
          billingCycle: billingCycle
        }
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto'
      }
    });

    return new Response(JSON.stringify({
      sessionId: session.id,
      url: session.url
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param
    });
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message,
      type: error.type,
      code: error.code
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
