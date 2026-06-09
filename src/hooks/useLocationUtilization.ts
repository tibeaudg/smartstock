import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { fetchLocationUtilization } from '@/lib/inventory/locationUtilization';

export interface LocationUtilizationItem {
  location: string;
  branch_id: string | null;
  branch_name: string | null;
  total_products: number;
  total_quantity: number;
  total_value: number;
  average_value_per_product: number;
  locations_count: number;
}

export interface LocationUtilizationSummary {
  total_locations: number;
  total_value: number;
  total_products: number;
  total_quantity: number;
  average_value_per_location: number;
  top_locations: LocationUtilizationItem[];
}

interface UseLocationUtilizationOptions {
  branchId?: string;
  limit?: number;
}

export const useLocationUtilization = ({
  branchId,
  limit,
}: UseLocationUtilizationOptions = {}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const effectiveBranchId = branchId || activeBranch?.branch_id || null;

  useEffect(() => {
    if (!user?.id || !effectiveBranchId) return;

    const channel = supabase
      .channel(`location-utilization-rt-${effectiveBranchId}-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `branch_id=eq.${effectiveBranchId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['locationUtilization'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, effectiveBranchId, queryClient]);

  return useQuery({
    queryKey: ['locationUtilization', effectiveBranchId, limit],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      if (!effectiveBranchId) throw new Error('No branch selected');

      return fetchLocationUtilization(effectiveBranchId, limit);
    },
    enabled: !!user && !!effectiveBranchId,
    staleTime: 0,
  });
};
