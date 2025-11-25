import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';
import { useDemoBranches, useDemoProducts, useDemoTransactions } from '@/hooks/useDemoData';
import { useCurrency } from '@/hooks/useCurrency';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMobile } from '@/hooks/use-mobile';

interface DemoDashboardProps {
  sessionToken: string | null;
  selectedBranchId?: string;
}

export const DemoDashboard: React.FC<DemoDashboardProps> = ({ sessionToken, selectedBranchId }) => {
  const { formatPrice } = useCurrency();
  const { isMobile } = useMobile();
  const { data: branches, isLoading: branchesLoading } = useDemoBranches(sessionToken);
  const { data: products, isLoading: productsLoading } = useDemoProducts(sessionToken, selectedBranchId);
  const { data: transactions, isLoading: transactionsLoading } = useDemoTransactions(sessionToken, selectedBranchId, 100);

  const activeBranch = useMemo(() => {
    if (!branches || branches.length === 0) return null;
    return selectedBranchId 
      ? branches.find(b => b.id === selectedBranchId) || branches[0]
      : branches[0];
  }, [branches, selectedBranchId]);

  const metrics = useMemo(() => {
    if (!products) return null;

    const totalValue = products.reduce((sum, product) => {
      const stock = product.quantity_in_stock || 0;
      const price = product.unit_price || 0;
      return sum + (stock * price);
    }, 0);

    const totalProducts = products.length;

    const lowStockCount = products.filter(product => {
      const stock = product.quantity_in_stock || 0;
      const minStock = product.minimum_stock_level || 0;
      return stock <= minStock && minStock > 0;
    }).length;

    // Calculate today's activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = transactions?.filter(t => {
      const tDate = new Date(t.created_at);
      tDate.setHours(0, 0, 0, 0);
      return tDate.getTime() === today.getTime();
    }) || [];

    const incomingToday = todayTransactions
      .filter(t => t.transaction_type === 'in' || t.transaction_type === 'incoming')
      .reduce((sum, t) => sum + (t.quantity || 0), 0);

    const outgoingToday = todayTransactions
      .filter(t => t.transaction_type === 'out' || t.transaction_type === 'outgoing')
      .reduce((sum, t) => sum + (t.quantity || 0), 0);

    return {
      totalValue,
      totalProducts,
      lowStockCount,
      incomingToday,
      outgoingToday
    };
  }, [products, transactions]);

  const handleWriteAction = () => {
    toast.info('Register for a free account to save changes', {
      description: 'Create an account to start managing your inventory',
      action: {
        label: 'Sign Up',
        onClick: () => window.location.href = '/auth?mode=register'
      }
    });
  };

  if (branchesLoading || productsLoading || transactionsLoading) {
    return (
      <div className={`space-y-8 ${isMobile ? 'm-2' : 'my-6 mr-6 ml-0'}`}>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`space-y-8 ${isMobile ? 'm-2' : 'my-6 mr-6 ml-0'}`}>
        <div className="text-center text-gray-500">
          <p>No demo data available. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${isMobile ? 'm-2' : 'm-6'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Demo Dashboard</h1>
          {activeBranch && (
            <p className="text-gray-600 mt-1">{activeBranch.name}</p>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(metrics.totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {metrics.totalProducts} products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incoming Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.incomingToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outgoing Today</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.outgoingToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items shipped
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Demo Mode</h3>
              <p className="text-sm text-blue-800">
                You're viewing demo data. All features are available for exploration, but changes won't be saved. 
                Create a free account to start managing your own inventory.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

