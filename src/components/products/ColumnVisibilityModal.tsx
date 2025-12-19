import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, RotateCcw, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  getAvailableColumns, 
  getColumnsByCategory, 
  getCategoryDisplayName,
  getDefaultVisibleColumns,
  getDefaultColumnOrder,
  getColumnById,
  type ColumnDefinition 
} from '@/lib/products/columnFieldMapping';

interface ColumnVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleColumns: string[];
  columnOrder?: string[];
  onSave: (columns: string[], order?: string[]) => void;
  onReset: () => void;
}

interface SortableColumnItemProps {
  id: string;
  column: ColumnDefinition;
  index: number;
  total: number;
  isSelected: boolean;
  onToggle: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function SortableColumnItem({ 
  id, 
  column, 
  index, 
  total, 
  isSelected, 
  onToggle,
  onMoveUp,
  onMoveDown 
}: SortableColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 py-2 px-3 rounded-md border bg-white",
        isDragging && "shadow-lg z-50",
        !isSelected && "opacity-50"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
        {index + 1}
      </div>
      <Checkbox
        id={`order-${column.id}`}
        checked={isSelected}
        onCheckedChange={onToggle}
        className="h-4 w-4"
      />
      <Label
        htmlFor={`order-${column.id}`}
        className="flex-1 cursor-pointer text-sm font-medium"
      >
        {column.label}
      </Label>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onMoveUp}
          disabled={index === 0}
        >
          <ArrowUp className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onMoveDown}
          disabled={index === total - 1}
        >
          <ArrowDown className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export function ColumnVisibilityModal({
  isOpen,
  onClose,
  visibleColumns,
  columnOrder,
  onSave,
  onReset,
}: ColumnVisibilityModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(visibleColumns);
  const [orderedColumns, setOrderedColumns] = useState<string[]>(columnOrder || visibleColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'visibility' | 'order'>('visibility');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update selected columns and order when props change
  useEffect(() => {
    setSelectedColumns(visibleColumns);
    if (columnOrder && columnOrder.length > 0) {
      setOrderedColumns(columnOrder);
    } else {
      setOrderedColumns(visibleColumns);
    }
  }, [visibleColumns, columnOrder]);

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
    const defaultOrder = getDefaultColumnOrder();
    setSelectedColumns(defaults);
    setOrderedColumns(defaultOrder);
    onReset();
  };

  // Get ordered visible columns (merge order with selected columns)
  const getOrderedVisibleColumns = () => {
    // Start with columns in the stored order that are also selected
    const ordered = orderedColumns.filter(col => selectedColumns.includes(col));
    // Add any selected columns that aren't in the order (newly selected)
    const unordered = selectedColumns.filter(col => !orderedColumns.includes(col));
    return [...ordered, ...unordered];
  };

  // Handle drag end for column reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedColumns.indexOf(active.id as string);
      const newIndex = orderedColumns.indexOf(over.id as string);

      setOrderedColumns((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  // Handle move up/down
  const moveColumn = (columnId: string, direction: 'up' | 'down') => {
    const currentIndex = orderedColumns.indexOf(columnId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= orderedColumns.length) return;

    setOrderedColumns((items) => arrayMove(items, currentIndex, newIndex));
  };

  // Handle save
  const handleSave = () => {
    // Ensure at least one column is selected
    if (selectedColumns.length === 0) {
      const defaults = getDefaultVisibleColumns();
      setSelectedColumns(defaults);
      onSave(defaults, orderedColumns);
    } else {
      // Save with the ordered visible columns
      const finalOrder = getOrderedVisibleColumns();
      onSave(selectedColumns, finalOrder);
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
  const orderedVisibleColumns = getOrderedVisibleColumns();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Customize Columns</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Choose which columns to display and their order in the products table
          </p>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('visibility')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'visibility'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            Visibility
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'order'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            Order
          </button>
        </div>

        {/* Column Presets */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <Label className="text-xs font-medium text-gray-700 mb-2 block">Presets:</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                // Operations preset: name, sku, stock, location, category
                const opsColumns = ['name', 'sku', 'stock', 'location', 'category_name'];
                setSelectedColumns(opsColumns);
              }}
            >
              Operations
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                // Replenishment preset: name, sku, stock, minimum_stock_level, location
                const replColumns = ['name', 'sku', 'stock', 'minimum_stock_level', 'location'];
                setSelectedColumns(replColumns);
              }}
            >
              Replenishment
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                // Accounting preset: name, sku, purchase_price, sale_price, unit_price
                const accColumns = ['name', 'sku', 'purchase_price', 'sale_price', 'unit_price'];
                setSelectedColumns(accColumns);
              }}
            >
              Accounting
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                // Audit preset: name, sku, category_name, location, warehouses, created_at
                const auditColumns = ['name', 'sku', 'category_name', 'location', 'warehouses'];
                setSelectedColumns(auditColumns);
              }}
            >
              Audit
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {activeTab === 'visibility' ? (
            <>
              {/* Search Bar */}
              <div className="mb-4 mt-4">
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
            </>
          ) : (
            <>
              {/* Order Tab */}
              <div className="mt-4 mb-4">
                <p className="text-sm text-gray-600">
                  Drag and drop columns to reorder them, or use the arrow buttons. Only visible columns are shown.
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg p-4">
                {orderedVisibleColumns.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No columns selected. Go to the Visibility tab to select columns.</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={orderedVisibleColumns}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {orderedVisibleColumns.map((columnId, index) => {
                          const column = getColumnById(columnId);
                          if (!column) return null;
                          
                          return (
                            <SortableColumnItem
                              key={columnId}
                              id={columnId}
                              column={column}
                              index={index}
                              total={orderedVisibleColumns.length}
                              isSelected={selectedColumns.includes(columnId)}
                              onToggle={() => toggleColumn(columnId)}
                              onMoveUp={() => moveColumn(columnId, 'up')}
                              onMoveDown={() => moveColumn(columnId, 'down')}
                            />
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </>
          )}
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



