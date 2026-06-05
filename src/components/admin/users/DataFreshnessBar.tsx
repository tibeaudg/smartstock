import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataFreshnessBarProps {
  lastUpdated: number | undefined;
  isFetching: boolean;
  onRefresh: () => void;
}

export function DataFreshnessBar({ lastUpdated, isFetching, onRefresh }: DataFreshnessBarProps) {
  const label =
    lastUpdated != null
      ? `Updated ${formatDistanceToNow(lastUpdated, { addSuffix: true })}`
      : 'Not loaded yet';

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100">
      <div className="flex items-center gap-2">
        {isFetching && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />}
        <span>{label}</span>
        <span className="text-slate-400 hidden sm:inline">
          · Live profiles · Product health from daily aggregates
        </span>
      </div>
      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onRefresh} disabled={isFetching}>
        <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}
