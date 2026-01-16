import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalesOrderBulkActionBarProps {
  selectedCount: number;
  onExport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onClearSelection?: () => void;
  className?: string;
}

export const SalesOrderBulkActionBar: React.FC<SalesOrderBulkActionBarProps> = ({
  selectedCount,
  onExport,
  onEdit,
  onDelete,
  onClearSelection,
  className,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'sticky bottom-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex items-center justify-between',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          {selectedCount} Selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="h-8 text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
          </Button>
        )}
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 text-xs"
          >
            <Edit className="w-3.5 h-3.5 mr-1.5" />
            Edit Info
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete
          </Button>
        )}
        {onClearSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

