import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { fetchInventoryTurnover } from '@/lib/inventory/turnover';

export type TurnoverPeriod = 'monthly' | 'quarterly' | 'yearly';

export interface InventoryTurnoverItem {
  product_id: string;
  product_name: string;
  category_name: string;
  period_start: string;
  period_end: string;
  beginning_inventory: number;
  ending_inventory: number;
  average_inventory: number;
  cogs: number;
  turnover_ratio: number;
  days_sales_of_inventory: number | null;
}

export interface InventoryTurnoverSummary {
  average_turnover_ratio: number;
  total_cogs: number;
  total_average_inventory: number;
  by_category: Record<string, { turnover_ratio: number; cogs: number }>;
}

interface UseInventoryTurnoverOptions {
  period?: TurnoverPeriod;
  startDate?: Date;
  endDate?: Date;
  branchId?: string;
}

export const useInventoryTurnover = ({
  period = 'monthly',
  startDate,
  endDate,
  branchId,
}: UseInventoryTurnoverOptions = {}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const effectiveBranchId = branchId || activeBranch?.branch_id || null;

  useEffect(() => {
    if (!user?.id || !effectiveBranchId) return;

    const channel = supabase
      .channel(`inventory-turnover-rt-${effectiveBranchId}-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_transactions', filter: `branch_id=eq.${effectiveBranchId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['inventoryTurnover'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `branch_id=eq.${effectiveBranchId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['inventoryTurnover'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, effectiveBranchId, queryClient]);

  return useQuery({
    queryKey: [
      'inventoryTurnover',
      period,
      effectiveBranchId,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      if (!effectiveBranchId) throw new Error('No branch selected');

      return fetchInventoryTurnover(effectiveBranchId, period, startDate, endDate);
    },
    enabled: !!user && !!effectiveBranchId,
    staleTime: 0,
  });
};
