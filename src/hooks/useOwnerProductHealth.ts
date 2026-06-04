import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface ProductHealthSummary {
  activation_rate: number;
  import_failure_rate_7d: number;
  error_events_7d: number;
  top_client_errors: Array<{ code: string; cnt: number }>;
}

function parseProductHealth(data: Json | null): ProductHealthSummary {
  const d = (data ?? {}) as Record<string, unknown>;
  const top = Array.isArray(d.top_client_errors) ? d.top_client_errors : [];
  return {
    activation_rate: Number(d.activation_rate ?? 0),
    import_failure_rate_7d: Number(d.import_failure_rate_7d ?? 0),
    error_events_7d: Number(d.error_events_7d ?? 0),
    top_client_errors: top.map((row) => {
      const r = row as Record<string, unknown>;
      return { code: String(r.code ?? 'unknown'), cnt: Number(r.cnt ?? 0) };
    }),
  };
}

export function useOwnerProductHealth(dateFrom?: string, dateTo?: string) {
  const from = dateFrom ?? new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const to = dateTo ?? new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ['productHealthSummary', from, to],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_product_health_summary', {
        p_date_from: from,
        p_date_to: to,
      });
      if (error) throw error;
      return parseProductHealth(data);
    },
    staleTime: 5 * 60 * 1000,
  });
}
