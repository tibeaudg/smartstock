/**
 * Category Header Component
 * Displays breadcrumbs, unified actions, view toggles, and Add Product button
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Grid3x3,
  List,
  Plus,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import type { CategoryTree } from '@/types/categoryTypes';
import { cn } from '@/lib/utils';

interface CategoryHeaderProps {
  selectedCategoryId: string | null | 'all';
  selectedCategory: CategoryTree | null;
  categories: Array<{ id: string; name: string; parent_category_id: string | null }>;
  productViewMode: 'grid' | 'list' | 'table';
  onViewModeChange: (mode: 'grid' | 'list' | 'table') => void;
  onAddCategory: () => void;
  onAddSubcategory: () => void;
  onAddProduct: () => void;
  onBreadcrumbClick?: (categoryId: string | null) => void;
  isMobile?: boolean;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  selectedCategoryId,
  selectedCategory,
  categories,
  productViewMode,
  onViewModeChange,
  onAddCategory,
  onAddSubcategory,
  onAddProduct,
  onBreadcrumbClick,
  isMobile = false,
}) => {
  // Build breadcrumb items
  const breadcrumbItems = React.useMemo(() => {
    const items: Array<{ id: string | null; name: string }> = [
      { id: null, name: 'All Categories' },
    ];

    if (selectedCategoryId === 'all' || !selectedCategoryId) {
      return items;
    }

    // Get ancestors
    const ancestors: Array<{ id: string; name: string }> = [];
    let currentId: string | null = selectedCategoryId;
    
    while (currentId) {
      const category = categories.find(c => c.id === currentId);
      if (!category) break;
      
      ancestors.unshift({ id: category.id, name: category.name });
      currentId = category.parent_category_id;
    }

    items.push(...ancestors);

    // Add current category if it's not already in ancestors
    if (selectedCategory && !ancestors.some(a => a.id === selectedCategory.id)) {
      items.push({ id: selectedCategory.id, name: selectedCategory.name });
    }

    return items;
  }, [selectedCategoryId, selectedCategory, categories]);

  const categoryTitle = selectedCategoryId === 'all'
    ? 'All Products'
    : selectedCategory?.name || categories.find(c => c.id === selectedCategoryId)?.name || 'Category';

  const canAddSubcategory = selectedCategoryId && selectedCategoryId !== 'all' && selectedCategory;

  return (
    <div className="flex-shrink-0 px-3 md:px-4 lg:px-6 py-3 bg-white border-b sticky top-0 z-20 md:static md:z-auto">
      {/* Breadcrumbs */}
      {selectedCategoryId && selectedCategoryId !== 'all' && (
        <div className="mb-2">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                  <React.Fragment key={item.id || 'all'}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="text-sm text-gray-900 font-medium">
                          {item.name}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => {
                            if (onBreadcrumbClick) {
                              if (item.id === null) {
                                onBreadcrumbClick(null);
                              } else {
                                onBreadcrumbClick(item.id);
                              }
                            }
                          }}
                          className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                        >
                          {item.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {isMobile && selectedCategoryId && (
          <button
            onClick={() => {
              if (onBreadcrumbClick) {
                onBreadcrumbClick(null);
              }
            }}
            className="flex-shrink-0 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Show categories"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
        )}
        
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
            {categoryTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
 

          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={productViewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-8 w-8 p-0"
              title="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={productViewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className="h-8 w-8 p-0"
              title="Table view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Add Product Button */}
          <Button
            onClick={onAddProduct}
            variant="default"
            size="default"
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 sm:px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

