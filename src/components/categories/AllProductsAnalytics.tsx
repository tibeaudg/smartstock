/**
 * All Products Analytics Component
 * Displays statistics for all products (when "Show All Products" is selected)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  AlertTriangle, 
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';

interface AllProductsAnalyticsProps {
  products: any[];
}

export const AllProductsAnalytics: React.FC<AllProductsAnalyticsProps> = ({
  products,
}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();

  // Calculate analytics from products
  const analytics = React.useMemo(() => {
    if (!products || products.length === 0) {
      return {
        total_products: 0,
        total_stock_quantity: 0,
        total_stock_value: 0,
        low_stock_count: 0,
        out_of_stock_count: 0,
        average_price: 0,
      };
    }

    const totalProducts = products.length;
    const totalStockQuantity = products.reduce((sum, p) => sum + (Number(p.quantity_in_stock) || 0), 0);
    const totalStockValue = products.reduce((sum, p) => {
      const qty = Number(p.quantity_in_stock) || 0;
      const price = Number(p.purchase_price) || 0;
      return sum + (qty * price);
    }, 0);
    
    const lowStockCount = products.filter(p => {
      const qty = Number(p.quantity_in_stock) || 0;
      const min = Number(p.minimum_stock_level) || 0;
      return qty > 0 && qty <= min;
    }).length;
    
    const outOfStockCount = products.filter(p => {
      const qty = Number(p.quantity_in_stock) || 0;
      return qty === 0;
    }).length;
    
    const averagePrice = totalProducts > 0 
      ? products.reduce((sum, p) => sum + (Number(p.purchase_price) || 0), 0) / totalProducts
      : 0;

    return {
      total_products: totalProducts,
      total_stock_quantity: totalStockQuantity,
      total_stock_value: totalStockValue,
      low_stock_count: lowStockCount,
      out_of_stock_count: outOfStockCount,
      average_price: averagePrice,
    };
  }, [products]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(analytics.total_products)}</div>
          <p className="text-xs text-muted-foreground">
            All products in inventory
          </p>
        </CardContent>
      </Card>

      {/* Stock Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(analytics.total_stock_value)}</div>
          <p className="text-xs text-muted-foreground">
            Total inventory value
          </p>
        </CardContent>
      </Card>

      {/* Low Stock */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{formatNumber(analytics.low_stock_count)}</div>
          <p className="text-xs text-muted-foreground">
            Products below minimum
          </p>
        </CardContent>
      </Card>

      {/* Out of Stock */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatNumber(analytics.out_of_stock_count)}</div>
          <p className="text-xs text-muted-foreground">
            Products with zero stock
          </p>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Additional Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Stock Quantity</div>
              <div className="text-lg font-semibold">{formatNumber(analytics.total_stock_quantity)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Average Price</div>
              <div className="text-lg font-semibold">{formatCurrency(analytics.average_price)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

