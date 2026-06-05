import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload } from 'lucide-react';
import { MetricCard } from '@/components/admin/MetricCard';

interface ImportFunnelStats {
  started: number;
  succeeded: number;
  failed: number;
  failureRate: number;
  p95DurationMs: number | null;
}

async function fetchImportFunnel(): Promise<ImportFunnelStats> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('events')
    .select('event_name, properties, timestamp')
    .gte('timestamp', since)
    .in('event_name', ['import_started', 'import_succeeded', 'import_failed']);

  if (error) throw error;

  let started = 0;
  let succeeded = 0;
  let failed = 0;
  const durations: number[] = [];

  for (const row of data ?? []) {
    if (row.event_name === 'import_started') started += 1;
    if (row.event_name === 'import_succeeded') {
      succeeded += 1;
      const ms = (row.properties as Record<string, unknown>)?.duration_ms;
      if (typeof ms === 'number') durations.push(ms);
    }
    if (row.event_name === 'import_failed') failed += 1;
  }

  durations.sort((a, b) => a - b);
  const p95 =
    durations.length > 0
      ? durations[Math.min(durations.length - 1, Math.floor(durations.length * 0.95))]
      : null;

  return {
    started,
    succeeded,
    failed,
    failureRate: started > 0 ? Math.round((100 * failed) / started) : 0,
    p95DurationMs: p95,
  };
}

export function ImportHealthSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['importHealthFunnel'],
    queryFn: fetchImportFunnel,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Import health</h2>
        <p className="text-sm text-red-600">Could not load import funnel from events table.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Import health</h2>
        <p className="text-sm text-slate-500 mt-1">
          Operation funnel: import_started → import_succeeded / import_failed (last 7 days).
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={Upload}
          label="Imports started"
          description="import_started events in the last 7 days."
          value={data?.started ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={Upload}
          label="Succeeded"
          description="import_succeeded events."
          value={data?.succeeded ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={Upload}
          label="Failed"
          description="import_failed events."
          value={data?.failed ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={Upload}
          label="Failure rate"
          description="failed / started."
          value={isLoading ? '—' : `${data?.failureRate ?? 0}%`}
          isLoading={isLoading}
        />
      </div>
      {!isLoading && data?.p95DurationMs != null && (
        <p className="text-xs text-slate-500">
          p95 duration on succeeded imports: {(data.p95DurationMs / 1000).toFixed(1)}s
        </p>
      )}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading funnel…
        </div>
      )}
    </section>
  );
}
