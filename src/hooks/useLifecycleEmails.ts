import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type LifecycleStage = '24h_nudge' | '7d_inactive' | '14d_inactive' | '25d_warning' | '29d_final_warning';

export const ALL_LIFECYCLE_STAGES: LifecycleStage[] = [
  '24h_nudge',
  '7d_inactive',
  '14d_inactive',
  '25d_warning',
  '29d_final_warning',
];

export interface LifecycleSetting {
  id?: string;
  stage: LifecycleStage;
  enabled: boolean;
  template_id: string | null;
  email_templates?: { id: string; name: string; type: string } | null;
}

export interface LifecycleStats {
  stage: LifecycleStage;
  total: number;
  sent: number;
  failed: number;
  last_sent_at: string | null;
}

const fetchLifecycleSettings = async (userId: string): Promise<LifecycleSetting[]> => {
  const { data, error } = await supabase
    .from('lifecycle_email_settings')
    .select('id, stage, enabled, template_id, email_templates:template_id(id, name, type)')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []) as LifecycleSetting[];
};

const fetchLifecycleStats = async (): Promise<{ stage: string; status: string; sent_at: string }[]> => {
  const { data, error } = await supabase
    .from('user_lifecycle_emails')
    .select('lifecycle_stage, status, sent_at');
  if (error) throw error;
  return (data || []) as any[];
};

export const useLifecycleEmails = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading: settingsLoading } = useQuery<LifecycleSetting[]>({
    queryKey: ['lifecycle-settings', user?.id],
    queryFn: () => fetchLifecycleSettings(user!.id),
    enabled: !!user,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const { data: rawStats } = useQuery({
    queryKey: ['lifecycle-stats'],
    queryFn: fetchLifecycleStats,
    staleTime: 1000 * 60 * 3,
    retry: 1,
  });

  // Build settings map — stages not in DB default to enabled
  const settingsMap = new Map<LifecycleStage, LifecycleSetting>(
    (settingsData || []).map((s) => [s.stage as LifecycleStage, s])
  );

  // Compute stats per stage
  const statsMap = new Map<LifecycleStage, LifecycleStats>();
  for (const stage of ALL_LIFECYCLE_STAGES) {
    const stageLogs = (rawStats || []).filter((r: any) => r.lifecycle_stage === stage);
    statsMap.set(stage, {
      stage,
      total: stageLogs.length,
      sent: stageLogs.filter((r: any) => r.status === 'sent').length,
      failed: stageLogs.filter((r: any) => r.status === 'failed').length,
      last_sent_at: stageLogs.reduce((max: string | null, r: any) => {
        if (!max) return r.sent_at;
        return r.sent_at > max ? r.sent_at : max;
      }, null),
    });
  }

  // Update a single stage setting
  const updateMutation = useMutation({
    mutationFn: async ({
      stage,
      enabled,
      template_id,
    }: {
      stage: LifecycleStage;
      enabled: boolean;
      template_id: string | null;
    }) => {
      const { data, error } = await supabase
        .from('lifecycle_email_settings')
        .upsert(
          { user_id: user!.id, stage, enabled, template_id, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,stage' }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lifecycle-settings'] });
    },
    onError: () => toast.error('Failed to save lifecycle setting'),
  });

  // Trigger lifecycle emails (optionally for one stage)
  const triggerMutation = useMutation({
    mutationFn: async (stage?: LifecycleStage) => {
      const { data, error } = await supabase.functions.invoke('trigger-lifecycle-emails', {
        body: stage ? { stage } : {},
      });
      if (error) throw new Error(error.message || 'Failed to trigger');
      if (!data?.success) throw new Error(data?.error || 'Failed to trigger lifecycle emails');
      return data;
    },
    onSuccess: (_data, stage) => {
      const label = stage ? `stage "${stage}"` : 'all lifecycle stages';
      toast.success(`Triggered ${label} successfully`);
      queryClient.invalidateQueries({ queryKey: ['lifecycle-stats'] });
      queryClient.invalidateQueries({ queryKey: ['email-log-stats'] });
      queryClient.invalidateQueries({ queryKey: ['email-logs'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to trigger lifecycle emails');
    },
  });

  const getEffectiveSetting = (stage: LifecycleStage): LifecycleSetting => {
    return settingsMap.get(stage) ?? { stage, enabled: true, template_id: null };
  };

  return {
    settingsMap,
    statsMap,
    isLoading: settingsLoading,
    getEffectiveSetting,
    updateSetting: updateMutation.mutate,
    isSaving: updateMutation.isPending,
    triggerLifecycle: triggerMutation.mutate,
    isTriggering: triggerMutation.isPending,
    triggeringStage: triggerMutation.variables as LifecycleStage | undefined,
  };
};
