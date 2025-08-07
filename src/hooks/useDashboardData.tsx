import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { useEffect } from 'react';

interface UseDashboardDataParams {
  dateFrom?: Date;
  dateTo?: Date;
}

interface DashboardData {
  totalValue: number;
  totalProducts: number;
  lowStockCount: number;
  incomingToday: number;
  outgoingToday: number;
  totalTransactions: number;
  dailyActivity?: Array<{
    date: string;
    incoming: number;
    outgoing: number;
  }>;
}

export const useDashboardData = ({ dateFrom, dateTo }: UseDashboardDataParams = {}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const fetchDashboardData = async () => {
    if (!user || !activeBranch) throw new Error('Geen gebruiker of filiaal');

    try {
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

      // Generate daily activity data for chart
      const dailyActivity = generateDailyActivity(transactions || [], dateFrom, dateTo);

      return {
        totalValue,
        totalProducts: productsData?.length || 0,
        lowStockCount,
        incomingToday,
        outgoingToday,
        totalTransactions: transactions?.length || 0,
        dailyActivity,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  // Helper function to generate daily activity data
  const generateDailyActivity = (transactions: any[], from?: Date, to?: Date) => {
    const activityMap = new Map<string, { incoming: number; outgoing: number }>();
    
    // Initialize all days in range with 0 values
    const startDate = from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days ago
    const endDate = to || new Date();
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      activityMap.set(dateStr, { incoming: 0, outgoing: 0 });
    }

    // Add transaction data
    transactions.forEach(transaction => {
      const dateStr = new Date(transaction.created_at).toISOString().split('T')[0];
      const existing = activityMap.get(dateStr) || { incoming: 0, outgoing: 0 };
      
      if (transaction.transaction_type === 'incoming') {
        existing.incoming += transaction.quantity;
      } else if (transaction.transaction_type === 'outgoing') {
        existing.outgoing += transaction.quantity;
      }
      
      activityMap.set(dateStr, existing);
    });

    // Convert to array format for chart
    return Array.from(activityMap.entries()).map(([date, data]) => ({
      date,
      incoming: data.incoming,
      outgoing: data.outgoing,
    }));
  };

  // Real-time updates voor dashboard data
  useEffect(() => {
    if (!user?.id || !activeBranch?.branch_id) return;

    const dashboardChannel = supabase
      .channel('dashboard-changes-' + activeBranch.branch_id)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        () => {
          console.log('Product wijziging gedetecteerd, refresh dashboard...');
          queryClient.invalidateQueries({ 
            queryKey: ['dashboardData', activeBranch.branch_id, dateFrom, dateTo] 
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_transactions',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        () => {
          console.log('Stock transaction wijziging gedetecteerd, refresh dashboard...');
          queryClient.invalidateQueries({ 
            queryKey: ['dashboardData', activeBranch.branch_id, dateFrom, dateTo] 
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dashboardChannel);
    };
  }, [user?.id, activeBranch?.branch_id, queryClient, dateFrom, dateTo]);

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<DashboardData>({
    queryKey: ['dashboardData', activeBranch?.branch_id, dateFrom, dateTo],
    queryFn: fetchDashboardData,
    enabled: !!user && !!activeBranch,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2, // 2 minuten cache
  });

  return {
    data: dashboardData,
    isLoading,
    error,
  };
};

// Extra hook voor alleen het aantal producten
export const useProductCount = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const fetchProductCount = async () => {
    if (!user || !activeBranch) return 0;
    const { count, error } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('branch_id', activeBranch.branch_id);
    if (error) return 0;
    return count || 0;
  };

  useEffect(() => {
    if (!activeBranch) return;
    // Maak altijd een nieuwe channel instance aan
    const channel = supabase.channel('products-count-' + activeBranch.branch_id + '-' + Math.random().toString(36).substr(2, 9))
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user?.id] });
        }
      );
    try {
      channel.subscribe();
    } catch (e) {
      console.error('Supabase subscribe error:', e);
    }
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeBranch, user, queryClient]);

  const { data: productCount, isLoading } = useQuery({
    queryKey: ['productCount', activeBranch?.branch_id, user?.id],
    queryFn: fetchProductCount,
    enabled: !!user && !!activeBranch,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

  return { productCount: productCount ?? 0, isLoading };
};
