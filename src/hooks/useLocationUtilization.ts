import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';

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

  const effectiveBranchId = branchId || activeBranch?.branch_id || null;

  return useQuery({
    queryKey: ['locationUtilization', effectiveBranchId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('calculate_location_utilization', {
        p_branch_id: effectiveBranchId,
      });

      if (error) {
        console.error('Error fetching location utilization:', error);
        throw error;
      }

      const items: LocationUtilizationItem[] = (data || [])
        .map((item: any) => ({
          location: item.location,
          branch_id: item.branch_id,
          branch_name: item.branch_name,
          total_products: item.total_products,
          total_quantity: item.total_quantity,
          total_value: parseFloat(item.total_value || 0),
          average_value_per_product: parseFloat(item.average_value_per_product || 0),
          locations_count: item.locations_count,
        }))
        .filter((item: LocationUtilizationItem) => {
          // Filter out "No Location" if limit is set (for top locations only)
          if (limit && item.location === 'No Location') return false;
          return true;
        })
        .sort((a, b) => b.total_value - a.total_value)
        .slice(0, limit || Infinity);

      // Calculate summary statistics
      const summary: LocationUtilizationSummary = {
        total_locations: items.length,
        total_value: items.reduce((sum, item) => sum + item.total_value, 0),
        total_products: items.reduce((sum, item) => sum + item.total_products, 0),
        total_quantity: items.reduce((sum, item) => sum + item.total_quantity, 0),
        average_value_per_location:
          items.length > 0
            ? items.reduce((sum, item) => sum + item.total_value, 0) / items.length
            : 0,
        top_locations: items.slice(0, 10), // Top 10 locations by value
      };

      return {
        items,
        summary,
      };
    },
    enabled: !!user && !!effectiveBranchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

