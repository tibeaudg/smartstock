import React from 'react';

interface AnalyticsChartProps {
  title: string;
  description: string;
  height?: string;
  children: React.ReactNode;
}

export function AnalyticsChart({
  title,
  description,
  height = 'h-48',
  children,
}: AnalyticsChartProps) {
  return (
    <div className={`${height} w-full rounded-lg border border-slate-200 bg-white p-4 flex flex-col`}>
      <div className="mb-3 flex-shrink-0">
        <h3 className="text-sm font-medium text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
