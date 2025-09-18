import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, CreditCard, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pricingTiers, startTrial, isStartingTrial } = useSubscription();
  
  const tierParam = searchParams.get('tier');
  const cycleParam = searchParams.get('cycle') as 'monthly' | 'yearly';
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(cycleParam || 'monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedTier = pricingTiers.find(tier => tier.name === tierParam);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!selectedTier) {
      navigate('/pricing');
      return;
    }
  }, [user, selectedTier, navigate]);

  if (!selectedTier) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan not found</h1>
          <Button onClick={() => navigate('/pricing')}>
            Back to pricing
          </Button>
        </div>
      </div>
    );
  }

  const handleStartTrial = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      await startTrial({ tierId: selectedTier.name, billingCycle });
      navigate('/dashboard?trial=started');
    } catch (error) {
      console.error('Error starting trial:', error);
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      // Create subscription checkout session using Supabase Edge Function
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://sszuxnqhbxauvershuys.supabase.co";
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzenV4bnFoYnhhdXZlcnNodXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTEyODYsImV4cCI6MjA2NTQ2NzI4Nn0.-jvEJ1uUwdcJKZ1JbgOtD6jr-e0FoeepPrj8rpSFviQ";
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          tierId: selectedTier.name,
          billingCycle,
          userId: user.id,
          successUrl: `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error subscribing:', error);
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getPrice = () => {
    return billingCycle === 'monthly' ? selectedTier.price_monthly : selectedTier.price_yearly;
  };

  const getYearlySavings = () => {
    if (billingCycle === 'yearly' && selectedTier.yearly_discount_percentage > 0) {
      const monthlyTotal = selectedTier.price_monthly * 12;
      const yearlyPrice = selectedTier.price_yearly;
      return monthlyTotal - yearlyPrice;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/pricing')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to pricing
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Start your free trial
            </h1>
            <p className="text-gray-600 mt-2">
              start immediately with your {selectedTier.display_name} plan - 14 days completly free, no payment information required
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plan Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedTier.display_name}</CardTitle>
                      <CardDescription>{selectedTier.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {selectedTier.is_popular ? 'Popular' : selectedTier.is_enterprise ? 'Enterprise' : 'Basic'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Billing Cycle Toggle */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Billing cycle</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          billingCycle === 'monthly'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">Monthly</div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(selectedTier.price_monthly)}/maand
                        </div>
                      </button>
                      <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          billingCycle === 'yearly'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">Yearly</div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(selectedTier.price_yearly)}/jaar
                        </div>
                        {selectedTier.yearly_discount_percentage > 0 && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Save {selectedTier.yearly_discount_percentage}%
                          </Badge>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Inbegrepen features</h4>
                    <ul className="space-y-2">
                      {selectedTier.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limits */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Limits</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Products:</span>
                        <span className="ml-2 font-medium">
                          {selectedTier.max_products || 'Unlimited'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Users:</span>
                        <span className="ml-2 font-medium">
                          {selectedTier.max_users || 'Unlimited'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Orders/month:</span>
                        <span className="ml-2 font-medium">
                          {selectedTier.max_orders_per_month || 'Unlimited'}
                        </span>
                      </div>
                      <div>
                          <span className="text-gray-600">Branches:</span>
                        <span className="ml-2 font-medium">
                          {selectedTier.max_branches || 'Unlimited'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Proefperiode samenvatting</CardTitle>
                  <CardDescription>
                    After 14 days you will be automatically charged {formatPrice(getPrice())} {billingCycle === 'monthly' ? 'per month' : 'per year'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{selectedTier.display_name} plan</span>
                    <span className="font-medium">
                      {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">14 days free</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Full access to all features
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          After trial ({billingCycle === 'monthly' ? 'per month' : 'per year'})
                        </span>
                        <span className="font-medium">{formatPrice(getPrice())}</span>
                      </div>
                      
                      {getYearlySavings() > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Yearly savings</span>
                          <span>-{formatPrice(getYearlySavings())}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">What happens after 14 days?</p>
                    <p>Your account will be locked until you add your payment information. No hidden costs, cancel anytime.</p>
                  </div>
                  
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-gray-500">
                      Yearly billed • {formatPrice(getPrice() / 12)}/month
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment information</CardTitle>
                  <CardDescription>
                    No payment information required to start
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">14-day free trial</div>   
                        <div className="text-sm text-gray-600 mt-1">
                          You can start immediately without payment information. After 14 days your account will be locked until you add your payment information.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Creditcard</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Safe payment</div>
                        <div className="text-sm text-gray-600">256-bit SSL encryption</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                {selectedTier.price_monthly === 0 ? (
                  <Button 
                    onClick={handleStartTrial}
                    disabled={isProcessing || isStartingTrial}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                    size="lg"
                  >
                    {isProcessing || isStartingTrial ? 'Processing...' : 'Start free'}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {/* Main CTA Button */}
                    <Button 
                      onClick={handleSubscribe}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 font-semibold"
                      size="lg"
                    >
                      <Clock className="h-5 w-5 mr-3" />
                      {isProcessing ? 'Processing...' : 'Start 14-day free trial'}
                    </Button>
                    
                    {/* Trial Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-blue-900 mb-1">14-day free trial</p>
                          <p className="text-blue-700">
                            After 14 days your account will be locked until you add your payment information. 
                            No hidden costs, cancel anytime.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 text-center">
                  By starting you agree to our{' '}
                  <a href="/terms" className="text-blue-600 hover:underline">General terms and conditions</a>
                  {' '}en{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">Privacy policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
