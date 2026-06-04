import React from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import type { MetricDelta as MetricDeltaType } from '@/lib/admin/types';

interface MetricDeltaProps {
  delta: MetricDeltaType;
  className?: string;
}

export function MetricDelta({ delta, className = '' }: MetricDeltaProps) {
  if (delta.direction === 'flat') {
    return (
      <span className={`inline-flex items-center gap-0.5 text-[10px] text-slate-400 ${className}`}>
        <Minus className="w-3 h-3" />
        {delta.label}
      </span>
    );
  }
  const isUp = delta.direction === 'up';
  const Icon = isUp ? ArrowUp : ArrowDown;
  const color = isUp ? 'text-emerald-600' : 'text-red-600';
  const suffix = delta.isPercent ? '%' : '';
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${color} ${className}`}>
      <Icon className="w-3 h-3" />
      {isUp ? '+' : '−'}
      {delta.value}
      {suffix} {delta.label}
    </span>
  );
}
