import React from 'react';
import { MetricCard } from '@/components/admin/MetricCard';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import type { CohortRow } from '@/hooks/useAnalyticsDashboard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface RetentionSectionProps {
  cohorts: CohortRow[];
  avgRetention: { d1: number; d7: number; d30: number };
  isLoading: boolean;
}

export function RetentionSection({ cohorts, avgRetention, isLoading }: RetentionSectionProps) {
  const chartData = [...cohorts]
    .reverse()
    .map(c => ({
      date: c.signup_date.slice(5),
      d1: c.day_1_pct ?? 0,
      d7: c.day_7_pct ?? 0,
      d30: c.day_30_pct ?? 0,
    }));

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Retention</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          icon={Calendar}
          label="Avg D1 retention"
          value={`${avgRetention.d1.toFixed(1)}%`}
          isLoading={isLoading}
        />
        <MetricCard
          icon={CalendarDays}
          label="Avg D7 retention"
          value={`${avgRetention.d7.toFixed(1)}%`}
          isLoading={isLoading}
        />
        <MetricCard
          icon={CalendarRange}
          label="Avg D30 retention"
          value={`${avgRetention.d30.toFixed(1)}%`}
          isLoading={isLoading}
        />
      </div>
      {chartData.length > 0 && (
        <div className="h-56 w-full rounded-lg border border-slate-200 bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Legend />
              <Line type="monotone" dataKey="d1" name="D1" stroke="#2563eb" dot={false} />
              <Line type="monotone" dataKey="d7" name="D7" stroke="#16a34a" dot={false} />
              <Line type="monotone" dataKey="d30" name="D30" stroke="#9333ea" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
