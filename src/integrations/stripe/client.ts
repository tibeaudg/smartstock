import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing Stripe publishable key');
}

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PLAN_PRICES = {
  starter: import.meta.env.VITE_STRIPE_PRICE_STARTER || 'price_starter_monthly',
  business: import.meta.env.VITE_STRIPE_PRICE_BUSINESS || 'price_business_monthly',
  enterprise: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE || 'price_enterprise_monthly'
} as const;

export interface PlanDetails {
  name: string;
  price: number;
  maxProducts: number;
  features: string[];
}

export const PLAN_DETAILS: Record<string, PlanDetails> = {
  free: {
    name: 'Free',
    price: 0,
    maxProducts: 30,
    features: [
      'Tot 30 producten',
      '1 gebruiker',
      '1 filiaal',
      'Basis voorraad beheer',
      'Email ondersteuning'
    ]
  },
  starter: {
    name: 'Starter',
    price: 9,
    maxProducts: 150,
    features: [
      'Tot 150 producten',
      'Extra gebruikers (€2/maand)',
      'Extra filialen (€5/maand)',
      'Voorraad beheer',
      'Email ondersteuning',
      'Data backup'
    ]
  },
  business: {
    name: 'Business',
    price: 49,
    maxProducts: 1500,
    features: [
      'Tot 1500 producten',
      'Extra gebruikers (€2/maand)',
      'Extra filialen (€5/maand)',
      'Prioriteit ondersteuning',
      'Data backup',
      'API toegang'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 79,
    maxProducts: Number.MAX_SAFE_INTEGER,
    features: [
      'Onbeperkt producten',
      'Extra gebruikers (€2/maand)',
      'Extra filialen (€5/maand)',
      'Prioriteit ondersteuning',
      '24/7 telefoon support',
      'Custom integraties',
      'SLA garantie'
    ]
  }
};
