import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { moduleId, billingCycle, userId, successUrl, cancelUrl } = req.body;

    // Validate required fields
    if (!moduleId || !billingCycle || !userId || !successUrl || !cancelUrl) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get module details from database
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('*')
      .eq('id', moduleId)
      .single();

    if (moduleError || !module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate price
    const price = billingCycle === 'monthly' ? module.price_monthly : module.price_yearly;
    const interval = billingCycle === 'monthly' ? 'month' : 'year';

    // Create or get Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create Stripe price if it doesn't exist
    const priceId = `${module.id}_${billingCycle}`;
    let stripePrice;
    
    try {
      stripePrice = await stripe.prices.retrieve(priceId);
    } catch (error) {
      // Price doesn't exist, create it
      stripePrice = await stripe.prices.create({
        unit_amount: Math.round(price * 100), // Convert to cents
        currency: 'eur',
        recurring: {
          interval: interval as 'month' | 'year',
        },
        product_data: {
          name: module.title,
          description: module.description,
          metadata: {
            moduleId: module.id,
            billingCycle: billingCycle,
          },
        },
        metadata: {
          moduleId: module.id,
          billingCycle: billingCycle,
        },
      });
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
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
