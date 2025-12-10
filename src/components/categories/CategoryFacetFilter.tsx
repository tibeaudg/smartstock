/**
 * Category Facet Filter Component
 * A collapsible sidebar with multi-select checkboxes for filtering products by category
 */

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  CheckSquare,
  Square,
  Plus,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { flattenCategoryTree } from '@/lib/categories/categoryUtils';
import type { CategoryTree } from '@/types/categoryTypes';

interface CategoryFacetFilterProps {
  tree: CategoryTree[];
  selectedCategoryIds: string[];
  onSelectionChange: (categoryIds: string[]) => void;
  productCounts?: Map<string, number>;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onAddCategory?: () => void;
  className?: string;
}

export const CategoryFacetFilter: React.FC<CategoryFacetFilterProps> = ({
  tree,
  selectedCategoryIds,
  onSelectionChange,
  productCounts,
  isCollapsed = false,
  onToggleCollapse,
  onAddCategory,
  className,
}) => {
  // Flatten the tree to get all categories
  const allCategories = useMemo(() => {
    return flattenCategoryTree(tree);
  }, [tree]);

  // Sort categories alphabetically
  const sortedCategories = useMemo(() => {
    return [...allCategories].sort((a, b) => a.name.localeCompare(b.name));
  }, [allCategories]);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      onSelectionChange(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      onSelectionChange([...selectedCategoryIds, categoryId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCategoryIds.length === sortedCategories.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(sortedCategories.map(cat => cat.id));
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const allSelected = sortedCategories.length > 0 && selectedCategoryIds.length === sortedCategories.length;
  const someSelected = selectedCategoryIds.length > 0 && selectedCategoryIds.length < sortedCategories.length;

  // Get top-level categories for Quick Filters
  const topLevelCategories = useMemo(() => {
    return sortedCategories.filter(cat => !cat.parent_category_id).slice(0, 8);
  }, [sortedCategories]);

  // State for Quick Filters collapse
  const [isQuickFiltersExpanded, setIsQuickFiltersExpanded] = useState(true);

  // Collapsed state shows just a toggle button
  if (isCollapsed) {
    return (
      <div className={cn("flex flex-col border-r bg-white", className)}>
        <div className="flex flex-col">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full justify-center p-2 hover:bg-gray-100 rounded-none"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          {onAddCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddCategory}
              className="w-full justify-center p-2 hover:bg-gray-100 rounded-none"
              title="Add Category"
            >
              <Plus className="w-3.5 h-3.5 text-gray-600" />
            </Button>
          )}
        </div>
        {selectedCategoryIds.length > 0 && (
          <div className="px-2 pb-2">
            <Badge variant="secondary" className="w-full justify-center">
              {selectedCategoryIds.length}
            </Badge>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-[280px] border-r bg-white flex flex-col flex-shrink-0 transition-all", className)}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-sm text-gray-900">Categories</h3>
          {onAddCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddCategory}
              className="h-6 w-6 p-0 hover:bg-gray-200 ml-auto"
              title="Add Category"
            >
              <Plus className="w-3.5 h-3.5 text-gray-600" />
            </Button>
          )}
        </div>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-6 w-6 p-0 hover:bg-gray-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 px-4 py-2 border-b bg-white flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSelectAll}
          className="flex-1 h-8 text-xs"
        >
          {allSelected ? (
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
        {selectedCategoryIds.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Quick Filters Section */}
      {topLevelCategories.length > 0 && (
        <div className="flex-shrink-0 border-b bg-white">
          <button
            onClick={() => setIsQuickFiltersExpanded(!isQuickFiltersExpanded)}
            className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-xs font-medium text-gray-700">Quick Filters</span>
            {isQuickFiltersExpanded ? (
              <ChevronUp className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            )}
          </button>
          {isQuickFiltersExpanded && (
            <div className="px-4 py-2 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {topLevelCategories.map((category) => {
                  const isSelected = selectedCategoryIds.includes(category.id);
                  const count = productCounts?.get(category.id) ?? 0;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-colors",
                        isSelected
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{category.name}</span>
                      {count > 0 && (
                        <Badge variant="secondary" className={cn(
                          "h-3.5 px-1 text-[9px] ml-0.5",
                          isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                        )}>
                          {count}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {!isQuickFiltersExpanded && selectedCategoryIds.length > 0 && (
            <div className="px-4 py-1.5 border-t bg-gray-50">
              <div className="text-xs text-gray-600">
                {selectedCategoryIds.length} filter{selectedCategoryIds.length !== 1 ? 's' : ''} active
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {sortedCategories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">No categories yet</p>
          </div>
        ) : (
          <div className="p-2">
            <div className="space-y-1">
              {sortedCategories.map((category) => {
                const isSelected = selectedCategoryIds.includes(category.id);
                const count = productCounts?.get(category.id) ?? 0;

                return (
                  <label
                    key={category.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
                      isSelected && "bg-blue-50 hover:bg-blue-100"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <span className={cn(
                      "flex-1 text-sm truncate",
                      isSelected ? "font-medium text-blue-900" : "text-gray-700"
                    )}>
                      {category.name}
                    </span>
                    {count > 0 && (
                      <Badge variant="secondary" className="ml-auto flex-shrink-0 text-xs">
                        {count}
                      </Badge>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer with selection count */}
      {selectedCategoryIds.length > 0 && (
        <>
          <Separator />
          <div className="flex-shrink-0 px-4 py-2 bg-blue-50 border-t">
            <div className="text-xs text-blue-900 font-medium">
              {selectedCategoryIds.length} {selectedCategoryIds.length === 1 ? 'category' : 'categories'} selected
            </div>
          </div>
        </>
      )}
    </div>
  );
};

