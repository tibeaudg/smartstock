/**
 * Multi-Intent Search Component
 * Provides search across Products, SKUs, Categories, Suppliers with Create actions
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, Package, Tag, Building2, Plus, X, ChevronRight, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useCategoryTree } from '@/hooks/useCategories';
import { useQuery } from '@tanstack/react-query';
import { getCategoryPath } from '@/lib/categories/categoryUtils';

interface MultiIntentSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onProductClick?: (product: any) => void;
  onCategoryClick?: (categoryId: string) => void;
  onSupplierClick?: (supplierId: string) => void;
  onCreateProduct?: () => void;
  onCreateCategory?: () => void;
  onCreateLocation?: () => void;
  placeholder?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

interface SearchResult {
  type: 'product' | 'sku' | 'category' | 'supplier';
  id: string;
  name: string;
  subtitle?: string;
  data?: any;
}

export const MultiIntentSearch = React.forwardRef<HTMLInputElement, MultiIntentSearchProps>(({
  value,
  onChange,
  onSubmit,
  onProductClick,
  onCategoryClick,
  onSupplierClick,
  onCreateProduct,
  onCreateCategory,
  onCreateLocation,
  placeholder = "Search products, SKUs, categories, suppliers…",
  inputRef: externalInputRef,
}, ref) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { categories: flatCategories } = useCategoryTree();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'create'>('results');
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Callback ref to merge external and internal refs
  const setInputRef = React.useCallback((node: HTMLInputElement | null) => {
    internalInputRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && 'current' in ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    }
    if (typeof externalInputRef === 'function') {
      externalInputRef(node);
    } else if (externalInputRef && 'current' in externalInputRef) {
      (externalInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    }
  }, [ref, externalInputRef]);
  
  const inputRef = internalInputRef;

  // Search query
  const searchQuery = useQuery({
    queryKey: ['multiSearch', value, user?.id, activeBranch?.branch_id],
    queryFn: async () => {
      if (!user || !value.trim() || value.length < 2) return [];
      
      const term = value.toLowerCase().trim();
      const results: SearchResult[] = [];

      // Search products
      const { data: products } = await supabase
        .from('products')
        .select('id, name, sku, barcode, location, category_id, quantity_in_stock')
        .eq('branch_id', activeBranch?.branch_id)
        .or(`name.ilike.%${term}%,sku.ilike.%${term}%,barcode.ilike.%${term}%`)
        .limit(10);

      if (products) {
        products.forEach(product => {
          // Add as product match
          if (product.name?.toLowerCase().includes(term)) {
            results.push({
              type: 'product',
              id: product.id,
              name: product.name,
              subtitle: product.sku ? `SKU: ${product.sku}` : product.location || undefined,
              data: product,
            });
          }
          // Add as SKU match if SKU matches
          if (product.sku?.toLowerCase().includes(term) && product.sku.toLowerCase() !== product.name?.toLowerCase()) {
            results.push({
              type: 'sku',
              id: product.id,
              name: product.sku,
              subtitle: product.name,
              data: product,
            });
          }
        });
      }

      // Search categories
      const { data: categoryResults } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .ilike('name', `%${term}%`)
        .limit(10);

      if (categoryResults && flatCategories.length > 0) {
        categoryResults.forEach(category => {
          const path = getCategoryPath(category as any, flatCategories);
          results.push({
            type: 'category',
            id: category.id,
            name: category.name,
            subtitle: path !== category.name ? path : category.description || undefined,
            data: category,
          });
        });
      }

      // Search suppliers
      const { data: suppliers } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
        .ilike('name', `%${term}%`)
        .limit(10);

      if (suppliers) {
        suppliers.forEach(supplier => {
          results.push({
            type: 'supplier',
            id: supplier.id,
            name: supplier.name,
            subtitle: supplier.contact_person || supplier.email || undefined,
            data: supplier,
          });
        });
      }

      return results;
    },
    enabled: !!user && !!activeBranch && value.length >= 2,
    staleTime: 1000 * 30, // 30 seconds
  });

  const searchResults = searchQuery.data || [];

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups = {
      products: searchResults.filter(r => r.type === 'product'),
      skus: searchResults.filter(r => r.type === 'sku'),
      categories: searchResults.filter(r => r.type === 'category'),
      suppliers: searchResults.filter(r => r.type === 'supplier'),
    };
    return groups;
  }, [searchResults]);

  // Calculate dropdown position based on input position
  useEffect(() => {
    const updatePosition = () => {
      if (inputRef.current && isOpen) {
        const rect = inputRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        
        // Calculate position with viewport bounds checking
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const dropdownMaxHeight = 500; // max-h-[500px]
        const gap = 4; // mt-1 equivalent
        
        // Check if there's enough space below, otherwise show above
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const showBelow = spaceBelow >= dropdownMaxHeight || spaceBelow >= spaceAbove;
        
        let top: number;
        if (showBelow) {
          top = rect.bottom + scrollY + gap;
        } else {
          // Show above the input
          top = rect.top + scrollY - dropdownMaxHeight - gap;
          // Ensure it doesn't go above viewport
          if (top < scrollY) {
            top = scrollY + gap;
          }
        }
        
        // Ensure dropdown doesn't go off the right edge
        let left = rect.left + scrollX;
        const maxLeft = viewportWidth + scrollX - rect.width;
        if (left > maxLeft) {
          left = maxLeft;
        }
        // Ensure it doesn't go off the left edge
        if (left < scrollX) {
          left = scrollX;
        }
        
        setDropdownPosition({
          top,
          left,
          width: rect.width,
        });
      } else {
        setDropdownPosition(null);
      }
    };

    if (isOpen) {
      updatePosition();
      
      // Update position on scroll and resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        searchRef.current && 
        !searchRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use capture phase to catch clicks before they bubble
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue.trim().length >= 2) {
      setIsOpen(true);
      setActiveTab('results');
    } else {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (value.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(value);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    onChange('');
    
    switch (result.type) {
      case 'product':
      case 'sku':
        onProductClick?.(result.data);
        break;
      case 'category':
        onCategoryClick?.(result.id);
        break;
      case 'supplier':
        onSupplierClick?.(result.id);
        break;
    }
  };

  const handleCreateAction = (action: 'product' | 'category' | 'location') => {
    setIsOpen(false);
    onChange('');
    
    switch (action) {
      case 'product':
        onCreateProduct?.();
        break;
      case 'category':
        onCreateCategory?.();
        break;
      case 'location':
        onCreateLocation?.();
        break;
    }
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'product':
        return <Package className="w-4 h-4" />;
      case 'sku':
        return <Tag className="w-4 h-4" />;
      case 'category':
        return <Tag className="w-4 h-4" />;
      case 'supplier':
        return <Building2 className="w-4 h-4" />;
    }
  };

  const hasResults = searchResults.length > 0;
  const showDropdown = isOpen && (value.trim().length >= 2 || activeTab === 'create');

  return (
    <div ref={searchRef} className="relative flex-1 rounded-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          ref={setInputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 h-10 sm:h-9 text-sm bg-gray-50 min-h-[44px] sm:min-h-0 touch-manipulation"
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {showDropdown && dropdownPosition && typeof document !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg max-h-[500px] overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'results' | 'create')} className="w-full">
            <TabsList className="w-full rounded-none border-b bg-gray-50">
              <TabsTrigger value="results" className="flex-1">
                Results
              </TabsTrigger>
              <TabsTrigger value="create" className="flex-1">
                Create
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="m-0 p-0 max-h-[400px] overflow-y-auto">
              {searchQuery.isLoading ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Searching...
                </div>
              ) : !hasResults ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  {value.trim().length < 2 
                    ? 'Type at least 2 characters to search'
                    : 'No results found'}
                </div>
              ) : (
                <div className="py-2">
                  {/* Products */}
                  {groupedResults.products.length > 0 && (
                    <div className="mb-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                        Products
                      </div>
                      {groupedResults.products.map((result) => (
                        <button
                          key={`product-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                        >
                          <div className="flex-shrink-0 text-gray-400">
                            {getResultIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {result.name}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-500 truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* SKUs */}
                  {groupedResults.skus.length > 0 && (
                    <div className="mb-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                        SKUs
                      </div>
                      {groupedResults.skus.map((result) => (
                        <button
                          key={`sku-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                        >
                          <div className="flex-shrink-0 text-gray-400">
                            {getResultIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {result.name}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-500 truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Categories */}
                  {groupedResults.categories.length > 0 && (
                    <div className="mb-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                        Categories
                      </div>
                      {groupedResults.categories.map((result) => (
                        <button
                          key={`category-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                        >
                          <div className="flex-shrink-0 text-gray-400">
                            {getResultIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {result.name}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-500 truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suppliers */}
                  {groupedResults.suppliers.length > 0 && (
                    <div className="mb-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                        Suppliers
                      </div>
                      {groupedResults.suppliers.map((result) => (
                        <button
                          key={`supplier-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                        >
                          <div className="flex-shrink-0 text-gray-400">
                            {getResultIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {result.name}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-500 truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="m-0 p-0">
              <div className="py-2">
                <button
                  onClick={() => handleCreateAction('product')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <div className="flex-shrink-0 text-blue-600">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Create Product</div>
                    <div className="text-xs text-gray-500">Add a new product to inventory</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>

                <button
                  onClick={() => handleCreateAction('category')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <div className="flex-shrink-0 text-green-600">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Create Category</div>
                    <div className="text-xs text-gray-500">Add a new product category</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>

                <button
                  onClick={() => handleCreateAction('location')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <div className="flex-shrink-0 text-purple-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Create Location</div>
                    <div className="text-xs text-gray-500">Add a new storage location</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>,
        document.body
      )}
    </div>
  );
});

MultiIntentSearch.displayName = 'MultiIntentSearch';

