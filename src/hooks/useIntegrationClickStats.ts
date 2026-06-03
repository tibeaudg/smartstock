import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { INTEGRATIONS } from '@/lib/integrations/catalog';

export interface IntegrationClickStat {
  integrationId: string;
  integrationName: string;
  category: string;
  totalClicks: number;
  uniqueUsers: number;
}

export interface IntegrationClickStatsResult {
  stats: IntegrationClickStat[];
  totalClicks: number;
  totalUniqueUsers: number;
  integrationsWithClicks: number;
}

function buildClickStats(
  rows: { user_id: string | null; properties: Record<string, unknown> | null }[],
): IntegrationClickStatsResult {
  const byId = new Map<
    string,
    { name: string; category: string; clicks: number; users: Set<string> }
  >();
  const allUsers = new Set<string>();

  for (const row of rows) {
    const props = row.properties ?? {};
    const id = String(props.integration_id ?? '');
    if (!id) continue;
    const name = String(props.integration_name ?? id);
    const category = String(props.integration_category ?? '');
    const existing = byId.get(id) ?? {
      name,
      category,
      clicks: 0,
      users: new Set<string>(),
    };
    existing.clicks += 1;
    if (row.user_id) {
      existing.users.add(row.user_id);
      allUsers.add(row.user_id);
    }
    byId.set(id, existing);
  }

  const stats: IntegrationClickStat[] = INTEGRATIONS.map((def) => {
    const agg = byId.get(def.id);
    return {
      integrationId: def.id,
      integrationName: def.name,
      category: def.category,
      totalClicks: agg?.clicks ?? 0,
      uniqueUsers: agg?.users.size ?? 0,
    };
  }).sort(
    (a, b) =>
      b.totalClicks - a.totalClicks || a.integrationName.localeCompare(b.integrationName),
  );

  const totalClicks = stats.reduce((sum, s) => sum + s.totalClicks, 0);

  return {
    stats,
    totalClicks,
    totalUniqueUsers: allUsers.size,
    integrationsWithClicks: stats.filter((s) => s.totalClicks > 0).length,
  };
}

export function useIntegrationClickStats() {
  return useQuery({
    queryKey: ['admin', 'integration-click-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('user_id, properties')
        .eq('event_name', 'integration_clicked');

      if (error) throw error;
      return buildClickStats(data ?? []);
    },
    refetchInterval: 30_000,
  });
}
