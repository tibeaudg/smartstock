// Tijdelijke Stripe configuratie voor ontwikkeling
// Vervang deze met je echte keys zodra je toegang hebt tot je Stripe dashboard

export const STRIPE_CONFIG = {
  // Test keys - vervang deze met je echte keys
  publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef',
  secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_1234567890abcdef',
  
  // API endpoints
  apiBaseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // Test mode
  isTestMode: true,
};

// Functie om te controleren of keys zijn ingesteld
export const validateStripeConfig = () => {
  const issues: string[] = [];
  
  if (!process.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    issues.push('VITE_STRIPE_PUBLISHABLE_KEY is niet ingesteld');
  }
  
  if (!process.env.STRIPE_SECRET_KEY) {
    issues.push('STRIPE_SECRET_KEY is niet ingesteld');
  }
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    issues.push('STRIPE_WEBHOOK_SECRET is niet ingesteld');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
};
