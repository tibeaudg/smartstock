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

export interface UseDashboardDataParams {
  dateFrom?: Date;
  dateTo?: Date;
}

export const useDashboardData = ({ dateFrom, dateTo }: UseDashboardDataParams = {}) => {
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

      // Get transactions for the selected range
      let query = supabase
        .from('stock_transactions')
        .select('transaction_type, quantity, created_at')
        .eq('branch_id', activeBranch.branch_id);
      if (dateFrom) query = query.gte('created_at', dateFrom.toISOString());
      if (dateTo) query = query.lte('created_at', dateTo.toISOString());
      const { data: transactions, error: transactionError } = await query;
      if (transactionError) throw new Error('Failed to fetch transactions data');

      // Calculate incoming/outgoing today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const incomingToday = transactions
        ?.filter(t => t.transaction_type === 'incoming' && new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + t.quantity, 0) || 0;
      const outgoingToday = transactions
        ?.filter(t => t.transaction_type === 'outgoing' && new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + t.quantity, 0) || 0;

      // Generate daily activity (voor gekozen bereik)
      const activity = [];
      let start = dateFrom ? new Date(dateFrom) : new Date();
      let end = dateTo ? new Date(dateTo) : new Date();
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      // Loop van start t/m end (inclusief)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1);
        const dayTransactions = transactions?.filter((t) => {
          const tDate = new Date(t.created_at);
          return tDate >= d && tDate < nextDay;
        }) || [];
        const incoming = dayTransactions.filter((t) => t.transaction_type === 'incoming')
          .reduce((sum, t) => sum + t.quantity, 0);
        const outgoing = dayTransactions.filter((t) => t.transaction_type === 'outgoing')
          .reduce((sum, t) => sum + t.quantity, 0);
        activity.push({
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
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
    queryKey: ['dashboardData', activeBranch?.branch_id, user?.id, dateFrom?.toISOString(), dateTo?.toISOString()],
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
