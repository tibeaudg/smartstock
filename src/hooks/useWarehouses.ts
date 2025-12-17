/**
 * React hooks for warehouse management
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from 'sonner';

export interface Warehouse {
  id: string;
  name: string;
  description: string | null;
  branch_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface WarehouseCreateData {
  name: string;
  description?: string | null;
  branch_id?: string | null;
}

export interface WarehouseUpdateData {
  name?: string;
  description?: string | null;
  branch_id?: string | null;
}

/**
 * Hook to fetch all warehouses for the current user and branch
 */
export function useWarehouses() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  
  return useQuery<Warehouse[]>({
    queryKey: ['warehouses', user?.id, activeBranch?.branch_id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('warehouses')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
      
      // Filter by branch if activeBranch is set
      if (activeBranch?.branch_id) {
        query = query.eq('branch_id', activeBranch.branch_id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching warehouses:', error);
        throw error;
      }
      
      return (data || []) as Warehouse[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to get product count for a warehouse
 */
export function useWarehouseProductCount(warehouseName: string | null) {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  
  return useQuery<number>({
    queryKey: ['warehouseProductCount', warehouseName, user?.id, activeBranch?.branch_id],
    queryFn: async () => {
      if (!user || !warehouseName || !activeBranch?.branch_id) return 0;
      
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('branch_id', activeBranch.branch_id)
        .eq('location', warehouseName);
      
      if (error) {
        console.error('Error counting warehouse products:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!user && !!warehouseName && !!activeBranch?.branch_id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to create a warehouse
 */
export function useCreateWarehouse() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: WarehouseCreateData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: warehouse, error } = await supabase
        .from('warehouses')
        .insert({
          name: data.name.trim(),
          description: data.description?.trim() || null,
          branch_id: data.branch_id || activeBranch?.branch_id || null,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating warehouse:', error);
        toast.error(`Error creating warehouse: ${error.message}`);
        throw error;
      }
      
      return warehouse as Warehouse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success('Warehouse created successfully');
    },
  });
}

/**
 * Hook to update a warehouse
 */
export function useUpdateWarehouse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ warehouseId, data }: { warehouseId: string; data: WarehouseUpdateData }) => {
      if (!user) throw new Error('User not authenticated');
      
      // If name is being updated, we need to update products that reference the old name
      if (data.name) {
        const { data: oldWarehouse } = await supabase
          .from('warehouses')
          .select('name, branch_id')
          .eq('id', warehouseId)
          .eq('user_id', user.id)
          .single();
        
        if (oldWarehouse && oldWarehouse.name !== data.name.trim()) {
          // Update products that reference the old warehouse name
          const { error: updateError } = await supabase
            .from('products')
            .update({ location: data.name.trim() })
            .eq('location', oldWarehouse.name)
            .eq('branch_id', oldWarehouse.branch_id)
            .eq('user_id', user.id);
          
          if (updateError) {
            console.error('Error updating product locations:', updateError);
            // Continue with warehouse update even if product update fails
          }
        }
      }
      
      const updateData: Partial<WarehouseUpdateData> = { ...data };
      if (updateData.name) {
        updateData.name = updateData.name.trim();
      }
      
      const { data: warehouse, error } = await supabase
        .from('warehouses')
        .update(updateData)
        .eq('id', warehouseId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating warehouse:', error);
        toast.error(`Error updating warehouse: ${error.message}`);
        throw error;
      }
      
      return warehouse as Warehouse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['warehouseProductCount'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      toast.success('Warehouse updated successfully');
    },
  });
}

/**
 * Hook to delete a warehouse
 * Products referencing this warehouse will have their location set to NULL via database trigger
 */
export function useDeleteWarehouse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (warehouseId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('warehouses')
        .delete()
        .eq('id', warehouseId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting warehouse:', error);
        toast.error(`Error deleting warehouse: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['warehouseProductCount'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      toast.success('Warehouse deleted successfully');
    },
  });
}

/**
 * Hook to set up real-time subscriptions for warehouses
 */
export function useWarehouseRealtime() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase
      .channel('warehouses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'warehouses',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['warehouses', user.id] });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);
}

