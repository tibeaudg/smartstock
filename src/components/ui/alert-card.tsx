import React from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  className?: string;
}

export function AlertCard({ className }: AlertCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl p-4',
        'shadow-lg',
        className
      )}
      style={{
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-orange-400/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-medium text-orange-400 uppercase tracking-wide">
              Alert
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">
            Reorder Triggered
          </h3>
          <p className="text-xs text-white/70 leading-relaxed">
            Product "Widget A" has reached minimum stock level. Automatic reorder initiated.
          </p>
        </div>
      </div>
    </div>
  );
}

