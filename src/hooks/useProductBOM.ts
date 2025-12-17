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
  component_uom?: string;
  conversion_factor?: number;
  scrap_factor?: number;
  sequence_number?: number;
  bom_version_id?: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BOMWithBuildable extends BOMItem {
  buildableQuantity: number;
  componentAvailable: number;
  effectiveQuantity: number; // quantity after scrap factor
}

export interface CreateBOMItem {
  component_product_id: string;
  quantity_required: number;
  unit_of_measure?: string;
  component_uom?: string;
  conversion_factor?: number;
  scrap_factor?: number;
  sequence_number?: number;
  bom_version_id?: string | null;
  notes?: string;
}

export const useProductBOM = (productId: string | null, bomVersionId?: string | null) => {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<BOMItem[]>({
    queryKey: ['productBOM', productId, activeBranch?.branch_id, bomVersionId],
    queryFn: async () => {
      if (!productId || !activeBranch) return [];

      let query = supabase
        .from('product_bom')
        .select('*')
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id);

      // Filter by version if provided, otherwise get items without version (backward compatibility)
      if (bomVersionId !== undefined) {
        if (bomVersionId === null) {
          query = query.is('bom_version_id', null);
        } else {
          query = query.eq('bom_version_id', bomVersionId);
        }
      }

      const { data: bomData, error: bomError } = await query.order('sequence_number', { ascending: true, nullsFirst: false })
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
        scrap_factor: item.scrap_factor ? parseFloat(item.scrap_factor.toString()) : 0,
        conversion_factor: item.conversion_factor ? parseFloat(item.conversion_factor.toString()) : 1.0,
        sequence_number: item.sequence_number || 0,
      }));
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 30000,
  });

  // Calculate buildable quantity (accounting for scrap factor)
  const bomWithBuildable = useQuery<BOMWithBuildable[]>({
    queryKey: ['productBOMBuildable', productId, activeBranch?.branch_id, data],
    queryFn: () => {
      if (!data || data.length === 0) return [];

      return data.map((item) => {
        // Calculate effective quantity (base quantity * (1 + scrap factor) * conversion factor)
        const effectiveQuantity = item.quantity_required * 
          (1 + (item.scrap_factor || 0)) * 
          (item.conversion_factor || 1.0);
        
        const buildableQuantity = item.component_stock && effectiveQuantity > 0
          ? Math.floor(item.component_stock / effectiveQuantity)
          : 0;

        return {
          ...item,
          buildableQuantity,
          componentAvailable: item.component_stock || 0,
          effectiveQuantity,
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

      // Get max sequence number for this BOM to set default
      const { data: existingItems } = await supabase
        .from('product_bom')
        .select('sequence_number')
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .eq('bom_version_id', item.bom_version_id || null)
        .order('sequence_number', { ascending: false })
        .limit(1);

      const maxSequence = existingItems && existingItems.length > 0 
        ? (existingItems[0].sequence_number || 0) 
        : 0;

      const { data: newItem, error: createError } = await supabase
        .from('product_bom')
        .insert({
          parent_product_id: productId,
          component_product_id: item.component_product_id,
          quantity_required: item.quantity_required,
          unit_of_measure: item.unit_of_measure || 'unit',
          component_uom: item.component_uom || item.unit_of_measure || 'unit',
          conversion_factor: item.conversion_factor || 1.0,
          scrap_factor: item.scrap_factor || 0,
          sequence_number: item.sequence_number !== undefined ? item.sequence_number : maxSequence + 1,
          bom_version_id: item.bom_version_id || null,
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
      // Clean up updates to remove undefined values
      const cleanUpdates: any = {};
      if (updates.quantity_required !== undefined) cleanUpdates.quantity_required = updates.quantity_required;
      if (updates.unit_of_measure !== undefined) cleanUpdates.unit_of_measure = updates.unit_of_measure;
      if (updates.component_uom !== undefined) cleanUpdates.component_uom = updates.component_uom;
      if (updates.conversion_factor !== undefined) cleanUpdates.conversion_factor = updates.conversion_factor;
      if (updates.scrap_factor !== undefined) cleanUpdates.scrap_factor = updates.scrap_factor;
      if (updates.sequence_number !== undefined) cleanUpdates.sequence_number = updates.sequence_number;
      if (updates.notes !== undefined) cleanUpdates.notes = updates.notes || null;

      const { data: updatedItem, error: updateError } = await supabase
        .from('product_bom')
        .update(cleanUpdates)
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

  // Reorder BOM items by sequence number
  const reorderBOMItems = useMutation({
    mutationFn: async (itemIds: string[]) => {
      if (!activeBranch) {
        throw new Error('No active branch');
      }

      // Update sequence numbers for all items
      const updates = itemIds.map((id, index) => ({
        id,
        sequence_number: index + 1,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('product_bom')
          .update({ sequence_number: update.sequence_number })
          .eq('id', update.id);

        if (error) {
          console.error('Error reordering BOM items:', error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productBOM', productId] });
      toast.success('BOM items reordered');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reorder items: ${error.message}`);
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
    reorderBOMItems: reorderBOMItems.mutate,
    isCreating: createBOMItem.isPending,
    isUpdating: updateBOMItem.isPending,
    isDeleting: deleteBOMItem.isPending,
    isReordering: reorderBOMItems.isPending,
  };
};

