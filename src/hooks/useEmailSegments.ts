import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmailSegment {
  id: string;
  name: string;
  filters: Record<string, any>;
  user_count: number;
  automation_enabled?: boolean;
  automation_trigger?: 'user_signup' | null;
  automation_template_id?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmailSegmentInput {
  name: string;
  filters: Record<string, any>;
  automation_enabled?: boolean;
  automation_trigger?: 'user_signup' | null;
  automation_template_id?: string | null;
}

const fetchEmailSegments = async (): Promise<EmailSegment[]> => {
  const { data, error } = await supabase
    .from('email_segments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching email segments:', error);
    throw error;
  }

  return (data || []) as EmailSegment[];
};

const fetchEmailSegment = async (id: string): Promise<EmailSegment | null> => {
  const { data, error } = await supabase
    .from('email_segments')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching email segment:', error);
    throw error;
  }

  return data as EmailSegment | null;
};

const createEmailSegment = async (segment: EmailSegmentInput): Promise<EmailSegment> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Calculate user count based on filters
  const userCount = await calculateSegmentUserCount(segment.filters);

  const { data, error } = await supabase
    .from('email_segments')
    .insert({
      ...segment,
      created_by: user.id,
      user_count: userCount,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating email segment:', error);
    throw error;
  }

  return data as EmailSegment;
};

const updateEmailSegment = async (id: string, segment: Partial<EmailSegmentInput>): Promise<EmailSegment> => {
  // Recalculate user count if filters changed
  let userCount: number | undefined;
  if (segment.filters) {
    userCount = await calculateSegmentUserCount(segment.filters);
  }

  const updateData: any = { ...segment };
  if (userCount !== undefined) {
    updateData.user_count = userCount;
  }

  const { data, error } = await supabase
    .from('email_segments')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating email segment:', error);
    throw error;
  }

  return data as EmailSegment;
};

const deleteEmailSegment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('email_segments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting email segment:', error);
    throw error;
  }
};

const calculateSegmentUserCount = async (filters: Record<string, any>): Promise<number> => {
  // Get all users first, then filter in memory for complex date logic
  let query = supabase
    .from('profiles')
    .select('id, created_at, last_login, selected_plan, organization_name, role, is_owner');

  // Apply simple filters that can be done in SQL
  if (filters.plan && Array.isArray(filters.plan) && filters.plan.length > 0) {
    query = query.in('selected_plan', filters.plan);
  }

  if (filters.organization && Array.isArray(filters.organization) && filters.organization.length > 0) {
    query = query.in('organization_name', filters.organization);
  }

  if (filters.role && Array.isArray(filters.role) && filters.role.length > 0) {
    query = query.in('role', filters.role);
  }

  if (filters.isOwner !== undefined) {
    query = query.eq('is_owner', filters.isOwner);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error calculating segment user count:', error);
    return 0;
  }

  if (!data) return 0;

  const now = new Date();
  let filteredUsers = data;

  // Apply date-based filters
  if (filters.accountCreated) {
    const f = filters.accountCreated;
    filteredUsers = filteredUsers.filter((user: any) => {
      if (!user.created_at) return false;
      const createdDate = new Date(user.created_at);
      const hoursAgo = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
      const daysAgo = hoursAgo / 24;

      if (f.operator === 'less_than' && f.days !== undefined) {
        // Support both days and fractional days (hours)
        if (f.days < 1) {
          return hoursAgo < (f.days * 24);
        }
        return daysAgo < f.days;
      }
      if (f.operator === 'greater_than' && f.days !== undefined) {
        if (f.days < 1) {
          return hoursAgo > (f.days * 24);
        }
        return daysAgo > f.days;
      }
      if (f.operator === 'equal' && f.days !== undefined) {
        if (f.days < 1) {
          return Math.abs(hoursAgo - (f.days * 24)) < 1; // Within 1 hour
        }
        return Math.floor(daysAgo) === f.days;
      }
      if (f.operator === 'between' && f.daysFrom !== undefined && f.daysTo !== undefined) {
        const fromHours = f.daysFrom < 1 ? f.daysFrom * 24 : f.daysFrom * 24;
        const toHours = f.daysTo < 1 ? f.daysTo * 24 : f.daysTo * 24;
        return hoursAgo >= fromHours && hoursAgo <= toHours;
      }
      return true;
    });
  }

  if (filters.lastLogin) {
    const f = filters.lastLogin;
    filteredUsers = filteredUsers.filter((user: any) => {
      if (f.operator === 'never') return !user.last_login;
      if (!user.last_login) return false;

      const loginDate = new Date(user.last_login);
      const daysAgo = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24));

      if (f.operator === 'less_than' && f.days !== undefined) return daysAgo < f.days;
      if (f.operator === 'greater_than' && f.days !== undefined) return daysAgo > f.days;
      if (f.operator === 'equal' && f.days !== undefined) return daysAgo === f.days;
      if (f.operator === 'between' && f.daysFrom !== undefined && f.daysTo !== undefined) {
        return daysAgo >= f.daysFrom && daysAgo <= f.daysTo;
      }
      return true;
    });
  }

  if (filters.accountAge) {
    const f = filters.accountAge;
    filteredUsers = filteredUsers.filter((user: any) => {
      if (!user.created_at) return false;
      const createdDate = new Date(user.created_at);
      const daysOld = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

      if (f.operator === 'less_than' && f.days !== undefined) return daysOld < f.days;
      if (f.operator === 'greater_than' && f.days !== undefined) return daysOld > f.days;
      if (f.operator === 'equal' && f.days !== undefined) return daysOld === f.days;
      if (f.operator === 'between' && f.daysFrom !== undefined && f.daysTo !== undefined) {
        return daysOld >= f.daysFrom && daysOld <= f.daysTo;
      }
      return true;
    });
  }

  // Apply product count filter (would need to join with products table, simplified here)
  if (filters.productCountMin !== undefined || filters.productCountMax !== undefined) {
    // Note: This would require a join with products table to get accurate counts
    // For now, we'll skip this filter in the count calculation
    // In production, you'd want to do: SELECT COUNT(*) FROM profiles WHERE ... AND (SELECT COUNT(*) FROM products WHERE user_id = profiles.id) BETWEEN min AND max
  }

  return filteredUsers.length;
};

export const useEmailSegments = () => {
  const queryClient = useQueryClient();

  const { data: segments, isLoading, error } = useQuery<EmailSegment[]>({
    queryKey: ['email-segments'],
    queryFn: fetchEmailSegments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: createEmailSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-segments'] });
      toast.success('Email segment created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating email segment:', error);
      toast.error('Failed to create email segment');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, segment }: { id: string; segment: Partial<EmailSegmentInput> }) =>
      updateEmailSegment(id, segment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-segments'] });
      toast.success('Email segment updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating email segment:', error);
      toast.error('Failed to update email segment');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmailSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-segments'] });
      toast.success('Email segment deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting email segment:', error);
      toast.error('Failed to delete email segment');
    },
  });

  return {
    segments: segments || [],
    isLoading,
    error,
    createSegment: createMutation.mutate,
    updateSegment: updateMutation.mutate,
    deleteSegment: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useEmailSegment = (id: string | undefined) => {
  return useQuery<EmailSegment | null>({
    queryKey: ['email-segment', id],
    queryFn: () => (id ? fetchEmailSegment(id) : null),
    enabled: !!id,
  });
};

export const useSegmentUserCount = (filters: Record<string, any> | undefined) => {
  return useQuery<number>({
    queryKey: ['segment-user-count', filters],
    queryFn: () => (filters ? calculateSegmentUserCount(filters) : 0),
    enabled: !!filters,
  });
};
