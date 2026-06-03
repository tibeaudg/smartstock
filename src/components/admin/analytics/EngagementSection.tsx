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
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Engagement</h2>
        <p className="text-sm text-slate-500 mt-1">
          How often users return and how deeply they use core product features.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <MetricCard
          icon={Activity}
          label="DAU"
          description="Unique users who performed any action today."
          value={summary?.dau ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={Activity}
          label="WAU"
          description="Unique users active at least once in the last 7 days."
          value={summary?.wau ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={Activity}
          label="MAU"
          description="Unique users active at least once in the last 30 days."
          value={summary?.mau ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={Zap}
          label="Actions / active user"
          description="Average events per active user over the last 30 days."
          value={summary?.avg_actions_per_active_user ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={Repeat}
          label="Weekly core feature %"
          description="Share of weekly active users who used a core feature this week."
          value={`${summary?.core_feature_weekly_pct ?? 0}%`}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
