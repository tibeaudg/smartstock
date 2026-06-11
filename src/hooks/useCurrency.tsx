import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

type Currency = 'EUR' | 'USD' | 'GBP';

export const MAX_PRICE_DECIMALS = 6;

/** Plain decimal string for inputs/displays — preserves stored precision up to 6 decimals. */
export function formatDecimalForDisplay(
  value: number,
  maxDecimals: number = MAX_PRICE_DECIMALS,
): string {
  if (!Number.isFinite(value)) return '';
  if (value === 0) return '0';
  const sign = value < 0 ? '-' : '';
  const trimmed = Math.abs(value).toFixed(maxDecimals).replace(/\.?0+$/, '');
  return sign + trimmed;
}

/** Decimal places for monetary values — shows stored precision up to 6 decimals, minimum 2. */
export function getPriceFractionDigits(price: number): number {
  if (!Number.isFinite(price) || price === 0) return 2;
  const trimmed = Math.abs(price).toFixed(MAX_PRICE_DECIMALS).replace(/0+$/, '');
  const dotIndex = trimmed.indexOf('.');
  if (dotIndex === -1) return 2;
  const decimals = trimmed.length - dotIndex - 1;
  return Math.min(Math.max(decimals, 2), MAX_PRICE_DECIMALS);
}

/** @deprecated Use getPriceFractionDigits */
export function getUnitPriceFractionDigits(price: number): number {
  return getPriceFractionDigits(price);
}

function formatCurrencyAmount(price: number, currency: Currency): string {
  const fractionDigits = getPriceFractionDigits(price);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(price);
}

export function formatUnitPriceWithCurrency(price: number, currency: Currency): string {
  return formatCurrencyAmount(price, currency);
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
    return formatCurrencyAmount(price, currency);
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