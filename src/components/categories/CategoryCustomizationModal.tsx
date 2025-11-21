/**
 * Category Customization Modal
 * Icon picker and color picker for categories
 */

import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { categoryIcons, searchIcons, getIconSuggestions, type CategoryIcon } from '@/lib/categories/categoryIcons';
import { categoryColors, getColorSuggestions, type CategoryColor } from '@/lib/categories/categoryColors';
import { Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Category } from '@/types/categoryTypes';
import { cn } from '@/lib/utils';

interface CategoryCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (icon: string | null, color: string | null) => void;
}

export const CategoryCustomizationModal: React.FC<CategoryCustomizationModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(category?.icon || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(category?.color || null);
  const [iconSearch, setIconSearch] = useState('');

  const filteredIcons = useMemo(() => {
    return iconSearch ? searchIcons(iconSearch) : categoryIcons;
  }, [iconSearch]);

  const iconSuggestions = useMemo(() => {
    return category ? getIconSuggestions(category.name) : [];
  }, [category]);

  const colorSuggestions = useMemo(() => {
    return category ? getColorSuggestions(category.name) : [];
  }, [category]);

  const handleSave = () => {
    onSave(selectedIcon, selectedColor);
    onClose();
  };

  const handleReset = () => {
    setSelectedIcon(null);
    setSelectedColor(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Customize Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Icon Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Icon</Label>
            
            {/* Suggestions */}
            {iconSuggestions.length > 0 && !iconSearch && (
              <div className="mb-4">
                <Label className="text-sm text-gray-600 mb-2 block">Suggestions</Label>
                <div className="flex flex-wrap gap-2">
                  {iconSuggestions.map((icon) => {
                    const IconComponent = LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                    return (
                      <button
                        key={icon}
                        onClick={() => setSelectedIcon(icon)}
                        className={cn(
                          'w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all',
                          selectedIcon === icon
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <IconComponent className="w-6 h-6" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search icons..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Icon Grid */}
            <ScrollArea className="h-64 border rounded-lg p-4">
              <div className="grid grid-cols-8 gap-2">
                {filteredIcons.map((icon) => {
                  const IconComponent = LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                  return (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={cn(
                        'w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-110',
                        selectedIcon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                      title={icon}
                    >
                      <IconComponent className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </ScrollArea>

            {/* No icon option */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIcon(null)}
              className={cn(
                'mt-2',
                selectedIcon === null && 'bg-blue-50 border-blue-500'
              )}
            >
              No Icon
            </Button>
          </div>

          {/* Color Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Color</Label>
            
            {/* Suggestions */}
            {colorSuggestions.length > 0 && (
              <div className="mb-4">
                <Label className="text-sm text-gray-600 mb-2 block">Suggestions</Label>
                <div className="flex flex-wrap gap-2">
                  {colorSuggestions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={cn(
                        'w-12 h-12 rounded-lg border-2 transition-all',
                        selectedColor === color.value
                          ? 'border-blue-500 scale-110'
                          : 'border-gray-200 hover:scale-110'
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Colors */}
            <ScrollArea className="h-48 border rounded-lg p-4">
              <div className="grid grid-cols-8 gap-2">
                {categoryColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={cn(
                      'w-10 h-10 rounded-lg border-2 transition-all hover:scale-110',
                      selectedColor === color.value
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </ScrollArea>

            {/* No color option */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedColor(null)}
              className={cn(
                'mt-2',
                selectedColor === null && 'bg-blue-50 border-blue-500'
              )}
            >
              Default Color
            </Button>
          </div>

          {/* Preview */}
          <div className="border-t pt-4">
            <Label className="text-base font-semibold mb-3 block">Preview</Label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: selectedColor || '#6B7280',
                  color: selectedColor ? '#FFFFFF' : '#000000',
                }}
              >
                {selectedIcon ? (
                  (() => {
                    const IconComponent = LucideIcons[selectedIcon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                    return <IconComponent className="w-6 h-6" />;
                  })()
                ) : (
                  <LucideIcons.Tag className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="font-semibold">{category?.name || 'Category Name'}</div>
                <div className="text-sm text-gray-500">Preview of your category</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

