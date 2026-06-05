import React, { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { AdminAlert, QuickFilter } from '@/lib/admin/types';
import { dismissAlertId } from '@/lib/admin/alerts';

interface AdminAlertsPanelProps {
  alerts: AdminAlert[];
  onApplyFilter: (filter: QuickFilter) => void;
  onDismiss: (id: string) => void;
}

export function AdminAlertsPanel({ alerts, onApplyFilter, onDismiss }: AdminAlertsPanelProps) {
  const [expanded, setExpanded] = useState(true);

  const visible = useMemo(() => alerts, [alerts]);

  if (visible.length === 0) return null;

  const severityStyles = {
    critical: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden mb-4">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-sm font-semibold text-slate-800"
        onClick={() => setExpanded((e) => !e)}
      >
        <span className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Alerts ({visible.length})
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expanded && (
        <ul className="divide-y divide-slate-100">
          {visible.map((alert) => (
            <li
              key={alert.id}
              className={`flex flex-wrap items-start justify-between gap-2 px-4 py-3 border-l-4 ${severityStyles[alert.severity]}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{alert.title}</p>
                <p className="text-xs mt-0.5 opacity-90">{alert.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {alert.filter && alert.actionLabel && (
                  <button
                    type="button"
                    className="text-xs font-medium underline hover:no-underline"
                    onClick={() => onApplyFilter(alert.filter!)}
                  >
                    {alert.actionLabel}
                  </button>
                )}
                <button
                  type="button"
                  className="p-1 rounded hover:bg-black/5"
                  aria-label="Dismiss alert"
                  onClick={() => {
                    dismissAlertId(alert.id);
                    onDismiss(alert.id);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
