import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EmailLog {
  id: string;
  campaign_id: string | null;
  template_id: string | null;
  recipient_email: string;
  recipient_user_id: string | null;
  subject: string;
  email_type: 'welcome' | 'newsletter' | 'followup' | 'support' | 'custom' | 'lifecycle' | 'deletion_warning';
  status: 'sent' | 'delivered' | 'failed' | 'bounced';
  error_message: string | null;
  sent_at: string;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  metadata: Record<string, any>;
  email_templates?: {
    id: string;
    name: string;
  } | null;
  email_campaigns?: {
    id: string;
    name: string;
  } | null;
}

export interface EmailLogFilters {
  email_type?: string;
  status?: string;
  recipient_email?: string;
  date_from?: string;
  date_to?: string;
  campaign_id?: string;
  template_id?: string;
}

const fetchEmailLogs = async (filters?: EmailLogFilters): Promise<EmailLog[]> => {
  let query = supabase
    .from('email_logs')
    .select(`
      *,
      email_templates (
        id,
        name
      ),
      email_campaigns (
        id,
        name
      )
    `)
    .order('sent_at', { ascending: false })
    .limit(1000);

  if (filters?.email_type) {
    query = query.eq('email_type', filters.email_type);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.recipient_email) {
    query = query.ilike('recipient_email', `%${filters.recipient_email}%`);
  }

  if (filters?.date_from) {
    query = query.gte('sent_at', filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte('sent_at', filters.date_to);
  }

  if (filters?.campaign_id) {
    query = query.eq('campaign_id', filters.campaign_id);
  }

  if (filters?.template_id) {
    query = query.eq('template_id', filters.template_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching email logs:', error);
    throw error;
  }

  return (data || []) as EmailLog[];
};

const fetchEmailLogStats = async (): Promise<{
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  bounced: number;
  by_type: Record<string, number>;
}> => {
  const { data, error } = await supabase
    .from('email_logs')
    .select('status, email_type');

  if (error) {
    console.error('Error fetching email log stats:', error);
    throw error;
  }

  const stats = {
    total: data?.length || 0,
    sent: 0,
    delivered: 0,
    failed: 0,
    bounced: 0,
    by_type: {} as Record<string, number>,
  };

  (data || []).forEach((log: any) => {
    if (log.status === 'sent') stats.sent++;
    if (log.status === 'delivered') stats.delivered++;
    if (log.status === 'failed') stats.failed++;
    if (log.status === 'bounced') stats.bounced++;

    const type = log.email_type || 'custom';
    stats.by_type[type] = (stats.by_type[type] || 0) + 1;
  });

  return stats;
};

export const useEmailLogs = (filters?: EmailLogFilters) => {
  return useQuery<EmailLog[]>({
    queryKey: ['email-logs', filters],
    queryFn: () => fetchEmailLogs(filters),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

export const useEmailLogStats = () => {
  return useQuery({
    queryKey: ['email-log-stats'],
    queryFn: fetchEmailLogStats,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
