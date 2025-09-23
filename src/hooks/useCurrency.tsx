import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'EUR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (priceInEUR: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Static conversion rate: 1 EUR = 1.08 USD (approximate)
const EUR_TO_USD_RATE = 1.08;

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('EUR');

  // Load currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency') as Currency;
    if (savedCurrency && (savedCurrency === 'EUR' || savedCurrency === 'USD')) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save currency preference to localStorage
  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferred-currency', newCurrency);
  };

  const convertPrice = (priceInEUR: number): number => {
    if (currency === 'USD') {
      return priceInEUR * EUR_TO_USD_RATE;
    }
    return priceInEUR;
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(convertedPrice);
    }
    
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency: handleSetCurrency,
      formatPrice,
      convertPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
