/**
 * All Products Analytics Component
 * Displays statistics for all products (when "Show All Products" is selected)
 */

import React from 'react';
import { 
  Package, 
  DollarSign,
  AlertTriangle,
  XCircle,
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

  // Calculate current analytics from products
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

  // Fetch week-ago analytics
  const { data: weekAgoAnalytics, isLoading: isLoadingWeekAgo } = useQuery({
    queryKey: ['allProductsAnalyticsWeekAgo', user?.id, activeBranch?.branch_id],
    queryFn: async () => {
      if (!user) return null;

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoISO = oneWeekAgo.toISOString();

      let productsQuery = supabase
        .from('products')
        .select('quantity_in_stock, purchase_price, minimum_stock_level')
        .eq('user_id', user.id)
        .lte('created_at', oneWeekAgoISO);

      if (activeBranch?.branch_id) {
        productsQuery = productsQuery.eq('branch_id', activeBranch.branch_id);
      }

      const { data: productsWeekAgo, error } = await productsQuery;

      if (error || !productsWeekAgo) {
        return {
          total_products: 0,
          total_stock_value: 0,
          low_stock_count: 0,
          out_of_stock_count: 0,
        };
      }

      const totalProducts = productsWeekAgo.length;
      const totalStockValue = productsWeekAgo.reduce((sum, p) => {
        const qty = Number(p.quantity_in_stock) || 0;
        const price = Number(p.purchase_price) || 0;
        return sum + (qty * price);
      }, 0);
      
      const lowStockCount = productsWeekAgo.filter(p => {
        const qty = Number(p.quantity_in_stock) || 0;
        const min = Number(p.minimum_stock_level) || 0;
        return qty > 0 && qty <= min;
      }).length;
      
      const outOfStockCount = productsWeekAgo.filter(p => {
        const qty = Number(p.quantity_in_stock) || 0;
        return qty === 0;
      }).length;

      return {
        total_products: totalProducts,
        total_stock_value: totalStockValue,
        low_stock_count: lowStockCount,
        out_of_stock_count: outOfStockCount,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

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

  const weekAgo = weekAgoAnalytics || {
    total_products: 0,
    total_stock_value: 0,
    low_stock_count: 0,
    out_of_stock_count: 0,
  };

  const totalProductsChange = calculatePercentageChange(
    analytics.total_products,
    weekAgo.total_products
  );
  const stockValueChange = calculatePercentageChange(
    analytics.total_stock_value,
    weekAgo.total_stock_value
  );
  const lowStockChange = calculatePercentageChange(
    analytics.low_stock_count,
    weekAgo.low_stock_count
  );
  const outOfStockChange = calculatePercentageChange(
    analytics.out_of_stock_count,
    weekAgo.out_of_stock_count
  );

  if (isLoadingWeekAgo) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

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
