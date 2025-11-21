/**
 * Hook for handling category drag-and-drop operations using dnd-kit
 */

import { useState, useCallback } from 'react';
import { useMoveCategory } from './useCategories';
import { validateCategoryMove } from '@/lib/categories/categoryUtils';
import type { Category, CategoryMoveData, CategoryTree } from '@/types/categoryTypes';
import { toast } from 'sonner';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';

export function useCategoryDragDrop(categories: Category[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const moveCategory = useMoveCategory();
  const [isMoving, setIsMoving] = useState(false);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Can be used for visual feedback if needed
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!active) {
      setActiveId(null);
      return;
    }

    const draggedCategoryId = active.id as string;
    const draggedCategory = categories.find(c => c.id === draggedCategoryId);

    if (!draggedCategory) {
      setActiveId(null);
      return;
    }

    // If dropped on root drop zone or nothing, move to root level
    if (!over || over.id === 'root-drop-zone') {
      // Move to root level
      const rootCategories = categories.filter(c => c.parent_category_id === null && c.id !== draggedCategoryId);
      const newDisplayOrder = rootCategories.length > 0
        ? Math.max(...rootCategories.map(c => c.display_order || 0)) + 1
        : 0;

      const validation = validateCategoryMove(
        draggedCategory.id,
        null,
        categories
      );

      if (!validation.valid) {
        toast.error(validation.error || 'Invalid move');
        setActiveId(null);
        return;
      }

      setIsMoving(true);
      try {
        const moveData: CategoryMoveData = {
          category_id: draggedCategory.id,
          new_parent_id: null,
          new_display_order: newDisplayOrder,
        };
        
        await moveCategory.mutateAsync(moveData);
        toast.success('Category moved successfully');
      } catch (error) {
        console.error('Error moving category:', error);
        toast.error('Failed to move category');
      } finally {
        setIsMoving(false);
        setActiveId(null);
      }
      return;
    }

    const targetCategoryId = over.id as string;

    if (draggedCategoryId === targetCategoryId) {
      setActiveId(null);
      return;
    }

    const targetCategory = categories.find(c => c.id === targetCategoryId);

    if (!targetCategory) {
      setActiveId(null);
      return;
    }

    // Check if we're trying to move a category into its own descendant
    const isDescendant = (categoryId: string, potentialAncestorId: string): boolean => {
      const category = categories.find(c => c.id === categoryId);
      if (!category || !category.parent_category_id) return false;
      if (category.parent_category_id === potentialAncestorId) return true;
      return isDescendant(category.parent_category_id, potentialAncestorId);
    };

    if (isDescendant(targetCategory.id, draggedCategory.id)) {
      toast.error('Cannot move category into its own descendant');
      setActiveId(null);
      return;
    }

    // Determine new parent and display order
    // Move as a child of the target category
    const newParentId = targetCategory.id;
    
    // Get the last child's display_order
    const children = categories.filter(c => c.parent_category_id === targetCategory.id && c.id !== draggedCategoryId);
    const newDisplayOrder = children.length > 0
      ? Math.max(...children.map(c => c.display_order || 0)) + 1
      : 0;

    // Validate the move
    const validation = validateCategoryMove(
      draggedCategory.id,
      newParentId,
      categories
    );

    if (!validation.valid) {
      toast.error(validation.error || 'Invalid move');
      setActiveId(null);
      return;
    }

    // Perform the move
    setIsMoving(true);
    try {
      const moveData: CategoryMoveData = {
        category_id: draggedCategory.id,
        new_parent_id: newParentId,
        new_display_order: newDisplayOrder,
      };
      
      await moveCategory.mutateAsync(moveData);
      toast.success('Category moved successfully');
    } catch (error) {
      console.error('Error moving category:', error);
      toast.error('Failed to move category');
    } finally {
      setIsMoving(false);
      setActiveId(null);
    }
  }, [categories, moveCategory]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return {
    activeId,
    isMoving,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}

