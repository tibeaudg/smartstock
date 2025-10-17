import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StockTransaction, TransactionFilters, StockMovementStats } from '@/types/stockTypes';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useStockMovements = (): {
  transactions: StockTransaction[];
  stats: StockMovementStats;
  loading: boolean;
  error: Error | null;
  filters: TransactionFilters;
  setFilters: React.Dispatch<React.SetStateAction<TransactionFilters>>;
  refresh: () => void;
} => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: 'all',
    transactionType: 'all',
    searchQuery: '',
  });

  // Helper om filters te serialiseren voor queryKey
  const filtersKey = JSON.stringify(filters);

  const fetchTransactions = async () => {
    if (!user || !activeBranch) return [];
    let query = supabase
      .from('stock_transactions')
      .select(`
        id,
        product_id,
        product_name,
        variant_id,
        variant_name,
        transaction_type,
        quantity,
        unit_price,
        total_value,
        notes,
        reference_number,
        created_at,
        created_by,
        branch_id,
        profiles:created_by (email, first_name, last_name)
      `)
      .eq('branch_id', activeBranch.branch_id)
      .order('created_at', { ascending: false });
    if (filters.transactionType !== 'all') {
      query = query.eq('transaction_type', filters.transactionType);
    }
    const getDateRange = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      switch (filters.dateRange) {
        case 'today': return { start: today.toISOString() };
        case 'week': const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7); return { start: weekAgo.toISOString() };
        case 'month': const monthAgo = new Date(today); monthAgo.setMonth(monthAgo.getMonth() - 1); return { start: monthAgo.toISOString() };
        case 'custom': return { start: filters.startDate?.toISOString(), end: filters.endDate?.toISOString() };
        default: return {};
      }
    };
    const dateRange = getDateRange();
    if (dateRange.start) query = query.gte('created_at', dateRange.start);
    if (dateRange.end) query = query.lte('created_at', dateRange.end);
    // Use textSearch or separate filters to prevent SQL injection
    if (filters.searchQuery) {
      // Sanitize search query - remove special SQL characters
      const sanitizedQuery = filters.searchQuery.replace(/[%;\\]/g, '');
      query = query.or(`product_name.ilike.%${sanitizedQuery}%,reference_number.ilike.%${sanitizedQuery}%`);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map((row: any) => ({
      ...row,
      email: row.profiles?.email ?? null,
      first_name: row.profiles?.first_name ?? null,
      last_name: row.profiles?.last_name ?? null,
    }));
  };

  const {
    data: transactions = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<StockTransaction[]>({
    queryKey: ['stockTransactions', activeBranch?.branch_id, filtersKey],
    queryFn: fetchTransactions,
    enabled: !!user && !!activeBranch,
    refetchOnWindowFocus: false, // Disabled - show cached data immediately
    staleTime: Infinity, // Never mark as stale - persist until invalidated
    onError: (error) => {
      console.error('Stock movements fetch error:', error);
    },
  });

  // Real-time updates voor stock transactions
  useEffect(() => {
    if (!user?.id || !activeBranch?.branch_id) return;

    const transactionsChannel = supabase
      .channel('stock-transactions-changes-' + activeBranch.branch_id)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_transactions',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        () => {
          console.log('Stock transaction wijziging gedetecteerd, refresh transactions...');
          queryClient.invalidateQueries({ 
            queryKey: ['stockTransactions', activeBranch.branch_id, filtersKey] 
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsChannel);
    };
  }, [user?.id, activeBranch?.branch_id, queryClient, filtersKey]);

  // Stats berekenen uit data
  const stats = transactions.reduce(
    (acc, curr) => {
      if (curr.transaction_type === 'incoming') acc.totalIncoming += curr.quantity;
      else acc.totalOutgoing += curr.quantity;
      acc.totalValue += Number(curr.total_value) || (curr.quantity * Number(curr.unit_price));
      acc.transactionCount++;
      return acc;
    },
    { totalIncoming: 0, totalOutgoing: 0, totalValue: 0, transactionCount: 0 }
  );

  return {
    transactions,
    stats,
    loading,
    error,
    filters,
    setFilters,
    refresh: refetch,
  };
};
