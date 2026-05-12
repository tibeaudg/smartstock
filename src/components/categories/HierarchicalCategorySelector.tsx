/**
 * Hierarchical Category Selector Component
 * Tree-based category selection with search and create-on-the-fly
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategoryTree, useCreateCategory } from '@/hooks/useCategories';
import { filterCategories, getCategoryPath } from '@/lib/categories/categoryUtils';
import type { Category } from '@/types/categoryTypes';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface HierarchicalCategorySelectorProps {
  value?: string | null;
  onValueChange: (categoryId: string | null, categoryName: string | null) => void;
  placeholder?: string;
  allowCreate?: boolean;
  showPath?: boolean;
}

const CategoryTreeItem: React.FC<{
  category: any;
  level: number;
  selectedId: string | null;
  onSelect: (category: Category) => void;
  showPath: boolean;
}> = ({ category, level, selectedId, onSelect, showPath }) => {
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedId === category.id;

  return (
    <>
      <CommandItem
        value={category.id}
        onSelect={() => onSelect(category)}
        className={cn(
          'pl-4',
          isSelected && 'bg-blue-50'
        )}
      >
      
        <div className="flex-1">
          <div className="font-medium">{category.name}</div>
          {showPath && category.path && category.path !== category.name && (
            <div className="text-xs text-gray-500">{category.path}</div>
          )}
        </div>
      </CommandItem>
      {hasChildren &&
        category.children.map((child: any) => (
          <CategoryTreeItem
            key={child.id}
            category={child}
            level={level + 1}
            selectedId={selectedId}
            onSelect={onSelect}
            showPath={showPath}
          />
        ))}
    </>
  );
};

export const HierarchicalCategorySelector: React.FC<HierarchicalCategorySelectorProps> = ({
  value,
  onValueChange,
  placeholder = 'Select category...',
  allowCreate = true,
  showPath = true,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const createCategory = useCreateCategory();
  const { tree, categories } = useCategoryTree();

  const selectedCategory = useMemo(() => {
    if (!value) return null;
    return categories.find(c => c.id === value) || null;
  }, [value, categories]);

  const selectedCategoryPath = useMemo(() => {
    if (!selectedCategory || !showPath) return null;
    return getCategoryPath(selectedCategory, categories);
  }, [selectedCategory, categories, showPath]);

  const filteredTree = useMemo(() => {
    if (!searchTerm.trim()) return tree;
    
    const filtered = filterCategories(categories, searchTerm);
    const filteredIds = new Set(filtered.map(c => c.id));
    
    // Rebuild tree with only filtered categories
    const buildFilteredTree = (nodes: any[]): any[] => {
      return nodes
        .filter(node => filteredIds.has(node.id))
        .map(node => ({
          ...node,
          children: buildFilteredTree(node.children),
        }));
    };
    
    return buildFilteredTree(tree);
  }, [tree, categories, searchTerm]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const normalizedSearch = searchTerm.trim();
  const exactMatchCategory = categories.find(
    c => c.name.toLowerCase() === normalizedSearch.toLowerCase()
  );
  const canCreateCategory = allowCreate && normalizedSearch.length > 0 && !exactMatchCategory;

  const handleCreateButtonClick = () => {
    setIsAddingNew(true);
    setNewCategoryName('');
  };

  const handleSaveNewCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;

    const exactMatch = categories.find(
      c => c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exactMatch) {
      toast.error('Category already exists');
      return;
    }

    try {
      await createCategory.mutateAsync({ name: trimmedName });
      setIsAddingNew(false);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error creating category');
    }
  };

  const handleCancelNewCategory = () => {
    setIsAddingNew(false);
    setNewCategoryName('');
  };

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  const handleSelect = (category: Category) => {
    onValueChange(category.id, category.name);
    setOpen(false);
  };

  const handleCreateCategory = async () => {
    if (!canCreateCategory || !user) return;

    try {
      const newCategory = await createCategory.mutateAsync({
        name: normalizedSearch,
        description: null,
        parent_category_id: null,
        is_active: true,
      });

      toast.success('Category created');
      onValueChange(newCategory.id, newCategory.name);
      setOpen(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error creating category');
    }
  };

  const displayValue = selectedCategory
    ? (selectedCategoryPath || selectedCategory.name)
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput
            ref={searchInputRef}
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search or type to add a category..."
            autoComplete="off"
          />
          {allowCreate && (
            <div className="border-b bg-slate-50 px-3 py-2">
              {isAddingNew ? (
                <div className="space-y-2">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveNewCategory();
                      } else if (e.key === 'Escape') {
                        handleCancelNewCategory();
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveNewCategory}
                      disabled={!newCategoryName.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelNewCategory}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={handleCreateButtonClick}
                >
                  <span>Add new category</span>
                  <Plus className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          <CommandList>
            <CommandEmpty>
              {allowCreate && searchTerm.trim() ? (
                <div className="p-2 text-center">
                  <p className="text-sm text-gray-500 mb-2">No category found</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateCategory}
                    className="w-full"
                    disabled={!canCreateCategory}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create "{normalizedSearch}"
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No categories found</p>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredTree.map((category) => (
                <CategoryTreeItem
                  key={category.id}
                  category={category}
                  level={0}
                  selectedId={value || null}
                  onSelect={handleSelect}
                  showPath={showPath}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

