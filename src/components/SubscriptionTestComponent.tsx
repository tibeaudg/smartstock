import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { FeatureGate } from './FeatureGate';
import { UsageLimits } from './UsageLimits';
import { Scan, Truck, Package, Users, Building, ShoppingCart } from 'lucide-react';

/**
 * Test component voor abonnementen en feature gates
 * Dit component toont de huidige subscription status en test verschillende features
 */
export const SubscriptionTestComponent: React.FC = () => {
  const { 
    currentTier, 
    usageTracking, 
    canUseFeature, 
    isWithinLimits,
    getRemainingLimit,
    isTrialActive,
    isSubscriptionActive 
  } = useSubscription();

  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const runFeatureTests = () => {
    const results: Record<string, boolean> = {};
    
    // Test scanner access
    results.scanner = canUseFeature('Barcode scanner');
    
    // Test delivery notes access  
    results.deliveryNotes = canUseFeature('Delivery notes management');
    
    // Test product limits
    results.canAddProduct = isWithinLimits('products');
    results.canAddUser = isWithinLimits('users');
    results.canAddBranch = isWithinLimits('branches');
    results.canAddOrder = isWithinLimits('orders');
    
    setTestResults(results);
  };

  const getFeatureStatus = (feature: string) => {
    const hasAccess = canUseFeature(feature);
    const isOverLimit = !isWithinLimits('products');
    
    if (hasAccess && !isOverLimit) {
      return { status: 'available', color: 'bg-green-100 text-green-800', icon: '✅' };
    } else if (hasAccess && isOverLimit) {
      return { status: 'over-limit', color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' };
    } else {
      return { status: 'locked', color: 'bg-red-100 text-red-800', icon: '🔒' };
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Subscription Test Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Subscription Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Current Plan</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {currentTier?.display_name || 'Basic'}
                </Badge>
                {isTrialActive && <Badge className="bg-blue-100 text-blue-800">Trial Active</Badge>}
                {isSubscriptionActive && <Badge className="bg-green-100 text-green-800">Active</Badge>}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Plan Limits</h3>
              <div className="text-sm text-gray-600">
                <div>Products: {currentTier?.max_products || 'Unlimited'}</div>
                <div>Users: {currentTier?.max_users || 'Unlimited'}</div>
                <div>Branches: {currentTier?.max_branches || 'Unlimited'}</div>
                <div>Orders: {currentTier?.max_orders || 'Unlimited'}</div>
              </div>
            </div>
          </div>

          {/* Feature Tests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Feature Access Tests</h3>
              <Button onClick={runFeatureTests} variant="outline" size="sm">
                Run Tests
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scanner Test */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Scan className="h-4 w-4" />
                  <span className="font-medium">Barcode Scanner</span>
                  <Badge className={getFeatureStatus('Barcode scanner').color}>
                    {getFeatureStatus('Barcode scanner').icon}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Available in Growth and Premium plans
                </p>
                {testResults.scanner !== undefined && (
                  <div className="text-xs">
                    Test result: {testResults.scanner ? '✅ Available' : '❌ Not Available'}
                  </div>
                )}
              </div>

              {/* Delivery Notes Test */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">Delivery Management</span>
                  <Badge className={getFeatureStatus('Delivery notes management').color}>
                    {getFeatureStatus('Delivery notes management').icon}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Available only in Premium plan
                </p>
                {testResults.deliveryNotes !== undefined && (
                  <div className="text-xs">
                    Test result: {testResults.deliveryNotes ? '✅ Available' : '❌ Not Available'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Usage Limits</h3>
            <UsageLimits showUpgradePrompts={true} compact={false} />
          </div>

          {/* Feature Gates Test */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Feature Gates Test</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scanner Feature Gate */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    Scanner Feature Gate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FeatureGate feature="Barcode scanner">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Scan className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">Scanner Available</span>
                      </div>
                      <p className="text-sm text-green-700">
                        You can access the barcode scanner feature.
                      </p>
                    </div>
                  </FeatureGate>
                </CardContent>
              </Card>

              {/* Delivery Notes Feature Gate */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Notes Feature Gate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FeatureGate feature="Delivery notes management">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">Delivery Management Available</span>
                      </div>
                      <p className="text-sm text-green-700">
                        You can access the delivery notes management feature.
                      </p>
                    </div>
                  </FeatureGate>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Test Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Testing Instructions</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. <strong>Basic Plan:</strong> Should show scanner and delivery notes as locked</p>
              <p>2. <strong>Growth Plan:</strong> Should show scanner as available, delivery notes as locked</p>
              <p>3. <strong>Premium Plan:</strong> Should show both features as available</p>
              <p>4. <strong>Product Limits:</strong> Test by adding products until you hit the limit</p>
              <p>5. <strong>Upgrade Prompts:</strong> Should appear when limits are exceeded</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
