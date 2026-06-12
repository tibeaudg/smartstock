import React from 'react';

import { MetricCard } from '@/components/admin/MetricCard';

import { Users, TrendingUp, Target } from 'lucide-react';

import type { AnalyticsSummary, DailySignup } from '@/hooks/useAnalyticsDashboard';

import { AnalyticsChart } from '@/components/admin/analytics/AnalyticsChart';

import {

  ResponsiveContainer,

  AreaChart,

  Area,

  XAxis,

  YAxis,

  Tooltip,

  CartesianGrid,

} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';





interface GrowthSectionProps {

  summary?: AnalyticsSummary;

  dailySignups: DailySignup[];

  isLoading: boolean;

}



export function GrowthSection({ summary, dailySignups, isLoading }: GrowthSectionProps) {
  // Fetch operational metrics
  const { data: metrics, isLoading: loadingMetrics } = useQuery({   
    queryKey: ['systemMetrics'],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .or('is_owner.is.null,is_owner.eq.false');



      return {
        totalUsers: totalUsers || 0,
      
      };
    },
    refetchInterval: 60000, // Refetch every minute
  });

  return (

    <section className="space-y-4">

      <div>

        <h2 className="text-lg font-semibold text-slate-900">Growth</h2>

        <p className="text-sm text-slate-500 mt-1">

          New account signups and how quickly users reach their first core action.

        </p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        <MetricCard

          icon={Users}

          label="New users today"

          description="Accounts created since midnight UTC today."

          value={summary?.new_users_today ?? 0}

          isLoading={isLoading}

        />

        <MetricCard

          icon={TrendingUp}

          label="New users (30d)"

          description="Total signups in the last 30 days."

          value={summary?.new_users_period ?? 0}

          isLoading={isLoading}

        />

        <MetricCard
              icon={Users}
              value={metrics?.totalUsers || 0}
              label="Total Users"
              isLoading={loadingMetrics}
              iconColor="text-blue-600"
        />

      </div>

      {dailySignups.length > 0 && (

        <AnalyticsChart

          title="Daily signups"

          description="Number of new accounts registered each day over the selected period."

        >

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={dailySignups}>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />

              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />

              <Tooltip />

              <Area type="monotone" dataKey="count" stroke="#2563eb" fill="#93c5fd" fillOpacity={0.4} />

            </AreaChart>

          </ResponsiveContainer>

        </AnalyticsChart>

      )}

    </section>

  );

}

