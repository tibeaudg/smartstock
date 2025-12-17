import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from './useBranches';

export interface ExplodedBOMItem {
  component_product_id: string;
  component_product_name: string;
  component_product_sku: string | null;
  level: number;
  quantity_required: number;
  effective_quantity: number;
  unit_of_measure: string;
  path: string[];
  parent_product_id: string;
  parent_product_name: string;
}

export interface BOMTreeItem {
  component_product_id: string;
  component_product_name: string;
  component_product_sku: string | null;
  quantity_required: number;
  unit_of_measure: string;
  scrap_factor: number;
  sequence_number: number;
  level: number;
  parent_product_id: string;
  has_children: boolean;
}

export const useBOMExplosion = (
  productId: string | null,
  quantity: number = 1.0,
  bomVersionId: string | null = null
) => {
  const { activeBranch } = useBranches();

  const { data: explodedBOM, isLoading, error } = useQuery<ExplodedBOMItem[]>({
    queryKey: ['bomExplosion', productId, quantity, activeBranch?.branch_id, bomVersionId],
    queryFn: async () => {
      if (!productId || !activeBranch) return [];

      const { data, error: explosionError } = await supabase.rpc('explode_bom', {
        p_product_id: productId,
        p_quantity: quantity,
        p_branch_id: activeBranch.branch_id,
        p_bom_version_id: bomVersionId || null,
      });

      if (explosionError) {
        console.error('Error exploding BOM:', explosionError);
        throw explosionError;
      }

      return (data || []).map((item: any) => ({
        component_product_id: item.component_product_id,
        component_product_name: item.component_product_name || '',
        component_product_sku: item.component_product_sku,
        level: item.level,
        quantity_required: parseFloat(item.quantity_required || 0),
        effective_quantity: parseFloat(item.effective_quantity || 0),
        unit_of_measure: item.unit_of_measure || 'unit',
        path: item.path || [],
        parent_product_id: item.parent_product_id,
        parent_product_name: item.parent_product_name || '',
      })) as ExplodedBOMItem[];
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 30000,
  });

  return {
    explodedBOM: explodedBOM || [],
    isLoading,
    error,
  };
};

export const useBOMTree = (
  productId: string | null,
  bomVersionId: string | null = null
) => {
  const { activeBranch } = useBranches();

  const { data: bomTree, isLoading, error } = useQuery<BOMTreeItem[]>({
    queryKey: ['bomTree', productId, activeBranch?.branch_id, bomVersionId],
    queryFn: async () => {
      if (!productId || !activeBranch) return [];

      const { data, error: treeError } = await supabase.rpc('get_bom_tree', {
        p_product_id: productId,
        p_branch_id: activeBranch.branch_id,
        p_bom_version_id: bomVersionId || null,
      });

      if (treeError) {
        console.error('Error fetching BOM tree:', treeError);
        throw treeError;
      }

      return (data || []).map((item: any) => ({
        component_product_id: item.component_product_id,
        component_product_name: item.component_product_name || '',
        component_product_sku: item.component_product_sku,
        quantity_required: parseFloat(item.quantity_required || 0),
        unit_of_measure: item.unit_of_measure || 'unit',
        scrap_factor: parseFloat(item.scrap_factor || 0),
        sequence_number: item.sequence_number || 0,
        level: item.level,
        parent_product_id: item.parent_product_id,
        has_children: item.has_children || false,
      })) as BOMTreeItem[];
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 30000,
  });

  return {
    bomTree: bomTree || [],
    isLoading,
    error,
  };
};

