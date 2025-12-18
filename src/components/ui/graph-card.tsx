import React from 'react';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface GraphCardProps {
  className?: string;
}

// Sample sales velocity data
const salesData = [
  { value: 45 },
  { value: 52 },
  { value: 48 },
  { value: 61 },
  { value: 55 },
  { value: 68 },
  { value: 72 },
  { value: 65 },
  { value: 78 },
  { value: 82 },
  { value: 75 },
  { value: 88 },
];

export function GraphCard({ className }: GraphCardProps) {
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Sales Velocity</h3>
        </div>
        <span className="text-xs text-cyan-400 font-medium">+12.5%</span>
      </div>

      <div className="h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
        <span>Last 12 days</span>
        <span className="text-white/40">•</span>
        <span className="text-cyan-400">Trending up</span>
      </div>
    </div>
  );
}

