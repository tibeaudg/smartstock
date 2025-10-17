import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/services/paymentService';
import type { Stripe } from '@stripe/stripe-js';

interface StripeContextType {
  stripe: Stripe | null;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Stripe asynchronously
    getStripe()
      .then(stripe => {
        setStripeInstance(stripe);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('[Stripe] Failed to initialize:', error);
        setStripeInstance(null);
        setIsLoading(false);
      });
  }, []);

  // Show loading state while Stripe is being initialized
  if (isLoading) {
    return (
      <StripeContext.Provider value={{ stripe: null }}>
        {children}
      </StripeContext.Provider>
    );
  }

  // If Stripe is null (not configured or failed to load), render children without Elements wrapper
  if (!stripeInstance) {
    return (
      <StripeContext.Provider value={{ stripe: null }}>
        {children}
      </StripeContext.Provider>
    );
  }

  return (
    <StripeContext.Provider value={{ stripe: stripeInstance }}>
      <Elements stripe={stripeInstance} options={{ locale: 'en' }}>
        {children}
      </Elements>
    </StripeContext.Provider>
  );
};

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};
