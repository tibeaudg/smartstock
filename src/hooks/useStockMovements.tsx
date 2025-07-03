import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StockTransaction, TransactionFilters, StockMovementStats } from '@/types/stockTypes';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useStockMovements = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: 'all',
    transactionType: 'all',
    searchQuery: '',
  });
  const queryClient = useQueryClient();

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
        transaction_type,
        quantity,
        unit_price,
        notes,
        reference_number,
        created_at,
        created_by,
        branch_id
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
    if (filters.searchQuery) query = query.or(`product_name.ilike.%${filters.searchQuery}%,reference_number.ilike.%${filters.searchQuery}%`);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  };

  const {
    data: transactions = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['stockTransactions', activeBranch?.branch_id, filtersKey],
    queryFn: fetchTransactions,
    enabled: !!user && !!activeBranch,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

  // Stats berekenen uit data
  const stats = transactions.reduce(
    (acc, curr) => {
      if (curr.transaction_type === 'incoming') acc.totalIncoming += curr.quantity;
      else acc.totalOutgoing += curr.quantity;
      acc.totalValue += curr.quantity * curr.unit_price;
      acc.transactionCount++;
      return acc;
    },
    { totalIncoming: 0, totalOutgoing: 0, totalValue: 0, transactionCount: 0 }
  );

  // Real-time updates: refetch bij mutatie elders
  // (optioneel: kan met queryClient.invalidateQueries in andere componenten)

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
