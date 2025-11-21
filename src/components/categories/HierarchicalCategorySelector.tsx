/**
 * Hierarchical Category Selector Component
 * Tree-based category selection with search and create-on-the-fly
 */

import React, { useState, useMemo } from 'react';
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
import { useCategoryTree } from '@/hooks/useCategories';
import { getCategoryPath, filterCategories } from '@/lib/categories/categoryUtils';
import type { Category } from '@/types/categoryTypes';
import { supabase } from '@/integrations/supabase/client';
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
        style={{ paddingLeft: `${level * 16 + 16}px` }}
      >
        <Check
          className={cn(
            'mr-2 h-4 w-4',
            isSelected ? 'opacity-100' : 'opacity-0'
          )}
        />
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
  const { tree, categories } = useCategoryTree();

  const selectedCategory = useMemo(() => {
    if (!value) return null;
    return categories.find(c => c.id === value) || null;
  }, [value, categories]);

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

  const handleSelect = (category: Category) => {
    onValueChange(category.id, category.name);
    setOpen(false);
  };

  const handleCreateCategory = async () => {
    if (!searchTerm.trim() || !user) return;

    try {
      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert({
          name: searchTerm.trim(),
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        toast.error('Error creating category');
        return;
      }

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
    ? (showPath && selectedCategory.path ? selectedCategory.path : selectedCategory.name)
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
            placeholder="Search categories..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
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
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create "{searchTerm}"
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

