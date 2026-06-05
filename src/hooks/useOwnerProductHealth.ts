import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface ProductHealthSummary {
  activation_rate: number | null;
  activation_signup_count: number;
  import_failure_rate_7d: number | null;
  import_started_7d: number;
  error_events_7d: number;
  events_in_period: number;
  top_client_errors: Array<{ code: string; cnt: number }>;
}

function parseProductHealth(data: Json | null): ProductHealthSummary {
  const d = (data ?? {}) as Record<string, unknown>;
  const top = Array.isArray(d.top_client_errors) ? d.top_client_errors : [];
  const activationRaw = d.activation_rate;
  return {
    activation_rate:
      activationRaw === null || activationRaw === undefined
        ? null
        : Number(activationRaw),
    activation_signup_count: Number(d.activation_signup_count ?? 0),
    import_failure_rate_7d:
      d.import_failure_rate_7d === null || d.import_failure_rate_7d === undefined
        ? null
        : Number(d.import_failure_rate_7d),
    import_started_7d: Number(d.import_started_7d ?? 0),
    error_events_7d: Number(d.error_events_7d ?? 0),
    events_in_period: Number(d.events_in_period ?? 0),
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
