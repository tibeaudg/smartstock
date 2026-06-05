import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { UserPlanInfo } from '@/lib/admin/types';

export function SubStatusBadge({
  status,
  hasFailedInvoice,
}: {
  status: UserPlanInfo['subStatus'];
  hasFailedInvoice: boolean;
}) {
  if (status === 'past_due' || hasFailedInvoice) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">
        <AlertTriangle className="w-3 h-3" />
        Past Due
      </span>
    );
  }
  if (status === 'trial') {
    return (
      <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">
        Trial
      </span>
    );
  }
  if (status === 'active') {
    return (
      <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">
        Active
      </span>
    );
  }
  if (status === 'paused') {
    return (
      <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-700">
        Paused
      </span>
    );
  }
  if (status === 'cancelled') {
    return (
      <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
        Cancelled
      </span>
    );
  }
  if (status === 'expired') {
    return (
      <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800">
        Expired
      </span>
    );
  }
  return <span className="text-slate-400 text-xs">—</span>;
}
