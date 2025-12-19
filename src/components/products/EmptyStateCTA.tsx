import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateCTAProps {
  field: string;
  message: string;
  onAction?: () => void;
  compact?: boolean;
  className?: string;
}

export const EmptyStateCTA: React.FC<EmptyStateCTAProps> = ({
  field,
  message,
  onAction,
  compact = false,
  className,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 hover:underline transition-colors',
        compact ? 'text-[10px]' : 'text-xs',
        className
      )}
    >
      <Plus className={cn(compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      <span>{message}</span>
    </button>
  );
};
