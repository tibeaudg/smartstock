import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

let stripePromise: Promise<Stripe | null>;

// Initialize Stripe with error handling
export const getStripe = () => {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.warn('Stripe publishable key not configured. Stripe functionality will be disabled.');
      stripePromise = Promise.resolve(null);
    } else {
      stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
  }
  return stripePromise;
};

// Payment interfaces
export interface CreateCheckoutSessionRequest {
  moduleId: string;
  billingCycle: 'monthly' | 'yearly';
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

// Create checkout session for module subscription
export const createCheckoutSession = async (
  request: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> => {
  try {
    // Use Supabase Edge Function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const url = `${supabaseUrl}/functions/v1/create-checkout-session`;
    
    console.log('Making request to:', url);
    console.log('Request body:', request);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(request),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Get response text first to debug
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      try {
        const error = JSON.parse(responseText);
        throw new Error(error.error || 'Failed to create checkout session');
      } catch (parseError) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }
    }

    // Try to parse JSON
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create payment intent for one-time payments
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'eur',
  metadata?: Record<string, string>
): Promise<PaymentIntent> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Confirm payment intent
export const confirmPaymentIntent = async (
  paymentIntentId: string,
  paymentMethodId: string
): Promise<PaymentIntent> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/confirm-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        paymentIntentId,
        paymentMethodId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to confirm payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

// Get payment methods for user
export const getPaymentMethods = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/payment-methods`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch payment methods');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

// Create customer portal session for subscription management
export const createCustomerPortalSession = async (
  returnUrl: string
): Promise<{ url: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ returnUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create portal session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

// Get subscription details
export const getSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/subscription/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};

// Get user's subscriptions
export const getUserSubscriptions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/subscriptions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch subscriptions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};
