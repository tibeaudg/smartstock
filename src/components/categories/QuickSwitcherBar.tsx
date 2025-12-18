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
  Search,
  Upload,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBranches } from '@/hooks/useBranches';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWarehouses } from '@/hooks/useWarehouses';
import type { CategoryTree } from '@/types/categoryTypes';
import { flattenCategoryTree } from '@/lib/categories/categoryUtils';
import { Warehouse } from 'lucide-react';

interface QuickSwitcherBarProps {
  tree: CategoryTree[];
  selectedCategoryIds: string[];
  onCategorySelectionChange: (categoryIds: string[]) => void;
  selectedLocation?: string | null;
  onLocationChange?: (location: string | null) => void;
  selectedWarehouse?: string | null;
  onWarehouseChange?: (warehouse: string | null) => void;
  onQuickFilterChange?: (filter: string | null) => void;
  activeQuickFilter?: string | null;
  className?: string;
  onImportClick?: () => void;
  onExportClick?: () => void;
}

export const QuickSwitcherBar: React.FC<QuickSwitcherBarProps> = ({
  tree,
  selectedCategoryIds,
  onCategorySelectionChange,
  selectedLocation,
  onLocationChange,
  selectedWarehouse,
  onWarehouseChange,
  onQuickFilterChange,
  activeQuickFilter,
  className,
  onImportClick,
  onExportClick,
}) => {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const { data: warehouses = [] } = useWarehouses();
  const [locations, setLocations] = useState<string[]>([]);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);
  const [isWarehousePopoverOpen, setIsWarehousePopoverOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState('');

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

  useEffect(() => {
    if (!isWarehousePopoverOpen) {
      setWarehouseSearchQuery('');
    }
  }, [isWarehousePopoverOpen]);

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

  const handleWarehouseSelect = (warehouse: string | null) => {
    if (onWarehouseChange) {
      onWarehouseChange(warehouse);
    }
    setIsWarehousePopoverOpen(false);
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

  // Filter warehouses based on search query
  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(warehouseSearchQuery.toLowerCase())
  );

  const actionButtons = [
    { id: 'import', label: 'Import', icon: Upload, color: 'text-blue-600', onClick: onImportClick },
    { id: 'export', label: 'Export', icon: Download, color: 'text-green-600', onClick: onExportClick },
  ];  

  const selectedCategoryNames = allCategories
    .filter(cat => selectedCategoryIds.includes(cat.id))
    .map(cat => cat.name);

  return (
    <div className={cn("flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-3 sm:px-4 py-2 bg-white border-b", className)}>
      {/* Filter Buttons Row - Stack on mobile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 min-w-0">
        {/* Category Quick Selector */}
        <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 sm:h-8 text-xs sm:text-xs justify-between sm:justify-start min-h-[44px] touch-manipulation"
            >
              <div className="flex items-center gap-1.5 sm:gap-1.5">
                <Package className="w-4 h-4 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">
                  {selectedCategoryIds.length === 0 ? (
                    'All Categories'
                  ) : selectedCategoryIds.length === 1 ? (
                    selectedCategoryNames[0] || '1 Category'
                  ) : (
                    `${selectedCategoryIds.length} Categories`
                  )}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 sm:w-3 sm:h-3 ml-auto sm:ml-1.5 flex-shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-64 max-w-sm p-2" align="start">
          <div className="space-y-1">
      
            
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-3 sm:h-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="h-9 sm:h-7 pl-9 sm:pl-7 text-sm sm:text-xs min-h-[44px] sm:min-h-0"
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
                        "flex items-center gap-2 px-3 sm:px-2 py-3 sm:py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation",
                        isSelected && "bg-blue-50"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="data-[state=checked]:bg-blue-600 w-5 h-5 sm:w-4 sm:h-4"
                      />
                      <span className={cn(
                        "flex-1 text-sm sm:text-xs truncate",
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
                  className="w-full h-10 sm:h-7 text-sm sm:text-xs text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px] sm:min-h-0 touch-manipulation"
                >
                  <X className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

        {/* Warehouse Quick Selector */}
        {warehouses.length > 0 && (
          <Popover open={isWarehousePopoverOpen} onOpenChange={setIsWarehousePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 sm:h-8 text-xs sm:text-xs justify-between sm:justify-start min-h-[44px] touch-manipulation"
              >
                <div className="flex items-center gap-1.5 sm:gap-1.5">
                  <Warehouse className="w-4 h-4 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="truncate">{selectedWarehouse || 'All Warehouses'}</span>
                </div>
                <ChevronDown className="w-4 h-4 sm:w-3 sm:h-3 ml-auto sm:ml-1.5 flex-shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] sm:w-48 max-w-sm p-2" align="start">
            <div className="space-y-1">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-3 sm:h-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search warehouses..."
                  value={warehouseSearchQuery}
                  onChange={(e) => setWarehouseSearchQuery(e.target.value)}
                  className="h-9 sm:h-7 pl-9 sm:pl-7 text-sm sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>
              
              <div className="max-h-[200px] overflow-y-auto space-y-1">
                <button
                  onClick={() => handleWarehouseSelect(null)}
                  className={cn(
                    "w-full text-left px-3 sm:px-2 py-3 sm:py-1.5 rounded-md text-sm sm:text-xs hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation",
                    !selectedWarehouse && "bg-blue-50 font-medium text-blue-900"
                  )}
                >
                  All Warehouses
                </button>
                {filteredWarehouses.length > 0 ? (
                  filteredWarehouses.map((warehouse) => (
                    <button
                      key={warehouse.id}
                      onClick={() => handleWarehouseSelect(warehouse.name)}
                      className={cn(
                        "w-full text-left px-3 sm:px-2 py-3 sm:py-1.5 rounded-md text-sm sm:text-xs hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation",
                        selectedWarehouse === warehouse.name && "bg-blue-50 font-medium text-blue-900"
                      )}
                    >
                      {warehouse.name}
                    </button>
                  ))
                ) : (
                  <div className="px-3 sm:px-2 py-3 sm:py-1.5 text-sm sm:text-xs text-gray-500 text-center">
                    No warehouses found
                  </div>
                )}
              </div>
              {selectedWarehouse && (
                <div className="pt-1 border-t mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleWarehouseSelect(null);
                    }}
                    className="w-full h-10 sm:h-7 text-sm sm:text-xs text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px] sm:min-h-0 touch-manipulation"
                  >
                    <X className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

  

      </div>

      {/* Import/Export Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-1.5 sm:ml-auto">
        {actionButtons.map((button) => {
          const Icon = button.icon;
          
          return (
            <Button
              key={button.id}
              variant="outline"
              size="sm"
              className={cn(
                "h-10 sm:h-8 text-sm sm:text-xs min-h-[44px] sm:min-h-0 touch-manipulation flex-1 sm:flex-initial",
                button.id === 'import' && "border-blue-600 text-blue-600 hover:bg-blue-50",
                button.id === 'export' && "border-green-600 text-green-600 hover:bg-green-50"
              )}
              onClick={button.onClick}
            >
              <Icon className={cn("w-4 h-4 sm:w-3 sm:h-3 sm:mr-1.5", button.color)} />
              <span className="hidden sm:inline">{button.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

