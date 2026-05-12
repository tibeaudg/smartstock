import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { toast } from 'sonner';

export interface LocationItem {
  id: string | null;   // null = orphan location (exists on products but not in table yet)
  name: string;
  productCount: number;
}

async function fetchLocations(userId: string): Promise<LocationItem[]> {
  // Fetch managed locations from the table
  const { data: tableRows, error: tableError } = await supabase
    .from('locations')
    .select('id, name')
    .eq('user_id', userId)
    .order('name');

  if (tableError) {
    // If locations table doesn't exist yet, just return empty managed locations
    console.warn('Locations table not found, using fallback mode');
  }

  // Get product counts - same pattern as categories page
  const { data: productRows, error: productError } = await supabase
    .from('products')
    .select('location')
    .eq('user_id', userId)
    .not('location', 'is', null)
    .neq('location', '')
    .eq('is_variant', false)
    .eq('status', 'active');

  if (productError) throw productError;

  // Count products per location name (same as categories)
  const countMap = new Map<string, number>();
  (productRows || []).forEach((row) => {
    const loc = row.location?.trim();
    if (loc) countMap.set(loc, (countMap.get(loc) ?? 0) + 1);
  });

  // Build final list: managed locations first, then orphans
  const managedNames = new Set((tableRows || []).map((r) => r.name));

  const managed: LocationItem[] = (tableRows || []).map((r) => ({
    id: r.id,
    name: r.name,
    productCount: countMap.get(r.name) ?? 0,
  }));

  const orphans: LocationItem[] = Array.from(countMap.entries())
    .filter(([name]) => !managedNames.has(name))
    .map(([name, count]) => ({ id: null, name, productCount: count }));

  return [...managed, ...orphans].sort((a, b) => a.name.localeCompare(b.name));
}

export function useLocations() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();

  return useQuery<LocationItem[]>({
    queryKey: ['locations', user?.id],
    queryFn: () => fetchLocations(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateLocation() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!user || !activeBranch) throw new Error('Not authenticated');
      const { error } = await supabase.from('locations').insert({
        name: name.trim(),
        description: description?.trim() || null,
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: (_, { name }) => {
      queryClient.invalidateQueries({ queryKey: ['locations', user?.id] });
      toast.success(`Location "${name}" created`);
    },
    onError: (err: Error) => {
      const msg = err.message.includes('unique')
        ? 'A location with that name already exists.'
        : `Failed to create location: ${err.message}`;
      toast.error(msg);
    },
  });
}

export function useRenameLocation() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      locationId,
      oldName,
      newName,
    }: {
      locationId: string | null;
      oldName: string;
      newName: string;
    }) => {
      if (!user || !activeBranch) throw new Error('Not authenticated');

      // Update the managed row if it exists
      if (locationId) {
        const { error } = await supabase
          .from('locations')
          .update({ name: newName.trim(), updated_at: new Date().toISOString() })
          .eq('id', locationId)
          .eq('user_id', user.id);
        if (error) throw error;
      }

      // Always cascade to products
      const { error: prodErr } = await supabase
        .from('products')
        .update({ location: newName.trim() })
        .eq('location', oldName)
        .eq('user_id', user.id)
        
        if (prodErr) throw prodErr;
    },
    onSuccess: (_, { newName }) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Location renamed to "${newName}"`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to rename location: ${err.message}`);
    },
  });
}

export function useDeleteLocation() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ locationId, name }: { locationId: string | null; name: string }) => {
      if (!user || !activeBranch) throw new Error('Not authenticated');

      // Remove from locations table if managed
      if (locationId) {
        const { error } = await supabase
          .from('locations')
          .delete()
          .eq('id', locationId)
          .eq('user_id', user.id);
        if (error) throw error;
      }

      // Clear from all products
      const { error: prodErr } = await supabase
        .from('products')
        .update({ location: null })
        .eq('location', name)
        .eq('user_id', user.id)
      if (prodErr) throw prodErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Location removed');
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete location: ${err.message}`);
    },
  });
}
