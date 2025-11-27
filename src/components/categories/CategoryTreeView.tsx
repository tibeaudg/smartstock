/**
 * Category Tree View Component
 * Displays categories in a hierarchical tree structure with drag-and-drop support
 */

import React, { useMemo } from 'react';
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor, useDraggable, useDroppable, rectIntersection } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  GripVertical,
  MoreVertical,
  Tag,
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

interface CategoryTreeViewProps {
  tree: CategoryTree[];
  selectedCategoryId?: string | null;
  expanded?: Set<string>;
  onCategoryClick?: (category: CategoryTree) => void;
  onToggleExpand?: (categoryId: string) => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onEdit?: (category: CategoryTree) => void;
  onDelete?: (category: CategoryTree) => void;
  onAddChild?: (parentCategory: CategoryTree) => void;
  activeId?: string | null;
  isMoving?: boolean;
  onDragStart?: (event: any) => void;
  onDragOver?: (event: any) => void;
  onDragEnd?: (event: any) => void;
  onDragCancel?: () => void;
}

interface CategoryTreeNodeProps {
  category: CategoryTree;
  level: number;
  expanded: Set<string>;
  selectedCategoryId?: string | null;
  activeId?: string | null;
  onToggleExpand: (id: string) => void;
  onCategoryClick?: (category: CategoryTree) => void;
  onEdit?: (category: CategoryTree) => void;
  onDelete?: (category: CategoryTree) => void;
  onAddChild?: (parentCategory: CategoryTree) => void;
  isLastChild?: boolean; // Whether this is the last child in its parent's children array
  parentHasMoreSiblings?: boolean; // Whether parent has more siblings after it
}

const CategoryTreeNode: React.FC<CategoryTreeNodeProps> = ({
  category,
  level,
  expanded,
  selectedCategoryId,
  activeId,
  onToggleExpand,
  onCategoryClick,
  onEdit,
  onDelete,
  onAddChild,
  isLastChild = false,
  parentHasMoreSiblings = false,
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expanded.has(category.id);
  const isSelected = selectedCategoryId === category.id;

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: category.id,
    disabled: false,
  });

  const {
    setNodeRef: setDropRef,
    isOver,
  } = useDroppable({
    id: category.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const nodeRef = (node: HTMLDivElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  // Calculate indentation - cleaner tree structure
  const indentPerLevel = 20; // Spacing per level
  const totalIndent = level * indentPerLevel;
  const connectorWidth = 20; // Width for tree connectors

  return (
    <div className="select-none" ref={nodeRef} style={style}>
      <div
        className={cn(
          'group flex items-center gap-2 px-3 py-2.5 transition-colors relative',
          'hover:bg-gray-50 cursor-pointer rounded-sm',
          isOver && 'bg-blue-50 border-2 border-blue-300 border-dashed',
          isSelected && 'bg-blue-50 border-l-4 border-l-blue-600'
        )}
        style={{ 
          paddingLeft: `${totalIndent + (level > 0 ? connectorWidth : 0)}px`,
          minHeight: '44px'
        }}
        onClick={() => onCategoryClick?.(category)}
      >
        {/* Tree connector lines for nested items */}
        {level > 0 && (
          <div 
            className="absolute left-0 top-0 flex items-center pointer-events-none" 
            style={{ 
              width: `${connectorWidth}px`,
              height: '100%'
            }}
          >
            {/* Vertical line extending down - only if not last child or has expanded children */}
            {(!isLastChild || (hasChildren && isExpanded)) && (
              <div 
                className="absolute left-0 top-1/2 w-0.5 bg-gray-300/50"
                style={{ 
                  height: isLastChild && hasChildren && isExpanded ? '50%' : '100%',
                  transform: 'translateY(-50%)'
                }}
              />
            )}
            {/* Horizontal line connecting to item */}
            <div 
              className="absolute top-1/2 h-0.5 bg-gray-300/50"
              style={{ 
                left: '0px',
                width: `${connectorWidth - 8}px`
              }}
            />
            {/* Vertical line from parent level - only if parent has more siblings */}
            {parentHasMoreSiblings && (
              <div 
                className="absolute left-0 top-0 w-0.5 bg-gray-300/50"
                style={{ height: '50%' }}
              />
            )}
          </div>
        )}

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Expand/collapse button - always visible for items with children */}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 flex-shrink-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(category.id);
            }}
          >
            {isExpanded ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
        ) : (
          // Spacer for items without children to maintain alignment
          <div className="w-7 flex-shrink-0" />
        )}

        {/* Category name and info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm truncate",
              isSelected 
                ? "text-blue-700 font-semibold" 
                : level > 0 
                  ? "text-gray-700 font-medium" 
                  : "text-gray-900 font-medium"
            )}>
              {category.name}
            </span>
            {category.product_count !== undefined && category.product_count > 0 && (
              <Badge variant="secondary" className="text-xs h-5 px-1.5 font-normal bg-gray-100 text-gray-600">
                {category.product_count}
              </Badge>
            )}
            {!category.is_active && (
              <Badge variant="secondary" className="text-xs h-5 px-1.5 bg-gray-100 text-gray-500">
                Inactive
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onAddChild?.(category);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subcategory
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
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {category.children.map((child, index) => {
            const isLast = index === category.children.length - 1;
            return (
              <CategoryTreeNode
                key={child.id}
                category={child}
                level={level + 1}
                expanded={expanded}
                selectedCategoryId={selectedCategoryId}
                activeId={activeId}
                onToggleExpand={onToggleExpand}
                onCategoryClick={onCategoryClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddChild={onAddChild}
                isLastChild={isLast}
                parentHasMoreSiblings={!isLast}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to get all category IDs in tree
const getAllCategoryIds = (nodes: CategoryTree[]): Set<string> => {
  const ids = new Set<string>();
  const traverse = (nodes: CategoryTree[]) => {
    nodes.forEach(node => {
      ids.add(node.id);
      if (node.children?.length) {
        traverse(node.children);
      }
    });
  };
  traverse(nodes);
  return ids;
};

export const CategoryTreeView: React.FC<CategoryTreeViewProps> = ({
  tree,
  selectedCategoryId,
  expanded = new Set(),
  onCategoryClick,
  onToggleExpand,
  onExpandAll,
  onCollapseAll,
  onEdit,
  onDelete,
  onAddChild,
  activeId,
  isMoving,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragCancel,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Check if all categories are expanded
  const allCategoryIds = useMemo(() => getAllCategoryIds(tree), [tree]);
  const allExpanded = useMemo(() => {
    return allCategoryIds.size > 0 && Array.from(allCategoryIds).every(id => expanded.has(id));
  }, [allCategoryIds, expanded]);

  const activeCategory = tree.find(c => c.id === activeId) || 
    (() => {
      const findInTree = (nodes: CategoryTree[]): CategoryTree | undefined => {
        for (const node of nodes) {
          if (node.id === activeId) return node;
          if (node.children?.length) {
            const found = findInTree(node.children);
            if (found) return found;
          }
        }
        return undefined;
      };
      return findInTree(tree);
    })();

  // Root-level droppable for moving categories to root
  const { setNodeRef: setRootDropRef, isOver: isRootOver } = useDroppable({
    id: 'root-drop-zone',
  });

  return (
    <div className="flex flex-col h-full">
   

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {tree.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No categories yet. Create your first category to get started.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
          >
            <div 
              ref={setRootDropRef}
              className={cn(
                "min-h-full transition-colors",
                isRootOver && activeId && "bg-blue-50 border-2 border-blue-300 border-dashed rounded"
              )}
            >
              <div>
                {tree.map((category, index) => {
                  const isLast = index === tree.length - 1;
                  return (
                    <CategoryTreeNode
                      key={category.id}
                      category={category}
                      level={0}
                      expanded={expanded}
                      selectedCategoryId={selectedCategoryId}
                      activeId={activeId}
                      onToggleExpand={onToggleExpand || (() => {})}
                      onCategoryClick={onCategoryClick}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onAddChild={onAddChild}
                      isLastChild={isLast}
                      parentHasMoreSiblings={false}
                    />
                  );
                })}
              </div>
            </div>
            <DragOverlay>
              {activeCategory ? (
                <div className="px-4 py-2 bg-white border border-gray-200 rounded shadow-lg">
                  <span className="text-base font-medium text-gray-900">{activeCategory.name}</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};

