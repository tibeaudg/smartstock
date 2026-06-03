import React from 'react';
import { MetricCard } from '@/components/admin/MetricCard';
import { Users, TrendingUp, Target } from 'lucide-react';
import type { AnalyticsSummary, DailySignup } from '@/hooks/useAnalyticsDashboard';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface GrowthSectionProps {
  summary?: AnalyticsSummary;
  dailySignups: DailySignup[];
  isLoading: boolean;
}

export function GrowthSection({ summary, dailySignups, isLoading }: GrowthSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Growth</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          icon={Users}
          label="New users today"
          value={summary?.new_users_today ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={TrendingUp}
          label="New users (30d)"
          value={summary?.new_users_period ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={Target}
          label="Activation rate (7d)"
          value={`${summary?.activation_rate ?? 0}%`}
          isLoading={isLoading}
          iconColor="text-green-600"
        />
      </div>
      {dailySignups.length > 0 && (
        <div className="h-48 w-full rounded-lg border border-slate-200 bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailySignups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#2563eb" fill="#93c5fd" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
