import { useEffect, useState } from 'react';
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

  const fetchTransactions = async (
    previousData: StockTransaction[] = [],
    options: { skipRetry?: boolean } = {}
  ) => {
    if (!user || !activeBranch) return [];

    const performFetch = async () => {
      console.log('[useStockMovements] Fetching transactions', {
        branchId: activeBranch?.branch_id,
        filters,
      });
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
          source_type,
          source_id,
          adjustment_method,
          audit_trail,
          profiles:created_by (email, first_name, last_name)
        `)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });

      if (filters.transactionType !== 'all') {
        query = query.eq('transaction_type', filters.transactionType);
      }
      
      if (filters.sourceType && filters.sourceType !== 'all') {
        query = query.eq('source_type', filters.sourceType);
      }
      
      if (filters.adjustmentMethod && filters.adjustmentMethod !== 'all') {
        query = query.eq('adjustment_method', filters.adjustmentMethod);
      }
      
      if (filters.userId) {
        query = query.eq('created_by', filters.userId);
      }
      
      if (filters.productId) {
        query = query.eq('product_id', filters.productId);
      }

      const getDateRange = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        switch (filters.dateRange) {
          case 'today':
            return { start: today.toISOString() };
          case 'week': {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return { start: weekAgo.toISOString() };
          }
          case 'month': {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return { start: monthAgo.toISOString() };
          }
          case 'custom':
            return { start: filters.startDate?.toISOString(), end: filters.endDate?.toISOString() };
          default:
            return {};
        }
      };

      const dateRange = getDateRange();
      if (dateRange.start) query = query.gte('created_at', dateRange.start);
      if (dateRange.end) query = query.lte('created_at', dateRange.end);

      if (filters.searchQuery) {
        const sanitizedQuery = filters.searchQuery.replace(/[%;\\]/g, '');
        query = query.or(`product_name.ilike.%${sanitizedQuery}%,reference_number.ilike.%${sanitizedQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      const mapped = (data || []).map((row: Record<string, unknown>) => ({
        ...row,
        email: row.profiles?.email ?? null,
        first_name: row.profiles?.first_name ?? null,
        last_name: row.profiles?.last_name ?? null,
        source_type: row.source_type ?? null,
        source_id: row.source_id ?? null,
        adjustment_method: row.adjustment_method ?? null,
        audit_trail: row.audit_trail ?? null,
      }));
      console.log('[useStockMovements] Fetched transaction count', mapped.length);
      return mapped;
    };

    try {
      const result = await performFetch();

      if (result.length === 0 && previousData.length > 0 && !options.skipRetry) {
        console.warn('[useStockMovements] Empty transaction result despite cached data. Attempting session refresh.');
        try {
          const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            throw refreshError;
          }

          if (!refreshed?.session) {
            throw new Error('No session returned after refreshSession');
          }

          const retryResult = await fetchTransactions(previousData, { skipRetry: true });
          console.log('[useStockMovements] Retry result count', retryResult.length);
          if (retryResult.length === 0) {
            console.warn('[useStockMovements] Retry after session refresh still returned no transactions. Falling back to cached data.');
            return previousData;
          }

          return retryResult;
        } catch (retryError) {
          console.error('[useStockMovements] Failed to refresh session or refetch transactions. Falling back to cached data.', retryError);
          return previousData;
        }
      }

      return result;
    } catch (error) {
      console.error('[useStockMovements] Error fetching transactions:', error);
      if (previousData.length > 0 && !options.skipRetry) {
        console.warn('[useStockMovements] Returning cached transactions because fetch failed.');
        return previousData;
      }
      throw error;
    }
  };

  const {
    data: transactions = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<StockTransaction[]>({
    queryKey: ['stockTransactions', activeBranch?.branch_id, filtersKey],
    queryFn: async () => {
      if (!user || !activeBranch) return [];
      const cachedTransactions =
        queryClient.getQueryData<StockTransaction[]>(['stockTransactions', activeBranch.branch_id, filtersKey]) || [];
      return fetchTransactions(cachedTransactions);
    },
    enabled: !!user && !!activeBranch,
    refetchOnWindowFocus: true, // Enable refetch on window focus for fresh data
    staleTime: 1000 * 60 * 2, // Mark as stale after 2 minutes (allows background refresh)
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
