import React from 'react';
import { MetricCard } from '@/components/admin/MetricCard';
import { CreditCard, Users, Clock, Percent } from 'lucide-react';
import type { RevenueMetrics } from '@/hooks/useAnalyticsDashboard';

interface RevenueSectionProps {
  revenue?: RevenueMetrics;
  isLoading: boolean;
}

export function RevenueSection({ revenue, isLoading }: RevenueSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Revenue</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={CreditCard}
          label="MRR"
          value={`$${revenue?.mrr ?? 0}`}
          isLoading={isLoading}
          iconColor="text-green-600"
        />
        <MetricCard
          icon={Users}
          label="Paying customers"
          value={revenue?.payingCustomers ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          icon={Clock}
          label="Active trials"
          value={revenue?.activeTrials ?? 0}
          isLoading={isLoading}
          iconColor="text-purple-600"
        />
        <MetricCard
          icon={Percent}
          label="Trial → paid"
          value={`${revenue?.trialConversionPct ?? 0}%`}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
