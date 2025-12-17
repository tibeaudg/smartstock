import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from './useBranches';
import { toast } from 'sonner';

export interface UOMConversion {
  id: string;
  product_id: string;
  from_uom: string;
  to_uom: string;
  conversion_factor: number;
  branch_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUOMConversionInput {
  product_id: string;
  from_uom: string;
  to_uom: string;
  conversion_factor: number;
}

export const useUOMConversions = (productId: string | null) => {
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  // Fetch conversions for a product
  const { data: conversions, isLoading, error } = useQuery<UOMConversion[]>({
    queryKey: ['uomConversions', productId, activeBranch?.branch_id],
    queryFn: async () => {
      if (!productId || !activeBranch) return [];

      const { data, error: fetchError } = await supabase
        .from('uom_conversions')
        .select('*')
        .eq('product_id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .order('from_uom', { ascending: true });

      if (fetchError) {
        console.error('Error fetching UOM conversions:', fetchError);
        throw fetchError;
      }

      return (data || []) as UOMConversion[];
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 30000,
  });

  // Create conversion
  const createConversion = useMutation({
    mutationFn: async (input: CreateUOMConversionInput) => {
      if (!activeBranch) {
        throw new Error('No active branch');
      }

      const { data, error: createError } = await supabase
        .from('uom_conversions')
        .insert({
          ...input,
          branch_id: activeBranch.branch_id,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating UOM conversion:', createError);
        throw createError;
      }

      return data as UOMConversion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uomConversions', productId] });
      toast.success('UOM conversion created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create conversion: ${error.message}`);
    },
  });

  // Update conversion
  const updateConversion = useMutation({
    mutationFn: async ({
      id,
      conversion_factor,
    }: {
      id: string;
      conversion_factor: number;
    }) => {
      const { data, error: updateError } = await supabase
        .from('uom_conversions')
        .update({ conversion_factor })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating UOM conversion:', updateError);
        throw updateError;
      }

      return data as UOMConversion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uomConversions', productId] });
      toast.success('UOM conversion updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update conversion: ${error.message}`);
    },
  });

  // Delete conversion
  const deleteConversion = useMutation({
    mutationFn: async (id: string) => {
      const { error: deleteError } = await supabase
        .from('uom_conversions')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting UOM conversion:', deleteError);
        throw deleteError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uomConversions', productId] });
      toast.success('UOM conversion deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete conversion: ${error.message}`);
    },
  });

  // Get conversion factor between two UOMs
  const getConversionFactor = (fromUOM: string, toUOM: string): number => {
    if (fromUOM === toUOM) return 1.0;

    const conversion = conversions?.find(
      c => c.from_uom === fromUOM && c.to_uom === toUOM
    );

    if (conversion) {
      return conversion.conversion_factor;
    }

    // Check reverse conversion
    const reverseConversion = conversions?.find(
      c => c.from_uom === toUOM && c.to_uom === fromUOM
    );

    if (reverseConversion) {
      return 1.0 / reverseConversion.conversion_factor;
    }

    return 1.0; // Default: no conversion
  };

  return {
    conversions: conversions || [],
    isLoading,
    error,
    createConversion: createConversion.mutate,
    updateConversion: updateConversion.mutate,
    deleteConversion: deleteConversion.mutate,
    getConversionFactor,
    isCreating: createConversion.isPending,
    isUpdating: updateConversion.isPending,
    isDeleting: deleteConversion.isPending,
  };
};

