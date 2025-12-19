import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ShoppingCart, History, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockQuickActionMenuProps {
  product: any;
  onAdjustStock: (product: any) => void;
  onCreatePO: (product: any) => void;
  onViewHistory: (product: any) => void;
  children: React.ReactNode;
  className?: string;
}

export const StockQuickActionMenu: React.FC<StockQuickActionMenuProps> = ({
  product,
  onAdjustStock,
  onCreatePO,
  onViewHistory,
  children,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = React.useRef(false);

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    isHoveringRef.current = true;
    setOpen(true);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    // Add a delay before closing to allow mouse to move to content
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setOpen(false);
      }
    }, 200);
  };

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <div 
          className={cn("w-full", className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-56 p-1" 
        align="start"
        side="right"
        sideOffset={8}
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking inside
          const target = e.target as HTMLElement;
          if (target.closest('[data-radix-popper-content-wrapper]')) {
            e.preventDefault();
          }
        }}
      >
        <div 
          className="space-y-0.5"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-9 px-2"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onAdjustStock(product);
            }}
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Adjust Stock</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-9 px-2"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onCreatePO(product);
            }}
          >
            <ShoppingCart className="w-4 h-4 text-green-600" />
            <span className="text-sm">Create PO</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-9 px-2"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onViewHistory(product);
            }}
          >
            <History className="w-4 h-4 text-gray-600" />
            <span className="text-sm">View History</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};


