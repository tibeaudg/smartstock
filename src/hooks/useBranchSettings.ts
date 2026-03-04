import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from './useBranches';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface BranchSettings {
  id: string;
  branch_id: string;
  language: string;
  currency: string;
  country: string | null;
  organisation_name: string | null;
  stock_alert_enabled: boolean;
  stock_alert_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface BranchSettingsUpdate {
  language?: string;
  currency?: string;
  country?: string | null;
  organisation_name?: string | null;
  stock_alert_enabled?: boolean;
  stock_alert_email?: string | null;
}

const fetchBranchSettings = async (branchId: string): Promise<BranchSettings | null> => {
  const { data, error } = await supabase
    .from('branch_settings')
    .select('*')
    .eq('branch_id', branchId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching branch settings:', error);
    throw error;
  }

  return data as BranchSettings | null;
};

const upsertBranchSettings = async (
  branchId: string,
  settings: BranchSettingsUpdate
): Promise<BranchSettings> => {
  const { data, error } = await supabase
    .from('branch_settings')
    .upsert(
      {
        branch_id: branchId,
        ...settings,
      },
      { onConflict: 'branch_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving branch settings:', error);
    throw error;
  }

  return data as BranchSettings;
};

export const useBranchSettings = () => {
  const { activeBranch } = useBranches();
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const branchId = activeBranch?.branch_id ?? null;

  const {
    data: branchSettings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['branch-settings', branchId],
    queryFn: () => (branchId ? fetchBranchSettings(branchId) : null),
    enabled: !!branchId,
  });

  const updateMutation = useMutation({
    mutationFn: (settings: BranchSettingsUpdate) => {
      if (!branchId) throw new Error('No active branch');
      return upsertBranchSettings(branchId, settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branch-settings', branchId] });
      toast.success('Settings saved successfully');
    },
    onError: (err: Error) => {
      console.error('Error updating branch settings:', err);
      toast.error('Failed to save settings');
    },
  });

  // Resolved values with fallbacks
  const organisationName = branchSettings?.organisation_name ?? userProfile?.organization_name ?? '';
  const language = branchSettings?.language ?? 'en';
  const currency = branchSettings?.currency ?? 'USD';
  const country = branchSettings?.country ?? null;
  const stockAlertEnabled = branchSettings?.stock_alert_enabled ?? false;
  const stockAlertEmail = branchSettings?.stock_alert_email ?? null;

  return {
    branchSettings,
    isLoading,
    error,
    refetch,
    updateBranchSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    // Resolved values for form defaults
    organisationName,
    language,
    currency,
    country,
    stockAlertEnabled,
    stockAlertEmail,
  };
};
