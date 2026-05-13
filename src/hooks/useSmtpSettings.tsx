import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

type EdgeFunctionResponse = {
  success: boolean;
  configured?: boolean;
  username?: string | null;
  message?: string;
  error?: string;
};

const checkSmtpConfig = async (): Promise<{ configured: boolean; username: string | null }> => {
  const { data, error } = await supabase.functions.invoke<EdgeFunctionResponse>('admin-smtp-test', {
    body: { action: 'check' },
  });
  if (error || !data?.success) return { configured: false, username: null };
  return { configured: !!data.configured, username: data.username ?? null };
};

const testSmtpConnection = async (): Promise<boolean> => {
  const { data, error } = await supabase.functions.invoke<EdgeFunctionResponse>('admin-smtp-test', {
    body: { action: 'test' },
  });
  if (error) throw new Error(error.message || 'Failed to test SMTP connection. Make sure the Edge Function is deployed.');
  if (data?.error) throw new Error(data.error);
  if (!data?.success) throw new Error('SMTP connection test failed');
  return true;
};

const sendTestEmailViaApi = async (toEmail: string): Promise<boolean> => {
  const { data, error } = await supabase.functions.invoke<EdgeFunctionResponse>('admin-smtp-test', {
    body: { action: 'send-test', toEmail: toEmail.trim() },
  });
  if (error) throw new Error(error.message || 'Failed to send test email. Make sure the Edge Function is deployed.');
  if (data?.error) throw new Error(data.error);
  if (!data?.success) throw new Error('Failed to send test email');
  return true;
};

export const useSmtpSettings = () => {
  const { user } = useAuth();

  const { data: checkResult, isLoading } = useQuery({
    queryKey: ['smtp-config-check'],
    queryFn: checkSmtpConfig,
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const testMutation = useMutation({
    mutationFn: () => testSmtpConnection(),
    onSuccess: () => toast.success('SMTP connection test successful!'),
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'SMTP connection test failed'),
  });

  const sendTestEmailMutation = useMutation({
    mutationFn: ({ toEmail }: { toEmail: string }) => sendTestEmailViaApi(toEmail),
    onSuccess: () => toast.success('Test email sent successfully!'),
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Failed to send test email'),
  });

  return {
    isConfigured: checkResult?.configured ?? false,
    smtpUsername: checkResult?.username ?? null,
    isLoading,
    testSmtpConnection: testMutation.mutate,
    sendTestEmail: sendTestEmailMutation.mutate,
    isTesting: testMutation.isPending,
    isSendingTestEmail: sendTestEmailMutation.isPending,
  };
};
