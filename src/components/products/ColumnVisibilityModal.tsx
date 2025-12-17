import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getAvailableColumns, 
  getColumnsByCategory, 
  getCategoryDisplayName,
  getDefaultVisibleColumns,
  type ColumnDefinition 
} from '@/lib/products/columnFieldMapping';

interface ColumnVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleColumns: string[];
  onSave: (columns: string[]) => void;
  onReset: () => void;
}

export function ColumnVisibilityModal({
  isOpen,
  onClose,
  visibleColumns,
  onSave,
  onReset,
}: ColumnVisibilityModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(visibleColumns);
  const [searchTerm, setSearchTerm] = useState('');

  // Update selected columns when visibleColumns prop changes
  useEffect(() => {
    setSelectedColumns(visibleColumns);
  }, [visibleColumns]);

  // Get all columns grouped by category
  const columnsByCategory = getColumnsByCategory();
  const allColumns = getAvailableColumns();

  // Filter columns based on search term
  const filteredColumns = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return columnsByCategory;
    }

    const term = searchTerm.toLowerCase();
    const filtered: Record<string, ColumnDefinition[]> = {};

    Object.entries(columnsByCategory).forEach(([category, columns]) => {
      const matching = columns.filter(col => 
        col.label.toLowerCase().includes(term) ||
        col.description?.toLowerCase().includes(term) ||
        col.id.toLowerCase().includes(term)
      );
      if (matching.length > 0) {
        filtered[category] = matching;
      }
    });

    return filtered;
  }, [searchTerm, columnsByCategory]);

  // Toggle column visibility
  const toggleColumn = (columnId: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  // Select all columns
  const selectAll = () => {
    setSelectedColumns(allColumns.map(col => col.id));
  };

  // Deselect all columns
  const deselectAll = () => {
    setSelectedColumns([]);
  };

  // Reset to defaults
  const handleReset = () => {
    const defaults = getDefaultVisibleColumns();
    setSelectedColumns(defaults);
    onReset();
  };

  // Handle save
  const handleSave = () => {
    // Ensure at least one column is selected
    if (selectedColumns.length === 0) {
      setSelectedColumns(getDefaultVisibleColumns());
      onSave(getDefaultVisibleColumns());
    } else {
      onSave(selectedColumns);
    }
    onClose();
  };

  // Check if all columns in a category are selected
  const isCategoryFullySelected = (category: string): boolean => {
    const categoryColumns = columnsByCategory[category] || [];
    if (categoryColumns.length === 0) return false;
    return categoryColumns.every(col => selectedColumns.includes(col.id));
  };

  // Toggle all columns in a category
  const toggleCategory = (category: string) => {
    const categoryColumns = columnsByCategory[category] || [];
    const allSelected = isCategoryFullySelected(category);
    
    if (allSelected) {
      // Deselect all in category
      setSelectedColumns(prev => prev.filter(id => 
        !categoryColumns.some(col => col.id === id)
      ));
    } else {
      // Select all in category
      const categoryIds = categoryColumns.map(col => col.id);
      setSelectedColumns(prev => {
        const newSelection = [...prev];
        categoryIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const totalColumns = allColumns.length;
  const selectedCount = selectedColumns.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Customize Columns</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Choose which columns to display in the products table
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Selection Summary */}
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {selectedCount} of {totalColumns} columns selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="h-7 text-xs"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deselectAll}
                className="h-7 text-xs"
              >
                Deselect All
              </Button>
            </div>
          </div>

          {/* Columns List - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg p-4 space-y-6">
            {Object.entries(filteredColumns).map(([category, columns]) => (
              <div key={category} className="space-y-2">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isCategoryFullySelected(category)}
                      onCheckedChange={() => toggleCategory(category)}
                      className="h-4 w-4"
                    />
                    <Label className="font-semibold text-sm cursor-pointer" onClick={() => toggleCategory(category)}>
                      {getCategoryDisplayName(category)}
                    </Label>
                  </div>
                  <span className="text-xs text-gray-500">
                    {columns.filter(col => selectedColumns.includes(col.id)).length} / {columns.length}
                  </span>
                </div>

                {/* Category Columns */}
                <div className="ml-6 space-y-2">
                  {columns.map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center gap-2 py-1 hover:bg-gray-50 rounded px-2 -mx-2"
                    >
                      <Checkbox
                        id={column.id}
                        checked={selectedColumns.includes(column.id)}
                        onCheckedChange={() => toggleColumn(column.id)}
                        className="h-4 w-4"
                      />
                      <Label
                        htmlFor={column.id}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {column.label}
                      </Label>
                      {column.sortable && (
                        <span className="text-xs text-gray-400">Sortable</span>
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="mt-4" />
              </div>
            ))}

            {Object.keys(filteredColumns).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No columns found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

