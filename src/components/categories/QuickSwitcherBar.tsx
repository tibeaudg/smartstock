/**
 * Quick Switcher Bar Component
 * Global quick-switchers for Location, Category, and quick filters
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Package, 
  AlertCircle,
  Clock,
  TrendingUp,
  DollarSign,
  X,
  ChevronDown,
  Plus,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBranches } from '@/hooks/useBranches';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { CategoryTree } from '@/types/categoryTypes';
import { flattenCategoryTree } from '@/lib/categories/categoryUtils';

interface QuickSwitcherBarProps {
  tree: CategoryTree[];
  selectedCategoryIds: string[];
  onCategorySelectionChange: (categoryIds: string[]) => void;
  selectedLocation?: string | null;
  onLocationChange?: (location: string | null) => void;
  onQuickFilterChange?: (filter: string | null) => void;
  activeQuickFilter?: string | null;
  className?: string;
  lowStockCount?: number;
  outOfStockCount?: number;
}

export const QuickSwitcherBar: React.FC<QuickSwitcherBarProps> = ({
  tree,
  selectedCategoryIds,
  onCategorySelectionChange,
  selectedLocation,
  onLocationChange,
  onQuickFilterChange,
  activeQuickFilter,
  className,
  lowStockCount,
  outOfStockCount,
}) => {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const [locations, setLocations] = useState<string[]>([]);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

  // Flatten categories for quick selection
  const allCategories = React.useMemo(() => {
    return flattenCategoryTree(tree);
  }, [tree]);

  // Fetch unique locations
  useEffect(() => {
    const fetchLocations = async () => {
      if (!user || !activeBranch) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('location')
          .eq('branch_id', activeBranch.branch_id)
          .not('location', 'is', null)
          .neq('location', '');
        
        if (error) {
          console.error('Error fetching locations:', error);
          return;
        }
        
        const uniqueLocations = [...new Set(data?.map(item => item.location).filter(Boolean))];
        setLocations(uniqueLocations.sort());
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, [user, activeBranch]);

  // Clear search query when popover closes
  useEffect(() => {
    if (!isLocationPopoverOpen) {
      setLocationSearchQuery('');
    }
  }, [isLocationPopoverOpen]);

  useEffect(() => {
    if (!isCategoryPopoverOpen) {
      setCategorySearchQuery('');
    }
  }, [isCategoryPopoverOpen]);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      onCategorySelectionChange(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      onCategorySelectionChange([...selectedCategoryIds, categoryId]);
    }
  };

  const handleLocationSelect = (location: string | null) => {
    if (onLocationChange) {
      onLocationChange(location);
    }
    setIsLocationPopoverOpen(false);
  };

  const handleCreateLocation = () => {
    // TODO: Implement create location functionality
    console.log('Create new location clicked');
    // You can add a modal or form here to create a new location
  };

  const handleCreateCategory = () => {
    // TODO: Implement create category functionality
    console.log('Create new category clicked');
    // You can add a modal or form here to create a new category
  };

  // Filter locations based on search query
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  // Filter categories based on search query
  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const quickFilters = [
    { id: 'low-stock', label: 'Low Stock', icon: AlertCircle, color: 'text-orange-600' },
    { id: 'out-of-stock', label: 'Out of Stock', icon: AlertCircle, color: 'text-red-600' },
    { id: 'recently-added', label: 'Recently Added', icon: Clock, color: 'text-blue-600' },
    { id: 'high-value', label: 'High Value', icon: DollarSign, color: 'text-green-600' },
  ];

  const selectedCategoryNames = allCategories
    .filter(cat => selectedCategoryIds.includes(cat.id))
    .map(cat => cat.name);

  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 bg-white border-b flex-wrap", className)}>
      {/* Category Quick Selector */}
      <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
          >
            <Package className="w-3 h-3 mr-1.5" />
            {selectedCategoryIds.length === 0 ? (
              'All Categories'
            ) : selectedCategoryIds.length === 1 ? (
              selectedCategoryNames[0] || '1 Category'
            ) : (
              `${selectedCategoryIds.length} Categories`
            )}
            <ChevronDown className="w-3 h-3 ml-1.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <div className="space-y-1">
            <Button
              onClick={handleCreateCategory}
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs mb-2"
            >
              <Plus className="w-3 h-3 mr-1.5" />
              Create new category
            </Button>
            
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="h-7 pl-7 text-xs"
              />
            </div>
            
            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {filteredCategories.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500">
                  No categories found
                </div>
              ) : (
                filteredCategories.map((category) => {
                  const isSelected = selectedCategoryIds.includes(category.id);
                  return (
                    <label
                      key={category.id}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
                        isSelected && "bg-blue-50"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <span className={cn(
                        "flex-1 text-xs truncate",
                        isSelected ? "font-medium text-blue-900" : "text-gray-700"
                      )}>
                        {category.name}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
            {selectedCategoryIds.length > 0 && (
              <div className="pt-1 border-t mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onCategorySelectionChange([]);
                    setIsCategoryPopoverOpen(false);
                  }}
                  className="w-full h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Location Quick Selector */}
      {locations.length > 0 && (
        <Popover open={isLocationPopoverOpen} onOpenChange={setIsLocationPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
            >
              <MapPin className="w-3 h-3 mr-1.5" />
              {selectedLocation || 'All Locations'}
              <ChevronDown className="w-3 h-3 ml-1.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="space-y-1">
              <Button
                onClick={handleCreateLocation}
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs mb-2"
              >
                <Plus className="w-3 h-3 mr-1.5" />
                Create new location
              </Button>
              
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search locations..."
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  className="h-7 pl-7 text-xs"
                />
              </div>
              
              <div className="max-h-[200px] overflow-y-auto space-y-1">
                <button
                  onClick={() => handleLocationSelect(null)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-md text-xs hover:bg-gray-50 transition-colors",
                    !selectedLocation && "bg-blue-50 font-medium text-blue-900"
                  )}
                >
                  All Locations
                </button>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleLocationSelect(location)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 rounded-md text-xs hover:bg-gray-50 transition-colors",
                        selectedLocation === location && "bg-blue-50 font-medium text-blue-900"
                      )}
                    >
                      {location}
                    </button>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-xs text-gray-500 text-center">
                    No locations found
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Quick Filter Buttons */}
      <div className="flex items-center gap-1.5 ml-auto">
        {quickFilters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeQuickFilter === filter.id;
          
          // Get count for low stock and out of stock filters
          let displayLabel = filter.label;
          if (filter.id === 'low-stock' && lowStockCount !== undefined && lowStockCount > 0) {
            displayLabel = `Low Stock (${lowStockCount})`;
          } else if (filter.id === 'out-of-stock' && outOfStockCount !== undefined && outOfStockCount > 0) {
            displayLabel = `Out of Stock (${outOfStockCount})`;
          }
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-8 text-xs",
                isActive && "bg-blue-600 hover:bg-blue-700 text-white"
              )}
              onClick={() => {
                if (onQuickFilterChange) {
                  onQuickFilterChange(isActive ? null : filter.id);
                }
              }}
            >
              <Icon className={cn("w-3 h-3 mr-1.5", isActive ? "text-white" : filter.color)} />
              {displayLabel}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

