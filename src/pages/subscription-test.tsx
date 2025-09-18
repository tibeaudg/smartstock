import React from 'react';
import { SubscriptionTestComponent } from '@/components/SubscriptionTestComponent';

/**
 * Test pagina voor abonnementen en feature gates
 * Toegankelijk via /subscription-test
 */
export default function SubscriptionTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subscription & Feature Gates Test
          </h1>
          <p className="text-gray-600">
            Test de verschillende abonnementen en hun feature gates
          </p>
        </div>
        
        <SubscriptionTestComponent />
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Test Scenarios</h3>
          <div className="text-sm text-yellow-800 space-y-2">
            <p><strong>1. Basic Plan Test:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Scanner should be locked (🔒)</li>
              <li>• Delivery notes should be locked (🔒)</li>
              <li>• Product limit: 50 products</li>
              <li>• Should show upgrade prompts when limit reached</li>
            </ul>
            
            <p><strong>2. Growth Plan Test:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Scanner should be available (✅)</li>
              <li>• Delivery notes should be locked (🔒)</li>
              <li>• Product limit: 500 products</li>
              <li>• Should show upgrade prompts when limit reached</li>
            </ul>
            
            <p><strong>3. Premium Plan Test:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Scanner should be available (✅)</li>
              <li>• Delivery notes should be available (✅)</li>
              <li>• Unlimited products, users, branches, orders</li>
              <li>• No upgrade prompts needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

