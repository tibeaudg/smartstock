import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe } from '../_shared/stripe.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

interface LicenseInfo {
  id: string;
  license_type: string;
  stripe_customer_id: string | null;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planType, currentLicense, returnUrl } = await req.json()

    // Get auth user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) throw new Error('Unauthorized')

    // Get or create Stripe customer
    let customerId = currentLicense?.stripe_customer_id

    if (!customerId) {
      // Get user profile info
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', user.id)
        .single()

      // Create new customer
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.full_name,
        metadata: {
          supabaseUid: user.id
        }
      })
      customerId = customer.id

      // Update license with customer ID
      await supabase
        .from('licenses')
        .update({ stripe_customer_id: customerId })
        .eq('admin_user_id', user.id)
        .eq('is_active', true)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: planType === 'starter' ? Deno.env.get('STRIPE_PRICE_STARTER') :
                 planType === 'business' ? Deno.env.get('STRIPE_PRICE_BUSINESS') :
                 Deno.env.get('STRIPE_PRICE_ENTERPRISE'),
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${returnUrl}?success=true`,
      cancel_url: `${returnUrl}?canceled=true`,
      metadata: {
        userId: user.id,
        planType
      }
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
