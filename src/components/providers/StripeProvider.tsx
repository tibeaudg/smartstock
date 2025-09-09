import React, { createContext, useContext, ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/services/paymentService';

interface StripeContextType {
  stripe: any;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const stripe = getStripe();

  return (
    <StripeContext.Provider value={{ stripe }}>
      <Elements stripe={stripe}>
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
