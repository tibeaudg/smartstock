import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  Calendar, 
  Euro, 
  TrendingUp, 
  Info,
  ExternalLink,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BillingSnapshot {
  id: string;
  snapshot_date: string;
  product_count: number;
  calculated_amount: number;
  status: 'pending' | 'invoiced' | 'paid' | 'failed';
  stripe_invoice_id: string | null;
}

export const UsageDashboard: React.FC = () => {
  const { user } = useAuth();
  const { usageTracking, currentTier } = useSubscription();
  const navigate = useNavigate();

  // Fetch billing history
  const { data: billingHistory, isLoading } = useQuery({
    queryKey: ['billing-history', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('billing_snapshots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data as BillingSnapshot[];
    },
    enabled: !!user
  });

  if (!usageTracking || !currentTier) {
    return null;
  }

  // Calculate monthly cost
  const FREE_PRODUCTS = 100;
  const PRICE_PER_PRODUCT = 0.008;
  const billableProducts = Math.max(0, usageTracking.current_products - FREE_PRODUCTS);
  const monthlyCost = billableProducts * PRICE_PER_PRODUCT;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      invoiced: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Calculate next billing date
  const nextBillingDate = usageTracking.next_billing_date
    ? formatDate(usageTracking.next_billing_date)
    : 'Not set';

  return (
    <div className="space-y-6">
      {/* Current Usage Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Products Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Products</CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <CardDescription>Current product count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {usageTracking.current_products.toLocaleString()}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {usageTracking.current_products <= FREE_PRODUCTS 
                ? `${FREE_PRODUCTS - usageTracking.current_products} free products remaining`
                : `${billableProducts} billable products`
              }
            </div>
          </CardContent>
        </Card>

        {/* Monthly Cost Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Monthly Cost</CardTitle>
              <Euro className="h-5 w-5 text-green-600" />
            </div>
            <CardDescription>Estimated next bill</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(monthlyCost)}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {billableProducts > 0 
                ? `${billableProducts} × €${PRICE_PER_PRODUCT.toFixed(3)}`
                : 'First 100 products are free'
              }
            </div>
          </CardContent>
        </Card>

        {/* Next Billing Date */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Next Billing</CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <CardDescription>When you'll be billed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-gray-900">
              {nextBillingDate}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Products counted monthly
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Plan & Usage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {currentTier.display_name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {currentTier.description}
              </p>
            </div>
            <Badge 
              variant={currentTier.name === 'basic' ? 'secondary' : 'default'}
              className={currentTier.name === 'basic' ? 'bg-green-100 text-green-700' : 'bg-blue-600'}
            >
              Active
            </Badge>
          </div>

          {/* Usage-based pricing info */}
          {billableProducts > 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">
                    Usage-Based Billing
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    You're being charged based on your product count. First {FREE_PRODUCTS} products are free, 
                    then €{PRICE_PER_PRODUCT.toFixed(3)} per product per month. 
                    Your current estimate is based on {usageTracking.current_products} products.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your past 12 months of billing</CardDescription>
            </div>
            {billingHistory && billingHistory.length > 0 && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading billing history...
            </div>
          ) : !billingHistory || billingHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No billing history yet</p>
              <p className="text-sm mt-1">Your first bill will appear here after your first billing cycle</p>
            </div>
          ) : (
            <div className="space-y-3">
              {billingHistory.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(snapshot.snapshot_date)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {snapshot.product_count.toLocaleString()} products
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(snapshot.calculated_amount)}
                      </p>
                      {snapshot.stripe_invoice_id && (
                        <a
                          href={`https://dashboard.stripe.com/invoices/${snapshot.stripe_invoice_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          View invoice
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    {getStatusBadge(snapshot.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enterprise CTA (if approaching limit) */}
      {usageTracking.current_products >= 9000 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-900">Need More Products?</CardTitle>
            <CardDescription>You're approaching the 10,000 product limit</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700 mb-4">
              Looking for more than 10,000 products? Contact our sales team for custom Enterprise pricing 
              with dedicated support, SLA guarantees, and unlimited scalability.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/contact?subject=enterprise-pricing')}
              className="border-purple-600 text-purple-700 hover:bg-purple-100"
            >
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsageDashboard;

