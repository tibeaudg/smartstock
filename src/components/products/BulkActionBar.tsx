import React from 'react';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Download, Archive, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionBarProps {
  selectedCount: number;
  onUpdateStock?: () => void;
  onAssignLocation?: () => void;
  onExport?: () => void;
  onArchive?: () => void;
  onClearSelection?: () => void;
  className?: string;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onUpdateStock,
  onAssignLocation,
  onExport,
  onArchive,
  onClearSelection,
  className,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-2 flex items-center justify-between',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-7 text-xs text-gray-500 hover:text-gray-700"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {onUpdateStock && (
          <Button
            variant="outline"
            size="sm"
            onClick={onUpdateStock}
            className="h-8 text-xs"
          >
            <Package className="w-3.5 h-3.5 mr-1.5" />
            Update Stock
          </Button>
        )}
        {onAssignLocation && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAssignLocation}
            className="h-8 text-xs"
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            Assign Location
          </Button>
        )}
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="h-8 text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Selected
          </Button>
        )}
        {onArchive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onArchive}
            className="h-8 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <Archive className="w-3.5 h-3.5 mr-1.5" />
            Archive
          </Button>
        )}
      </div>
    </div>
  );
};
