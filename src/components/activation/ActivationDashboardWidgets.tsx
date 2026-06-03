import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const RESTOCKING_ROWS = [
  { name: 'Office Chair', stock: '2 in stock' },
  { name: 'Printer Paper A4', stock: '5 in stock' },
];

const RECENT_ROWS = [
  { name: 'Wireless Mouse', stock: '24 in stock' },
  { name: 'USB-C Cable', stock: '120 in stock' },
];

function PreviewBadge() {
  return (
    <Badge variant="secondary" className="text-[10px] font-normal uppercase tracking-wide">
      Preview
    </Badge>
  );
}

function GhostListCard({
  title,
  icon,
  rows,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  rows: { name: string; stock: string }[];
  className?: string;
}) {
  return (
    <Card
      className={cn(
        'border border-dashed border-gray-300 dark:border-gray-600 shadow-none opacity-75 pointer-events-none',
        className
      )}
    >
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon}
          <h3 className="font-semibold text-slate-600 dark:text-slate-300 text-sm truncate">{title}</h3>
        </div>
        <PreviewBadge />
      </div>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {rows.map((row) => (
            <div key={row.name} className="p-4 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300 dark:text-gray-600">{row.name}</span>
              <span className="text-sm text-gray-300 dark:text-gray-600">{row.stock}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivationDashboardWidgets({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-4', className)}>
      <GhostListCard
        title="Items that need restocking"
        icon={
          <div className="p-1 bg-emerald-50 dark:bg-emerald-950 rounded">
            <Plus className="h-4 w-4 text-emerald-400 rotate-45" />
          </div>
        }
        rows={RESTOCKING_ROWS.map((r) => ({ ...r, stock: r.stock.replace(' in stock', ' in stock') }))}
      />
      <GhostListCard
        title="Recent items"
        icon={null}
        rows={RECENT_ROWS}
      />
    </div>
  );
}
