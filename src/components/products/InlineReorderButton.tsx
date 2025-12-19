import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineReorderButtonProps {
  productId: string;
  productName: string;
  onReorder?: (productId: string) => void;
  onCreatePO?: (productId: string) => void;
  variant?: 'reorder' | 'create-po' | 'both';
  compact?: boolean;
  className?: string;
}

export const InlineReorderButton: React.FC<InlineReorderButtonProps> = ({
  productId,
  productName,
  onReorder,
  onCreatePO,
  variant = 'reorder',
  compact = false,
  className,
}) => {
  const handleReorder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReorder?.(productId);
  };

  const handleCreatePO = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreatePO?.(productId);
  };

  if (variant === 'both') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Button
          variant="outline"
          size={compact ? 'sm' : 'default'}
          className={cn(
            'h-6 px-2 text-xs font-medium',
            compact && 'h-5 px-1.5 text-[10px]'
          )}
          onClick={handleReorder}
        >
          <ShoppingCart className={cn('mr-1', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
          Reorder
        </Button>
        <Button
          variant="outline"
          size={compact ? 'sm' : 'default'}
          className={cn(
            'h-6 px-2 text-xs font-medium',
            compact && 'h-5 px-1.5 text-[10px]'
          )}
          onClick={handleCreatePO}
        >
          <FileText className={cn('mr-1', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
          Create PO
        </Button>
      </div>
    );
  }

  const isCreatePO = variant === 'create-po';

  return (
    <Button
      variant="outline"
      size={compact ? 'sm' : 'default'}
      className={cn(
        'h-6 px-2 text-xs font-medium',
        compact && 'h-5 px-1.5 text-[10px]',
        className
      )}
      onClick={isCreatePO ? handleCreatePO : handleReorder}
    >
      {isCreatePO ? (
        <>
          <FileText className={cn('mr-1', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
          Create PO
        </>
      ) : (
        <>
          <ShoppingCart className={cn('mr-1', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
          Reorder
        </>
      )}
    </Button>
  );
};
