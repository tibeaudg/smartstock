/**
 * React Query hooks for Supplier CRUD operations with Supabase
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Supplier, SupplierCreateData, SupplierUpdateData } from '../types/supplierTypes';
import { useEffect } from 'react';
import { toast } from 'sonner';

const SUPPLIERS_QUERY_KEY = ['suppliers'];

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

export function useSupplier(id: string | undefined) {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: async () => {
      if (!id) throw new Error('Supplier ID is required');

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Supplier;
    },
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSupplier: SupplierCreateData) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const name = (newSupplier.name || '').trim();
      if (!name) throw new Error('Name is required');

      // Check for duplicate supplier name (case-insensitive)
      const { data: existing } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', session.user.id)
        .ilike('name', name)
        .limit(1)
        .maybeSingle();

      if (existing) {
        throw new Error('Supplier already exists');
      }

      const { data, error } = await supabase
        .from('suppliers')
        .insert([{ ...newSupplier, user_id: session.user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SupplierUpdateData }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const name = data.name?.trim();
      if (name) {
        const { data: existing } = await supabase
          .from('suppliers')
          .select('id')
          .eq('user_id', session.user.id)
          .ilike('name', name)
          .neq('id', id)
          .limit(1)
          .maybeSingle();

        if (existing) {
          throw new Error('Supplier already exists');
        }
      }

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
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('suppliers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(`Deletion failed: ${error.message}`);
    },
  });
}

export function useSupplierRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('suppliers-realtime')
      .on('postgres_changes', { event: '*', table: 'suppliers', schema: 'public' }, () => {
        queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
