/**
 * Category Grouped Product List Component
 * Groups products by category in list view with expandable sections
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Package } from 'lucide-react';
import { useCategoryTree } from '@/hooks/useCategories';
import { getCategoryIdsIncludingDescendants } from '@/lib/categories/categoryUtils';
import type { CategoryTree } from '@/types/categoryTypes';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category_id: string | null;
  category_name: string | null;
  [key: string]: any;
}

interface CategoryGroupedProductListProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  renderProduct: (product: Product) => React.ReactNode;
  showCategoryHeaders?: boolean;
}

export const CategoryGroupedProductList: React.FC<CategoryGroupedProductListProps> = ({
  products,
  onProductClick,
  renderProduct,
  showCategoryHeaders = true,
}) => {
  const { tree, categories } = useCategoryTree();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Group products by category
  const groupedProducts = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    const uncategorized: Product[] = [];

    products.forEach((product) => {
      if (product.category_id) {
        if (!grouped[product.category_id]) {
          grouped[product.category_id] = [];
        }
        grouped[product.category_id].push(product);
      } else {
        uncategorized.push(product);
      }
    });

    return { grouped, uncategorized };
  }, [products]);

  // Get category info
  const getCategoryInfo = (categoryId: string): CategoryTree | null => {
    const findInTree = (nodes: CategoryTree[]): CategoryTree | null => {
      for (const node of nodes) {
        if (node.id === categoryId) return node;
        const found = findInTree(node.children);
        if (found) return found;
      }
      return null;
    };
    return findInTree(tree);
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Render category group
  const renderCategoryGroup = (categoryId: string, categoryProducts: Product[]) => {
    const categoryInfo = getCategoryInfo(categoryId);
    if (!categoryInfo) return null;

    const isExpanded = expandedCategories.has(categoryId);
    const IconComponent = categoryInfo.icon
      ? (LucideIcons[categoryInfo.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
      : Package;

    const categoryColor = categoryInfo.color || '#6B7280';
    const textColor = categoryInfo.color ? '#FFFFFF' : '#000000';

    return (
      <Card key={categoryId} className="mb-4">
        {showCategoryHeaders && (
          <CardHeader
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleCategory(categoryId)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(categoryId);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: categoryColor,
                    color: textColor,
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{categoryInfo.name}</CardTitle>
                  {categoryInfo.path && categoryInfo.path !== categoryInfo.name && (
                    <p className="text-xs text-gray-500 mt-1">{categoryInfo.path}</p>
                  )}
                </div>
                <Badge variant="secondary">{categoryProducts.length}</Badge>
              </div>
            </div>
          </CardHeader>
        )}
        {isExpanded && (
          <CardContent>
            <div className="space-y-2">
              {categoryProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onProductClick?.(product)}
                  className={cn(
                    'cursor-pointer',
                    onProductClick && 'hover:bg-gray-50 rounded-lg p-2 transition-colors'
                  )}
                >
                  {renderProduct(product)}
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  // Flatten tree to get all categories in order
  const flattenTree = (nodes: CategoryTree[]): CategoryTree[] => {
    const result: CategoryTree[] = [];
    const traverse = (nodes: CategoryTree[]) => {
      nodes.forEach((node) => {
        if (groupedProducts.grouped[node.id]) {
          result.push(node);
        }
        if (node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return result;
  };

  const orderedCategories = flattenTree(tree);

  return (
    <div className="space-y-4">
      {/* Render categories in tree order */}
      {orderedCategories.map((category) => {
        const categoryProducts = groupedProducts.grouped[category.id] || [];
        if (categoryProducts.length === 0) return null;
        return renderCategoryGroup(category.id, categoryProducts);
      })}

      {/* Uncategorized products */}
      {groupedProducts.uncategorized.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Uncategorized
              <Badge variant="secondary">{groupedProducts.uncategorized.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {groupedProducts.uncategorized.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onProductClick?.(product)}
                  className={cn(
                    'cursor-pointer',
                    onProductClick && 'hover:bg-gray-50 rounded-lg p-2 transition-colors'
                  )}
                >
                  {renderProduct(product)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {products.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No products found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

