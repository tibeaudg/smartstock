import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ message: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { tierId, userId, billingCycle } = session.metadata || {};
  
  if (!tierId || !userId || !billingCycle) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  // Get subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  
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
    });

  if (error) {
    console.error('Error creating subscription record:', error);
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
    });

  if (usageError) {
    console.error('Error creating usage tracking record:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const { tierId, userId, billingCycle } = subscription.metadata || {};
  
  if (!tierId || !userId || !billingCycle) {
    console.error('Missing metadata in subscription creation:', subscription.id);
    return;
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
    });

  if (error) {
    console.error('Error updating subscription record:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { tierId, userId } = subscription.metadata || {};
  
  if (!tierId || !userId) {
    console.error('Missing metadata in subscription update:', subscription.id);
    return;
  }

  // Update subscription record
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: subscription.status === 'active' ? 'active' : 'cancelled',
      end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription record:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { userId } = subscription.metadata || {};
  
  if (!userId) {
    console.error('Missing userId in subscription deletion:', subscription.id);
    return;
  }

  // Cancel subscription in database
  const { error } = await supabase
    .from('user_subscriptions')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error cancelling subscription:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const { tierId, userId } = subscription.metadata || {};
  
  if (!tierId || !userId) {
    console.error('Missing metadata in invoice payment:', invoice.id);
    return;
  }

  // Update subscription end date
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription after payment:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const { userId } = subscription.metadata || {};
  
  if (!userId) {
    console.error('Missing userId in invoice payment failure:', invoice.id);
    return;
  }

  // Mark subscription as expired
  const { error } = await supabase
    .from('user_subscriptions')
    .update({ status: 'expired' })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error marking subscription as expired:', error);
  }
}
