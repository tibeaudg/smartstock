import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingCalculatorProps {
  onSelectPlan?: (plan: 'free' | 'business' | 'enterprise') => void;
  defaultProducts?: number;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ 
  onSelectPlan, 
  defaultProducts = 0 
}) => {
  const [productCount, setProductCount] = useState<number>(defaultProducts);
  const navigate = useNavigate();

  const PRICE_PER_PRODUCT = 0.004;
  const FREE_PRODUCTS = 100;
  const ENTERPRISE_THRESHOLD = 10000;

  // Calculate monthly cost
  const calculateCost = (count: number): { amount: number; tier: 'free' | 'business' | 'enterprise' } => {
    if (count <= FREE_PRODUCTS) {
      return { amount: 0, tier: 'free' };
    } else if (count < ENTERPRISE_THRESHOLD) {
      const billableProducts = count - FREE_PRODUCTS;
      return { 
        amount: billableProducts * PRICE_PER_PRODUCT, 
        tier: 'business' 
      };
    } else {
      return { amount: 0, tier: 'enterprise' };
    }
  };

  const cost = calculateCost(productCount);

  // Auto-redirect to contact sales if >= 10,000 products
  useEffect(() => {
    if (productCount >= ENTERPRISE_THRESHOLD && onSelectPlan) {
      // Small delay to let user see the calculation
      const timer = setTimeout(() => {
        onSelectPlan('enterprise');
        navigate('/contact?subject=enterprise-pricing&products=' + productCount);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [productCount, onSelectPlan, navigate]);

  const formatPrice = (amount: number): string => {
    if (amount === 0) return '€0';
    return `€${amount.toFixed(2)}`;
  };

  const getRecommendedTier = (): string => {
    if (productCount <= FREE_PRODUCTS) return 'Free';
    if (productCount < ENTERPRISE_THRESHOLD) return 'Business';
    return 'Enterprise';
  };

  const getTierDescription = (): string => {
    if (productCount <= FREE_PRODUCTS) {
      return '100 products - Perfect for testing';
    } else if (productCount < ENTERPRISE_THRESHOLD) {
      const billableProducts = productCount - FREE_PRODUCTS;
      return `€${(billableProducts * PRICE_PER_PRODUCT).toFixed(2)}/month for ${billableProducts} billable products`;
    } else {
      return 'Custom pricing - Contact our sales team';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <CardTitle>Calculate Your Monthly Cost</CardTitle>
        </div>
        <CardDescription>
          Adjust the slider to see pricing based on your product count
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Count Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Number of Products
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {productCount.toLocaleString()}
            </span>
          </div>
          
          {/* Slider */}
          <Slider
            value={[productCount]}
            onValueChange={(value) => setProductCount(value[0])}
            min={0}
            max={10000}
            step={10}
            className="w-full"
          />
          
          {/* Scale markers */}
          <div className="flex justify-between text-xs text-gray-500 px-1">
            <span>100</span>
            <span>3,000</span>
            <span>6,000</span>
            <span>10,000</span>
          </div>
        </div>

        {/* Cost Display */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-600">Monthly Cost</div>
            <div className="text-4xl font-bold text-gray-900">
              {cost.tier === 'enterprise' ? (
                <span className="text-blue-600">Custom</span>
              ) : (
                formatPrice(cost.amount)
              )}
            </div>
            {cost.tier !== 'enterprise' && (
              <div className="text-sm text-gray-500">per month</div>
            )}
          </div>

          {/* Tier Badge */}
          <div className="mt-4 flex justify-center">
            <Badge 
              variant={cost.tier === 'free' ? 'secondary' : cost.tier === 'business' ? 'default' : 'default'}
              className={`${
                cost.tier === 'free' ? 'bg-green-100 text-green-700' :
                cost.tier === 'business' ? 'bg-blue-600 text-white' :
                'bg-purple-100 text-purple-700'
              }`}
            >
              {getRecommendedTier()} Tier
            </Badge>
          </div>

          {/* Description */}
          <div className="mt-4 text-center text-sm text-gray-600">
            {getTierDescription()}
          </div>

          {/* Breakdown for Business Tier */}
          {cost.tier === 'business' && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>First {FREE_PRODUCTS} products:</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional {productCount - FREE_PRODUCTS} products:</span>
                  <span className="font-medium">€{((productCount - FREE_PRODUCTS) * PRICE_PER_PRODUCT).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200 font-semibold text-gray-900">
                  <span>Total:</span>
                  <span>{formatPrice(cost.amount)}/month</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {cost.tier !== 'enterprise' && (
          <button
            onClick={() => onSelectPlan?.(cost.tier)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Start {cost.tier === 'free' ? 'Free' : 'Your Plan'}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        {cost.tier === 'enterprise' && (
          <button
            onClick={() => {
              onSelectPlan?.('enterprise');
              navigate('/contact?subject=enterprise-pricing&products=' + productCount);
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Contact Sales
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        {/* Info Text */}
        <div className="text-xs text-center text-gray-500 space-y-1">
          <p>
            {cost.tier === 'free' 
              ? `All features included up to ${FREE_PRODUCTS} products`
              : cost.tier === 'business'
              ? `Billed monthly based on your actual product count`
              : `SLA guarantees, dedicated support, and custom solutions available`
            }
          </p>
          <p className="font-medium">Cancel anytime • No credit card required for Free tier</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;

