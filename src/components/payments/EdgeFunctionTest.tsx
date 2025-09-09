import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const EdgeFunctionTest: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const testEdgeFunction = async () => {
    if (!user) {
      toast({
        title: 'Fout',
        description: 'Je moet ingelogd zijn om te testen.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('Environment variables:');
      console.log('VITE_SUPABASE_URL:', supabaseUrl);
      console.log('VITE_SUPABASE_ANON_KEY:', anonKey ? 'Set' : 'Not set');
      
      if (!supabaseUrl) {
        throw new Error('VITE_SUPABASE_URL is not set in environment variables');
      }
      
      const url = `${supabaseUrl}/functions/v1/create-checkout-session`;
      
      console.log('Testing Edge Function at:', url);
      
      const testRequest = {
        moduleId: '3d5d0bc6-ec76-43a2-96fc-a3c593c82b04',
        billingCycle: 'monthly',
        userId: user.id,
        successUrl: `${window.location.origin}/dashboard/settings/modules?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/settings/modules?canceled=true`,
      };
      
      console.log('Test request:', testRequest);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(testRequest),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          toast({
            title: 'Success!',
            description: `Edge Function werkt! Session ID: ${data.sessionId}`,
          });
        } catch (parseError) {
          toast({
            title: 'Parse Error',
            description: `Response is not valid JSON: ${responseText}`,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Error',
          description: `HTTP ${response.status}: ${responseText}`,
          variant: 'destructive',
        });
      }
      
    } catch (error) {
      console.error('Error testing Edge Function:', error);
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
        <CardTitle>Edge Function Test</CardTitle>
        <CardDescription>
          Test de Supabase Edge Function direct
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testEdgeFunction} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Testen...
            </>
          ) : (
            'Test Edge Function'
          )}
        </Button>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Controleer de browser console voor debug informatie.</p>
        </div>
      </CardContent>
    </Card>
  );
};
