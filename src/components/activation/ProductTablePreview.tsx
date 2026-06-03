import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const GHOST_ROWS = [
  { name: 'Wireless Mouse', sku: 'SKU-001', category: 'Electronics', stock: '24', status: 'In stock', statusClass: 'text-emerald-600' },
  { name: 'Office Chair', sku: 'SKU-002', category: 'Furniture', stock: '8', status: 'Low stock', statusClass: 'text-amber-600' },
  { name: 'USB-C Cable', sku: 'SKU-003', category: 'Electronics', stock: '120', status: 'In stock', statusClass: 'text-emerald-600' },
  { name: 'Notebook A5', sku: 'SKU-004', category: 'Stationery', stock: '45', status: 'In stock', statusClass: 'text-emerald-600' },
];

interface ProductTablePreviewProps {
  className?: string;
}

export function ProductTablePreview({ className }: ProductTablePreviewProps) {
  return (
    <div className={cn('relative', className)}>
      <Card className="border border-dashed border-gray-300 dark:border-gray-600 overflow-hidden shadow-none opacity-60 pointer-events-none select-none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Product', 'SKU', 'Category', 'Stock', 'Status'].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {GHOST_ROWS.map((row) => (
                <tr key={row.sku}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-400">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{row.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{row.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 text-center">{row.stock}</td>
                  <td className={cn('px-4 py-3 text-sm text-center', row.statusClass)}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
        Your products will appear here
      </p>
    </div>
  );
}
