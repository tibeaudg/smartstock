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
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Stock Value',
      value: formatCurrency(analytics.total_stock_value),
      change: stockValueChange,
      icon: DollarSign,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Low Stock',
      value: formatNumber(analytics.low_stock_count),
      change: lowStockChange,
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Out of Stock',
      value: formatNumber(analytics.out_of_stock_count),
      change: outOfStockChange,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;
        
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${card.gradient} p-6 shadow-lg`}
          >
            {/* Decorative wavy pattern background */}
            <div className="absolute inset-0 opacity-10">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,50 Q50,0 100,50 T200,50 L200,200 L0,200 Z" fill="white" />
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-white/90">{card.title}</h3>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1 flex flex-col justify-end">
                <div className="text-3xl font-bold text-white mb-2">
                  {card.value}
                </div>
                
                <div className="text-xs text-white/80">
                  {card.change !== 0 ? (
                    <span className={isPositive ? 'text-white/90' : 'text-white/80'}>
                      {formatPercentage(card.change)} This week
                    </span>
                  ) : (
                    <span className="text-white/70">No change this week</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
