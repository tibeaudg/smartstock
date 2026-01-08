/**
 * hooks/useSuppliers.ts
 * React Query hooks for Supplier CRUD operations with Supabase
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Supplier, SupplierCreateData, SupplierUpdateData } from '../types/supplierTypes';
import { useEffect } from 'react';
import { toast } from 'sonner';

const SUPPLIERS_QUERY_KEY = ['suppliers'];

// 1. Fetch Hook
export function useSuppliers() {
  return useQuery({
    queryKey: SUPPLIERS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Supplier[];
    },
  });
}

// 2. Create Hook
// hooks/useSuppliers.ts refactoring
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSupplier: SupplierCreateData) => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error("No active session");

      const { data, error } = await supabase
        .from('suppliers')
        .insert([{
          ...newSupplier,
          user_id: session.user.id, // Mandatory for most RLS policies
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    }
  });
}

// 3. Update Hook
export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SupplierUpdateData }) => {
      const { data: updatedData, error } = await supabase
        .from('suppliers')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });
}

// 4. Delete Hook
export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(`Deletion failed: ${error.message}`);
    },
  });
}

// 5. Real-time Subscription Hook
export function useSupplierRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('suppliers-realtime')
      .on(
        'postgres_changes',
        { event: '*', table: 'suppliers', schema: 'public' },
        () => {
          queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}