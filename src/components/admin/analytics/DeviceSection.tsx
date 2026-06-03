import React from 'react';
import { MetricCard } from '@/components/admin/MetricCard';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import type { DeviceStats } from '@/hooks/useAnalyticsDashboard';
import { AnalyticsChart } from '@/components/admin/analytics/AnalyticsChart';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const DEVICE_COLORS: Record<string, string> = {
  mobile: '#2563eb',
  tablet: '#9333ea',
  desktop: '#16a34a',
  unknown: '#94a3b8',
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: 'Mobile',
  tablet: 'Tablet',
  desktop: 'Desktop',
  unknown: 'Unknown',
};

interface DeviceSectionProps {
  deviceStats?: DeviceStats;
  isLoading: boolean;
}

export function DeviceSection({ deviceStats, isLoading }: DeviceSectionProps) {
  const breakdown = deviceStats?.breakdown ?? [];
  const total = breakdown.reduce((sum, d) => sum + d.count, 0);

  const pieData = breakdown.map(d => ({
    name: DEVICE_LABELS[d.device] ?? d.device,
    value: d.count,
    key: d.device,
  }));

  const mobileCount = breakdown.find(d => d.device === 'mobile')?.count ?? 0;
  const tabletCount = breakdown.find(d => d.device === 'tablet')?.count ?? 0;
  const desktopCount = breakdown.find(d => d.device === 'desktop')?.count ?? 0;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Devices</h2>
        <p className="text-sm text-slate-500 mt-1">
          Which devices users log in from, based on session starts in the selected period.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          icon={Smartphone}
          label="Mobile logins"
          description="Sessions started on screens under 768px wide."
          value={mobileCount}
          isLoading={isLoading}
          iconColor="text-blue-600"
        />
        <MetricCard
          icon={Tablet}
          label="Tablet logins"
          description="Sessions started on screens between 768px and 1024px."
          value={tabletCount}
          isLoading={isLoading}
          iconColor="text-purple-600"
        />
        <MetricCard
          icon={Monitor}
          label="Desktop logins"
          description="Sessions started on screens 1024px wide or larger."
          value={desktopCount}
          isLoading={isLoading}
          iconColor="text-green-600"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pieData.length > 0 && (
          <AnalyticsChart
            title="Login device mix"
            description="Share of sessions by device type for the selected period."
            height="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map(entry => (
                    <Cell key={entry.key} fill={DEVICE_COLORS[entry.key] ?? DEVICE_COLORS.unknown} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [v, 'Sessions']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </AnalyticsChart>
        )}
        {breakdown.length > 0 && (
          <AnalyticsChart
            title="Sessions by device"
            description="Total login sessions grouped by device category."
            height="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={breakdown.map(d => ({
                  device: DEVICE_LABELS[d.device] ?? d.device,
                  count: d.count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="device" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(v: number) => [v, 'Sessions']} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {breakdown.map(d => (
                    <Cell
                      key={d.device}
                      fill={DEVICE_COLORS[d.device] ?? DEVICE_COLORS.unknown}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </AnalyticsChart>
        )}
      </div>
      {(deviceStats?.dailyTrend ?? []).length > 0 && (
        <AnalyticsChart
          title="Daily logins by device"
          description="Session starts per day, split by mobile, tablet, and desktop."
          height="h-56"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={deviceStats?.dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="mobile"
                name="Mobile"
                stackId="1"
                stroke={DEVICE_COLORS.mobile}
                fill={DEVICE_COLORS.mobile}
                fillOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="tablet"
                name="Tablet"
                stackId="1"
                stroke={DEVICE_COLORS.tablet}
                fill={DEVICE_COLORS.tablet}
                fillOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="desktop"
                name="Desktop"
                stackId="1"
                stroke={DEVICE_COLORS.desktop}
                fill={DEVICE_COLORS.desktop}
                fillOpacity={0.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsChart>
      )}
      {!isLoading && total === 0 && (
        <p className="text-sm text-slate-500 rounded-lg border border-dashed border-slate-200 p-6 text-center">
          No login sessions recorded yet. Device data appears once users sign in after tracking is enabled.
        </p>
      )}
    </section>
  );
}
