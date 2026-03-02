import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmailCampaign {
  id: string;
  name: string;
  template_id: string | null;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'cancelled';
  scheduled_at: string | null;
  sent_at: string | null;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  recipient_type?: 'all' | 'segment' | 'manual' | null;
  segment_id?: string | null;
  recipient_config?: Record<string, any> | null;
  email_templates?: {
    id: string;
    name: string;
    subject: string;
    type: string;
  } | null;
}

export interface EmailCampaignInput {
  name: string;
  template_id: string;
  scheduled_at?: string | null;
  recipient_type: 'all' | 'segment' | 'manual';
  segment_id?: string;
  segment_filters?: Record<string, any>;
  recipient_user_ids?: string[];
  recipient_emails?: string[];
}

const fetchEmailCampaigns = async (): Promise<EmailCampaign[]> => {
  const { data, error } = await supabase
    .from('email_campaigns')
    .select(`
      *,
      email_templates (
        id,
        name,
        subject,
        type
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching email campaigns:', error);
    throw error;
  }

  return (data || []) as EmailCampaign[];
};

const fetchEmailCampaign = async (id: string): Promise<EmailCampaign | null> => {
  const { data, error } = await supabase
    .from('email_campaigns')
    .select(`
      *,
      email_templates (
        id,
        name,
        subject,
        type
      )
    `)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching email campaign:', error);
    throw error;
  }

  return data as EmailCampaign | null;
};

const createEmailCampaign = async (campaign: EmailCampaignInput): Promise<EmailCampaign> => {
  // Convert snake_case to camelCase for the backend function
  const { data, error } = await supabase.functions.invoke('create-email-campaign', {
    body: {
      name: campaign.name,
      templateId: campaign.template_id,
      scheduledAt: campaign.scheduled_at,
      recipientType: campaign.recipient_type,
      segmentId: campaign.segment_id,
      segmentFilters: campaign.segment_filters,
      recipientUserIds: campaign.recipient_user_ids,
      recipientEmails: campaign.recipient_emails,
    },
  });

  if (error) {
    console.error('Error creating email campaign:', error);
    throw new Error(error.message || 'Failed to create email campaign');
  }

  if (!data?.success) {
    throw new Error(data?.error || 'Failed to create email campaign');
  }

  // Fetch the created campaign
  const { data: campaignData, error: fetchError } = await supabase
    .from('email_campaigns')
    .select(`
      *,
      email_templates (
        id,
        name,
        subject,
        type
      )
    `)
    .eq('id', data.campaign.id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  return campaignData as EmailCampaign;
};

const sendEmailCampaign = async (campaignId: string, batchSize?: number): Promise<any> => {
  const { data, error } = await supabase.functions.invoke('send-email-campaign', {
    body: { campaignId, batchSize },
  });

  if (error) {
    console.error('Error sending email campaign:', error);
    throw new Error(error.message || 'Failed to send email campaign');
  }

  if (!data?.success) {
    throw new Error(data?.error || 'Failed to send email campaign');
  }

  return data;
};

const updateEmailCampaign = async (id: string, updates: Partial<EmailCampaign>): Promise<EmailCampaign> => {
  const { data, error } = await supabase
    .from('email_campaigns')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      email_templates (
        id,
        name,
        subject,
        type
      )
    `)
    .single();

  if (error) {
    console.error('Error updating email campaign:', error);
    throw error;
  }

  return data as EmailCampaign;
};

const deleteEmailCampaign = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('email_campaigns')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting email campaign:', error);
    throw error;
  }
};

export const useEmailCampaigns = () => {
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading, error } = useQuery<EmailCampaign[]>({
    queryKey: ['email-campaigns'],
    queryFn: fetchEmailCampaigns,
    // Campaign stats should feel live in the admin UI (new signups can trigger emails).
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 5000, // 5 seconds
    refetchOnWindowFocus: true,
  });

  const createMutation = useMutation({
    mutationFn: createEmailCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
      toast.success('Email campaign created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating email campaign:', error);
      toast.error(error.message || 'Failed to create email campaign');
    },
  });

  const sendMutation = useMutation({
    mutationFn: ({ campaignId, batchSize }: { campaignId: string; batchSize?: number }) =>
      sendEmailCampaign(campaignId, batchSize),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['email-logs'] });
      if (data.completed) {
        toast.success('Email campaign completed successfully');
      } else {
        toast.success(`Sent ${data.sent} emails. ${data.remaining} remaining.`);
      }
    },
    onError: (error: any) => {
      console.error('Error sending email campaign:', error);
      toast.error(error.message || 'Failed to send email campaign');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EmailCampaign> }) =>
      updateEmailCampaign(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
      toast.success('Email campaign updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating email campaign:', error);
      toast.error('Failed to update email campaign');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmailCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
      toast.success('Email campaign deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting email campaign:', error);
      toast.error('Failed to delete email campaign');
    },
  });

  return {
    campaigns: campaigns || [],
    isLoading,
    error,
    createCampaign: createMutation.mutate,
    sendCampaign: sendMutation.mutate,
    updateCampaign: updateMutation.mutate,
    deleteCampaign: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isSending: sendMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useEmailCampaign = (id: string | undefined) => {
  return useQuery<EmailCampaign | null>({
    queryKey: ['email-campaign', id],
    queryFn: () => (id ? fetchEmailCampaign(id) : null),
    enabled: !!id,
  });
};
