import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  value: number | string | React.ReactNode;
  label: string;
  isLoading?: boolean;
  iconColor?: string;
  valueColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  value,
  label,
  isLoading = false,
  iconColor = 'text-slate-600',
  valueColor = 'text-slate-900',
}) => {
  return (
    <div className="p-4 rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-2xl font-bold ${valueColor} tabular-nums`}>
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            ) : (
              value
            )}
          </div>
          <div className="text-sm text-slate-600 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
};


