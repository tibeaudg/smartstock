/**
 * Category Analytics Component
 * Displays product counts, stock values, and statistics for a category
 */

import React from 'react';
import { 
  Package, 
  DollarSign,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatPercentage = (value: number): string => {
    const absValue = Math.abs(value);
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${absValue.toFixed(0)}%`;
  };

  const weekAgoData = {
    total_products: analytics.total_products_week_ago ?? 0,
    total_stock_value: analytics.total_stock_value_week_ago ?? 0,
    low_stock_count: analytics.low_stock_count_week_ago ?? 0,
    out_of_stock_count: analytics.out_of_stock_count_week_ago ?? 0,
  };

  const totalProductsChange = calculatePercentageChange(
    analytics.total_products,
    weekAgoData.total_products
  );
  const stockValueChange = calculatePercentageChange(
    analytics.total_stock_value,
    weekAgoData.total_stock_value
  );
  const lowStockChange = calculatePercentageChange(
    analytics.low_stock_count,
    weekAgoData.low_stock_count
  );
  const outOfStockChange = calculatePercentageChange(
    analytics.out_of_stock_count,
    weekAgoData.out_of_stock_count
  );

  const statsCards = [
    {
      title: 'Total Products',
      value: formatNumber(analytics.total_products),
      change: totalProductsChange,
      icon: Package,
      gradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-gray-900',
    },
    {
      title: 'Stock Value',
      value: formatCurrency(analytics.total_stock_value),
      change: stockValueChange,
      icon: DollarSign,
      gradient: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-gray-900',
    },
    {
      title: 'Low Stock',
      value: formatNumber(analytics.low_stock_count),
      change: lowStockChange,
      icon: AlertTriangle,
      gradient: 'from-orange-50 to-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-gray-900',
    },
    {
      title: 'Out of Stock',
      value: formatNumber(analytics.out_of_stock_count),
      change: outOfStockChange,
      icon: XCircle,
      gradient: 'from-red-50 to-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-gray-900',
    },
  ];

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between w-full px-1 py-2 hover:bg-gray-50 rounded-md transition-colors">
          <h3 className="text-sm font-semibold text-gray-900">Category Overview</h3>
          <ChevronDown className="w-4 h-4 text-gray-500 data-[state=open]:rotate-180 transition-transform" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            
            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${card.gradient} p-4 border border-gray-200`}
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xs font-medium text-gray-700">{card.title}</h3>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-end">
                    <div className={`text-2xl font-bold ${card.textColor} mb-1`}>
                      {card.value}
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      {card.change !== 0 ? (
                        <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                          {formatPercentage(card.change)} This week
                        </span>
                      ) : (
                        <span className="text-gray-500">No change this week</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
