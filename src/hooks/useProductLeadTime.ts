import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from './useBranches';

export interface LeadTimeData {
  averageDays: number;
  lastReceiptDate: string | null;
  receiptCount: number;
  trend: 'up' | 'down' | 'stable';
  previousAverage: number | null;
}

export const useProductLeadTime = (productId: string | null) => {
  const { activeBranch } = useBranches();

  return useQuery<LeadTimeData>({
    queryKey: ['productLeadTime', productId, activeBranch?.branch_id],
    queryFn: async () => {
      if (!productId || !activeBranch) {
        return {
          averageDays: 0,
          lastReceiptDate: null,
          receiptCount: 0,
          trend: 'stable',
          previousAverage: null,
        };
      }

      // Fetch incoming transactions
      const { data, error } = await supabase
        .from('stock_transactions')
        .select('created_at, transaction_type')
        .eq('product_id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .in('transaction_type', ['incoming', 'purchase_order'])
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching lead time data:', error);
        throw error;
      }

      if (!data || data.length < 2) {
        return {
          averageDays: 0,
          lastReceiptDate: data && data.length > 0 ? data[0].created_at : null,
          receiptCount: data?.length || 0,
          trend: 'stable',
          previousAverage: null,
        };
      }

      // Calculate days between consecutive receipts
      const receiptDates = data
        .map((tx) => new Date(tx.created_at))
        .sort((a, b) => b.getTime() - a.getTime());

      const intervals: number[] = [];
      for (let i = 0; i < receiptDates.length - 1; i++) {
        const daysDiff =
          (receiptDates[i].getTime() - receiptDates[i + 1].getTime()) /
          (1000 * 60 * 60 * 24);
        intervals.push(daysDiff);
      }

      const averageDays =
        intervals.reduce((sum, days) => sum + days, 0) / intervals.length;

      // Calculate trend (compare first half vs second half)
      const midPoint = Math.floor(intervals.length / 2);
      const firstHalf = intervals.slice(0, midPoint);
      const secondHalf = intervals.slice(midPoint);

      const firstHalfAvg =
        firstHalf.reduce((sum, days) => sum + days, 0) / firstHalf.length;
      const secondHalfAvg =
        secondHalf.reduce((sum, days) => sum + days, 0) / secondHalf.length;

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (secondHalfAvg > firstHalfAvg * 1.1) {
        trend = 'up'; // Lead time increasing
      } else if (secondHalfAvg < firstHalfAvg * 0.9) {
        trend = 'down'; // Lead time decreasing
      }

      return {
        averageDays: Math.round(averageDays * 10) / 10,
        lastReceiptDate: receiptDates[0].toISOString(),
        receiptCount: receiptDates.length,
        trend,
        previousAverage: firstHalfAvg,
      };
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 300000, // 5 minutes
  });
};

