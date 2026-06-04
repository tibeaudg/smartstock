import React, { useEffect, useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChartTimeRange, UserPlanInfo, UserProfile } from '@/lib/admin/types';
import {
  buildRegistrationSeries,
  chartDataForRecharts,
  suggestChartRange,
} from '@/lib/admin/registrationSeries';

interface RegistrationChartProps {
  users: UserProfile[];
  subscriptionPlanMap: Record<string, UserPlanInfo>;
  timeRange: ChartTimeRange;
  onTimeRangeChange: (range: ChartTimeRange) => void;
  isLoading?: boolean;
}

export function RegistrationChart({
  users,
  subscriptionPlanMap,
  timeRange,
  onTimeRangeChange,
  isLoading,
}: RegistrationChartProps) {
  useEffect(() => {
    if (users.length > 0) {
      const suggested = suggestChartRange(users, subscriptionPlanMap);
      if (timeRange === 'month' && suggested !== 'month') {
        onTimeRangeChange(suggested);
      }
    }
    // Only auto-suggest on first meaningful load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users.length]);

  const buckets = useMemo(
    () => buildRegistrationSeries(users, subscriptionPlanMap, timeRange),
    [users, subscriptionPlanMap, timeRange],
  );

  const chartData = useMemo(() => chartDataForRecharts(buckets), [buckets]);
  const total = buckets.reduce((s, b) => s + b.total, 0);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4 text-center">
        <h3 className="text-sm font-semibold text-slate-800">New Registrations</h3>
        <p className="text-sm text-slate-500 mt-4">No registrations in this range.</p>
        <button
          type="button"
          className="mt-2 text-sm text-blue-600 hover:underline"
          onClick={() => onTimeRangeChange('year')}
        >
          Try a wider range
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">New Registrations</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {total} in view · stacked trial vs paid · dashed = prior period
          </p>
        </div>
        <Select value={timeRange} onValueChange={(v) => onTimeRangeChange(v as ChartTimeRange)}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Daily (30d)</SelectItem>
            <SelectItem value="week">Weekly (12wk)</SelectItem>
            <SelectItem value="month">Monthly (12mo)</SelectItem>
            <SelectItem value="year">Yearly (5yr)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="free" stackId="a" fill="#cbd5e1" name="Free" />
          <Bar dataKey="trial" stackId="a" fill="#a78bfa" name="Trial" />
          <Bar dataKey="paid" stackId="a" fill="#2563eb" name="Paid" radius={[2, 2, 0, 0]} />
          <Line
            type="monotone"
            dataKey="prior"
            stroke="#94a3b8"
            strokeDasharray="4 4"
            dot={false}
            name="Prior period"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
