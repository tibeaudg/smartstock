/**
 * Category Tree View Component
 * Displays categories in a hierarchical tree structure with drag-and-drop support
 */

import React from 'react';
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor, useDraggable, useDroppable, rectIntersection } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ChevronDown,
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

  return (
    <div className="select-none" ref={nodeRef} style={style}>
      <div
        className={cn(
          'group flex items-center gap-2 px-3 rounded transition-colors',
          'hover:bg-gray-50 cursor-pointer',
          isOver && 'bg-blue-50 border-2 border-blue-300 border-dashed',
          isSelected && 'bg-blue-50 border-l-4 border-l-blue-600'
        )}
        style={{ 
          paddingLeft: `${level * 20 + 12}px`,
          height: '32px',
          minHeight: '32px',
          maxHeight: '32px'
        }}
        onClick={() => onCategoryClick?.(category)}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Expand/collapse button */}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(category.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        ) : (
          <div className="w-6" />
        )}

        {/* Category name and info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium truncate",
              isSelected ? "text-blue-700" : "text-gray-900"
            )}>
              {category.name}
            </span>
            {category.product_count !== undefined && category.product_count > 0 && (
              <Badge variant="secondary" className="text-xs h-5 px-1.5">
                {category.product_count}
              </Badge>
            )}
            {!category.is_active && (
              <Badge variant="secondary" className="text-xs h-5 px-1.5">
                Inactive
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {category.children.map((child) => (
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CategoryTreeView: React.FC<CategoryTreeViewProps> = ({
  tree,
  selectedCategoryId,
  expanded = new Set(),
  onCategoryClick,
  onToggleExpand,
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

  if (tree.length === 0) {
    return (
      <div className="p-12 text-center">
        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No categories yet. Create your first category to get started.</p>
      </div>
    );
  }

  // Root-level droppable for moving categories to root
  const { setNodeRef: setRootDropRef, isOver: isRootOver } = useDroppable({
    id: 'root-drop-zone',
  });

  return (
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
          "p-4 min-h-full transition-colors",
          isRootOver && activeId && "bg-blue-50 border-2 border-blue-300 border-dashed rounded"
        )}
      >
        <div className="space-y-1">
          {tree.map((category) => (
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
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeCategory ? (
          <div className="px-3 py-2 bg-white border border-gray-200 rounded shadow-lg">
            <span className="text-sm font-medium text-gray-900">{activeCategory.name}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

