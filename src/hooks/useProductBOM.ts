import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from './useBranches';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface BOMItem {
  id: string;
  parent_product_id: string;
  component_product_id: string;
  component_product_name?: string;
  component_product_sku?: string;
  component_stock?: number;
  quantity_required: number;
  unit_of_measure: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BOMWithBuildable extends BOMItem {
  buildableQuantity: number;
  componentAvailable: number;
}

export interface CreateBOMItem {
  component_product_id: string;
  quantity_required: number;
  unit_of_measure?: string;
  notes?: string;
}

export const useProductBOM = (productId: string | null) => {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<BOMItem[]>({
    queryKey: ['productBOM', productId, activeBranch?.branch_id],
    queryFn: async () => {
      if (!productId || !activeBranch) return [];

      const { data: bomData, error: bomError } = await supabase
        .from('product_bom')
        .select('*')
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: true });

      if (bomError) {
        console.error('Error fetching BOM:', bomError);
        throw bomError;
      }

      if (!bomData || bomData.length === 0) return [];

      // Fetch component product details
      const componentIds = bomData.map((item) => item.component_product_id);
      const { data: components, error: componentsError } = await supabase
        .from('products')
        .select('id, name, sku, quantity_in_stock')
        .in('id', componentIds)
        .eq('branch_id', activeBranch.branch_id);

      if (componentsError) {
        console.error('Error fetching component products:', componentsError);
      }

      const componentsMap = new Map(
        (components || []).map((comp) => [comp.id, comp])
      );

      return bomData.map((item) => ({
        ...item,
        component_product_name: componentsMap.get(item.component_product_id)?.name,
        component_product_sku: componentsMap.get(item.component_product_id)?.sku,
        component_stock: componentsMap.get(item.component_product_id)?.quantity_in_stock || 0,
        quantity_required: parseFloat(item.quantity_required.toString()),
      }));
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 30000,
  });

  // Calculate buildable quantity
  const bomWithBuildable = useQuery<BOMWithBuildable[]>({
    queryKey: ['productBOMBuildable', productId, activeBranch?.branch_id, data],
    queryFn: () => {
      if (!data || data.length === 0) return [];

      return data.map((item) => {
        const buildableQuantity = item.component_stock
          ? Math.floor(item.component_stock / item.quantity_required)
          : 0;

        return {
          ...item,
          buildableQuantity,
          componentAvailable: item.component_stock || 0,
        };
      });
    },
    enabled: !!data,
  });

  const buildableQuantity = bomWithBuildable.data
    ? Math.min(...bomWithBuildable.data.map((item) => item.buildableQuantity))
    : 0;

  const createBOMItem = useMutation({
    mutationFn: async (item: CreateBOMItem) => {
      if (!productId || !activeBranch || !user) {
        throw new Error('Missing required data');
      }

      const { data: newItem, error: createError } = await supabase
        .from('product_bom')
        .insert({
          parent_product_id: productId,
          component_product_id: item.component_product_id,
          quantity_required: item.quantity_required,
          unit_of_measure: item.unit_of_measure || 'unit',
          notes: item.notes || null,
          branch_id: activeBranch.branch_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating BOM item:', createError);
        throw createError;
      }

      return newItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productBOM', productId] });
      toast.success('Component added to BOM');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add component: ${error.message}`);
    },
  });

  const updateBOMItem = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CreateBOMItem>;
    }) => {
      const { data: updatedItem, error: updateError } = await supabase
        .from('product_bom')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating BOM item:', updateError);
        throw updateError;
      }

      return updatedItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productBOM', productId] });
      toast.success('BOM item updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update BOM item: ${error.message}`);
    },
  });

  const deleteBOMItem = useMutation({
    mutationFn: async (id: string) => {
      const { error: deleteError } = await supabase
        .from('product_bom')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting BOM item:', deleteError);
        throw deleteError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productBOM', productId] });
      toast.success('Component removed from BOM');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove component: ${error.message}`);
    },
  });

  return {
    bom: data || [],
    bomWithBuildable: bomWithBuildable.data || [],
    buildableQuantity,
    isLoading,
    error,
    createBOMItem: createBOMItem.mutate,
    updateBOMItem: updateBOMItem.mutate,
    deleteBOMItem: deleteBOMItem.mutate,
    isCreating: createBOMItem.isPending,
    isUpdating: updateBOMItem.isPending,
    isDeleting: deleteBOMItem.isPending,
  };
};

