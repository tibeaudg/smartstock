import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Package, Search, Filter, ChevronDown, ChevronUp, X, Download, Upload, List, Grid, ChevronLeft, ChevronRight, Maximize2, Minimize2, Trash2, Edit, Loader2, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCategoryTree } from '@/hooks/useCategories';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import type { CategoryTree } from '@/types/categoryTypes';
import { flattenCategoryTree } from '@/lib/categories/categoryUtils';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

// Go to page input component
const GoToPageInput: React.FC<{ totalPages: number; onPageChange: (page: number) => void }> = ({ totalPages, onPageChange }) => {
  const [pageInput, setPageInput] = useState('');

  const handleGo = () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPageInput('');
    }
  };

  return (  
    <>
      <Input
        type="number"
        min={1}
        max={totalPages}
        className="w-16 h-8"
        value={pageInput}
        onChange={(e) => setPageInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleGo();
          }
        }}
        placeholder="Page"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleGo}
      >
        Go
      </Button>
    </>
  );
};

export default function CategorysPageSecured() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading: authLoading } = useAuth();
  const { activeBranch } = useBranches();

  const branchId = activeBranch?.branch_id ?? null;

  /* ============================================================================
     HARD SESSION ISOLATION
     ============================================================================ */
  const [sessionReady, setSessionReady] = useState(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const currentUserId = user?.id ?? null;

    if (lastUserIdRef.current !== currentUserId) {
      console.warn('[SECURITY] User changed → clearing cache');
      queryClient.clear();
      lastUserIdRef.current = currentUserId;
      setSessionReady(false);
      setTimeout(() => setSessionReady(true), 0);
    } else if (currentUserId && !sessionReady) {
      setSessionReady(true);
    }
  }, [user?.id, authLoading, queryClient, sessionReady]);

  const authReady = !!user && !authLoading && sessionReady;

  /* ============================================================================
     FIXED: Use a custom query to fetch products with branch filtering
     ============================================================================ */
  const { tree, categories, isLoading: categoriesLoading } = useCategoryTree();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  
  // Custom query for products with branch filtering
// Custom query for products with branch filtering
const { 
  data: productsData = [], 
  isLoading: productsLoading, 
  refetch: refetchProducts 
} = useQuery({
  queryKey: ['products', 'categoryProducts', branchId, selectedCategoryIds, user?.id],
  queryFn: async () => {
    if (!user || !branchId) return [];

    try {
      console.log('[Products Query] Fetching products for branch:', branchId, 'user:', user.id);
      
      // FIX: Use simpler select without complex joins, or fix the join syntax
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('user_id', user.id);

      // Apply branch filter - CRITICAL: Only show products for current branch
      query = query.eq('branch_id', branchId);

      // Apply category filter if specified
      if (selectedCategoryIds.length > 0) {
        query = query.in('category_id', selectedCategoryIds);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      console.log('[Products Query] Fetched:', data?.length || 0, 'products');
      return data || [];
    } catch (error) {
      console.error('Error in products query:', error);
      return [];
    }
  },
  enabled: !!user && !!branchId && authReady,
});

// Map products to ensure consistent structure
const categoryProductsData = useMemo(() => {
  return productsData.map((p: any) => ({
    ...p,
    id: p.id,
    name: p.name,
    sku: p.sku,
    // FIX: Access the category name properly
    category_name: p.categories?.[0]?.name || p.category_name || '—',
    category_id: p.category_id,
    quantity_in_stock: p.quantity_in_stock || 0,
    price: p.unit_price || p.sale_price || p.price || 0,
    cost_price: p.purchase_price || p.cost_price || 0,
    min_stock_level: p.minimum_stock_level || p.min_stock_level || 0,
    location: p.location || '—',
    status: p.status || 'active',
    description: p.description || '',
    image_url: p.image_url || null,
    // Variant fields
    is_variant: p.is_variant || false,
    parent_product_id: p.parent_product_id || null,
    variant_name: p.variant_name || null,
    variant_sku: p.variant_sku || null,
  }));
}, [productsData]);

  /* ============================================================================
     FINAL CLIENT OWNERSHIP GUARD
     ============================================================================ */
  const safeProducts = useMemo(() => {
    if (!authReady || !user) return [];
    return categoryProductsData.filter((p: any) => {
      // Double-check ownership
      if (p.user_id && p.user_id !== user.id) {
        console.error('[SECURITY] Cross-user product blocked:', p.id);
        return false;
      }
      // Ensure branch matches
      if (branchId && p.branch_id && p.branch_id !== branchId) {
        console.error('[SECURITY] Cross-branch product blocked:', p.id, p.branch_id, 'expected:', branchId);
        return false;
      }
      return true;
    });
  }, [categoryProductsData, user, branchId, authReady]);

  /* ============================================================================
     NORMAL UI STATE
     ============================================================================ */
  const allCategories = useMemo(() => flattenCategoryTree(tree), [tree]);
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all');
  const [filterStockStatus, setFilterStockStatus] = useState<string>('all');
  const [minStock, setMinStock] = useState<string>('');
  const [maxStock, setMaxStock] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Bulk Delete State
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteProgress, setBulkDeleteProgress] = useState(0);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // Fixed to 50 rows per page
  
  // Collapse/expand state for parent products with variants
  // collapsedParents contains parent IDs that are collapsed (variants hidden)
  // By default, all parents are expanded (empty set = all expanded)
  const [collapsedParents, setCollapsedParents] = useState<Set<string>>(new Set());

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterCategory !== 'all') count++;
    if (filterWarehouse !== 'all') count++;
    if (filterStockStatus !== 'all') count++;
    if (minStock || maxStock) count++;
    if (minPrice || maxPrice) count++;
    return count;
  }, [filterCategory, filterWarehouse, filterStockStatus, minStock, maxStock, minPrice, maxPrice]);

  const clearFilters = () => {
    setFilterCategory('all');
    setFilterWarehouse('all');
    setFilterStockStatus('all');
    setMinStock('');
    setMaxStock('');
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
  };

  // Create hierarchical product structure with variants grouped under parents
  const hierarchicalProducts = useMemo(() => {
    // Separate parents and variants
    // Parents: products that are not variants (is_variant is false or null, and no parent_product_id)
    const parents = safeProducts.filter((p: any) => !p.is_variant && !p.parent_product_id);
    // Variants: products that are marked as variants and have a parent_product_id
    const variants = safeProducts.filter((p: any) => p.is_variant && p.parent_product_id);
    
    // Group variants by parent
    const variantsByParent = new Map<string, any[]>();
    variants.forEach((variant: any) => {
      const parentId = variant.parent_product_id;
      if (!variantsByParent.has(parentId)) {
        variantsByParent.set(parentId, []);
      }
      variantsByParent.get(parentId)!.push(variant);
    });
    
    // Sort variants by variant_name
    variantsByParent.forEach((variantList) => {
      variantList.sort((a, b) => {
        const nameA = (a.variant_name || '').toLowerCase();
        const nameB = (b.variant_name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });
    
    // Create flat list: parent followed by its variants
    const result: any[] = [];
    parents.forEach((parent: any) => {
      const parentVariants = variantsByParent.get(parent.id) || [];
      const variantCount = parentVariants.length;
      result.push({ 
        ...parent, 
        isParent: true, 
        hasVariants: variantsByParent.has(parent.id),
        variantCount: variantCount
      });
      parentVariants.forEach((variant: any) => {
        result.push({ ...variant, isVariant: true, parentId: parent.id });
      });
    });
    
    return result;
  }, [safeProducts]);

  const filteredProducts = useMemo(() => {
    // First apply basic filters to the flat list
    let filtered = hierarchicalProducts;
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((p: any) => {
        const matchesParent = p.name?.toLowerCase().includes(term) ||
          p.sku?.toLowerCase().includes(term) ||
          p.category_name?.toLowerCase().includes(term);
        const matchesVariant = p.variant_name?.toLowerCase().includes(term) ||
          p.variant_sku?.toLowerCase().includes(term);
        return matchesParent || matchesVariant;
      });
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter((p: any) => p.category_id === filterCategory);
    }

    if (filterStockStatus !== 'all') {
      const stock = (p: any) => p.quantity_in_stock || 0;
      const minStockLevel = (p: any) => p.min_stock_level || 0;
      if (filterStockStatus === 'in-stock') {
        filtered = filtered.filter((p: any) => stock(p) > minStockLevel);
      } else if (filterStockStatus === 'low-stock') {
        filtered = filtered.filter((p: any) => stock(p) > 0 && stock(p) <= minStockLevel);
      } else if (filterStockStatus === 'out-of-stock') {
        filtered = filtered.filter((p: any) => stock(p) === 0);
      }
    }
    
    if (minStock) {
      const min = parseInt(minStock);
      if (!isNaN(min)) filtered = filtered.filter((p: any) => (p.quantity_in_stock || 0) >= min);
    }
    
    if (maxStock) {
      const max = parseInt(maxStock);
      if (!isNaN(max)) filtered = filtered.filter((p: any) => (p.quantity_in_stock || 0) <= max);
    }
    
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) filtered = filtered.filter((p: any) => (p.price || 0) >= min);
    }
    
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) filtered = filtered.filter((p: any) => (p.price || 0) <= max);
    }
    
    // Rebuild hierarchy from filtered results
    const parents = filtered.filter((p: any) => p.isParent);
    const variants = filtered.filter((p: any) => p.isVariant);
    const variantsByParent = new Map<string, any[]>();
    
    variants.forEach((variant: any) => {
      const parentId = variant.parentId;
      if (parentId && filtered.some((p: any) => p.id === parentId)) {
        if (!variantsByParent.has(parentId)) {
          variantsByParent.set(parentId, []);
        }
        variantsByParent.get(parentId)!.push(variant);
      }
    });
    
    // Sort variants
    variantsByParent.forEach((variantList) => {
      variantList.sort((a, b) => {
        const nameA = (a.variant_name || '').toLowerCase();
        const nameB = (b.variant_name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });
    
    // Create final hierarchical list
    const result: any[] = [];
    parents.forEach((parent: any) => {
      result.push(parent);
      const parentVariants = variantsByParent.get(parent.id) || [];
      parentVariants.forEach((variant: any) => {
        result.push(variant);
      });
    });
    
    return result;
  }, [hierarchicalProducts, searchTerm, filterCategory, filterWarehouse, filterStockStatus, minStock, maxStock, minPrice, maxPrice]);

  // Apply collapse/expand filter to hide variants of collapsed parents
  // collapsedParents contains parent IDs that are collapsed (variants hidden)
  // By default, all parents are expanded (empty set = all variants shown)
  const productsWithCollapseFilter = useMemo(() => {
    return filteredProducts.filter((p: any) => {
      // Always show parent products
      if (p.isParent) return true;
      // For variants, hide if parent is in collapsedParents
      if (p.isVariant) {
        const parentId = p.parentId;
        return !collapsedParents.has(parentId); // Show if parent is NOT collapsed
      }
      return true;
    });
  }, [filteredProducts, collapsedParents]);

  const totalPages = Math.max(1, Math.ceil(productsWithCollapseFilter.length / itemsPerPage));
  const paginatedProducts = productsWithCollapseFilter.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedProductIds(new Set());
      setIsSelectAll(false);
    } else {
      const allIds = new Set(paginatedProducts.map((p: any) => p.id));
      setSelectedProductIds(allIds);
      setIsSelectAll(true);
    }
  };

  const clearSelection = () => {
    setSelectedProductIds(new Set());
    setIsSelectAll(false);
  };

  // Toggle collapse/expand for parent products
  const toggleParentExpansion = (parentId: string) => {
    setCollapsedParents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId); // Expand: remove from collapsed set
      } else {
        newSet.add(parentId); // Collapse: add to collapsed set
      }
      return newSet;
    });
  };

  // Helper function to get stock status
  const getStockStatus = (quantity: number | string | null | undefined, minLevel: number | string | null | undefined) => {
    // Convert to numbers, handling null, undefined, and string values
    const qty = Number(quantity) || 0;
    const min = Number(minLevel) || 0;
    
    // Out of stock: quantity is 0
    if (qty === 0) {
      return { label: 'Out', variant: 'destructive' as const, color: 'bg-red-100 text-red-800 border-red-200' };
    }
    
    // Low stock: quantity is greater than 0 but less than minimum level
    // Only check for low stock if minimum level is greater than 0
    if (min > 0 && qty < min) {
      return { label: 'Low', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
    
    // In stock: quantity is greater than or equal to minimum level
    return { label: 'In Stock', variant: 'default' as const, color: 'bg-green-100 text-green-800 border-green-200' };
  };

  useEffect(() => {
    const allSelected = paginatedProducts.length > 0 && 
      paginatedProducts.every((p: any) => selectedProductIds.has(p.id));
    setIsSelectAll(allSelected);
  }, [selectedProductIds, paginatedProducts]);




  
  /* ============================================================================
     FIXED BULK DELETE WITH REAL-TIME VERIFICATION
     ============================================================================ */
  const handleBulkDelete = async () => {
    if (selectedProductIds.size === 0 || !user || !branchId) {
      toast.error('No products selected or missing branch information');
      return;
    }
  
    setShowBulkDeleteDialog(true);
  };
  
  const executeBulkDelete = async () => {
    if (!user || !branchId) return;
  
    setIsBulkDeleting(true);
    setBulkDeleteProgress(0);
    
    const productIdsArray = Array.from(selectedProductIds);
    const totalProducts = productIdsArray.length;
    
    console.log('[Bulk Delete] Starting bulk delete for:', {
      count: totalProducts,
      branchId,
      userId: user.id
    });
  
    let successfulDeletions = 0;
    let failedDeletions: Array<{ id: string; error: any }> = [];
  
    try {
      // VERIFICATION STEP: Get current products to confirm they exist
      const { data: currentProducts, error: fetchError } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIdsArray)
        .eq('user_id', user.id)
        .eq('branch_id', branchId);
  
      if (fetchError) {
        toast.error('Failed to verify products');
        console.error('Fetch error:', fetchError);
        setIsBulkDeleting(false);
        setBulkDeleteProgress(0);
        setShowBulkDeleteDialog(false);
        return;
      }
  
      if (!currentProducts || currentProducts.length === 0) {
        toast.error('No products found to delete');
        setIsBulkDeleting(false);
        setBulkDeleteProgress(0);
        setShowBulkDeleteDialog(false);
        return;
      }
  
      const existingProductIds = (currentProducts as Array<{ id: string; name: string }>).map(p => p.id);
      console.log('[Bulk Delete] Products to delete:', existingProductIds.length, 'of', productIdsArray.length);
  
      // Try batch delete first (more efficient)
      console.log('[Bulk Delete] Attempting batch delete...');
      const { data: batchDeletedData, error: batchError } = await supabase
        .from('products')
        .delete()
        .in('id', existingProductIds)
        .eq('branch_id', branchId)
        .select('id');
      
      if (!batchError && batchDeletedData && batchDeletedData.length > 0) {
        // Batch delete succeeded
        successfulDeletions = batchDeletedData.length;
        console.log(`[Bulk Delete] Batch delete succeeded: ${successfulDeletions} products deleted`);
        
        // Check if all products were deleted
        if (batchDeletedData.length < existingProductIds.length) {
          const deletedIds = new Set(batchDeletedData.map((p: any) => p.id));
          const failedIds = existingProductIds.filter(id => !deletedIds.has(id));
          console.warn(`[Bulk Delete] Batch delete partial: ${failedIds.length} products not deleted`);
          failedIds.forEach(id => {
            failedDeletions.push({
              id,
              error: { message: 'Not deleted in batch operation' }
            });
          });
        }
      } else {
        // Batch delete failed or didn't delete all - fall back to individual deletes
        console.log('[Bulk Delete] Batch delete failed or incomplete, falling back to individual deletes...');
        if (batchError) {
          console.error('[Bulk Delete] Batch delete error:', batchError);
        }
        
        // Delete products one at a time with progress tracking
        for (let i = 0; i < existingProductIds.length; i++) {
        const productId = existingProductIds[i];
        
        try {
          console.log(`[Bulk Delete] Deleting product ${productId}...`);
          
          // Match the pattern from ProductDetailPage - only filter by id and branch_id
          // RLS policy will automatically enforce user_id check via auth.uid()
          const { data: deletedData, error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', productId)
            .eq('branch_id', branchId)
            .select('id'); // Select id to verify deletion
  
          if (deleteError) {
            console.error(`[Bulk Delete] Failed to delete ${productId}:`, deleteError);
            console.error(`[Bulk Delete] Error details:`, JSON.stringify(deleteError, null, 2));
            failedDeletions.push({
              id: productId,
              error: deleteError
            });
          } else if (!deletedData || deletedData.length === 0) {
            // No error but no data returned - deletion didn't happen
            // This could be RLS policy, or product doesn't exist, or doesn't match branch_id
            console.warn(`[Bulk Delete] No rows deleted for ${productId}`);
            console.warn(`[Bulk Delete] Product ID: ${productId}, Branch ID: ${branchId}, User ID: ${user.id}`);
            
            // Try to fetch the product to see what's wrong
            const { data: productCheck, error: checkError } = await supabase
              .from('products')
              .select('id, user_id, branch_id')
              .eq('id', productId)
              .single();
            
            if (checkError) {
              console.warn(`[Bulk Delete] Product ${productId} not found:`, checkError);
            } else if (productCheck) {
              const product = productCheck as { id: string; user_id: string; branch_id: string };
              console.warn(`[Bulk Delete] Product exists but deletion failed:`, product);
              console.warn(`[Bulk Delete] Expected user_id: ${user.id}, actual: ${product.user_id}`);
              console.warn(`[Bulk Delete] Expected branch_id: ${branchId}, actual: ${product.branch_id}`);
            }
            
            failedDeletions.push({
              id: productId,
              error: { 
                message: 'No rows deleted - possible RLS policy issue or mismatch',
                details: productCheck || 'Product not found'
              }
            });
          } else {
            successfulDeletions++;
            console.log(`[Bulk Delete] Successfully deleted ${productId}`, deletedData);
          }
        } catch (err) {
          console.error(`[Bulk Delete] Error deleting ${productId}:`, err);
          failedDeletions.push({
            id: productId,
            error: err
          });
        }
  
        // Update progress
        setBulkDeleteProgress(Math.round(((i + 1) / existingProductIds.length) * 100));
        
        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
  
      // Small delay to ensure database consistency after deletions
      if (successfulDeletions > 0) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Verify deletions actually happened by checking remaining products
      if (successfulDeletions > 0) {
        console.log('[Bulk Delete] Verifying deletions...');
        const { data: remainingProducts, error: verifyError } = await supabase
          .from('products')
          .select('id')
          .in('id', existingProductIds)
          .eq('user_id', user.id)
          .eq('branch_id', branchId);
        
        if (!verifyError && remainingProducts && remainingProducts.length > 0) {
          console.warn(`[Bulk Delete] Warning: ${remainingProducts.length} products still exist after deletion`);
          const remainingIds = (remainingProducts as Array<{ id: string }>).map(p => p.id);
          console.warn('[Bulk Delete] Remaining product IDs:', remainingIds);
          // Update failed deletions to reflect reality
          remainingIds.forEach(id => {
            if (!failedDeletions.some(f => f.id === id)) {
              failedDeletions.push({
                id,
                error: { message: 'Product still exists after deletion attempt' }
              });
            }
          });
          // Adjust successful count
          successfulDeletions -= remainingProducts.length;
        } else {
          console.log('[Bulk Delete] Verification: All products successfully deleted');
        }
      }

      // Update the cache optimistically - remove successfully deleted products
      const currentQueryKey = ['products', 'categoryProducts', branchId, selectedCategoryIds, user.id];
      const successfullyDeletedIds = existingProductIds.filter(id => 
        !failedDeletions.some(f => f.id === id)
      );
      
      if (successfullyDeletedIds.length > 0) {
        queryClient.setQueryData(
          currentQueryKey,
          (oldData: any[] = []) => {
            const deletedIdsSet = new Set(successfullyDeletedIds);
            const filtered = oldData.filter((p: any) => !deletedIdsSet.has(p.id));
            console.log(`[Bulk Delete] Cache updated: ${oldData.length} -> ${filtered.length} products`);
            return filtered;
          }
        );
      }
  
      // Cancel any pending queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['products'] });
      
      // Invalidate and refetch the main query to get fresh data
      // Use exact match to avoid invalidating unrelated queries
      await queryClient.invalidateQueries({ 
        queryKey: currentQueryKey,
        exact: true,
        refetchType: 'active'
      });
      
      // Force a refetch to ensure we have the latest data from the database
      try {
        const refetchResult = await refetchProducts();
        console.log('[Bulk Delete] Refetch completed, products count:', refetchResult.data?.length || 0);
      } catch (refetchError) {
        console.error('[Bulk Delete] Error during refetch:', refetchError);
      }
  
      // Invalidate related queries but don't refetch immediately
      queryClient.invalidateQueries({ 
        queryKey: ['products'],
        refetchType: 'none'
      });
  
      // Show results
      if (successfulDeletions > 0) {
        toast.success(`Successfully deleted ${successfulDeletions} product(s)`);
      }
      
      if (failedDeletions.length > 0) {
        toast.warning(`${failedDeletions.length} product(s) failed to delete. Check console for details.`);
        console.error('Failed deletions:', failedDeletions);
      }
  
      clearSelection();
      
      // Reset to first page if current page becomes empty
      if (paginatedProducts.length === successfulDeletions && currentPage > 1) {
        setCurrentPage(1);
      }
  
    } catch (error) {
      console.error('[Bulk Delete] Critical error:', error);
      toast.error('Failed to delete products');
    } finally {
      setIsBulkDeleting(false);
      setBulkDeleteProgress(0);
      setShowBulkDeleteDialog(false);
    }
  }; // END OF executeBulkDelete FUNCTION

  /* ============================================================================
     Export/Import Functions
     ============================================================================ */
  const exportToCSV = () => {
    try {
      const headers = ['ID', 'Name', 'SKU', 'Category', 'Stock', 'Price', 'Cost',  'Description'];
      const csvRows = [headers.join(',')];

      filteredProducts.forEach((p: any) => {
        const row = [
          p.id || '',
          `"${(p.name || '').replace(/"/g, '""')}"`,
          p.sku || '',
          `"${(p.category_name || '').replace(/"/g, '""')}"`,
          p.quantity_in_stock || 0,
          p.price || 0,
          p.cost_price || 0,
          `"${(p.warehouse_name || '').replace(/"/g, '""')}"`,
          `"${((p.description || '').replace(/"/g, '""')).replace(/\n/g, ' ')}"`
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const dateStr = new Date().toISOString().split('T')[0];
      
      link.setAttribute('href', url);
      link.setAttribute('download', `products-export-${dateStr}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast.success(`Exported ${filteredProducts.length} products`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export products');
    }
  };

  const handleImportFile = async () => {
    if (!importFile || !user) {
      toast.error('Please select a file');
      return;
    }

    setImporting(true);
    try {
      const text = await importFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('CSV file must have at least a header row and one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name'));
      const skuIndex = headers.findIndex(h => h.toLowerCase() === 'sku');
      
      if (nameIndex === -1) {
        toast.error('CSV must contain a "Name" column');
        return;
      }

      let imported = 0;
      let errors = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const name = values[nameIndex];
        const sku = skuIndex >= 0 ? values[skuIndex] : null;

        if (!name) continue;

        try {
          const productData: any = {
            name,
            sku: sku || undefined,
            user_id: user.id,
            branch_id: branchId || undefined,
          };

          const categoryIndex = headers.findIndex(h => h.toLowerCase().includes('category'));
          const stockIndex = headers.findIndex(h => h.toLowerCase().includes('stock') || h.toLowerCase().includes('quantity'));
          const priceIndex = headers.findIndex(h => h.toLowerCase() === 'price');

          if (categoryIndex >= 0 && values[categoryIndex]) {
            const categoryName = values[categoryIndex];
            const category = allCategories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
            if (category) {
              productData.category_id = category.id;
            }
          }

          if (stockIndex >= 0 && values[stockIndex]) {
            productData.quantity_in_stock = parseInt(values[stockIndex]) || 0;
          }

          if (priceIndex >= 0 && values[priceIndex]) {
            productData.price = parseFloat(values[priceIndex]) || 0;
          }

          const { error } = await supabase
            .from('products')
            .insert(productData);

          if (error) {
            console.error('Error importing product:', error);
            errors++;
          } else {
            imported++;
          }
        } catch (err) {
          console.error('Error processing row:', err);
          errors++;
        }
      }

      queryClient.invalidateQueries({ queryKey: ['products', 'categoryProducts', branchId, selectedCategoryIds, user?.id] });
      toast.success(`Imported ${imported} products${errors > 0 ? `, ${errors} errors` : ''}`);
      setShowImportDialog(false);
      setImportFile(null);
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast.error('Failed to import products');
    } finally {
      setImporting(false);
    }
  };

  /* ============================================================================
     BLOCK RENDER UNTIL SAFE
     ============================================================================ */
  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Initializing secure session…</p>
        </div>
      </div>
    );
  }

  /* ============================================================================
     RENDER
     ============================================================================ */
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header with Title and Actions */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your products, track inventory, and manage your product catalog
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === 'compact' ? 'expanded' : 'compact')}
          >
            {viewMode === 'compact' ? (
              <>
                <Maximize2 className="w-4 h-4 mr-2" />
                Expanded
              </>
            ) : (
              <>
                <Minimize2 className="w-4 h-4 mr-2" />
                Compact
              </>
            )}
          </Button>

          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>

          <Button onClick={() => navigate('/dashboard/products/new')} className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

          {/* Bulk Actions Toolbar */}
          {selectedProductIds.size > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedProductIds.size} product(s) selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  className="h-8"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={isBulkDeleting}
                >
                  {isBulkDeleting ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3 mr-1" />
                  )}
                  {isBulkDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <CollapsibleContent>
              <div className="pt-3 border-t space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Category</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {allCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>



                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Stock Status</Label>
                    <Select value={filterStockStatus} onValueChange={setFilterStockStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Stock Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minStock}
                        onChange={e => setMinStock(e.target.value)}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxStock}
                        onChange={e => setMaxStock(e.target.value)}
                        className="w-20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Price Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        step="0.01"
                        className="w-24"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        step="0.01"
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

      {categoriesLoading || productsLoading ? (
        <div className="py-12 text-center">Loading…</div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No products found</p>
            {activeFiltersCount > 0 && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                <tr>
                  <th className={cn("text-left w-12", viewMode === 'compact' ? "px-2 py-2" : "px-4 py-2")}>
                    <Checkbox
                      checked={isSelectAll}
                      onCheckedChange={toggleSelectAll}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </th>
                  {viewMode === 'expanded' && (
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Image</th>
                  )}
                  <th className={cn("text-left text-xs font-medium text-gray-500 uppercase tracking-wider", viewMode === 'compact' ? "px-2 py-2" : "px-4 py-2")}>Product</th>
                  <th className={cn("text-left text-xs font-medium text-gray-500 uppercase tracking-wider", viewMode === 'compact' ? "px-2 py-2" : "px-4 py-2")}>SKU</th>
                  <th className={cn("text-left text-xs font-medium text-gray-500 uppercase tracking-wider", viewMode === 'compact' ? "px-2 py-2" : "px-4 py-2")}>Category</th>
                  <th className={cn("text-left text-xs font-medium text-gray-500 uppercase tracking-wider", viewMode === 'compact' ? "px-2 py-2" : "px-4 py-2")}>Stock</th>
                  {viewMode === 'expanded' && (
                    <>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.map((p: any, index: number) => {
                  const isSelected = selectedProductIds.has(p.id);
                  const isVariant = p.isVariant || false;
                  const isParent = p.isParent || false;
                  // For alternating colors, only count parent rows
                  const parentIndex = paginatedProducts.slice(0, index).filter((item: any) => !item.isVariant).length;
                  const isEven = parentIndex % 2 === 0;
                  
                  return (
                    <tr 
                      key={p.id}
                      className={cn(
                        "border-b transition-colors",
                        isSelected && "bg-blue-50",
                        !isSelected && isVariant && isEven && "bg-gray-50",
                        !isSelected && isVariant && !isEven && "bg-gray-100",
                        !isSelected && !isVariant && isEven && "bg-white",
                        !isSelected && !isVariant && !isEven && "bg-gray-50",
                        !isSelected && "hover:bg-gray-100",
                        viewMode === 'expanded' && "cursor-pointer",
                        isVariant && "border-l-4 border-l-blue-300"
                      )}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;
                        navigate(`/dashboard/products/${p.id}`);
                      }}
                    >
                      <td className={cn(viewMode === 'compact' ? "px-2 py-1.5" : "px-4 py-4")} onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleProductSelection(p.id)}
                        />
                      </td>
                      {viewMode === 'expanded' && (
                        <td className="px-4 py-4">
                          {!isVariant && (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative">
                              {p.image_url ? (
                                <img 
                                  src={p.image_url} 
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    img.style.display = 'none';
                                    const placeholder = img.nextElementSibling as HTMLElement;
                                    if (placeholder) placeholder.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="absolute inset-0 flex items-center justify-center" style={{ display: p.image_url ? 'none' : 'flex' }}>
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            </div>
                          )}
                        </td>
                      )}
                      <td className={cn(viewMode === 'compact' ? "px-2 py-1.5" : "px-4 py-4")}>
                        <div className={cn(
                          "flex items-center gap-2",
                          isVariant && "pl-6"
                        )}>
                          {isParent && p.hasVariants && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleParentExpansion(p.id);
                              }}
                              title={collapsedParents.has(p.id) ? "Expand variants" : "Collapse variants"}
                            >
                              {collapsedParents.has(p.id) ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronUp className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                          {!isParent && isVariant && (
                            <span className="text-gray-400 text-xs w-5">└─</span>
                          )}
                          {!isParent && !isVariant && (
                            <span className="w-5"></span>
                          )}
                          <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1">
                              <div className={cn("font-medium", viewMode === 'compact' ? "text-xs" : "text-sm")}>
                                {isVariant ? (
                                  <span className="text-gray-600">
                                    {p.variant_name || p.name}
                                  </span>
                                ) : (
                                  p.name
                                )}
                              </div>
                              {viewMode === 'expanded' && p.description && !isVariant && (
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-md">
                                  {p.description}
                                </div>
                              )}
                            </div>
                            {isParent && p.hasVariants && p.variantCount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {p.variantCount} {p.variantCount === 1 ? 'variant' : 'variants'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={cn(viewMode === 'compact' ? "px-2 py-1.5 text-xs text-gray-600" : "px-4 py-4 text-sm")}>
                        {isVariant ? (p.variant_sku || p.sku || '—') : (p.sku || '—')}
                      </td>
                      <td className={cn(viewMode === 'compact' ? "px-2 py-1.5 text-xs" : "px-4 py-4 text-sm")}>
                        <div className={cn(viewMode === 'expanded' && "max-w-xs truncate")}>
                          {p.category_name || '—'}
                        </div>
                      </td>
                      <td className={cn(viewMode === 'compact' ? "px-2 py-1.5 text-xs" : "px-4 py-4 text-sm")}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "font-medium",
                            (p.quantity_in_stock || 0) === 0 && "text-red-600",
                            (p.quantity_in_stock || 0) > 0 && (p.quantity_in_stock || 0) <= (p.min_stock_level || 0) && "text-yellow-600 bg-yellow-100"
                          )}
                          style={{
                            backgroundColor: (p.quantity_in_stock || 0) > 0 && (p.quantity_in_stock || 0) <= (p.min_stock_level || 0) ? 'bg-yellow-300' : 'bg-transparent'
                          }}
                        >
                            {p.quantity_in_stock || 0}
                          </span>
                          {(() => {
                            const qty = Number(p.quantity_in_stock) || 0;
                            const min = Number(p.min_stock_level) || 0;
                            const stockStatus = getStockStatus(qty, min);
                            return (
                              <Badge 
                                className={cn(
                                  "text-xs px-1.5 py-0.5 font-medium rounded-full border",
                                  stockStatus.color
                                )}
                              >
                                {stockStatus.label}
                              </Badge>
                            );
                          })()}
                        </div>
                        {viewMode === 'expanded' && p.min_stock_level !== undefined && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            Min: {p.min_stock_level || 0}
                          </div>
                        )}
                      </td>
                      {viewMode === 'expanded' && (
                        <>
                          <td className="px-4 py-4 text-sm">
                            {p.price ? `$${parseFloat(p.price).toFixed(2)}` : '—'}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {p.cost_price ? `$${parseFloat(p.cost_price).toFixed(2)}` : '—'}
                          </td>
                        
                          <td className="px-4 py-4 text-sm">
                            {p.location || '—'}
                          </td>
                          <td className="px-4 py-4">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              p.status === 'active' && "bg-green-100 text-green-800",
                              p.status === 'inactive' && "bg-gray-100 text-gray-800",
                              p.status === 'discontinued' && "bg-red-100 text-red-800",
                              !p.status && "bg-gray-100 text-gray-800"
                            )}>
                              {p.status || 'active'}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          {productsWithCollapseFilter.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Showing per page</span>
                <Select value={itemsPerPage.toString()} onValueChange={(v) => {
                  setCurrentPage(1);
                  // Note: itemsPerPage is fixed to 50 in this component, but we'll add the UI for consistency
                }}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">Show 50</SelectItem>
                    <SelectItem value="25">Show 25</SelectItem>
                    <SelectItem value="100">Show 100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, productsWithCollapseFilter.length)} of {productsWithCollapseFilter.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </Button>
                
                <div className="flex items-center gap-1">
                  {totalPages <= 5 ? (
                    // Show all pages if 5 or fewer
                    Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))
                  ) : currentPage <= 3 ? (
                    // Show first 5 pages when near start
                    <>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <span className="px-2">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  ) : currentPage >= totalPages - 2 ? (
                    // Show last 5 pages when near end
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </Button>
                      <span className="px-2">...</span>
                      {Array.from({ length: 5 }, (_, i) => {
                        const pageNum = totalPages - 4 + i;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </>
                  ) : (
                    // Show pages around current page when in middle
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </Button>
                      <span className="px-2">...</span>
                      {Array.from({ length: 5 }, (_, i) => {
                        const pageNum = currentPage - 2 + i;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      <span className="px-2">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Go to page</span>
                <GoToPageInput
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedProductIds.size} product(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {isBulkDeleting && (
            <div className="space-y-2">
              <Progress value={bulkDeleteProgress} className="h-2" />
              <p className="text-sm text-center text-gray-600">
                Deleting... {bulkDeleteProgress}%
              </p>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeBulkDelete}
              disabled={isBulkDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isBulkDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Products from CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>CSV File</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                CSV should include columns: Name, SKU (optional), Category (optional), Stock (optional), Price (optional)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowImportDialog(false);
              setImportFile(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleImportFile} disabled={!importFile || importing}>
              {importing ? 'Importing...' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}