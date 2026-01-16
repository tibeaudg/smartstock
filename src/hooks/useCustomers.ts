/**
 * hooks/useSuppliers.ts
 * React Query hooks for Supplier CRUD operations with Supabase
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer, CustomerCreateData, CustomerUpdateData } from '../types/customerTypes';
import { useEffect } from 'react';
import { toast } from 'sonner';

const CUSTOMERS_QUERY_KEY = ['customers'];

// 1. Fetch Hook
export function useCustomers() {
  return useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Customer[];
    },
  });
}

// 1b. Fetch Single Supplier Hook
export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      if (!id) throw new Error('Customer ID is required');
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Customer;
    },
    enabled: !!id,
  });
}

// 2. Create Hook
// hooks/useSuppliers.ts refactoring
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCustomer: CustomerCreateData) => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error("No active session");

      const { data, error } = await supabase
        .from('customers')
        .insert([{
          ...newCustomer,
          user_id: session.user.id, // Mandatory for most RLS policies
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
}

// 3. Update Hook
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CustomerUpdateData }) => {
      const { data: updatedData, error } = await supabase
        .from('customers')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });
}

// 4. Delete Hook
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(`Deletion failed: ${error.message}`);
    },
  });
}

// 5. Real-time Subscription Hook
export function useCustomerRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('customers-realtime')
      .on(
        'postgres_changes',
        { event: '*', table: 'customers', schema: 'public' },
        () => {
          queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}