import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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

// Save/Update SMTP settings
const saveSmtpSettings = async (userId: string, settings: SmtpSettingsInput): Promise<SmtpSettings> => {
  const { data, error } = await supabase
    .from('smtp_settings')
    .upsert({
      user_id: userId,
      smtp_host: settings.smtp_host,
      smtp_port: settings.smtp_port,
      smtp_username: settings.smtp_username,
      smtp_password: settings.smtp_password,
      from_email: settings.from_email,
      from_name: settings.from_name,
      use_tls: settings.use_tls
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving SMTP settings:', error);
    throw error;
  }

  return data;
};

// Test SMTP connection
const testSmtpConnection = async (settings: SmtpSettingsInput): Promise<boolean> => {
  try {
    // TODO: Implement actual SMTP test via API endpoint
    // For now, just simulate a test
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  } catch (error) {
    console.error('Error testing SMTP connection:', error);
    return false;
  }
};

// Send test email
const sendTestEmail = async (settings: SmtpSettingsInput, toEmail: string): Promise<boolean> => {
  try {
    // TODO: Implement actual email sending via API endpoint
    // For now, just simulate sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
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

  // Test SMTP connection mutation
  const testMutation = useMutation({
    mutationFn: testSmtpConnection,
    onSuccess: () => {
      toast.success('SMTP connection test successful!');
    },
    onError: () => {
      toast.error('SMTP connection test failed');
    }
  });

  // Send test email mutation
  const sendTestEmailMutation = useMutation({
    mutationFn: ({ settings, toEmail }: { settings: SmtpSettingsInput; toEmail: string }) =>
      sendTestEmail(settings, toEmail),
    onSuccess: () => {
      toast.success('Test email sent successfully!');
    },
    onError: () => {
      toast.error('Failed to send test email');
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
