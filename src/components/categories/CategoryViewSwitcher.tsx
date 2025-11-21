/**
 * Category View Switcher Component
 * Toggles between tree and grid views
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutList, Grid3x3 } from 'lucide-react';
import type { CategoryViewMode } from '@/types/categoryTypes';
import { cn } from '@/lib/utils';

interface CategoryViewSwitcherProps {
  viewMode: CategoryViewMode;
  onViewModeChange: (mode: CategoryViewMode) => void;
}

export const CategoryViewSwitcher: React.FC<CategoryViewSwitcherProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
      <Button
        variant={viewMode === 'tree' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('tree')}
        className={cn(
          'flex items-center gap-2',
          viewMode === 'tree' && 'bg-white shadow-sm'
        )}
      >
        <LayoutList className="w-4 h-4" />
        <span className="hidden sm:inline">Tree</span>
      </Button>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className={cn(
          'flex items-center gap-2',
          viewMode === 'grid' && 'bg-white shadow-sm'
        )}
      >
        <Grid3x3 className="w-4 h-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
    </div>
  );
};

