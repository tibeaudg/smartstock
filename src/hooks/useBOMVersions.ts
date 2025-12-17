import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from './useBranches';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface BOMVersion {
  id: string;
  parent_product_id: string;
  version_number: string;
  status: 'draft' | 'active' | 'archived';
  description: string | null;
  effective_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  branch_id: string | null;
}

export interface CreateBOMVersionInput {
  parent_product_id: string;
  version_number: string;
  description?: string;
  effective_date?: string;
}

export interface UpdateBOMVersionInput {
  status?: 'draft' | 'active' | 'archived';
  description?: string;
  effective_date?: string;
}

export const useBOMVersions = (productId: string | null) => {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all versions for a product
  const { data: versions, isLoading, error } = useQuery<BOMVersion[]>({
    queryKey: ['bomVersions', productId, activeBranch?.branch_id],
    queryFn: async () => {
      if (!productId || !activeBranch) return [];

      const { data, error: fetchError } = await supabase
        .from('bom_versions')
        .select('*')
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .order('version_number', { ascending: false });

      if (fetchError) {
        console.error('Error fetching BOM versions:', fetchError);
        throw fetchError;
      }

      return (data || []) as BOMVersion[];
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 30000,
  });

  // Get active version
  const activeVersion = versions?.find(v => v.status === 'active') || null;

  // Create new version
  const createVersion = useMutation({
    mutationFn: async (input: CreateBOMVersionInput) => {
      if (!activeBranch || !user) {
        throw new Error('Missing required data');
      }

      const { data, error: createError } = await supabase
        .from('bom_versions')
        .insert({
          ...input,
          branch_id: activeBranch.branch_id,
          created_by: user.id,
          status: 'draft',
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating BOM version:', createError);
        throw createError;
      }

      return data as BOMVersion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bomVersions', productId] });
      toast.success('BOM version created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create version: ${error.message}`);
    },
  });

  // Update version
  const updateVersion = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateBOMVersionInput }) => {
      const { data, error: updateError } = await supabase
        .from('bom_versions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating BOM version:', updateError);
        throw updateError;
      }

      return data as BOMVersion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bomVersions', productId] });
      queryClient.invalidateQueries({ queryKey: ['productBOM', productId] });
      toast.success('BOM version updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update version: ${error.message}`);
    },
  });

  // Activate version (archives other active versions)
  const activateVersion = useMutation({
    mutationFn: async (versionId: string) => {
      if (!activeBranch) {
        throw new Error('No active branch');
      }

      // First, archive all other active versions for this product
      const { error: archiveError } = await supabase
        .from('bom_versions')
        .update({ status: 'archived' })
        .eq('parent_product_id', productId!)
        .eq('branch_id', activeBranch.branch_id)
        .eq('status', 'active')
        .neq('id', versionId);

      if (archiveError) {
        console.error('Error archiving versions:', archiveError);
        throw archiveError;
      }

      // Then activate the selected version
      const { data, error: activateError } = await supabase
        .from('bom_versions')
        .update({ status: 'active' })
        .eq('id', versionId)
        .select()
        .single();

      if (activateError) {
        console.error('Error activating version:', activateError);
        throw activateError;
      }

      return data as BOMVersion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bomVersions', productId] });
      queryClient.invalidateQueries({ queryKey: ['productBOM', productId] });
      toast.success('BOM version activated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to activate version: ${error.message}`);
    },
  });

  // Delete version
  const deleteVersion = useMutation({
    mutationFn: async (versionId: string) => {
      const { error: deleteError } = await supabase
        .from('bom_versions')
        .delete()
        .eq('id', versionId);

      if (deleteError) {
        console.error('Error deleting BOM version:', deleteError);
        throw deleteError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bomVersions', productId] });
      toast.success('BOM version deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete version: ${error.message}`);
    },
  });

  // Create version from existing (copy)
  const createVersionFromExisting = useMutation({
    mutationFn: async ({ sourceVersionId, newVersionNumber }: { sourceVersionId: string; newVersionNumber: string }) => {
      if (!activeBranch || !user || !productId) {
        throw new Error('Missing required data');
      }

      // Fetch source version's BOM items
      const { data: sourceBOMItems, error: bomError } = await supabase
        .from('product_bom')
        .select('*')
        .eq('bom_version_id', sourceVersionId)
        .eq('branch_id', activeBranch.branch_id);

      if (bomError) {
        console.error('Error fetching source BOM:', bomError);
        throw bomError;
      }

      // Create new version
      const { data: newVersion, error: versionError } = await supabase
        .from('bom_versions')
        .insert({
          parent_product_id: productId,
          version_number: newVersionNumber,
          branch_id: activeBranch.branch_id,
          created_by: user.id,
          status: 'draft',
        })
        .select()
        .single();

      if (versionError) {
        console.error('Error creating new version:', versionError);
        throw versionError;
      }

      // Copy BOM items to new version
      if (sourceBOMItems && sourceBOMItems.length > 0) {
        const newBOMItems = sourceBOMItems.map(item => ({
          parent_product_id: item.parent_product_id,
          component_product_id: item.component_product_id,
          quantity_required: item.quantity_required,
          unit_of_measure: item.unit_of_measure,
          component_uom: item.component_uom,
          conversion_factor: item.conversion_factor,
          scrap_factor: item.scrap_factor,
          sequence_number: item.sequence_number,
          notes: item.notes,
          bom_version_id: newVersion.id,
          branch_id: activeBranch.branch_id,
          created_by: user.id,
        }));

        const { error: itemsError } = await supabase
          .from('product_bom')
          .insert(newBOMItems);

        if (itemsError) {
          console.error('Error copying BOM items:', itemsError);
          throw itemsError;
        }
      }

      return newVersion as BOMVersion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bomVersions', productId] });
      queryClient.invalidateQueries({ queryKey: ['productBOM', productId] });
      toast.success('BOM version copied successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to copy version: ${error.message}`);
    },
  });

  return {
    versions: versions || [],
    activeVersion,
    isLoading,
    error,
    createVersion: createVersion.mutate,
    updateVersion: updateVersion.mutate,
    activateVersion: activateVersion.mutate,
    deleteVersion: deleteVersion.mutate,
    createVersionFromExisting: createVersionFromExisting.mutate,
    isCreating: createVersion.isPending,
    isUpdating: updateVersion.isPending,
    isActivating: activateVersion.isPending,
    isDeleting: deleteVersion.isPending,
    isCopying: createVersionFromExisting.isPending,
  };
};

