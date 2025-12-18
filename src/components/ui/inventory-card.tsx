import React from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryCardProps {
  className?: string;
}

export function InventoryCard({ className }: InventoryCardProps) {
  const inStock = 75;
  const lowStock = 25;

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
      <div className="flex items-center gap-2 mb-3">
        <Package className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-white">Inventory Status</h3>
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/80">In Stock</span>
            <span className="text-white/60">{inStock}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${inStock}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/80">Low Stock</span>
            <span className="text-white/60">{lowStock}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${lowStock}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

