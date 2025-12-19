/**
 * Quick Switcher Bar Component
 * Global quick-switchers for Warehouse, Category, and quick filters
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Package, 
  AlertCircle,
  Clock,
  TrendingUp,
  DollarSign,
  X,
  ChevronDown,
  Plus,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBranches } from '@/hooks/useBranches';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWarehouses } from '@/hooks/useWarehouses';
import type { CategoryTree } from '@/types/categoryTypes';
import { flattenCategoryTree } from '@/lib/categories/categoryUtils';
import { Warehouse } from 'lucide-react';

interface QuickSwitcherBarProps {
  tree: CategoryTree[];
  selectedCategoryIds: string[];
  onCategorySelectionChange: (categoryIds: string[]) => void;
  selectedWarehouse?: string | null;
  onWarehouseChange?: (warehouse: string | null) => void;
  onQuickFilterChange?: (filter: string | null) => void;
  activeQuickFilter?: string | null;
  className?: string;
}

export const QuickSwitcherBar: React.FC<QuickSwitcherBarProps> = ({
  tree,
  selectedCategoryIds,
  onCategorySelectionChange,
  selectedWarehouse,
  onWarehouseChange,
  onQuickFilterChange,
  activeQuickFilter,
  className,
}) => {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const { data: warehouses = [] } = useWarehouses();
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isWarehousePopoverOpen, setIsWarehousePopoverOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState('');

  // Flatten categories for quick selection
  const allCategories = React.useMemo(() => {
    return flattenCategoryTree(tree);
  }, [tree]);

  useEffect(() => {
    if (!isCategoryPopoverOpen) {
      setCategorySearchQuery('');
    }
  }, [isCategoryPopoverOpen]);

  useEffect(() => {
    if (!isWarehousePopoverOpen) {
      setWarehouseSearchQuery('');
    }
  }, [isWarehousePopoverOpen]);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      onCategorySelectionChange(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      onCategorySelectionChange([...selectedCategoryIds, categoryId]);
    }
  };

  const handleWarehouseSelect = (warehouse: string | null) => {
    if (onWarehouseChange) {
      onWarehouseChange(warehouse);
    }
    setIsWarehousePopoverOpen(false);
  };

  const handleCreateCategory = () => {
    // TODO: Implement create category functionality
    console.log('Create new category clicked');
    // You can add a modal or form here to create a new category
  };

  // Filter categories based on search query
  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  // Filter warehouses based on search query
  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(warehouseSearchQuery.toLowerCase())
  );

  const selectedCategoryNames = allCategories
    .filter(cat => selectedCategoryIds.includes(cat.id))
    .map(cat => cat.name);

  const hasActiveCategoryFilter = selectedCategoryIds.length > 0;
  const hasActiveWarehouseFilter = selectedWarehouse !== null && selectedWarehouse !== undefined;

  return (
    <div className={cn("flex flex-col sm:flex-row items-stretch sm:items-center gap-2  bg-white ", className)}>
      {/* Filter Buttons Row - Stack on mobile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 min-w-0">
        {/* Category Quick Selector */}
        <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 sm:h-9 text-xs sm:text-xs justify-between sm:justify-start touch-manipulation"
            >
              <div className="flex items-center gap-1.5 sm:gap-1.5">
                <Package className="w-4 h-4 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">
                  {selectedCategoryIds.length === 0 ? (
                    'All Categories'
                  ) : selectedCategoryIds.length === 1 ? (
                    selectedCategoryNames[0] || '1 Category'
                  ) : (
                    `${selectedCategoryIds.length} Categories`
                  )}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 sm:w-3 sm:h-3 ml-auto sm:ml-1.5 flex-shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-64 max-w-sm p-2" align="start">
          <div className="space-y-1">
      
            
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-3 sm:h-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="h-9 sm:h-7 pl-9 sm:pl-7 text-sm sm:text-xs min-h-[44px] sm:min-h-0"
              />
            </div>
            
            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {filteredCategories.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500">
                  No categories found
                </div>
              ) : (
                filteredCategories.map((category) => {
                  const isSelected = selectedCategoryIds.includes(category.id);
                  return (
                    <label
                      key={category.id}
                      className={cn(
                        "flex items-center gap-2 px-3 sm:px-2 py-3 sm:py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation",
                        isSelected && "bg-blue-50"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="data-[state=checked]:bg-blue-600 w-5 h-5 sm:w-4 sm:h-4"
                      />
                      <span className={cn(
                        "flex-1 text-sm sm:text-xs truncate",
                        isSelected ? "font-medium text-blue-900" : "text-gray-700"
                      )}>
                        {category.name}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
            {selectedCategoryIds.length > 0 && (
              <div className="pt-1 border-t mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onCategorySelectionChange([]);
                    setIsCategoryPopoverOpen(false);
                  }}
                  className="w-full h-5 sm:h-7 text-sm sm:text-xs text-red-600 hover:text-red-700 hover:bg-red-50 touch-manipulation"
                >
                  <X className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

        {/* Warehouse Quick Selector */}
        {warehouses.length > 0 && (
          <Popover open={isWarehousePopoverOpen} onOpenChange={setIsWarehousePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 sm:h-9 text-xs sm:text-xs justify-between sm:justify-start touch-manipulation"
              >
                <div className="flex items-center gap-1.5 sm:gap-1.5">
                  <Warehouse className="w-4 h-4 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="truncate">{selectedWarehouse || 'All Warehouses'}</span>
                </div>
                <ChevronDown className="w-4 h-4 sm:w-3 sm:h-3 ml-auto sm:ml-1.5 flex-shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] sm:w-48 max-w-sm p-2" align="start">
            <div className="space-y-1">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-3 sm:h-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search warehouses..."
                  value={warehouseSearchQuery}
                  onChange={(e) => setWarehouseSearchQuery(e.target.value)}
                  className="h-9 sm:h-7 pl-9 sm:pl-7 text-sm sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>
              
              <div className="max-h-[200px] overflow-y-auto space-y-1">
                <button
                  onClick={() => handleWarehouseSelect(null)}
                  className={cn(
                    "w-full text-left px-3 sm:px-2 py-3 sm:py-1.5 rounded-md text-sm sm:text-xs hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation",
                    !selectedWarehouse && "bg-blue-50 font-medium text-blue-900"
                  )}
                >
                  All Warehouses
                </button>
                {filteredWarehouses.length > 0 ? (
                  filteredWarehouses.map((warehouse) => (
                    <button
                      key={warehouse.id}
                      onClick={() => handleWarehouseSelect(warehouse.name)}
                      className={cn(
                        "w-full text-left px-3 sm:px-2 py-3 sm:py-1.5 rounded-md text-sm sm:text-xs hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation",
                        selectedWarehouse === warehouse.name && "bg-blue-50 font-medium text-blue-900"
                      )}
                    >
                      {warehouse.name}
                    </button>
                  ))
                ) : (
                  <div className="px-3 sm:px-2 py-3 sm:py-1.5 text-sm sm:text-xs text-gray-500 text-center">
                    No warehouses found
                  </div>
                )}
              </div>
              {selectedWarehouse && (
                <div className="pt-1 border-t mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleWarehouseSelect(null);
                    }}
                    className="w-full h-10 sm:h-7 text-sm sm:text-xs text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px] sm:min-h-0 touch-manipulation"
                  >
                    <X className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

      </div>
    </div>
  );
};

