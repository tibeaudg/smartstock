import React from 'react';
import { AlertTriangle, CreditCard, Loader2, Mail, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { AttentionQueueItem, AttentionReason } from '@/lib/admin/types';
import { getAttentionReasonLabel } from '@/lib/admin/attentionQueue';
import { emailUser, impersonateUser } from '@/lib/admin/userAdminActions';

const REASON_ICONS: Partial<Record<AttentionReason, React.ReactNode>> = {
  churn_risk: <AlertTriangle className="w-3 h-3" />,
  no_payment_method: <CreditCard className="w-3 h-3" />,
  recent_errors: <AlertTriangle className="w-3 h-3" />,
};

interface NeedsAttentionQueueProps {
  items: AttentionQueueItem[];
  isLoading?: boolean;
  maxVisible?: number;
  adminId?: string;
  adminEmail?: string;
  onSelectUser: (userId: string) => void;
  onViewAll?: () => void;
}

export function NeedsAttentionQueue({
  items,
  isLoading,
  maxVisible = 10,
  adminId,
  adminEmail,
  onSelectUser,
  onViewAll,
}: NeedsAttentionQueueProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 mb-4 space-y-2">
        <Skeleton className="h-5 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4 text-sm text-slate-600">
        <span className="font-semibold text-slate-800">Needs attention</span>
        <span className="ml-2">— No accounts require outreach right now.</span>
      </div>
    );
  }

  const visible = items.slice(0, maxVisible);

  return (
    <div className="rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50/80 to-white p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Needs attention</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized by MRR at risk — who to contact today
          </p>
        </div>
        {items.length > maxVisible && onViewAll && (
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onViewAll}>
            View all {items.length}
          </Button>
        )}
      </div>
      <ul className="space-y-1.5">
        {visible.map((item) => (
          <li
            key={item.userId}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 hover:border-amber-300 transition-colors"
          >
            <button
              type="button"
              className="flex-1 min-w-0 text-left"
              onClick={() => onSelectUser(item.userId)}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-slate-900 truncate">{item.email}</span>
                {item.mrrAtRisk > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 tabular-nums">
                    ${item.mrrAtRisk}/mo
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.reasons.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800"
                  >
                    {REASON_ICONS[r]}
                    {getAttentionReasonLabel(r)}
                  </span>
                ))}
              </div>
            </button>
            <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Send email"
                aria-label={`Email ${item.email}`}
                onClick={() => emailUser(item.email)}
              >
                <Mail className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Login as user (copies magic link)"
                aria-label={`Login as ${item.email}`}
                onClick={() =>
                  impersonateUser(
                    item.userId,
                    item.email,
                    adminId ? { id: adminId, email: adminEmail } : undefined,
                  )
                }
              >
                <UserCog className="w-4 h-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
