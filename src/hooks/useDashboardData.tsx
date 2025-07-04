import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';

export interface DashboardMetrics {
  totalStockValue: number;
  totalProducts: number;
  incomingToday: number;
  outgoingToday: number;
  lowStockAlerts: number;
}

export interface StockTrendData {
  date: string;
  value: number;
}

export interface CategoryData {
  name: string;
  value: number;
  products: number;
}

export interface DailyActivityData {
  date: string;
  incoming: number;
  outgoing: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  stockTrends: StockTrendData[];
  categoryData: CategoryData[];
  dailyActivity: DailyActivityData[];
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();

  const fetchDashboardData = async () => {
    if (!user || !activeBranch) throw new Error('Geen gebruiker of filiaal');

    try {
      // Fetch total stock value and product count
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('quantity_in_stock, unit_price, minimum_stock_level, categories(name)')
        .eq('branch_id', activeBranch.branch_id);

      if (productsError) throw new Error('Failed to fetch products data');

      // Calculate metrics
      const totalValue = productsData?.reduce((sum, product) => 
        sum + (product.quantity_in_stock * product.unit_price), 0) || 0;
      const lowStockCount = productsData?.filter(product => 
        product.quantity_in_stock <= product.minimum_stock_level).length || 0;

      // Get transactions for the last 7 days
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      const { data: transactions, error: transactionError } = await supabase
        .from('stock_transactions')
        .select('transaction_type, quantity, created_at')
        .eq('branch_id', activeBranch.branch_id)
        .gte('created_at', sevenDaysAgo.toISOString());

      if (transactionError) throw new Error('Failed to fetch transactions data');

      // Calculate incoming/outgoing today
      const incomingToday = transactions
        ?.filter(t => t.transaction_type === 'incoming' && new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + t.quantity, 0) || 0;
      const outgoingToday = transactions
        ?.filter(t => t.transaction_type === 'outgoing' && new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + t.quantity, 0) || 0;

      // Generate daily activity (last 7 days)
      const activity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        const dayTransactions = transactions?.filter((t) => {
          const tDate = new Date(t.created_at);
          return tDate >= date && tDate < nextDay;
        }) || [];
        const incoming = dayTransactions.filter((t) => t.transaction_type === 'incoming')
          .reduce((sum, t) => sum + t.quantity, 0);
        const outgoing = dayTransactions.filter((t) => t.transaction_type === 'outgoing')
          .reduce((sum, t) => sum + t.quantity, 0);
        activity.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          incoming,
          outgoing,
        });
      }

      // Generate category data
      const categoryMap = new Map();
      productsData?.forEach((product) => {
        const categoryName = product.categories?.name || 'Uncategorized';
        const existing = categoryMap.get(categoryName) || { value: 0, products: 0 };
        categoryMap.set(categoryName, {
          value: existing.value + (product.quantity_in_stock * product.unit_price),
          products: existing.products + 1,
        });
      });
      const categoryDataArray = Array.from(categoryMap.entries()).map(([name, data]) => ({
        name,
        value: data.value,
        products: data.products,
      }));

      // Generate stock trends (last 7 days, optional)
      const trends = [];
      // ...optioneel: trends vullen...

      return {
        metrics: {
          totalStockValue: totalValue,
          totalProducts: productsData?.length || 0,
          incomingToday,
          outgoingToday,
          lowStockAlerts: lowStockCount,
        },
        stockTrends: trends,
        categoryData: categoryDataArray,
        dailyActivity: activity,
      };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred while fetching dashboard data');
    }
  };

  const {
    data: dashboardData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboardData', activeBranch?.branch_id, user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user && !!activeBranch,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

  return {
    metrics: dashboardData?.metrics ?? {
      totalStockValue: 0,
      totalProducts: 0,
      incomingToday: 0,
      outgoingToday: 0,
      lowStockAlerts: 0,
    },
    stockTrends: dashboardData?.stockTrends ?? [],
    categoryData: dashboardData?.categoryData ?? [],
    dailyActivity: dashboardData?.dailyActivity ?? [],
    loading,
    error,
    refresh: refetch,
  };
};
