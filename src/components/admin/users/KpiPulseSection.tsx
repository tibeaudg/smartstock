import React from 'react';
import { Clock, CreditCard, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { MetricDelta, PulseMetricValues, QuickFilter } from '@/lib/admin/types';
import { MetricDelta as MetricDeltaDisplay } from './MetricDelta';

interface KpiTileProps {
  value: React.ReactNode;
  label: string;
  delta?: MetricDelta;
  emphasized?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

function KpiTile({ value, label, delta, emphasized = true, onClick, icon }: KpiTileProps) {
  const muted = !emphasized;
  return (
    <Card
      className={`${onClick && emphasized ? 'cursor-pointer hover:bg-slate-50' : ''} ${
        muted ? 'opacity-50 border-slate-100' : ''
      } transition-colors`}
      onClick={emphasized ? onClick : undefined}
    >
      <CardContent className="p-2 sm:p-3">
        <div className="flex items-center gap-1">
          <div
            className={`text-lg sm:text-2xl font-bold tabular-nums ${
              muted ? 'text-slate-500' : 'text-slate-800'
            }`}
          >
            {value}
          </div>
          {icon}
        </div>
        <div className={`text-xs font-medium ${muted ? 'text-slate-400' : 'text-slate-600'}`}>
          {label}
        </div>
        {delta && emphasized && <MetricDeltaDisplay delta={delta} className="mt-1 block" />}
      </CardContent>
    </Card>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
      {children}
    </p>
  );
}

interface KpiPulseSectionProps {
  metrics: PulseMetricValues;
  deltas: {
    newToday: MetricDelta;
    newWeek: MetricDelta;
    conversion: MetricDelta;
    mrrPartial: MetricDelta;
  };
  isLoading?: boolean;
  onFilter: (filter: QuickFilter) => void;
}

export function KpiPulseSection({ metrics, deltas, isLoading, onFilter }: KpiPulseSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2 mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
      <div>
        <SectionLabel>Acquisition</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mt-1">
          <KpiTile value={metrics.totalUsers} label="Total users" emphasized />
          <KpiTile
            value={metrics.newUsersToday}
            label="New today"
            delta={deltas.newToday}
            emphasized={metrics.newUsersToday > 0}
          />
          <KpiTile
            value={metrics.newUsersThisWeek}
            label="New this week"
            delta={deltas.newWeek}
            emphasized={metrics.newUsersThisWeek > 0}
          />
        </div>
      </div>
      <div>
        <SectionLabel>Conversion</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mt-1">
          <KpiTile
            value={metrics.activeTrials}
            label="Active trials"
            emphasized={metrics.activeTrials > 0}
            onClick={() => onFilter('trialing')}
          />
          <KpiTile
            value={metrics.trialsExpiringSoon}
            label="Expiring <48h"
            emphasized={metrics.trialsExpiringSoon > 0}
            onClick={() => onFilter('trialing')}
            icon={
              metrics.trialsExpiringSoon > 0 ? (
                <Clock className="w-4 h-4 text-orange-500" />
              ) : undefined
            }
          />
          <KpiTile
            value={`${metrics.conversionRate}%`}
            label="Trial → Paid"
            delta={deltas.conversion}
            emphasized={metrics.activeTrials + metrics.activePayingCustomers > 0}
          />
        </div>
      </div>
      <div>
        <SectionLabel>Revenue</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mt-1">
          <KpiTile
            value={metrics.activePayingCustomers}
            label="Paying customers"
            emphasized={metrics.activePayingCustomers > 0}
            onClick={() => onFilter('paying')}
            icon={<CreditCard className="w-4 h-4 text-blue-500" />}
          />
          <KpiTile
            value={`$${metrics.totalMRR.toLocaleString()}`}
            label="MRR"
            delta={deltas.mrrPartial}
            emphasized={metrics.totalMRR > 0}
            icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          />
          {metrics.mrrAtRisk > 0 && (
            <div className="flex items-center text-[11px] text-red-600 font-medium px-2">
              ${metrics.mrrAtRisk} MRR at billing risk
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
