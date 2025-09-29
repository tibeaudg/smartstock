import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, CreditCard } from 'lucide-react';
import { redirectToStripe } from '@/services/stripeService';

export const TestCheckout: React.FC = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTestCheckout = async () => {
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
      console.log('Creating checkout session for user:', user.id);
      
      toast({
        title: 'Checkout gestart',
        description: 'Je wordt doorgestuurd naar Stripe Checkout...',
      });
      
      // Use the redirect function
      redirectToStripe('test-module-id', user.id);
      
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

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Checkout</CardTitle>
        <CardDescription>
          Test of de checkout knop werkt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-blue-900">Analytics Basic</div>
                <div className="text-sm text-blue-700">$9.99/maand</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-green-900">Stripe Checkout</div>
                <div className="text-sm text-green-700">Veilig en eenvoudig</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold">Maandelijkse kosten</div>
              <div className="text-sm text-gray-600">Elke maand opnieuw</div>
            </div>
            <div className="text-2xl font-bold">$9.99</div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            disabled={isProcessing}
          >
            Annuleren
          </Button>
          <Button
            onClick={handleTestCheckout}
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
      </CardContent>
    </Card>
  );
};
