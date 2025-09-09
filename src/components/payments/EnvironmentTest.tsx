import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const EnvironmentTest: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Environment Variables Test</CardTitle>
        <CardDescription>
          Controleer of je environment variables correct zijn ingesteld
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>VITE_SUPABASE_URL:</strong>
          <div className="text-sm text-gray-600 break-all">
            {supabaseUrl || '❌ NOT SET'}
          </div>
        </div>
        
        <div>
          <strong>VITE_SUPABASE_ANON_KEY:</strong>
          <div className="text-sm text-gray-600">
            {anonKey ? '✅ Set' : '❌ NOT SET'}
          </div>
        </div>
        
        <div>
          <strong>VITE_STRIPE_PUBLISHABLE_KEY:</strong>
          <div className="text-sm text-gray-600">
            {stripeKey ? '✅ Set' : '❌ NOT SET'}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Tip:</strong> Zorg dat je .env.local bestand in de root staat (naast package.json) en start je development server opnieuw.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
