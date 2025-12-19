import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tag, Plus, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { flattenCategoryTree, getCategoryPath } from '@/lib/categories/categoryUtils';
import type { CategoryTree } from '@/types/categoryTypes';

interface CategoryColumnProps {
  product: any;
  categoryId: string | null;
  categoryName: string | null;
  isVariant?: boolean;
  parentProduct?: any;
  compactMode?: boolean;
  onAssignCategory?: (productId: string, categoryId: string | null, categoryName: string | null) => void;
  tree?: CategoryTree[];
  categories?: Array<{ id: string; name: string }>;
}

export const CategoryColumn: React.FC<CategoryColumnProps> = ({
  product,
  categoryId,
  categoryName,
  isVariant = false,
  parentProduct,
  compactMode = false,
  onAssignCategory,
  tree = [],
  categories = [],
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categoryId || '__none__');

  // Flatten categories for selection
  const flatCategories = React.useMemo(() => {
    if (tree.length > 0) {
      return flattenCategoryTree(tree);
    }
    return categories;
  }, [tree, categories]);

  // Get category options with paths
  const categoryOptions = React.useMemo(() => {
    if (tree.length > 0) {
      return flatCategories.map(cat => {
        const path = getCategoryPath(cat.id, flatCategories);
        return { id: cat.id, name: path || cat.name };
      });
    }
    return flatCategories.map(cat => ({ id: cat.id, name: cat.name }));
  }, [flatCategories, tree]);

  // For variants, check if matches parent
  if (isVariant) {
    const variantCategory = categoryName;
    const parentCategory = parentProduct ? parentProduct.category_name : null;
    const categoryMatchesParent = variantCategory === parentCategory;
    
    if (categoryMatchesParent) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center">
                <Link2 className={cn(
                  "text-[#D1D5DB]",
                  compactMode ? "w-3 h-3" : "w-4 h-4"
                )} style={{ opacity: 0.3 }} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inherited from parent</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  }

  const hasCategory = !!categoryName;
  const displayText = categoryName || null;

  const handleAssign = () => {
    if (onAssignCategory) {
      const selectedCategory = categoryOptions.find(cat => cat.id === selectedCategoryId);
      const finalCategoryId = selectedCategoryId === '__none__' ? null : selectedCategoryId;
      const finalCategoryName = selectedCategoryId === '__none__' ? null : (selectedCategory?.name || null);
      
      setIsAssigning(true);
      onAssignCategory(product.id, finalCategoryId, finalCategoryName);
      setTimeout(() => setIsAssigning(false), 500);
    }
  };

  if (!hasCategory) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAssigning(true);
                }}
                className={cn(
                  "h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 opacity-60 group-hover:opacity-100 transition-opacity",
                  compactMode && "h-5 px-1.5 text-[10px]"
                )}
              >
                <Tag className="w-3 h-3 mr-1" />
                Assign category
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to assign category</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {isAssigning && (
          <div className="mt-2 space-y-2">
            {categoryOptions.length > 0 && (
              <div className="flex gap-1">
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="h-7 text-xs flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">No Category</SelectItem>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleAssign}
                  className="h-7 px-2"
                  disabled={!selectedCategoryId}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsAssigning(true);
              setSelectedCategoryId(categoryId || '__none__');
            }}
            className={cn(
              "text-gray-900 hover:text-blue-700 hover:bg-blue-50 h-auto px-2 py-1",
              compactMode ? "text-xs h-5 px-1" : "text-sm h-6 px-2"
            )}
          >
            {displayText}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to change category</p>
        </TooltipContent>
      </Tooltip>
      {isAssigning && (
        <div className="mt-2 space-y-2">
          {categoryOptions.length > 0 && (
            <div className="flex gap-1">
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No Category</SelectItem>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleAssign}
                className="h-7 px-2"
                disabled={!selectedCategoryId}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </TooltipProvider>
  );
};

