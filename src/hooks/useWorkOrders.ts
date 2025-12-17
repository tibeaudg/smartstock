import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from './useBranches';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface WorkOrder {
  id: string;
  wo_number: string;
  product_id: string;
  bom_version_id: string | null;
  quantity_to_build: number;
  status: 'draft' | 'released' | 'in_progress' | 'completed' | 'cancelled';
  priority: number;
  due_date: string | null;
  started_at: string | null;
  completed_at: string | null;
  branch_id: string | null;
  created_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useWorkOrders = () => {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: workOrders, isLoading } = useQuery<WorkOrder[]>({
    queryKey: ['workOrders', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      const { data, error } = await supabase
        .from('work_orders')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching work orders:', error);
        throw error;
      }

      return (data || []) as WorkOrder[];
    },
    enabled: !!activeBranch,
  });

  const createWorkOrder = useMutation({
    mutationFn: async (input: {
      product_id: string;
      bom_version_id?: string | null;
      quantity_to_build: number;
      due_date?: string;
      priority?: number;
      notes?: string;
    }) => {
      if (!activeBranch || !user) {
        throw new Error('Missing required data');
      }

      // Generate WO number
      const woNumber = `WO-${Date.now()}`;

      const { data, error } = await supabase
        .from('work_orders')
        .insert({
          ...input,
          wo_number: woNumber,
          branch_id: activeBranch.branch_id,
          created_by: user.id,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      // Explode work order
      await supabase.rpc('explode_work_order', { p_work_order_id: data.id });

      return data as WorkOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast.success('Work order created');
    },
  });

  const updateWorkOrder = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<WorkOrder> }) => {
      const { data, error } = await supabase
        .from('work_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as WorkOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast.success('Work order updated');
    },
  });

  return {
    workOrders: workOrders || [],
    isLoading,
    createWorkOrder: createWorkOrder.mutate,
    updateWorkOrder: updateWorkOrder.mutate,
    isCreating: createWorkOrder.isPending,
  };
};

