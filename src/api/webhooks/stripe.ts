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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
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
  const { moduleId, userId, billingCycle } = session.metadata || {};
  
  if (!moduleId || !userId || !billingCycle) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  
  // Create subscription record in database
  const { error } = await supabase
    .from('user_module_subscriptions')
    .upsert({
      user_id: userId,
      module_id: moduleId,
      stripe_subscription_id: subscription.id,
      status: 'active',
      billing_cycle: billingCycle,
      start_date: new Date(subscription.current_period_start * 1000).toISOString(),
      end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    });

  if (error) {
    console.error('Error creating subscription record:', error);
  } else {
    console.log('Subscription created successfully:', subscription.id);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const { moduleId, userId, billingCycle } = subscription.metadata || {};
  
  if (!moduleId || !userId || !billingCycle) {
    console.error('Missing metadata in subscription:', subscription.id);
    return;
  }

  // Update subscription record
  const { error } = await supabase
    .from('user_module_subscriptions')
    .upsert({
      user_id: userId,
      module_id: moduleId,
      stripe_subscription_id: subscription.id,
      status: 'active',
      billing_cycle: billingCycle,
      start_date: new Date(subscription.current_period_start * 1000).toISOString(),
      end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    });

  if (error) {
    console.error('Error updating subscription record:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { moduleId, userId } = subscription.metadata || {};
  
  if (!moduleId || !userId) {
    console.error('Missing metadata in subscription update:', subscription.id);
    return;
  }

  // Update subscription record
  const { error } = await supabase
    .from('user_module_subscriptions')
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
  // Mark subscription as cancelled
  const { error } = await supabase
    .from('user_module_subscriptions')
    .update({
      status: 'cancelled',
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error cancelling subscription record:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    // Update subscription end date
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    
    const { error } = await supabase
      .from('user_module_subscriptions')
      .update({
        end_date: new Date(subscription.current_period_end * 1000).toISOString(),
        status: 'active',
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error updating subscription after payment:', error);
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    // Mark subscription as expired
    const { error } = await supabase
      .from('user_module_subscriptions')
      .update({
        status: 'expired',
      })
      .eq('stripe_subscription_id', invoice.subscription);

    if (error) {
      console.error('Error marking subscription as expired:', error);
    }
  }
}
