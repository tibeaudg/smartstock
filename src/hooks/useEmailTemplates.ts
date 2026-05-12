import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface EmailTemplate {
  id: string;
  name: string;
  type: 'welcome' | 'newsletter' | 'followup' | 'support' | 'custom' | 'lifecycle' | 'deletion_warning';
  subject: string;
  html_body: string;
  text_body: string | null;
  variables: Record<string, any>;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplateInput {
  name: string;
  type: 'welcome' | 'newsletter' | 'followup' | 'support' | 'custom' | 'lifecycle' | 'deletion_warning';
  subject: string;
  html_body: string;
  text_body?: string;
  variables?: Record<string, any>;
  is_active?: boolean;
}

const fetchEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }

  return (data || []) as EmailTemplate[];
};

const fetchEmailTemplate = async (id: string): Promise<EmailTemplate | null> => {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching email template:', error);
    throw error;
  }

  return data as EmailTemplate | null;
};

const createEmailTemplate = async (template: EmailTemplateInput): Promise<EmailTemplate> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('email_templates')
    .insert({
      ...template,
      created_by: user.id,
      variables: template.variables || {},
      is_active: template.is_active !== undefined ? template.is_active : true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating email template:', error);
    throw error;
  }

  return data as EmailTemplate;
};

const updateEmailTemplate = async (id: string, template: Partial<EmailTemplateInput>): Promise<EmailTemplate> => {
  const { data, error } = await supabase
    .from('email_templates')
    .update(template)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating email template:', error);
    throw error;
  }

  return data as EmailTemplate;
};

const deleteEmailTemplate = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('email_templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting email template:', error);
    throw error;
  }
};

export const useEmailTemplates = () => {
  const queryClient = useQueryClient();

  const { data: templates, isLoading, error } = useQuery<EmailTemplate[]>({
    queryKey: ['email-templates'],
    queryFn: fetchEmailTemplates,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: createEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast.success('Email template created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating email template:', error);
      toast.error('Failed to create email template');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, template }: { id: string; template: Partial<EmailTemplateInput> }) =>
      updateEmailTemplate(id, template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast.success('Email template updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating email template:', error);
      toast.error('Failed to update email template');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast.success('Email template deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting email template:', error);
      toast.error('Failed to delete email template');
    },
  });

  return {
    templates: templates || [],
    isLoading,
    error,
    createTemplate: createMutation.mutate,
    updateTemplate: updateMutation.mutate,
    deleteTemplate: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useEmailTemplate = (id: string | undefined) => {
  return useQuery<EmailTemplate | null>({
    queryKey: ['email-template', id],
    queryFn: () => (id ? fetchEmailTemplate(id) : null),
    enabled: !!id,
  });
};
