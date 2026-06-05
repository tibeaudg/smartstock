import React from 'react';
import { Shield, Download } from 'lucide-react';
import { CATEGORY_STYLES } from '@/lib/analytics/display';
import type { AnalyticsCategory } from '@/lib/analytics/types';

interface ActivityLogHeaderProps {
  title?: string;
  badge: { label: string; color: string; bg: string };
  categoryCounts: Record<AnalyticsCategory, number>;
  adminActionCount: number;
  showAdminOnly: boolean;
  onToggleAdminOnly: () => void;
  onExport?: () => void;
  exportDisabled?: boolean;
}

const CATEGORY_ORDER: AnalyticsCategory[] = [
  'lifecycle',
  'navigation',
  'interaction',
  'operation',
  'error',
  'performance',
];

export function ActivityLogHeader({
  title = 'Activity Log',
  badge,
  categoryCounts,
  adminActionCount,
  showAdminOnly,
  onToggleAdminOnly,
  onExport,
  exportDisabled,
}: ActivityLogHeaderProps) {
  const summaryParts = CATEGORY_ORDER.filter((c) => categoryCounts[c] > 0).map(
    (c) => `${categoryCounts[c]} ${CATEGORY_STYLES[c].label.toLowerCase()}`,
  );

  return (
    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {summaryParts.length > 0 ? summaryParts.join(' · ') : 'No product events'}
          {adminActionCount > 0 && ` · ${adminActionCount} admin action${adminActionCount !== 1 ? 's' : ''}`}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {CATEGORY_ORDER.map((cat) => {
            const n = categoryCounts[cat];
            if (n === 0) return null;
            const style = CATEGORY_STYLES[cat];
            return (
              <span
                key={cat}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${style.bg} ${style.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {n} {style.label}
              </span>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleAdminOnly}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
            showAdminOnly
              ? 'bg-purple-50 border-purple-200 text-purple-700 font-semibold'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-3 h-3" />
          Admin actions only
        </button>
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            disabled={exportDisabled}
            title="Exports product events and audit log rows for this user (current filters)"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export activity (CSV)
          </button>
        )}
      </div>
    </div>
  );
}
