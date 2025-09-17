import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const eventHandlers = {
  'checkout.session.completed': handleCheckoutSessionCompleted,
  'invoice.payment_succeeded': handleInvoicePaymentSucceeded,
  'invoice.payment_failed': handleInvoicePaymentFailed,
  'customer.subscription.updated': handleSubscriptionUpdated,
  'customer.subscription.deleted': handleSubscriptionDeleted
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16'
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Missing stripe-signature header', {
        status: 400
      });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not set');
      return new Response('Webhook secret not configured', {
        status: 500
      });
    }

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response('Invalid signature', {
        status: 400
      });
    }

    console.log(`Received webhook event: ${event.type}`);

    const handler = eventHandlers[event.type];
    if (handler) {
      await handler(event.data.object, supabase, stripe);
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({
      received: true
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});

// --- Helper Functions ---

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, supabase: any, stripe: Stripe) {
  console.log('Processing checkout session completed:', session.id);
  
  const { tierId, userId, billingCycle } = session.metadata || {};
  
  if (!tierId || !userId || !billingCycle) {
    console.error('Missing required metadata in checkout session:', session.metadata);
    throw new Error('Missing required metadata.');
  }

  const subscription = session.subscription;
  if (!subscription) {
    console.error('No subscription found in checkout session for ' + session.id);
    return;
  }

  // Get subscription details from Stripe
  const stripeSubscription = await stripe.subscriptions.retrieve(subscription as string);
  
  // Calculate end date based on billing cycle
  const endDate = new Date();
  if (billingCycle === 'yearly') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  // Get the actual tier ID from the database by name
  const { data: tier, error: tierError } = await supabase
    .from('pricing_tiers')
    .select('id')
    .eq('name', tierId)
    .maybeSingle();

  if (tierError || !tier) {
    console.error('Tier not found in webhook:', tierError);
    throw new Error('Tier not found');
  }

  const subscriptionData = {
    user_id: userId,
    tier_id: tier.id,
    stripe_subscription_id: subscription,
    status: 'active',
    billing_cycle: billingCycle,
    start_date: new Date().toISOString(),
    end_date: endDate.toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log('Attempting to upsert subscription data:', subscriptionData);

  const { error } = await supabase
    .from('user_subscriptions')
    .upsert(subscriptionData, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error creating/updating subscription:', error);
    throw error;
  }

  // Initialize usage tracking
  const { error: usageError } = await supabase
    .from('usage_tracking')
    .upsert({
      user_id: userId,
      tier_id: tier.id,
      current_products: 0,
      current_users: 1, // User themselves
      current_branches: 1, // Default branch
      orders_this_month: 0,
      last_reset_date: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    });

  if (usageError) {
    console.error('Error creating usage tracking record:', usageError);
  }

  console.log(`Subscription created successfully for user ${userId}, tier ${tier.id}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing invoice payment succeeded:', invoice.id);
  
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing invoice payment failed:', invoice.id);
  
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription updated:', subscription.id);
  
  const status = subscription.status;
  
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription deleted:', subscription.id);
  
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}
