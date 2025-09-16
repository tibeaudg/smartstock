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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan niet gevonden</h1>
          <Button onClick={() => navigate('/pricing')}>
            Terug naar prijzen
          </Button>
        </div>
      </div>
    );
  }

  const handleStartTrial = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      await startTrial({ tierId: selectedTier.id, billingCycle });
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
      // Create subscription checkout session
      const response = await fetch('/api/payments/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierId: selectedTier.id,
          billingCycle,
          userId: user.id,
          successUrl: `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
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
              Terug naar prijzen
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Kies je betalingsplan
            </h1>
            <p className="text-gray-600 mt-2">
              Start je {selectedTier.display_name} plan en begin direct met voorraadbeheer
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
                      {selectedTier.is_popular ? 'Populair' : selectedTier.is_enterprise ? 'Enterprise' : 'Basis'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Billing Cycle Toggle */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Betalingscyclus</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          billingCycle === 'monthly'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">Maandelijks</div>
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
                        <div className="font-medium">Jaarlijks</div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(selectedTier.price_yearly)}/jaar
                        </div>
                        {selectedTier.yearly_discount_percentage > 0 && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Bespaar {selectedTier.yearly_discount_percentage}%
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
                    <h4 className="font-medium text-gray-900">Limieten</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Producten:</span>
                        <span className="ml-2 font-medium">
                          {selectedTier.max_products || 'Onbeperkt'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Gebruikers:</span>
                        <span className="ml-2 font-medium">
                          {selectedTier.max_users || 'Onbeperkt'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Orders/maand:</span>
                        <span className="ml-2 font-medium">
                          {selectedTier.max_orders || 'Onbeperkt'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Vestigingen:</span>
                        <span className="ml-2 font-medium">
                          {selectedTier.max_branches || 'Onbeperkt'}
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
                  <CardTitle className="text-xl">Bestelling overzicht</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{selectedTier.display_name} plan</span>
                    <span className="font-medium">
                      {billingCycle === 'monthly' ? 'Maandelijks' : 'Jaarlijks'}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {billingCycle === 'monthly' ? 'Per maand' : 'Per jaar'}
                      </span>
                      <span className="font-medium">{formatPrice(getPrice())}</span>
                    </div>
                    
                    {getYearlySavings() > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Jaarlijkse besparing</span>
                        <span>-{formatPrice(getYearlySavings())}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Totaal</span>
                    <span>{formatPrice(getPrice())}</span>
                  </div>
                  
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-gray-500">
                      Billed annually • {formatPrice(getPrice() / 12)}/maand
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Betalingsmethoden</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
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
                      <div className="font-medium">Veilig betalen</div>
                      <div className="text-sm text-gray-600">256-bit SSL encryptie</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                {selectedTier.price_monthly === 0 ? (
                  <Button 
                    onClick={handleStartTrial}
                    disabled={isProcessing || isStartingTrial}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing || isStartingTrial ? 'Verwerken...' : 'Start gratis'}
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleStartTrial}
                      disabled={isProcessing || isStartingTrial}
                      variant="outline"
                      className="w-full"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {isProcessing || isStartingTrial ? 'Verwerken...' : 'Start 14-dagen trial'}
                    </Button>
                    
                    <Button 
                      onClick={handleSubscribe}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? 'Verwerken...' : `Nu betalen - ${formatPrice(getPrice())}`}
                    </Button>
                  </>
                )}
                
                <p className="text-xs text-gray-500 text-center">
                  Door te betalen ga je akkoord met onze{' '}
                  <a href="/terms" className="text-blue-600 hover:underline">Algemene Voorwaarden</a>
                  {' '}en{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">Privacybeleid</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
