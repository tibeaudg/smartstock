import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';

interface CurrencySwitcherProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const { currency, setCurrency } = useCurrency();

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-sm text-gray-600">Currency:</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={currency === 'EUR' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrency('EUR')}
            className={`px-3 py-1 text-xs ${
              currency === 'EUR' 
                ? 'bg-white shadow-sm' 
                : 'bg-transparent hover:bg-gray-200'
            }`}
          >
            € EUR
          </Button>
          <Button
            variant={currency === 'USD' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 text-xs ${
              currency === 'USD' 
                ? 'bg-white shadow-sm' 
                : 'bg-transparent hover:bg-gray-200'
            }`}
          >
            $ USD
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Currency</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={currency === 'EUR' ? 'default' : 'outline'}
              onClick={() => setCurrency('EUR')}
              className={`h-auto p-4 ${
                currency === 'EUR' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-left">
                <div className="font-medium">€ EUR</div>
                <div className="text-sm opacity-75">Euro</div>
              </div>
            </Button>
            <Button
              variant={currency === 'USD' ? 'default' : 'outline'}
              onClick={() => setCurrency('USD')}
              className={`h-auto p-4 ${
                currency === 'USD' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-left">
                <div className="font-medium">$ USD</div>
                <div className="text-sm opacity-75">US Dollar</div>
              </div>
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Prices are automatically converted using current exchange rates
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

