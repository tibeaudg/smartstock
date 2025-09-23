import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

type Currency = 'EUR' | 'USD';

interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyState | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  // Initialize currency from localStorage or default to EUR
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || 'EUR';
  });

  // Save to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  }, []);

  const formatPrice = useCallback((price: number): string => {
    const locale = currency === 'EUR' ? 'nl-NL' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(price);
  }, [currency]);

  const value: CurrencyState = {
    currency,
    setCurrency,
    formatPrice,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyState => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};