import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Package, Search, Filter, ChevronDown, ChevronUp, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useCategoryTree,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCategoryRealtime,
  useProductsByCategories
} from '@/hooks/useCategories';
import { useWarehouses } from '@/hooks/useWarehouses';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import type { CategoryTree, CategoryCreateData } from '@/types/categoryTypes';
import { flattenCategoryTree } from '@/lib/categories/categoryUtils';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';




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

      setTimeout(() => {
        setSessionReady(true);
      }, 0);
    } else if (currentUserId && !sessionReady) {
      setSessionReady(true);
    }
  }, [user?.id, authLoading, queryClient, sessionReady]);

  const authReady = !!user && !authLoading && sessionReady;

  /* ============================================================================
     SAFE DATA HOOKS (ALWAYS CALLED)
     ============================================================================ */

  const { tree, categories, isLoading: categoriesLoading } = useCategoryTree({
    enabled: authReady,
    queryKey: ['categoryTree', user?.id, branchId]
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const {
    data: categoryProducts = [],
    isLoading: productsLoading
  } = useProductsByCategories(selectedCategoryIds, {
    enabled: authReady && selectedCategoryIds.length > 0,
    queryKey: ['productsByCategories', user?.id, branchId, selectedCategoryIds]
  });

  const { data: warehouses = [] } = useWarehouses({
    enabled: authReady
  });

  useCategoryRealtime({
    enabled: authReady
  });

  /* ============================================================================
     FINAL CLIENT OWNERSHIP GUARD
     ============================================================================ */

  const safeProducts = useMemo(() => {
    if (!authReady || !user) return [];

    return categoryProducts.filter((p: any) => {
      if (p.user_id && p.user_id !== user.id) {
        console.error('[SECURITY] Cross-user product blocked:', p.id);
        return false;
      }
      if (branchId && p.branch_id && p.branch_id !== branchId) return false;
      return true;
    });
  }, [categoryProducts, user, branchId, authReady]);

  /* ============================================================================
     NORMAL UI STATE
     ============================================================================ */

  const allCategories = useMemo(() => flattenCategoryTree(tree), [tree]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const filteredProducts = useMemo(() => {
    let filtered = safeProducts;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((p: any) =>
        p.name?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.category_name?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [safeProducts, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ============================================================================
     BLOCK RENDER UNTIL SAFE (NO HOOKS BELOW)
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
      <Card>
        <CardContent className="p-3 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button onClick={() => navigate('/dashboard/products/new')}>
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div>
        </CardContent>
      </Card>

      {categoriesLoading || productsLoading ? (
        <div className="py-12 text-center">Loading…</div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No products found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs">Product</th>
                <th className="px-4 py-3 text-left text-xs">SKU</th>
                <th className="px-4 py-3 text-left text-xs">Category</th>
                <th className="px-4 py-3 text-left text-xs">Stock</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p: any) => (
                <tr key={p.id} onClick={() => navigate(`/dashboard/products/${p.id}`)}>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.sku || '—'}</td>
                  <td className="px-4 py-2">{p.category_name || '—'}</td>
                  <td className="px-4 py-2">{p.quantity_in_stock || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
