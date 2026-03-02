import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

type EdgeFunctionResponse = { success: boolean; message?: string; error?: string };

interface SmtpSettings {
  id: string;
  user_id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  from_email: string;
  from_name?: string;
  use_tls: boolean;
  created_at: string;
  updated_at: string;
}

interface SmtpSettingsInput {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  from_email: string;
  from_name?: string;
  use_tls: boolean;
}

// Fetch SMTP settings
const fetchSmtpSettings = async (userId: string): Promise<SmtpSettings | null> => {
  const { data, error } = await supabase
    .from('smtp_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching SMTP settings:', error);
    throw error;
  }

  return data || null;
};

// Save/Update SMTP settings (only include password when user entered a new one; leave blank to keep existing)
const saveSmtpSettings = async (userId: string, settings: SmtpSettingsInput): Promise<SmtpSettings> => {
  const payload: Record<string, unknown> = {
    user_id: userId,
    smtp_host: settings.smtp_host,
    smtp_port: settings.smtp_port,
    smtp_username: settings.smtp_username,
    from_email: settings.from_email,
    from_name: settings.from_name,
    use_tls: settings.use_tls
  };
  if (settings.smtp_password && settings.smtp_password.trim()) {
    payload.smtp_password = settings.smtp_password;
  }
  const { data, error } = await supabase
    .from('smtp_settings')
    .upsert(payload as Record<string, never>, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving SMTP settings:', error);
    throw error;
  }

  return data;
};

// Test SMTP connection using Supabase Edge Function only
const testSmtpConnection = async (): Promise<boolean> => {
  const { data, error } = await supabase.functions.invoke<EdgeFunctionResponse>('admin-smtp-test', {
    body: { action: 'test' },
  });
  
  if (error) {
    throw new Error(error.message || 'Failed to test SMTP connection. Make sure the Edge Function is deployed.');
  }
  
  if (data?.error) {
    throw new Error(data.error);
  }
  
  if (!data?.success) {
    throw new Error('SMTP connection test failed');
  }
  
  return true;
};

// Send test email using Supabase Edge Function only
const sendTestEmailViaApi = async (toEmail: string): Promise<boolean> => {
  const { data, error } = await supabase.functions.invoke<EdgeFunctionResponse>('admin-smtp-test', {
    body: { action: 'send-test', toEmail: toEmail.trim() },
  });
  
  if (error) {
    throw new Error(error.message || 'Failed to send test email. Make sure the Edge Function is deployed.');
  }
  
  if (data?.error) {
    throw new Error(data.error);
  }
  
  if (!data?.success) {
    throw new Error('Failed to send test email');
  }
  
  return true;
};

export const useSmtpSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch SMTP settings
  const {
    data: smtpSettings,
    isLoading,
    error,
    refetch
  } = useQuery<SmtpSettings | null>({
    queryKey: ['smtp-settings', user?.id],
    queryFn: () => user ? fetchSmtpSettings(user.id) : null,
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collect
  });

  // Save SMTP settings mutation
  const saveMutation = useMutation({
    mutationFn: (settings: SmtpSettingsInput) => {
      if (!user) throw new Error('User not authenticated');
      return saveSmtpSettings(user.id, settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smtp-settings', user?.id] });
      toast.success('SMTP settings saved successfully');
    },
    onError: (error: any) => {
      console.error('Error saving SMTP settings:', error);
      toast.error('Error saving SMTP settings');
    }
  });

  // Test SMTP connection mutation (Supabase Edge Function only)
  const testMutation = useMutation({
    mutationFn: () => testSmtpConnection(),
    onSuccess: () => {
      toast.success('SMTP connection test successful!');
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'SMTP connection test failed');
    }
  });

  // Send test email mutation (Supabase Edge Function only)
  const sendTestEmailMutation = useMutation({
    mutationFn: ({ toEmail }: { settings: SmtpSettingsInput; toEmail: string }) =>
      sendTestEmailViaApi(toEmail),
    onSuccess: () => {
      toast.success('Test email sent successfully!');
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to send test email');
    }
  });

  // Check if SMTP is configured
  const isConfigured = () => {
    return smtpSettings && 
           smtpSettings.smtp_host && 
           smtpSettings.smtp_username && 
           smtpSettings.from_email;
  };

  // Get SMTP settings for email sending (without password for security)
  const getSmtpConfig = () => {
    if (!smtpSettings) return null;
    
    return {
      host: smtpSettings.smtp_host,
      port: smtpSettings.smtp_port,
      username: smtpSettings.smtp_username,
      fromEmail: smtpSettings.from_email,
      fromName: smtpSettings.from_name,
      useTls: smtpSettings.use_tls
    };
  };

  return {
    smtpSettings,
    isLoading,
    error,
    refetch,
    saveSmtpSettings: saveMutation.mutate,
    testSmtpConnection: testMutation.mutate,
    sendTestEmail: sendTestEmailMutation.mutate,
    isSaving: saveMutation.isPending,
    isTesting: testMutation.isPending,
    isSendingTestEmail: sendTestEmailMutation.isPending,
    isConfigured: isConfigured(),
    getSmtpConfig
  };
};
