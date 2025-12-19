import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from './useBranches';

export interface DemandForecastData {
  velocity7Days: number;
  velocity30Days: number;
  velocity90Days: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  suggestedRestockDate: string | null;
  daysUntilReorder: number | null;
  demandHistory: Array<{
    date: string;
    quantity: number;
  }>;
}

export const useProductDemandForecast = (
  productId: string | null,
  currentStock: number,
  reorderPoint: number
) => {
  const { activeBranch } = useBranches();

  return useQuery<DemandForecastData>({
    queryKey: [
      'productDemandForecast',
      productId,
      activeBranch?.branch_id,
      currentStock,
      reorderPoint,
    ],
    queryFn: async () => {
      if (!productId || !activeBranch) {
        return {
          velocity7Days: 0,
          velocity30Days: 0,
          velocity90Days: 0,
          trend: 'stable',
          trendPercentage: 0,
          suggestedRestockDate: null,
          daysUntilReorder: null,
          demandHistory: [],
        };
      }

      const now = new Date();
      const days90Ago = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const days7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Fetch outgoing transactions (demand)
      const { data, error } = await supabase
        .from('stock_transactions')
        .select('created_at, quantity, transaction_type')
        .eq('product_id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .in('transaction_type', ['outgoing', 'sales_order'])
        .gte('created_at', days90Ago.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching demand data:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          velocity7Days: 0,
          velocity30Days: 0,
          velocity90Days: 0,
          trend: 'stable',
          trendPercentage: 0,
          suggestedRestockDate: null,
          daysUntilReorder: null,
          demandHistory: [],
        };
      }

      // Group by date and sum quantities
      const demandByDate = new Map<string, number>();
      data.forEach((tx) => {
        const date = new Date(tx.created_at).toISOString().split('T')[0];
        demandByDate.set(date, (demandByDate.get(date) || 0) + Math.abs(tx.quantity));
      });

      const demandHistory = Array.from(demandByDate.entries())
        .map(([date, quantity]) => ({ date, quantity }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Calculate velocities
      const calculateVelocity = (days: number) => {
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        const relevantData = data.filter(
          (tx) => new Date(tx.created_at) >= cutoffDate
        );
        const totalQuantity = relevantData.reduce(
          (sum, tx) => sum + Math.abs(tx.quantity),
          0
        );
        return totalQuantity / days;
      };

      const velocity7Days = calculateVelocity(7);
      const velocity30Days = calculateVelocity(30);
      const velocity90Days = calculateVelocity(90);

      // Calculate trend (compare 7-day vs 30-day velocity)
      const trendPercentage =
        velocity30Days > 0
          ? ((velocity7Days - velocity30Days) / velocity30Days) * 100
          : 0;

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (trendPercentage > 10) {
        trend = 'up';
      } else if (trendPercentage < -10) {
        trend = 'down';
      }

      // Calculate suggested restock date
      let suggestedRestockDate: string | null = null;
      let daysUntilReorder: number | null = null;

      if (velocity7Days > 0 && reorderPoint > 0) {
        const daysUntilReorderPoint = Math.ceil(
          (currentStock - reorderPoint) / velocity7Days
        );
        daysUntilReorder = daysUntilReorderPoint;

        if (daysUntilReorderPoint > 0) {
          const restockDate = new Date(
            now.getTime() + daysUntilReorderPoint * 24 * 60 * 60 * 1000
          );
          suggestedRestockDate = restockDate.toISOString();
        } else {
          suggestedRestockDate = now.toISOString(); // Need to reorder now
        }
      }

      return {
        velocity7Days: Math.round(velocity7Days * 100) / 100,
        velocity30Days: Math.round(velocity30Days * 100) / 100,
        velocity90Days: Math.round(velocity90Days * 100) / 100,
        trend,
        trendPercentage: Math.round(trendPercentage * 10) / 10,
        suggestedRestockDate,
        daysUntilReorder,
        demandHistory,
      };
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 300000, // 5 minutes
  });
};




