import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';

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

  const effectiveBranchId = branchId || activeBranch?.branch_id || null;

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

      const { data, error } = await supabase.rpc('calculate_inventory_turnover_ratio', {
        p_branch_id: effectiveBranchId,
        p_start_date: startDate?.toISOString().split('T')[0] || null,
        p_end_date: endDate?.toISOString().split('T')[0] || null,
        p_period_type: period,
      });

      if (error) {
        console.error('Error fetching inventory turnover:', error);
        throw error;
      }

      const items: InventoryTurnoverItem[] = (data || []).map((item: any) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        category_name: item.category_name,
        period_start: item.period_start,
        period_end: item.period_end,
        beginning_inventory: parseFloat(item.beginning_inventory || 0),
        ending_inventory: parseFloat(item.ending_inventory || 0),
        average_inventory: parseFloat(item.average_inventory || 0),
        cogs: parseFloat(item.cogs || 0),
        turnover_ratio: parseFloat(item.turnover_ratio || 0),
        days_sales_of_inventory: item.days_sales_of_inventory
          ? parseFloat(item.days_sales_of_inventory)
          : null,
      }));

      // Calculate summary statistics
      const validTurnovers = items.filter((item) => item.turnover_ratio > 0);
      const summary: InventoryTurnoverSummary = {
        average_turnover_ratio:
          validTurnovers.length > 0
            ? validTurnovers.reduce((sum, item) => sum + item.turnover_ratio, 0) /
              validTurnovers.length
            : 0,
        total_cogs: items.reduce((sum, item) => sum + item.cogs, 0),
        total_average_inventory: items.reduce((sum, item) => sum + item.average_inventory, 0),
        by_category: {},
      };

      // Group by category
      items.forEach((item) => {
        if (!summary.by_category[item.category_name]) {
          summary.by_category[item.category_name] = { turnover_ratio: 0, cogs: 0 };
        }
        summary.by_category[item.category_name].cogs += item.cogs;
      });

      // Calculate category turnover ratios
      Object.keys(summary.by_category).forEach((category) => {
        const categoryItems = items.filter((item) => item.category_name === category);
        const categoryAvgInventory = categoryItems.reduce(
          (sum, item) => sum + item.average_inventory,
          0,
        );
        if (categoryAvgInventory > 0) {
          summary.by_category[category].turnover_ratio =
            summary.by_category[category].cogs / categoryAvgInventory;
        }
      });

      return {
        items,
        summary,
      };
    },
    enabled: !!user && !!effectiveBranchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

