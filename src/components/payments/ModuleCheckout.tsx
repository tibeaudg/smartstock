import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Check, Euro } from 'lucide-react';
import { createCheckoutSession, createPaymentIntent, confirmPaymentIntent } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';

interface ModuleCheckoutProps {
  module: {
    id: string;
    title: string;
    description: string;
    status: 'available' | 'coming-soon' | 'beta';
    price_monthly: number;
    features: string[];
    icon: string;
    is_subscribed: boolean;
    subscription_status?: 'active' | 'cancelled' | 'expired';
    subscription_end_date?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export const ModuleCheckout: React.FC<ModuleCheckoutProps> = ({
  module,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [billingCycle] = useState<'monthly' | 'yearly'>('monthly'); // Altijd maandelijks
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod] = useState<'checkout' | 'card'>('checkout'); // Altijd Stripe Checkout

  const price = module.price_monthly; // Altijd maandelijks

  const handleCheckoutSession = async () => {
    if (!user) {
      toast({
        title: 'Fout',
        description: 'Je moet ingelogd zijn om te betalen.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { url } = await createCheckoutSession({
        moduleId: module.id,
        billingCycle: 'monthly',
        userId: user.id,
        successUrl: `${window.location.origin}/dashboard/settings/modules?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/settings/modules?canceled=true`,
      });

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het starten van de betaling.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent(price, 'eur', {
        moduleId: module.id,
        billingCycle,
        userId: localStorage.getItem('user_id') || '',
      });

      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment
      const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (confirmedPayment?.status === 'succeeded') {
        toast({
          title: 'Betaling succesvol!',
          description: 'Je module abonnement is geactiveerd.',
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Betaling mislukt',
        description: error instanceof Error ? error.message : 'Er is een fout opgetreden bij de betaling.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Module Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Module Abonnement
          </CardTitle>
          <CardDescription>
            Bevestig je keuze voor {module.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{module.title}</h3>
              <p className="text-gray-600">{module.description}</p>
            </div>
            <Badge variant="outline">{module.category}</Badge>
          </div>

          {/* Features */}
          {module.features && module.features.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Inclusief:</h4>
              <ul className="space-y-1">
                {module.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Info - Simplified */}
      <Card>
        <CardHeader>
          <CardTitle>Abonnementsperiode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-blue-900">Maandelijks</div>
                <div className="text-sm text-blue-700">€{module.price_monthly}/maand</div>
              </div>
              <Check className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method - Hidden, always Stripe Checkout */}
      <Card>
        <CardHeader>
          <CardTitle>Betalingsmethode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-green-900">Stripe Checkout</div>
                <div className="text-sm text-green-700">Veilig en eenvoudig</div>
              </div>
              <Check className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Maandelijkse kosten</div>
              <div className="text-sm text-gray-600">Elke maand opnieuw</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold flex items-center gap-1">
                <Euro className="w-5 h-5" />
                {price}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isProcessing}
        >
          Annuleren
        </Button>
        <Button
          onClick={handleCheckoutSession}
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Verwerken...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Naar Checkout
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
