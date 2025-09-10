import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DeliveryNotesStats {
  incoming: number;
  outgoing: number;
  inProgress: number;
  thisMonth: number;
}

export const useDeliveryNotesStats = () => {
  const { user } = useAuth();

  return useQuery<DeliveryNotesStats>({
    queryKey: ['delivery-notes-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Geen gebruiker');

      // Get current month start date
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfMonthISO = startOfMonth.toISOString();

      // Fetch all delivery notes for the user
      const { data: deliveryNotes, error } = await supabase
        .from('delivery_notes')
        .select('type, status, created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate statistics
      const incoming = deliveryNotes?.filter(note => note.type === 'incoming').length || 0;
      const outgoing = deliveryNotes?.filter(note => note.type === 'outgoing').length || 0;
      const inProgress = deliveryNotes?.filter(note => note.status === 'processing').length || 0;
      const thisMonth = deliveryNotes?.filter(note => 
        new Date(note.created_at) >= startOfMonth
      ).length || 0;

      return {
        incoming,
        outgoing,
        inProgress,
        thisMonth
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
