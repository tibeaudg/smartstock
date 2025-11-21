/**
 * Category Grid View Component
 * E-commerce style tile/grid layout for categories
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CategoryTree } from '@/types/categoryTypes';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface CategoryGridViewProps {
  tree: CategoryTree[];
  onCategoryClick?: (category: CategoryTree) => void;
  onEdit?: (category: CategoryTree) => void;
  onDelete?: (category: CategoryTree) => void;
  onAddChild?: (parentCategory: CategoryTree) => void;
}

interface CategoryCardProps {
  category: CategoryTree;
  onCategoryClick?: (category: CategoryTree) => void;
  onEdit?: (category: CategoryTree) => void;
  onDelete?: (category: CategoryTree) => void;
  onAddChild?: (parentCategory: CategoryTree) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onCategoryClick,
  onEdit,
  onDelete,
  onAddChild,
}) => {
  // Get icon component
  const IconComponent = category.icon 
    ? (LucideIcons[category.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
    : Package;

  const categoryColor = category.color || '#6B7280';
  const textColor = category.color ? '#FFFFFF' : '#000000';
  const hasChildren = category.children && category.children.length > 0;

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02] cursor-pointer',
        'border-2 hover:border-blue-300',
        !category.is_active && 'opacity-60'
      )}
      onClick={() => onCategoryClick?.(category)}
    >
      <CardContent className="p-6">
        {/* Header with actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {category.path && category.path !== category.name && (
              <div className="text-xs text-gray-500 mb-1 truncate">
                {category.path.split(' > ').slice(0, -1).join(' > ')}
              </div>
            )}
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
              {category.name}
            </h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onAddChild?.(category);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Child
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit?.(category);
              }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(category);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Icon and color */}
        <div className="flex items-center justify-center mb-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
            style={{
              backgroundColor: categoryColor,
              color: textColor,
            }}
          >
            <IconComponent className="w-10 h-10" />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          {category.product_count !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Products</span>
              <Badge variant="secondary">
                {category.product_count}
              </Badge>
            </div>
          )}
          
          {hasChildren && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subcategories</span>
              <Badge variant="outline">
                {category.children.length}
              </Badge>
            </div>
          )}

          {!category.is_active && (
            <Badge variant="outline" className="w-full justify-center">
              Inactive
            </Badge>
          )}
        </div>

        {/* Footer with arrow */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">View products</span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
      </CardContent>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all pointer-events-none" />
    </Card>
  );
};

export const CategoryGridView: React.FC<CategoryGridViewProps> = ({
  tree,
  onCategoryClick,
  onEdit,
  onDelete,
  onAddChild,
}) => {
  // Flatten tree for grid display (show all categories, not just roots)
  const flattenTree = (nodes: CategoryTree[]): CategoryTree[] => {
    const result: CategoryTree[] = [];
    const traverse = (nodes: CategoryTree[]) => {
      nodes.forEach(node => {
        result.push(node);
        if (node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return result;
  };

  const allCategories = flattenTree(tree);

  if (allCategories.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No categories yet. Create your first category to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {allCategories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onCategoryClick={onCategoryClick}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      ))}
    </div>
  );
};

