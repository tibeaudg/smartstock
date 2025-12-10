import React from 'react';
import { Check, Package, Users, Building, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UsageLimitsProps {
  compact?: boolean;
}

export const UsageLimits: React.FC<UsageLimitsProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-900">Usage</h3>
          <Badge variant="secondary" className="bg-green-100 text-green-800">Free</Badge>
        </div>
        <div className="text-sm text-gray-600">
          <p>All features are free with unlimited usage.</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Usage & Limits</CardTitle>
            <CardDescription>StockFlow is completely free - no limits</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">Free Forever</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Unlimited Everything</h4>
              <p className="text-sm text-green-700 mt-1">
                StockFlow is completely free with no usage limits. Use as many products, users, branches, and orders as you need.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Products</p>
              <p className="text-xs text-gray-500">Unlimited</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Users</p>
              <p className="text-xs text-gray-500">Unlimited</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Building className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Branches</p>
              <p className="text-xs text-gray-500">Unlimited</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Orders</p>
              <p className="text-xs text-gray-500">Unlimited</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Hook for checking specific limits - all limits are unlimited now
export const useUsageLimits = () => {
  return {
    canAddProduct: () => true,
    canAddUser: () => true,
    canAddBranch: () => true,
    canAddOrder: () => true,
    getProductsRemaining: () => null,
    getUsersRemaining: () => null,
    getBranchesRemaining: () => null,
    getOrdersRemaining: () => null,
    currentTier: null,
    usageTracking: null
  };
};
