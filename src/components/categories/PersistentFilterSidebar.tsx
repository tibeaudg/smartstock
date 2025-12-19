/**
 * Persistent Filter Sidebar Component
 * A fixed-width sidebar with comprehensive filters for products
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Filter, 
  X,
  CheckSquare,
  Square,
  Plus,
  Check,
  MapPin,
  Package,
  Calendar,
  Tag as TagIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { flattenCategoryTree } from '@/lib/categories/categoryUtils';
import type { CategoryTree } from '@/types/categoryTypes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FilterState {
  categories: string[];
  stockStatus: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  tags: string[];
}

interface PersistentFilterSidebarProps {
  tree: CategoryTree[];
  selectedCategoryIds: string[];
  onCategorySelectionChange: (categoryIds: string[]) => void;
  productCounts?: Map<string, number>;
  onAddCategory?: () => void;
  onFiltersChange?: (filters: FilterState) => void;
  className?: string;
}

export const PersistentFilterSidebar: React.FC<PersistentFilterSidebarProps> = ({
  tree,
  selectedCategoryIds,
  onCategorySelectionChange,
  productCounts,
  onAddCategory,
  onFiltersChange,
  className,
}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  
  // Filter states
  const [selectedStockStatus, setSelectedStockStatus] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Collapsible sections
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [stockStatusExpanded, setStockStatusExpanded] = useState(true);
  const [dateExpanded, setDateExpanded] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(false);

  // Flatten the tree to get all categories
  const allCategories = useMemo(() => {
    return flattenCategoryTree(tree);
  }, [tree]);

  // Sort categories alphabetically
  const sortedCategories = useMemo(() => {
    return [...allCategories].sort((a, b) => a.name.localeCompare(b.name));
  }, [allCategories]);

  // Notify parent of filter changes
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        categories: selectedCategoryIds,
        stockStatus: selectedStockStatus,
        dateRange,
        tags: selectedTags,
      });
    }
  }, [selectedCategoryIds, selectedStockStatus, dateRange, selectedTags, onFiltersChange]);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      onCategorySelectionChange(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      onCategorySelectionChange([...selectedCategoryIds, categoryId]);
    }
  };

  const handleSelectAllCategories = () => {
    if (selectedCategoryIds.length === sortedCategories.length) {
      onCategorySelectionChange([]);
    } else {
      onCategorySelectionChange(sortedCategories.map(cat => cat.id));
    }
  };


  const handleStockStatusToggle = (status: string) => {
    if (selectedStockStatus.includes(status)) {
      setSelectedStockStatus(selectedStockStatus.filter(s => s !== status));
    } else {
      setSelectedStockStatus([...selectedStockStatus, status]);
    }
  };

  const activeFiltersCount = selectedCategoryIds.length + selectedStockStatus.length + 
    (dateRange !== 'all' ? 1 : 0) + selectedTags.length;

  const handleClearAll = () => {
    onCategorySelectionChange([]);
    setSelectedStockStatus([]);
    setDateRange('all');
    setSelectedTags([]);
  };

  const stockStatusOptions = [
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  return (
    <div className={cn("w-[280px] border-r bg-white flex flex-col flex-shrink-0 h-full", className)}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-sm text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {onAddCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddCategory}
            className="h-6 w-6 p-0 hover:bg-gray-200"
            title="Add Category"
          >
            <Plus className="w-3.5 h-3.5 text-gray-600" />
          </Button>
        )}
      </div>

      {/* Clear All Button */}
      {activeFiltersCount > 0 && (
        <div className="flex-shrink-0 px-4 py-2 border-b bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="w-full h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Scrollable Filter Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Categories Section */}
        <Collapsible open={categoriesExpanded} onOpenChange={setCategoriesExpanded}>
          <CollapsibleTrigger className="w-full px-4 py-3 border-b bg-white hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Categories</span>
              {selectedCategoryIds.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCategoryIds.length}
                </Badge>
              )}
            </div>
            {categoriesExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAllCategories}
                className="flex-1 h-7 text-xs"
              >
                {selectedCategoryIds.length === sortedCategories.length ? (
                  <>
                    <CheckSquare className="w-3 h-3 mr-1" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Square className="w-3 h-3 mr-1" />
                    Select All
                  </>
                )}
              </Button>
            </div>
            <div className="p-2 max-h-[300px] overflow-y-auto">
              {sortedCategories.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-500">No categories yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {sortedCategories.map((category) => {
                    const isSelected = selectedCategoryIds.includes(category.id);
                    const count = productCounts?.get(category.id) ?? 0;

                    return (
                      <label
                        key={category.id}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
                          isSelected && "bg-blue-50 hover:bg-blue-100"
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <span className={cn(
                          "flex-1 text-xs truncate",
                          isSelected ? "font-medium text-blue-900" : "text-gray-700"
                        )}>
                          {category.name}
                        </span>
                        {count > 0 && (
                          <Badge variant="secondary" className="ml-auto flex-shrink-0 text-[10px]">
                            {count}
                          </Badge>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Stock Status Section */}
        <Collapsible open={stockStatusExpanded} onOpenChange={setStockStatusExpanded}>
          <CollapsibleTrigger className="w-full px-4 py-3 border-b bg-white hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Stock Status</span>
              {selectedStockStatus.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedStockStatus.length}
                </Badge>
              )}
            </div>
            {stockStatusExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-2">
              <div className="space-y-1">
                {stockStatusOptions.map((option) => {
                  const isSelected = selectedStockStatus.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
                        isSelected && "bg-blue-50 hover:bg-blue-100"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleStockStatusToggle(option.value)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <span className={cn(
                        "flex-1 text-xs",
                        isSelected ? "font-medium text-blue-900" : "text-gray-700"
                      )}>
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Date Added Section */}
        <Collapsible open={dateExpanded} onOpenChange={setDateExpanded}>
          <CollapsibleTrigger className="w-full px-4 py-3 border-b bg-white hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Date Added</span>
              {dateRange !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  1
                </Badge>
              )}
            </div>
            {dateExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-2">
              <div className="space-y-1">
                {(['all', 'today', 'week', 'month', 'year'] as const).map((range) => (
                  <label
                    key={range}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
                      dateRange === range && "bg-blue-50 hover:bg-blue-100"
                    )}
                  >
                    <input
                      type="radio"
                      name="dateRange"
                      value={range}
                      checked={dateRange === range}
                      onChange={() => setDateRange(range)}
                      className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className={cn(
                      "flex-1 text-xs capitalize",
                      dateRange === range ? "font-medium text-blue-900" : "text-gray-700"
                    )}>
                      {range === 'all' ? 'All Time' : range === 'today' ? 'Today' : `Last ${range}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Footer with active filters summary */}
      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <div className="flex-shrink-0 px-4 py-2 bg-blue-50 border-t">
            <div className="text-xs text-blue-900 font-medium">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
            </div>
          </div>
        </>
      )}
    </div>
  );
};





