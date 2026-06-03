import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ActivationHeroProps {
  showDashboardLink?: boolean;
  className?: string;
}

export function ActivationHero({ showDashboardLink = false, className }: ActivationHeroProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {showDashboardLink && (
        <Link
          to="/dashboard"
          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
        >
          ← Back to setup overview
        </Link>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Your inventory control center
      </h2>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl">
        Add your first products and StockFlow tracks everything — quantities, values, low stock
        alerts, and activity — in real time.
      </p>
    </div>
  );
}
