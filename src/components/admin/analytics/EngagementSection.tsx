import React from 'react';
import { MetricCard } from '@/components/admin/MetricCard';
import { Activity, Zap, Repeat } from 'lucide-react';
import type { AnalyticsSummary } from '@/hooks/useAnalyticsDashboard';

interface EngagementSectionProps {
  summary?: AnalyticsSummary;
  isLoading: boolean;
}

export function EngagementSection({ summary, isLoading }: EngagementSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Engagement</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <MetricCard icon={Activity} label="DAU" value={summary?.dau ?? 0} isLoading={isLoading} />
        <MetricCard icon={Activity} label="WAU" value={summary?.wau ?? 0} isLoading={isLoading} />
        <MetricCard icon={Activity} label="MAU" value={summary?.mau ?? 0} isLoading={isLoading} />
        <MetricCard
          icon={Zap}
          label="Actions / active user"
          value={summary?.avg_actions_per_active_user ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={Repeat}
          label="Weekly core feature %"
          value={`${summary?.core_feature_weekly_pct ?? 0}%`}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
