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

      <div>

        <h2 className="text-lg font-semibold text-slate-900">Revenue</h2>

        <p className="text-sm text-slate-500 mt-1">

          Paid subscribers with billing on file, active trials, and conversion.

        </p>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        <MetricCard

          icon={CreditCard}

          label="MRR"

          description="MRR from active paid plans with Stripe billing. Excludes trials and accounts without payment info."

          value={`$${revenue?.mrr ?? 0}`}

          isLoading={isLoading}

          iconColor="text-green-600"

        />

        <MetricCard

          icon={Users}

          label="Paying customers"

          description="Active paid subscribers with payment info on file. Excludes trials and unpaid activations."

          value={revenue?.payingCustomers ?? 0}

          isLoading={isLoading}

        />

        <MetricCard

          icon={Clock}

          label="Active trials"

          description="Users in an ongoing trial (not expired) who have not converted to a paid plan."

          value={revenue?.activeTrials ?? 0}

          isLoading={isLoading}

          iconColor="text-purple-600"

        />

        <MetricCard

          icon={Percent}

          label="Trial → paid"

          description="Paying customers divided by paying customers plus active trials."

          value={`${revenue?.trialConversionPct ?? 0}%`}

          isLoading={isLoading}

        />

      </div>

    </section>

  );

}

