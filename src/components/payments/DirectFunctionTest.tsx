import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const DirectFunctionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const testDirectFunction = async () => {
    setIsLoading(true);
    
    try {
      const supabaseUrl = 'https://sszuxnqhbxauvershuys.supabase.co';
      const url = `${supabaseUrl}/functions/v1/create-checkout-session`;
      
      console.log('Testing direct function at:', url);
      
      // Test met een POST request met test data
      // Vervang deze moduleId met de echte ID van je test module
      const testData = {
        moduleId: 'YOUR_ACTUAL_MODULE_ID_HERE', // Vervang met de echte module ID die je net hebt aangemaakt
        billingCycle: 'monthly',
        userId: 'test-user-id',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      };
      
      console.log('Test data:', testData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(testData),
      });

      console.log('POST Response status:', response.status);
      console.log('POST Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('POST Response text:', responseText);

      if (response.status === 500) {
        toast({
          title: 'Server Error',
          description: 'De Edge Function heeft een interne fout. Controleer de environment variables.',
          variant: 'destructive',
        });
      } else if (response.status === 400) {
        toast({
          title: 'Bad Request',
          description: 'De request data is ongeldig. Dit is normaal voor test data.',
        });
      } else if (response.status === 404) {
        toast({
          title: 'Module Not Found',
          description: 'De test module bestaat niet in de database.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Unexpected Response',
          description: `Status: ${response.status} - ${responseText}`,
          variant: 'destructive',
        });
      }
      
    } catch (error) {
      console.error('Error testing function:', error);
      toast({
        title: 'Network Error',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Direct Function Test</CardTitle>
        <CardDescription>
          Test of de Edge Function bestaat via directe URL
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testDirectFunction} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Testen...
            </>
          ) : (
            'Test Direct Function'
          )}
        </Button>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Dit test of de Edge Function bestaat via een GET request.</p>
          <p>Controleer de console voor details.</p>
        </div>
      </CardContent>
    </Card>
  );
};
