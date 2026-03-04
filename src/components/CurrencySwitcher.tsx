import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { useBranchSettings } from '@/hooks/useBranchSettings';

interface CurrencySwitcherProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const { currency, setCurrency } = useCurrency();
  const { updateBranchSettings } = useBranchSettings();

  const handleSetCurrency = (newCurrency: 'EUR' | 'USD' | 'GBP') => {
    setCurrency(newCurrency);
    updateBranchSettings({ currency: newCurrency });
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-sm text-gray-600">Currency:</span>
        <div className="flex bg-gray-100 rounded-lg p-1 gap-0.5">
          {(['EUR', 'USD', 'GBP'] as const).map((c) => (
            <Button
              key={c}
              variant={currency === c ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleSetCurrency(c)}
              className={`px-3 py-1 text-xs ${
                currency === c ? 'bg-white shadow-sm' : 'bg-transparent hover:bg-gray-200'
              }`}
            >
              $ {c}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Currency</h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { code: 'EUR' as const, label: 'Euro' },
              { code: 'USD' as const, label: 'US Dollar' },
              { code: 'GBP' as const, label: 'British Pound' },
            ].map(({ code, label }) => (
              <Button
                key={code}
                variant={currency === code ? 'default' : 'outline'}
                onClick={() => handleSetCurrency(code)}
                className={`h-auto p-4 ${
                  currency === code
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">$ {code}</div>
                  <div className="text-sm opacity-75">{label}</div>
                </div>
              </Button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Prices are automatically converted using current exchange rates
          </p>
        </div>
      </CardContent>
    </Card>
  );
};


