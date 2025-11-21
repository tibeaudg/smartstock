/**
 * Category Analytics Component
 * Displays product counts, stock values, and statistics for a category
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  BarChart3,
} from 'lucide-react';
import type { CategoryAnalytics as CategoryAnalyticsType } from '@/types/categoryTypes';
import { useCategoryAnalytics } from '@/hooks/useCategories';

interface CategoryAnalyticsProps {
  categoryId: string | null;
}

export const CategoryAnalytics: React.FC<CategoryAnalyticsProps> = ({
  categoryId,
}) => {
  const { data: analytics, isLoading } = useCategoryAnalytics(categoryId);

  if (!categoryId) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Select a category to view analytics
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No analytics data available
        </CardContent>
      </Card>
    );
  }

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
            Products in this category
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
            {analytics.products_added_last_30_days !== undefined && (
              <div>
                <div className="text-sm text-muted-foreground">Added (30 days)</div>
                <div className="text-lg font-semibold flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  {formatNumber(analytics.products_added_last_30_days)}
                </div>
              </div>
            )}
            {analytics.stock_value_change_percentage !== undefined && (
              <div>
                <div className="text-sm text-muted-foreground">Value Change</div>
                <div className={`text-lg font-semibold flex items-center gap-1 ${
                  analytics.stock_value_change_percentage >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  <TrendingUp className="h-4 w-4" />
                  {analytics.stock_value_change_percentage >= 0 ? '+' : ''}
                  {analytics.stock_value_change_percentage.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

