import React from 'react';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeyTakeawaysProps {
  items: string[];
  className?: string;
}

export function KeyTakeaways({ items, className }: KeyTakeawaysProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={cn('bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 my-8', className)}>
      <div className="flex items-start gap-3 mb-4">
        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <h3 className="text-xl font-semibold text-gray-900">Key Takeaways</h3>
      </div>
      <ul className="space-y-3 ml-8">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700 leading-relaxed flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

