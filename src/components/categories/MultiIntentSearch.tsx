/**
 * Multi-Intent Search Component
 * Provides search across Products, SKUs, Categories, Customers with Create actions
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, Package, Tag, Building2, Plus, X, ChevronRight, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useCategoryTree } from '@/hooks/useCategories';
import { useQuery } from '@tanstack/react-query';
import { getCategoryPath } from '@/lib/categories/categoryUtils';
import { SavedSearches } from '@/components/products/SavedSearches';

interface SearchTokens {
  stock?: 'low' | 'out' | 'in';
  warehouse?: string;
  category?: string;
  location?: string;
}

interface ParsedSearch {
  baseTerm: string;
  tokens: SearchTokens;
}

interface MultiIntentSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onProductClick?: (product: any) => void;
  onCategoryClick?: (categoryId: string) => void;
  onCustomerClick?: (customerId: string) => void;
  onCreateProduct?: () => void;
  onCreateCategory?: () => void;
  onCreateLocation?: () => void;
  onTokensChange?: (tokens: SearchTokens) => void;
  placeholder?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

interface SearchResult {
  type: 'product' | 'sku' | 'category' | 'customer';
  id: string;
  name: string;
  subtitle?: string;
  data?: any;
  matchedFields?: string[];
}

// Parse search query for tokens
const parseSearchQuery = (query: string): ParsedSearch => {
  const tokens: SearchTokens = {};
  let baseTerm = query;

  // Match tokens like stock:low, warehouse:A, category:electronics
  const tokenPattern = /(\w+):([^\s]+)/g;
  const matches = [...query.matchAll(tokenPattern)];
  
  matches.forEach(match => {
    const [fullMatch, key, value] = match;
    const lowerKey = key.toLowerCase();
    const lowerValue = value.toLowerCase();

    switch (lowerKey) {
      case 'stock':
        if (['low', 'out', 'in'].includes(lowerValue)) {
          tokens.stock = lowerValue as 'low' | 'out' | 'in';
          baseTerm = baseTerm.replace(fullMatch, '').trim();
        }
        break;
      case 'warehouse':
        tokens.warehouse = value;
        baseTerm = baseTerm.replace(fullMatch, '').trim();
        break;
      case 'category':
        tokens.category = value;
        baseTerm = baseTerm.replace(fullMatch, '').trim();
        break;
      case 'location':
        tokens.location = value;
        baseTerm = baseTerm.replace(fullMatch, '').trim();
        break;
    }
  });

  return { baseTerm, tokens };
};

export const MultiIntentSearch = React.forwardRef<HTMLInputElement, MultiIntentSearchProps>(({
  value,
  onChange,
  onSubmit,
  onProductClick,
  onCategoryClick,
  onCustomerClick,
  onCreateProduct,
  onCreateCategory,
  onCreateLocation,
  onTokensChange,
  placeholder = "Search products, SKUs, categories, customers…",
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

  // Parse tokens from search query
  const parsedSearch = useMemo(() => parseSearchQuery(value), [value]);
  
  // Notify parent of token changes
  useEffect(() => {
    onTokensChange?.(parsedSearch.tokens);
  }, [parsedSearch.tokens, onTokensChange]);
  
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

  // Search query - use baseTerm for actual search
  const searchQuery = useQuery({
    queryKey: ['multiSearch', parsedSearch.baseTerm, user?.id, activeBranch?.branch_id],
    queryFn: async () => {
      if (!user || !parsedSearch.baseTerm.trim() || parsedSearch.baseTerm.length < 2) return [];
      
      const term = parsedSearch.baseTerm.toLowerCase().trim();
      const results: SearchResult[] = [];

      // Search products
      const { data: products } = await supabase
        .from('products')
        .select('id, name, sku, barcode, location, category_id, quantity_in_stock')
        .eq('branch_id', activeBranch?.branch_id)
        .or(`name.ilike.%${term}%,sku.ilike.%${term}%,barcode.ilike.%${term}%`)
        .limit(10);

      if (products && Array.isArray(products)) {
        products.forEach((product: any) => {
          const matchedFields: string[] = [];
          
          // Check which fields matched
          if (product.name?.toLowerCase().includes(term)) matchedFields.push('name');
          if (product.sku?.toLowerCase().includes(term)) matchedFields.push('SKU');
          if (product.barcode?.toLowerCase().includes(term)) matchedFields.push('barcode');
          
          // Add as product match
          if (product.name?.toLowerCase().includes(term)) {
            results.push({
              type: 'product',
              id: product.id,
              name: product.name,
              subtitle: product.sku ? `SKU: ${product.sku}` : product.location || undefined,
              data: product,
              matchedFields,
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
              matchedFields: ['SKU'],
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

      if (categoryResults && Array.isArray(categoryResults) && flatCategories.length > 0) {
        categoryResults.forEach((category: any) => {
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

      // Search customers
      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .ilike('name', `%${term}%`)
        .limit(10);

      if (customers && Array.isArray(customers)) {
        customers.forEach((customer: any) => {
          const matchedFields: string[] = ['name'];
          if (customer.contact_person?.toLowerCase().includes(term)) matchedFields.push('contact');
          if (customer.email?.toLowerCase().includes(term)) matchedFields.push('email');
          
          results.push({
            type: 'customer',
            id: customer.id,
            name: customer.name,
            subtitle: customer.contact_person || customer.email || undefined,
            data: customer,
            matchedFields,
          });
        });
      }

      return results;
    },
    enabled: !!user && !!activeBranch && parsedSearch.baseTerm.length >= 2,
    staleTime: 1000 * 30, // 30 seconds
  });

  const searchResults = searchQuery.data || [];

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups = {
      products: searchResults.filter(r => r.type === 'product'),
      skus: searchResults.filter(r => r.type === 'sku'),
      categories: searchResults.filter(r => r.type === 'category'),
      customers: searchResults.filter(r => r.type === 'customer'),
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
    const parsed = parseSearchQuery(newValue);
    if (parsed.baseTerm.trim().length >= 2 || Object.keys(parsed.tokens).length > 0) {
      setIsOpen(true);
      setActiveTab('results');
    } else {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    const parsed = parseSearchQuery(value);
    if (parsed.baseTerm.trim().length >= 2 || Object.keys(parsed.tokens).length > 0) {
      setIsOpen(true);
    }
  };

  const handleRemoveToken = (tokenKey: keyof SearchTokens) => {
    const newTokens = { ...parsedSearch.tokens };
    delete newTokens[tokenKey];
    
    // Reconstruct query without the removed token
    let newQuery = parsedSearch.baseTerm;
    if (Object.keys(newTokens).length > 0) {
      const tokenStrings: string[] = [];
      if (newTokens.stock) tokenStrings.push(`stock:${newTokens.stock}`);
      if (newTokens.warehouse) tokenStrings.push(`warehouse:${newTokens.warehouse}`);
      if (newTokens.category) tokenStrings.push(`category:${newTokens.category}`);
      if (newTokens.location) tokenStrings.push(`location:${newTokens.location}`);
      newQuery = tokenStrings.join(' ') + (parsedSearch.baseTerm ? ' ' + parsedSearch.baseTerm : '');
    }
    
    onChange(newQuery.trim());
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
      case 'customer':
        onCustomerClick?.(result.id);
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
      case 'customer':
        return <Building2 className="w-4 h-4" />;
    }
  };

  const hasResults = searchResults.length > 0;
  const hasTokens = Object.keys(parsedSearch.tokens).length > 0;
  const showDropdown = isOpen && (parsedSearch.baseTerm.trim().length >= 2 || hasTokens || activeTab === 'create');

  const getTokenLabel = (key: keyof SearchTokens, value: string | undefined) => {
    if (!value) return '';
    switch (key) {
      case 'stock':
        return `Stock: ${value}`;
      case 'warehouse':
        return `Warehouse: ${value}`;
      case 'category':
        return `Category: ${value}`;
      case 'location':
        return `Location: ${value}`;
      default:
        return `${key}: ${value}`;
    }
  };

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
            className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <SavedSearches
            currentQuery={value}
            onSelect={(query) => {
              onChange(query);
              onSubmit(query);
            }}
            userId={user?.id}
          />
        </div>
      </div>
      
      {/* Token chips */}
      {hasTokens && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {parsedSearch.tokens.stock && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 flex items-center gap-1">
              {getTokenLabel('stock', parsedSearch.tokens.stock)}
              <button
                onClick={() => handleRemoveToken('stock')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                aria-label="Remove stock filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {parsedSearch.tokens.warehouse && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 flex items-center gap-1">
              {getTokenLabel('warehouse', parsedSearch.tokens.warehouse)}
              <button
                onClick={() => handleRemoveToken('warehouse')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                aria-label="Remove warehouse filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {parsedSearch.tokens.category && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 flex items-center gap-1">
              {getTokenLabel('category', parsedSearch.tokens.category)}
              <button
                onClick={() => handleRemoveToken('category')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                aria-label="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {parsedSearch.tokens.location && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 flex items-center gap-1">
              {getTokenLabel('location', parsedSearch.tokens.location)}
              <button
                onClick={() => handleRemoveToken('location')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                aria-label="Remove location filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

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
              ) : !hasResults && !hasTokens ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  {parsedSearch.baseTerm.trim().length < 2 
                    ? 'Type at least 2 characters to search, or use filters like stock:low'
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
                            {result.matchedFields && result.matchedFields.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {result.matchedFields.map((field, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-[10px] px-1 py-0">
                                    {field}
                                  </Badge>
                                ))}
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
                            {result.matchedFields && result.matchedFields.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {result.matchedFields.map((field, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-[10px] px-1 py-0">
                                    {field}
                                  </Badge>
                                ))}
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
                            {result.matchedFields && result.matchedFields.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {result.matchedFields.map((field, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-[10px] px-1 py-0">
                                    {field}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Customers */}
                  {groupedResults.customers.length > 0 && (
                    <div className="mb-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                        Customers
                      </div>
                      {groupedResults.customers.map((result) => (
                        <button
                          key={`customer-${result.id}`}
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
                            {result.matchedFields && result.matchedFields.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {result.matchedFields.map((field, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-[10px] px-1 py-0">
                                    {field}
                                  </Badge>
                                ))}
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

