import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export const SubscriptionManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Account</CardTitle>
        <CardDescription>
          StockFlow is completely free - no subscriptions, no payments, no limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Completely Free</h4>
              <p className="text-sm text-green-700 mt-1">
                StockFlow is completely free forever. All features are included at no cost. 
                No credit card required, no subscriptions, no hidden fees.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What's Included</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Unlimited products</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Unlimited users</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Unlimited branches</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>All premium features</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Barcode scanning</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>API access</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Free Forever
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
