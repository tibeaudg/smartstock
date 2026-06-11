import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

type Currency = 'EUR' | 'USD' | 'GBP';

const MAX_UNIT_PRICE_DECIMALS = 6;

/** Decimal places for per-unit prices (e.g. purchase price). Uses 2+ digits when value is under one cent. */
export function getUnitPriceFractionDigits(price: number): number {
  if (!Number.isFinite(price) || price === 0) return 2;
  const abs = Math.abs(price);
  if (abs >= 0.01) return 2;
  const trimmed = abs.toFixed(10).replace(/0+$/, '');
  const dotIndex = trimmed.indexOf('.');
  if (dotIndex === -1) return 2;
  const decimals = trimmed.length - dotIndex - 1;
  return Math.min(Math.max(decimals, 2), MAX_UNIT_PRICE_DECIMALS);
}

export function formatUnitPriceWithCurrency(price: number, currency: Currency): string {
  const fractionDigits = getUnitPriceFractionDigits(price);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(price);
}

interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  formatUnitPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyState | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  // Initialize currency from localStorage or default to USD
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || 'USD';
  });

  // Save to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Listen for currency sync from branch_settings (when user is in dashboard)
  useEffect(() => {
    const handler = (e: CustomEvent<{ currency: string }>) => {
      const c = e.detail?.currency;
      if (c === 'EUR' || c === 'USD' || c === 'GBP') {
        setCurrencyState(c as Currency);
        setCurrencyState(c as Currency);
      }
    };
    window.addEventListener('stockflow-currency-sync' as never, handler as EventListener);
    return () => window.removeEventListener('stockflow-currency-sync' as never, handler as EventListener);
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  }, []);

  const formatPrice = useCallback((price: number): string => {
    const locale = 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(price);
  }, [currency]);

  const formatUnitPrice = useCallback((price: number): string => {
    return formatUnitPriceWithCurrency(price, currency);
  }, [currency]);

  const value: CurrencyState = {
    currency,
    setCurrency,
    formatPrice,
    formatUnitPrice,
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