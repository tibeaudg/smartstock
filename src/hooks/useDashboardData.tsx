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

export const useDashboardData = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();

  const fetchDashboardData = async () => {
    if (!user || !activeBranch) throw new Error('Geen gebruiker of filiaal');

    try {
      console.log('Fetching dashboard data for branch:', activeBranch.branch_id);

      // Fetch total stock value and product count
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('quantity_in_stock, unit_price, minimum_stock_level')
        .eq('branch_id', activeBranch.branch_id);

      if (productsError) throw new Error('Failed to fetch products data');

      // Calculate metrics
      const totalValue = productsData?.reduce((sum, product) => 
        sum + (product.quantity_in_stock * product.unit_price), 0) || 0;
      
      const lowStockCount = productsData?.filter(product => 
        product.quantity_in_stock <= product.minimum_stock_level).length || 0;

      // Get today's transactions
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: todayTransactions, error: transactionError } = await supabase
        .from('stock_transactions')
        .select('transaction_type, quantity')
        .eq('branch_id', activeBranch.branch_id)
        .gte('created_at', today.toISOString());

      if (transactionError) throw new Error('Failed to fetch transactions data');

      const incomingToday = todayTransactions
        ?.filter(t => t.transaction_type === 'incoming')
        .reduce((sum, t) => sum + t.quantity, 0) || 0;

      const outgoingToday = todayTransactions
        ?.filter(t => t.transaction_type === 'outgoing')
        .reduce((sum, t) => sum + t.quantity, 0) || 0;

      // Generate stock trends (last 7 days)
      const trends: StockTrendData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayTransactions = todayTransactions?.filter((t: any) => 
          t.created_at.startsWith(dateStr)
        ) || [];
        
        const dayValue = dayTransactions.reduce((sum: number, t: any) => sum + (t.total_value || 0), 0);
        trends.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: dayValue,
        });
      }

      // Generate category data
      const categoryMap = new Map<string, { value: number; products: number }>();
      productsData?.forEach((product: any) => {
        const categoryName = product.categories?.name || 'Uncategorized';
        const existing = categoryMap.get(categoryName) || { value: 0, products: 0 };
        categoryMap.set(categoryName, {
          value: existing.value + (product.quantity_in_stock * product.unit_price),
          products: existing.products + 1,
        });
      });

      const categoryDataArray: CategoryData[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
        name,
        value: data.value,
        products: data.products,
      }));

      // Generate daily activity (last 7 days)
      const activity: DailyActivityData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayTransactions = todayTransactions?.filter((t: any) => 
          t.created_at.startsWith(dateStr)
        ) || [];
        
        const incoming = dayTransactions.filter((t: any) => t.transaction_type === 'incoming')
          .reduce((sum: number, t: any) => sum + t.quantity, 0);
        const outgoing = dayTransactions.filter((t: any) => t.transaction_type === 'outgoing')
          .reduce((sum: number, t: any) => sum + t.quantity, 0);
          
        activity.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          incoming,
          outgoing,
        });
      }

      console.log('Dashboard data fetched successfully for branch:', activeBranch.branch_id);

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
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboardData', activeBranch?.branch_id],
    queryFn: fetchDashboardData,
    enabled: !!user && !!activeBranch,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

  return {
    metrics: data?.metrics ?? {
      totalStockValue: 0,
      totalProducts: 0,
      incomingToday: 0,
      outgoingToday: 0,
      lowStockAlerts: 0,
    },
    stockTrends: data?.stockTrends ?? [],
    categoryData: data?.categoryData ?? [],
    dailyActivity: data?.dailyActivity ?? [],
    loading,
    error,
    refresh: refetch,
  };
};
