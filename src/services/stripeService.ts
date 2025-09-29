import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (moduleId: string, userId: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    // Create a simple checkout session directly with Stripe
    // This is a simplified version for testing
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        moduleId,
        userId,
        price: 999, // $9.99 in cents
        currency: 'eur',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Fallback: Direct redirect to Stripe (for testing)
export const redirectToStripe = (moduleId: string, userId: string) => {
  // This is a test URL - replace with your actual Stripe checkout URL
  const testUrl = `https://checkout.stripe.com/test?prefilled_email=test@example.com`;
  window.open(testUrl, '_blank');
};
