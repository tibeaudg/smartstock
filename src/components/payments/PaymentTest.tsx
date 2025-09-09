import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { createCheckoutSession } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';

export const PaymentTest: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const testPayment = async () => {
    if (!user) {
      toast({
        title: 'Fout',
        description: 'Je moet ingelogd zijn om te betalen.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Test met de eerste module (Analytics)
      const { url } = await createCheckoutSession({
        moduleId: 'test-module-id', // Vervang met echte module ID
        billingCycle: 'monthly',
        userId: user.id,
        successUrl: `${window.location.origin}/dashboard/settings/modules?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/settings/modules?canceled=true`,
      });

      // Redirect naar Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het starten van de betaling.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Test</CardTitle>
        <CardDescription>
          Test de Stripe integratie met een test betaling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testPayment} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Laden...' : 'Test Betaling'}
        </Button>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Test Cards:</strong></p>
          <p>Succesvol: 4242 4242 4242 4242</p>
          <p>Mislukt: 4000 0000 0000 0002</p>
          <p>3D Secure: 4000 0025 0000 3155</p>
        </div>
      </CardContent>
    </Card>
  );
};
