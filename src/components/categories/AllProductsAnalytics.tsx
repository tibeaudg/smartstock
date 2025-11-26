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
  ChevronDown,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between w-full px-1 py-2 hover:bg-gray-50 rounded-md transition-colors">
            <h3 className="text-sm font-semibold text-gray-900">Category Overview</h3>
            <ChevronDown className="w-4 h-4 text-gray-500 data-[state=open]:rotate-180 transition-transform" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

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
