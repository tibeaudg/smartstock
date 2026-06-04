import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { AnalyticsSummary } from '@/hooks/useAnalyticsDashboard';

interface PostHogParityBannerProps {
  summary?: AnalyticsSummary;
  posthogActivationPct?: number | null;
  isLoading?: boolean;
}

/**
 * Compares Postgres activation_rate with PostHog funnel (manual entry or future API).
 * Target: within 5% per docs/analytics-dashboards.md
 */
export function PostHogParityBanner({
  summary,
  posthogActivationPct = null,
  isLoading,
}: PostHogParityBannerProps) {
  const pgRate = summary?.activation_rate ?? 0;
  const phRate = posthogActivationPct;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        Loading Postgres vs PostHog parity check…
      </div>
    );
  }

  if (phRate == null) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <strong>PostHog parity:</strong> Postgres activation rate is {pgRate}%. Enter PostHog funnel step-5
        % in saved insights to compare (target ±5%).
      </div>
    );
  }

  const delta = Math.abs(pgRate - phRate);
  const ok = delta <= 5;

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm flex items-start gap-2 ${
        ok ? 'border-green-200 bg-green-50 text-green-800' : 'border-amber-200 bg-amber-50 text-amber-900'
      }`}
    >
      {!ok && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
      <div>
        <strong>PostHog ↔ Postgres:</strong> activation {pgRate}% (Postgres) vs {phRate}% (PostHog) — delta{' '}
        {delta.toFixed(1)}% {ok ? '(within 5% target)' : '(exceeds 5% — investigate exclusions or lag)'}
      </div>
    </div>
  );
}
