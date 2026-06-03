import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface AnalyticsSummary {
  new_users_today: number;
  new_users_period: number;
  dau: number;
  wau: number;
  mau: number;
  activation_rate: number;
  avg_actions_per_active_user: number;
  core_feature_weekly_pct: number;
}

export interface CohortRow {
  signup_date: string;
  cohort_size: number;
  day_1_pct: number | null;
  day_7_pct: number | null;
  day_30_pct: number | null;
}

export interface DailySignup {
  date: string;
  count: number;
}

export interface RevenueMetrics {
  mrr: number;
  payingCustomers: number;
  activeTrials: number;
  trialConversionPct: number;
}

function parseSummary(data: Json | null): AnalyticsSummary {
  const d = (data ?? {}) as Record<string, number>;
  return {
    new_users_today: d.new_users_today ?? 0,
    new_users_period: d.new_users_period ?? 0,
    dau: d.dau ?? 0,
    wau: d.wau ?? 0,
    mau: d.mau ?? 0,
    activation_rate: d.activation_rate ?? 0,
    avg_actions_per_active_user: d.avg_actions_per_active_user ?? 0,
    core_feature_weekly_pct: d.core_feature_weekly_pct ?? 0,
  };
}

export function useAnalyticsDashboard(dateFrom?: string, dateTo?: string) {
  const from = dateFrom ?? new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const to = dateTo ?? new Date().toISOString().slice(0, 10);

  const summaryQuery = useQuery({
    queryKey: ['analyticsSummary', from, to],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_analytics_summary', {
        p_date_from: from,
        p_date_to: to,
      });
      if (error) throw error;
      return parseSummary(data);
    },
    staleTime: 5 * 60 * 1000,
  });

  const cohortQuery = useQuery({
    queryKey: ['cohortRetention'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cohort_retention')
        .select('*')
        .order('signup_date', { ascending: false })
        .limit(12);
      if (error) throw error;
      return (data ?? []) as CohortRow[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const signupsQuery = useQuery({
    queryKey: ['dailySignups', from, to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', `${from}T00:00:00`)
        .lte('created_at', `${to}T23:59:59`);
      if (error) throw error;
      const byDate: Record<string, number> = {};
      for (const row of data ?? []) {
        const date = row.created_at.slice(0, 10);
        byDate[date] = (byDate[date] ?? 0) + 1;
      }
      return Object.entries(byDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)) as DailySignup[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const revenueQuery = useQuery({
    queryKey: ['analyticsRevenue'],
    queryFn: async () => {
      const { data: subs, error } = await supabase
        .from('user_subscriptions')
        .select('status, tier_id');
      if (error) throw error;

      const tierIds = [...new Set((subs ?? []).map(s => s.tier_id).filter(Boolean))];
      const { data: tiers } = tierIds.length
        ? await supabase.from('pricing_tiers').select('id, price_monthly').in('id', tierIds)
        : { data: [] };
      const tierPrice = new Map((tiers ?? []).map(t => [t.id, t.price_monthly ?? 0]));

      let mrr = 0;
      let payingCustomers = 0;
      let activeTrials = 0;
      for (const sub of subs ?? []) {
        if (sub.status === 'trial') activeTrials++;
        if (sub.status === 'active' && sub.tier_id) {
          const price = tierPrice.get(sub.tier_id) ?? 0;
          if (price > 0) {
            payingCustomers++;
            mrr += price;
          }
        }
      }
      const trialConversionPct =
        payingCustomers + activeTrials > 0
          ? Math.round((100 * payingCustomers) / (payingCustomers + activeTrials))
          : 0;

      return { mrr, payingCustomers, activeTrials, trialConversionPct } as RevenueMetrics;
    },
    staleTime: 5 * 60 * 1000,
  });

  const avgRetention = cohortQuery.data?.length
    ? {
        d1: cohortQuery.data.reduce((s, c) => s + (c.day_1_pct ?? 0), 0) / cohortQuery.data.length,
        d7: cohortQuery.data.reduce((s, c) => s + (c.day_7_pct ?? 0), 0) / cohortQuery.data.length,
        d30: cohortQuery.data.reduce((s, c) => s + (c.day_30_pct ?? 0), 0) / cohortQuery.data.length,
      }
    : { d1: 0, d7: 0, d30: 0 };

  return {
    summary: summaryQuery.data,
    cohorts: cohortQuery.data ?? [],
    dailySignups: signupsQuery.data ?? [],
    revenue: revenueQuery.data,
    avgRetention,
    isLoading:
      summaryQuery.isLoading ||
      cohortQuery.isLoading ||
      signupsQuery.isLoading ||
      revenueQuery.isLoading,
  };
}
