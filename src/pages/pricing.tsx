import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star, Zap, Crown, ArrowRight, Clock, Users, Package, ShoppingCart, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface PricingTier {
  id: string;
  name: string;
  displayName: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  yearlyDiscount: number;
  maxProducts: number | null;
  maxOrders: number | null;
  maxUsers: number | null;
  maxBranches: number | null;
  features: string[];
  isPopular: boolean;
  isEnterprise: boolean;
  icon: React.ReactNode;
  color: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'basis',
    name: 'basis',
    displayName: 'Basis',
    description: 'Perfect for small businesses that are just starting with inventory management',
    priceMonthly: 0,
    priceYearly: 0,
    yearlyDiscount: 0,
    maxProducts: 50,
    maxOrders: 100,
    maxUsers: 2,
    maxBranches: 1,
    features: [
      'Basis inventory management',
      'Add/edit products',
      'Simple reports',
      'Email support',
      'Mobile app access'
    ],
    isPopular: false,
    isEnterprise: false,
    icon: <Package className="h-8 w-8" />,
    color: 'text-gray-600'
  },
  {
    id: 'groei',
    name: 'groei',
    displayName: 'Groei',
    description: 'Ideal for growing businesses with more needs',
    priceMonthly: 29.99,
    priceYearly: 299.99,
    yearlyDiscount: 16.67,
    maxProducts: 500,
    maxOrders: 1000,
    maxUsers: 10,
    maxBranches: 5,
    features: [
      'All Basic features',
      'Advanced analytics',
      'Barcode scanner',
      'Delivery notes management',
      'API access',
      'Priority support',
      'Custom reports',
      'Bulk import/export'
    ],
    isPopular: true,
    isEnterprise: false,
    icon: <Zap className="h-8 w-8" />,
    color: 'text-blue-600'
  },
  {
    id: 'premium',
    name: 'premium',
    displayName: 'Premium',
    description: 'For large businesses that need everything',
    priceMonthly: 79.99,
    priceYearly: 799.99,
    yearlyDiscount: 16.67,
    maxProducts: null,
    maxOrders: null,
    maxUsers: null,
    maxBranches: null,
    features: [
      'All Growth features',
      'Onbeperkte producten',
      'Onbeperkte orders',
      'Unlimited users',
      'Unlimited branches',
      'Dedicated support',
      'Custom onboarding',
      'SLA guarantee',
      'White-label opties'
    ],
    isPopular: false,
    isEnterprise: true,
    icon: <Crown className="h-8 w-8" />,
    color: 'text-purple-600'
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSelectPlan = (tierId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Navigate to checkout or subscription page
    navigate(`/checkout?tier=${tierId}&cycle=${billingCycle}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getLimitText = (value: number | null, type: string) => {
    if (value === null) return t('pricing.unlimited');
    if (value === 0) return t('pricing.notIncluded');
    return `${value} ${type}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('pricing.subtitle')}
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              {t('pricing.monthly')}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              {t('pricing.yearly')}
            </span>
            {billingCycle === 'yearly' && (
              <Badge variant="secondary" className="ml-2">
                {t('pricing.save')}
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative ${tier.isPopular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'shadow-lg'}`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most popular
                  </Badge>
                </div>
              )}
              
              {tier.isEnterprise && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white px-4 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    Enterprise plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`mx-auto mb-4 ${tier.color}`}>
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{tier.displayName}</CardTitle>
                <CardDescription className="text-gray-600">
                  {tier.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {tier.priceMonthly === 0 ? 'Gratis' : formatPrice(billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly)}
                  </div>
                  {tier.priceMonthly > 0 && (
                    <div className="text-sm text-gray-500">
                      {billingCycle === 'yearly' ? 'per year' : 'per month'}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Limits */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Products</span>
                    <span className="text-sm font-medium">{getLimitText(tier.maxProducts, 'products')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Orders per month</span>
                    <span className="text-sm font-medium">{getLimitText(tier.maxOrders, 'orders')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Users</span>
                    <span className="text-sm font-medium">{getLimitText(tier.maxUsers, 'users')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Branches</span>
                      <span className="text-sm font-medium">{getLimitText(tier.maxBranches, 'branches')}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Included:</h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  className={`w-full ${tier.isPopular ? 'bg-blue-600 hover:bg-blue-700' : tier.isEnterprise ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                  onClick={() => handleSelectPlan(tier.id)}
                >
                  {tier.priceMonthly === 0 ? 'Start free' : 'Start 14-day trial'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Free Trial Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">14-day free trial</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Probeer alle premium features 14 days free. No credit card required, 
              cancel anytime.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">No obligations</h4>
                  <p className="text-sm text-gray-600">Cancel anytime without any costs</p>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Full access</h4>
                  <p className="text-sm text-gray-600">All features and limits of your chosen plan</p>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Direct start</h4>
                  <p className="text-sm text-gray-600">Begin direct with your inventory management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently asked questions
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I change plans?</h4>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade at any time. Changes are made immediately.
              </p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 mb-2">What happens after my trial?</h4>
              <p className="text-gray-600 text-sm">
                After 14 days, your account will be automatically upgraded to the Basic plan, unless you choose a paid plan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h4>
              <p className="text-gray-600 text-sm">
                No, there are no hidden costs or setup fees. You only pay the monthly or yearly price.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do I get support?</h4>
              <p className="text-gray-600 text-sm">
                Yes, all plans contain email support. Premium plans get priority support and dedicated account managers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
