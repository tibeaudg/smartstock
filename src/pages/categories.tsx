/**
 * Categories Management Page
 * Revamped with hierarchical categories, dual view modes, and enhanced features
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCategoryTree, useCreateCategory, useUpdateCategory, useDeleteCategory, useCategoryRealtime, useProductsByCategories } from '@/hooks/useCategories';
import { CategoryFacetFilter } from '@/components/categories/CategoryFacetFilter';
import { CategoryCustomizationModal } from '@/components/categories/CategoryCustomizationModal';
import { HierarchicalCategorySelector } from '@/components/categories/HierarchicalCategorySelector';
import { MultiIntentSearch } from '@/components/categories/MultiIntentSearch';
import { ProductCard } from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Grid3x3, Table2, Edit, Trash2, Copy, MapPin, MoreVertical, ChevronRight, ChevronDown, Palette, ArrowUpDown, ArrowUp, ArrowDown, Scan, Filter, Search, X, Settings, Minimize2, Check, Printer, Truck, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import type { CategoryTree, CategoryCreateData } from '@/types/categoryTypes';
import { getCategoryPath, getCategoryIdsIncludingDescendants, flattenCategoryTree } from '@/lib/categories/categoryUtils';
import { cn } from '@/lib/utils';
import { EditProductInfoModal } from '@/components/EditProductInfoModal';
import { EditProductStockModal } from '@/components/EditProductStockModal';
import { ManualStockAdjustModal } from '@/components/ManualStockAdjustModal';
import { ImagePreviewModal } from '@/components/ImagePreviewModal';
import { AddProductModal } from '@/components/AddProductModal';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useScannerSettings } from '@/hooks/useScannerSettings';

export default function CategorysPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTree | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  // Filter sidebar collapse state - default to collapsed
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  // Default to table view on both mobile and desktop
  const [productViewMode, setProductViewMode] = useState<'grid' | 'list' | 'table'>(() => {
    if (typeof window !== 'undefined') {
      return 'table';
    }
    return 'table';
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sorting state - default to date_added descending (newest first)
  const [sortColumn, setSortColumn] = useState<string | null>('date_added');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Compact mode state - default to true
  const [compactMode, setCompactMode] = useState(true);
  
  // Row selection state
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  
  // Hover state for row actions
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  
  // Product modal states
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isMobileProductDetailModalOpen, setIsMobileProductDetailModalOpen] = useState(false);
  
  // Add product modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [scannedSKU, setScannedSKU] = useState<string>('');
  const [preFilledProductName, setPreFilledProductName] = useState<string>('');
  
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategoryId: null as string | null,
  });

  // Subcategory form state (requires parent)
  const [subCategoryFormData, setSubCategoryFormData] = useState({
    name: '',
    description: '',
    parentCategoryId: null as string | null,
  });

  // Hooks
  const { tree, categories, isLoading } = useCategoryTree();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const { data: categoryProducts = [], isLoading: productsLoading } = useProductsByCategories(selectedCategoryIds);
  const queryClient = useQueryClient();
  useCategoryRealtime();
  
  // Get product counts for categories
  const { data: productCounts } = useQuery({
    queryKey: ['categoryProductCounts', user?.id, activeBranch?.branch_id],
    queryFn: async () => {
      if (!user) return new Map<string, number>();
      const { getCategoryProductCounts } = await import('@/lib/categories/categoryService');
      return getCategoryProductCounts(user.id, activeBranch?.branch_id);
    },
    enabled: !!user && categories.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Removed filterCategoryTree and filteredTree - no longer needed with facet filter approach

  // Filter products based on search
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm.trim()) return categoryProducts;

    const term = searchTerm.toLowerCase();
    return categoryProducts.filter((product: any) => {
      return (
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term) ||
        product.location?.toLowerCase().includes(term) ||
        product.category_name?.toLowerCase().includes(term)
      );
    });
  }, [categoryProducts, searchTerm]);

  // Use filtered products for sorting
  const sortedProducts = React.useMemo(() => {
    const productsToSort = searchTerm.trim() ? filteredProducts : categoryProducts;
    if (!sortColumn) return productsToSort;

    return [...productsToSort].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'sku':
          aValue = (a.sku || '').toLowerCase();
          bValue = (b.sku || '').toLowerCase();
          break;
        case 'location':
          aValue = (a.location || '').toLowerCase();
          bValue = (b.location || '').toLowerCase();
          break;
        case 'stock':
          aValue = Number(a.quantity_in_stock) || 0;
          bValue = Number(b.quantity_in_stock) || 0;
          break;
        case 'date_added':
          aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
          bValue = b.created_at ? new Date(b.created_at).getTime() : 0;
          break;
        case 'purchase_price':
          aValue = Number(a.purchase_price) || 0;
          bValue = Number(b.purchase_price) || 0;
          break;
        case 'sale_price':
          aValue = Number(a.sale_price) || 0;
          bValue = Number(b.sale_price) || 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        if (sortDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
    });
  }, [filteredProducts, categoryProducts, searchTerm, sortColumn, sortDirection]);

  // Detect repetitive locations (appearing in >70% of rows)
  const repetitiveLocations = React.useMemo(() => {
    if (sortedProducts.length === 0) return new Set<string>();
    
    const locationCounts = new Map<string, number>();
    sortedProducts.forEach((product: any) => {
      const location = product.location || '';
      locationCounts.set(location, (locationCounts.get(location) || 0) + 1);
    });
    
    const threshold = sortedProducts.length * 0.7;
    const repetitive = new Set<string>();
    
    locationCounts.forEach((count, location) => {
      if (count > threshold) {
        repetitive.add(location);
      }
    });
    
    return repetitive;
  }, [sortedProducts]);

  // Helper function to get price color
  const getPriceColor = (value: number | null | undefined, positiveColor: string): string => {
    if (value === null || value === undefined || Number(value) === 0) {
      return 'text-gray-400';
    }
    if (Number(value) < 0) {
      return 'text-red-600';
    }
    return positiveColor;
  };

  const handleAddSubCategory = async () => {
    if (!subCategoryFormData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!subCategoryFormData.parentCategoryId) {
      toast.error('Parent category is required for subcategories');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to add categories');
      return;
    }

    try {
      const categoryData: CategoryCreateData = {
        name: subCategoryFormData.name.trim(),
        description: subCategoryFormData.description.trim() || null,
        parent_category_id: subCategoryFormData.parentCategoryId,
      };

      await createCategory.mutateAsync(categoryData);
      toast.success('Subcategory added successfully!');
      setShowAddSubCategoryModal(false);
      setSubCategoryFormData({ name: '', description: '', parentCategoryId: null });
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await updateCategory.mutateAsync({
        categoryId: selectedCategory.id,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          parent_category_id: formData.parentCategoryId,
        },
      });
      toast.success('Category updated successfully!');
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '', parentCategoryId: null });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory.mutateAsync(selectedCategory.id);
      toast.success('Category deleted successfully!');
      setShowDeleteDialog(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const openEditModal = (category: CategoryTree) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentCategoryId: category.parent_category_id,
    });
    setShowEditModal(true);
  };

  const openDeleteDialog = (category: CategoryTree) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const openCustomizationModal = (category: CategoryTree) => {
    setSelectedCategory(category);
    setShowCustomizationModal(true);
  };

  // Removed handleCategoryClick, handleToggleExpand, handleExpandAll, handleCollapseAll, handleBreadcrumbClick
  // These are no longer needed with the facet filter approach

  const handleAddCategory = () => {
    setFormData({ name: '', description: '', parentCategoryId: null });
    setShowAddModal(true);
  };

  const handleSubmitCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to add categories');
      return;
    }

    try {
      const categoryData: CategoryCreateData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        parent_category_id: formData.parentCategoryId || null,
      };

      await createCategory.mutateAsync(categoryData);
      toast.success('Category added successfully!');
      setShowAddModal(false);
      setFormData({ name: '', description: '', parentCategoryId: null });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddSubcategory = () => {
    // If only one category is selected, use it as parent
    if (selectedCategoryIds.length === 1) {
      setSubCategoryFormData({ name: '', description: '', parentCategoryId: selectedCategoryIds[0] });
      setShowAddSubCategoryModal(true);
    } else {
      // Otherwise, show modal without pre-selected parent
      setSubCategoryFormData({ name: '', description: '', parentCategoryId: null });
      setShowAddSubCategoryModal(true);
    }
  };

  // Category selection change handler
  const handleCategorySelectionChange = (categoryIds: string[]) => {
    setSelectedCategoryIds(categoryIds);
  };


  const handleFavoriteToggle = async (productId: string, isFavorite: boolean) => {
    if (!user || !activeBranch) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_favorite: isFavorite })
        .eq('id', productId)
        .eq('branch_id', activeBranch.branch_id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    }
  };

  const handleStockAction = (product: any, action: 'in' | 'out') => {
    setSelectedProduct(product);
    setIsStockAdjustModalOpen(true);
  };

  const handleProductEdit = (product: any) => {
    setSelectedProduct(product);
    setIsEditInfoModalOpen(true);
  };

  const handleImagePreview = (url: string) => {
    setPreviewImageUrl(url);
    setIsImagePreviewOpen(true);
  };

  const handleMobileRowClick = (product: any) => {
    if (isMobile) {
      setSelectedProduct(product);
      setIsMobileProductDetailModalOpen(true);
    }
  };

  // Handler for row click to toggle selection
  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, product: any) => {
    // Check if click target is an interactive element
    const target = e.target as HTMLElement;
    const isInteractive = 
      target.closest('button') ||
      target.closest('input') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('[data-interactive]') ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'A';

    // If mobile, use existing mobile behavior
    if (isMobile) {
      if (!isInteractive) {
        handleMobileRowClick(product);
      }
      return;
    }

    // On desktop, toggle selection if not clicking on interactive element
    if (!isInteractive) {
      const newSet = new Set(selectedProductIds);
      if (newSet.has(product.id)) {
        newSet.delete(product.id);
      } else {
        newSet.add(product.id);
      }
      setSelectedProductIds(newSet);
    }
  };

  const handleDuplicateProduct = async (product: any) => {
    if (!activeBranch) return;

    try {
      const { id, created_at, updated_at, ...productData } = product;
      
      const duplicatedProduct: any = {
        ...productData,
        name: `${product.name} (Copy)`,
        branch_id: activeBranch.branch_id,
      };

      const { error } = await supabase
        .from('products')
        .insert(duplicatedProduct);

      if (error) throw error;

      toast.success('Product duplicated successfully');
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Failed to duplicate product');
    }
  };

  const handleDeleteProduct = async (product: any) => {
    if (!product) return;

    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      toast.success('Product deleted successfully');
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleMoveToLocation = async (product: any) => {
    const newLocation = prompt('Enter new location for this product:', product.location || '');
    
    if (newLocation === null) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ location: newLocation })
        .eq('id', product.id);

      if (error) throw error;

      toast.success('Product location updated successfully');
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error updating product location:', error);
      toast.error('Failed to update product location');
    }
  };

  // Helper functions for table view
  const getStockStatus = (quantity: number, minLevel: number) => {
    const qty = Number(quantity);
    const min = Number(minLevel);
    if (qty === 0) return 'Out of Stock';
    if (qty > 0 && qty <= min) return 'Low Stock';
    return 'In Stock';
  };

  const getStockStatusDotColor = (quantity: number, minLevel: number) => {
    const qty = Number(quantity);
    const min = Number(minLevel);
    if (qty === 0) return 'bg-red-500';
    if (qty > 0 && qty <= min) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const formatStockQuantity = (quantity: number) => {
    return new Intl.NumberFormat('en-US').format(Number(quantity) || 0);
  };

  // Handler for barcode detection (when adding products)
  const handleBarcodeDetected = async (barcode: string) => {
    try {
      if (!activeBranch) {
        toast.error('No active branch selected');
        return;
      }

      // Search for product by SKU
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .eq('sku', barcode)
        .limit(1);

      if (error) {
        console.error('Error searching for product:', error);
        toast.error('Error searching for product');
        return;
      }

      if (products && products.length > 0) {
        // Product found - open stock adjustment modal
        const foundProduct: any = products[0];
        setSelectedProduct(foundProduct);
        setIsStockAdjustModalOpen(true);
        setIsBarcodeScannerOpen(false);
        toast.success(`Product found: ${foundProduct?.name || 'Product'}`);
      } else {
        // Product not found - open add product modal with pre-filled SKU
        setScannedSKU(barcode);
        setPreFilledProductName('');
        setIsBarcodeScannerOpen(false);
        setIsAddModalOpen(true);
        toast.info('Product not found - will create new product');
      }
    } catch (error) {
      console.error('Error processing scanned barcode:', error);
      toast.error('Error processing scanned barcode');
    }
  };

  // Handler for barcode search from search bar (navigate to product in table)
  const handleBarcodeSearch = async (barcode: string) => {
    try {
      if (!activeBranch) {
        toast.error('No active branch selected');
        return;
      }

      // Search for product by SKU or barcode
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .or(`sku.eq.${barcode},barcode.eq.${barcode}`)
        .limit(1);

      if (error) {
        console.error('Error searching for product:', error);
        toast.error('Error searching for product');
        return;
      }

      if (products && products.length > 0) {
        const foundProduct: any = products[0];
        // If product has a category and it's not in the current filter, add it to ensure the product is visible
        if (foundProduct.category_id && !selectedCategoryIds.includes(foundProduct.category_id)) {
          // Flatten tree to get flat categories array
          const flatCategories = flattenCategoryTree(tree);
          // Get the category and all its descendants
          const categoryIds = getCategoryIdsIncludingDescendants(foundProduct.category_id, flatCategories);
          // Merge with existing selected categories
          setSelectedCategoryIds([...selectedCategoryIds, ...categoryIds]);
        }
        
        // Set search term to product name to highlight it
        setSearchTerm(foundProduct.name);
        
        // Scroll to the product in the table after a short delay to ensure DOM is updated
        setTimeout(() => {
          const productElement = document.querySelector(`[data-product-id="${foundProduct.id}"]`);
          if (productElement) {
            productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight the row briefly
            const row = productElement as HTMLElement;
            row.style.backgroundColor = '#dbeafe';
            setTimeout(() => {
              row.style.backgroundColor = '';
            }, 2000);
          }
        }, 300);
        
        toast.success(`Found: ${foundProduct.name}`);
      } else {
        // Product not found - offer to add it
        setSearchTerm('');
        setScannedSKU(barcode);
        setPreFilledProductName('');
        setIsAddModalOpen(true);
        toast.info('Product not found - will create new product');
      }
    } catch (error) {
      console.error('Error processing barcode search:', error);
      toast.error('Error processing barcode search');
    }
  };

  // Detect if input looks like a barcode (numeric, 8-13 digits or alphanumeric)
  const isBarcodePattern = (input: string): boolean => {
    // Remove whitespace
    const cleaned = input.trim();
    // Check if it's all numeric and 8-13 digits (common barcode lengths)
    if (/^\d{8,13}$/.test(cleaned)) {
      return true;
    }
    // Check if it's alphanumeric and looks like a barcode (e.g., EAN-13 with check digit)
    if (/^[A-Z0-9]{8,20}$/i.test(cleaned) && cleaned.length >= 8) {
      return true;
    }
    return false;
  };

  // Handle search input with command palette functionality
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle search submission (Enter key or blur)
  const handleSearchSubmit = (value: string) => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      setSearchTerm('');
      return;
    }

    // Check for barcode pattern
    if (isBarcodePattern(trimmed)) {
      handleBarcodeSearch(trimmed);
      return;
    }

    // Otherwise, just set as normal search term
    setSearchTerm(trimmed);
  };

  // Handle product click from search results
  const handleSearchProductClick = (product: any) => {
    // If product has a category and it's not in the current filter, add it
    if (product.category_id && !selectedCategoryIds.includes(product.category_id)) {
      const flatCategories = flattenCategoryTree(tree);
      const categoryIds = getCategoryIdsIncludingDescendants(product.category_id, flatCategories);
      setSelectedCategoryIds([...selectedCategoryIds, ...categoryIds]);
    }
    
    // Set search term to product name to highlight it
    setSearchTerm(product.name);
    
    // Scroll to the product in the table after a short delay
    setTimeout(() => {
      const productElement = document.querySelector(`[data-product-id="${product.id}"]`);
      if (productElement) {
        productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const row = productElement as HTMLElement;
        row.style.backgroundColor = '#dbeafe';
        setTimeout(() => {
          row.style.backgroundColor = '';
        }, 2000);
      }
    }, 300);
  };

  // Handle category click from search results
  const handleSearchCategoryClick = (categoryId: string) => {
    const flatCategories = flattenCategoryTree(tree);
    const categoryIds = getCategoryIdsIncludingDescendants(categoryId, flatCategories);
    setSelectedCategoryIds([...categoryIds]);
    setSearchTerm('');
  };

  // Handle supplier click from search results
  const handleSearchSupplierClick = (supplierId: string) => {
    // For now, just show a toast - could navigate to supplier page or filter by supplier
    toast.info('Supplier search clicked - filtering by supplier not yet implemented');
    setSearchTerm('');
  };

  // Handle create location action
  const handleCreateLocation = () => {
    const locationName = prompt('Enter location name:');
    if (locationName && locationName.trim()) {
      // Location creation is handled by setting product locations
      // This is just a quick way to create a location reference
      toast.success(`Location "${locationName}" can be used when adding products`);
    }
  };


  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3 h-3 ml-1 text-blue-600" />;
    }
    return <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />;
  };

  // Bulk action handlers
  const handleBulkPrintLabels = async () => {
    if (selectedProductIds.size === 0) return;

    try {
      const selectedProducts = sortedProducts.filter((p: any) => selectedProductIds.has(p.id));
      
      // Create CSV data for labels
      const csvHeaders = ['Name', 'SKU', 'Barcode', 'Location', 'Stock'];
      const csvData = selectedProducts.map((product: any) => [
        product.name || '',
        product.sku || '',
        product.barcode || '',
        product.location || '',
        product.quantity_in_stock || 0
      ]);

      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `product_labels_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${selectedProductIds.size} product label${selectedProductIds.size !== 1 ? 's' : ''} for printing`);
    } catch (error) {
      console.error('Error exporting labels:', error);
      toast.error('Failed to export labels');
    }
  };

  const handleBulkTransferStock = async () => {
    if (selectedProductIds.size === 0) return;

    const newLocation = prompt(
      `Enter new location for ${selectedProductIds.size} selected product${selectedProductIds.size !== 1 ? 's' : ''}:`,
      ''
    );

    if (newLocation === null) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ location: newLocation.trim() || null })
        .in('id', Array.from(selectedProductIds));

      if (error) throw error;

      toast.success(`Updated location for ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}`);
      setSelectedProductIds(new Set());
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error transferring stock:', error);
      toast.error('Failed to update product locations');
    }
  };

  const handleBulkChangeStatus = async () => {
    if (selectedProductIds.size === 0) return;

    const statusOptions = ['active', 'inactive', 'archived'];
    const currentStatus = prompt(
      `Enter new status for ${selectedProductIds.size} selected product${selectedProductIds.size !== 1 ? 's' : ''}:\n` +
      `Options: ${statusOptions.join(', ')}`,
      'active'
    );

    if (currentStatus === null) return;

    if (!statusOptions.includes(currentStatus.toLowerCase())) {
      toast.error(`Invalid status. Must be one of: ${statusOptions.join(', ')}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ status: currentStatus.toLowerCase() })
        .in('id', Array.from(selectedProductIds));

      if (error) throw error;

      toast.success(`Updated status for ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}`);
      setSelectedProductIds(new Set());
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('Failed to update product status');
    }
  };

  const handleBulkDeleteProducts = async () => {
    if (selectedProductIds.size === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedProductIds.size} selected product${selectedProductIds.size !== 1 ? 's' : ''}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', Array.from(selectedProductIds));

      if (error) throw error;

      toast.success(`Deleted ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''} successfully`);
      setSelectedProductIds(new Set());
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const handleCustomizationSave = async (icon: string | null, color: string | null) => {
    if (!selectedCategory) return;

    try {
      await updateCategory.mutateAsync({
        categoryId: selectedCategory.id,
        data: {
          icon,
          color,
        },
      });
      toast.success('Category customized successfully!');
      setShowCustomizationModal(false);
    } catch (error) {
      console.error('Error customizing category:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">You are not logged in</p>
        </div>
      </div>
    );
  }

  // Removed showCategoryPane state - no longer needed

  // Compact mode is always true (default) - no longer using localStorage
  // Removed localStorage loading and saving to ensure compact mode is always the default

  return (
    <div className={`h-[calc(100vh-8rem)] md:h-[calc(100vh-8rem)] ${isMobile ? 'm-2' : 'm-4'} rounded-lg border border-gray-200 flex flex-col overflow-hidden overscroll-none touch-pan-y bg-white`} style={{ touchAction: 'pan-y' }}>
      {/* Main Layout with Filter Sidebar and Product Table */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative overscroll-none">
        {/* Left Sidebar - Category Facet Filter */}
        <CategoryFacetFilter
          tree={tree}
          selectedCategoryIds={selectedCategoryIds}
          onSelectionChange={handleCategorySelectionChange}
          productCounts={productCounts}
          isCollapsed={isFilterCollapsed}
          onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
          onAddCategory={handleAddCategory}
        />

        {/* Main Content - Products Table (100% width when filter collapsed) */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden bg-gray-50 min-w-0 min-h-0 relative",
          isFilterCollapsed && "w-full"
        )}>
          {(categoryProducts.length > 0 || productsLoading) ? (
            <>
              {/* Row A: Control Bar - Search Bar + Action Buttons */}
              <div className="flex-shrink-0 px-3 md:px-4 lg:px-6 py-2 bg-white border-b flex items-center gap-3 transition-all duration-200">
                {selectedProductIds.size > 0 ? (
                  // Bulk Action Bar
                  <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-900">
                        {selectedProductIds.size} product{selectedProductIds.size !== 1 ? 's' : ''} selected
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleBulkDeleteProducts}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkTransferStock}
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Move
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProductIds(new Set())}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Selection
                    </Button>
                  </div>
                ) : (
                  // Normal Header: Search Bar (left, expanded) + Action Buttons (right)
                  <>
                    {/* Multi-Intent Search Bar - Left, Expanded Width */}
                    <MultiIntentSearch
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onSubmit={handleSearchSubmit}
                      onProductClick={handleSearchProductClick}
                      onCategoryClick={handleSearchCategoryClick}
                      onSupplierClick={handleSearchSupplierClick}
                      onCreateProduct={() => {
                        setScannedSKU('');
                        setPreFilledProductName('');
                        setIsAddModalOpen(true);
                      }}
                      onCreateCategory={handleAddCategory}
                      onCreateLocation={handleCreateLocation}
                      placeholder="Search products, SKUs, categories, suppliers…"
                    />
                    {/* Action Buttons - Right */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          setScannedSKU('');
                          setPreFilledProductName('');
                          setIsAddModalOpen(true);
                        
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProductViewMode(productViewMode === 'table' ? 'grid' : 'table')}
                      >
                        {productViewMode === 'table' ? (
                          <>
                            <Grid3x3 className="w-4 h-4 mr-2" />
                            Grid
                          </>
                        ) : (
                          <>
                            <Table2 className="w-4 h-4 mr-2" />
                            Table
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
              
              {/* Search Results Info - Show below search bar when searching */}
              {searchTerm && (
                <div className="flex-shrink-0 px-3 md:px-4 lg:px-6 py-1 bg-gray-50 border-b">
                  <div className="text-xs text-gray-500">
                    {filteredProducts.length > 0 && (
                      <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found</span>
                    )}
                    {filteredProducts.length === 0 && (
                      <span>No results found</span>
                    )}
                  </div>
                </div>
              )}

              {/* Products Section - Scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain bg-gray-50" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="">
                {productsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading products...</p>
                    </div>
                  </div>
                ) : (searchTerm.trim() ? filteredProducts : categoryProducts).length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {searchTerm.trim() 
                          ? 'No products match your search' 
                          : 'No products found in this category'}
                      </p>
                    </CardContent>
                  </Card>
                ) : productViewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedProducts.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onFavoriteToggle={handleFavoriteToggle}
                        onStockAction={handleStockAction}
                        onEdit={handleProductEdit}
                        onImagePreview={handleImagePreview}
                        isVariant={product.is_variant}
                      />
                    ))}
                  </div>
                ) : productViewMode === 'table' ? (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-visible shadow-sm">
                    <div className="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <table className={cn("w-full divide-y divide-gray-200", !isMobile && "min-w-[640px]")}>
                        <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                          <tr>
                            <th 
                              className={cn(
                                "text-center w-12",
                                compactMode ? "px-2 py-1" : "px-3 py-4"
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={selectedProductIds.size > 0 && selectedProductIds.size === sortedProducts.length}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProductIds(new Set(sortedProducts.map((p: any) => p.id)));
                                  } else {
                                    setSelectedProductIds(new Set());
                                  }
                                }}
                                className={cn(
                                  "text-blue-600 rounded border-gray-300 focus:ring-blue-500",
                                  compactMode ? "w-3 h-3" : "w-4 h-4"
                                )}
                              />
                            </th>
                            <th 
                              className="px-2 sm:px-4 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => handleSort('sku')}
                            >
                              <div className="flex items-center">
                                SKU
                                {getSortIcon('sku')}
                              </div>
                            </th>
                            <th 
                              className="px-2 sm:px-4 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/3 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => handleSort('name')}
                            >
                              <div className="flex items-center">
                                Product
                                {getSortIcon('name')}
                              </div>
                            </th>
                            <th 
                              className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors hidden md:table-cell"
                              onClick={() => handleSort('location')}
                            >
                              <div className="flex items-center justify-center">
                                Location
                                {getSortIcon('location')}
                              </div>
                            </th>
                            <th 
                              className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => handleSort('stock')}
                            >
                              <div className="flex items-center justify-center">
                                Stock
                                {getSortIcon('stock')}
                              </div>
                            </th>
                            <th 
                              className={cn(
                                "text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors hidden lg:table-cell",
                                compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-3 sm:py-4"
                              )}
                              onClick={() => handleSort('date_added')}
                            >
                              <div className="flex items-center justify-center">
                                Date Added
                                {getSortIcon('date_added')}
                              </div>
                            </th>
                            <th 
                              className={cn(
                                "text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors hidden sm:table-cell",
                                compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-3 sm:py-4"
                              )}
                              onClick={() => handleSort('purchase_price')}
                            >
                              <div className="flex items-center justify-center">
                                Cost
                                {getSortIcon('purchase_price')}
                              </div>
                            </th>
                            <th 
                              className={cn(
                                "text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors hidden sm:table-cell",
                                compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-3 sm:py-4"
                              )}
                              onClick={() => handleSort('sale_price')}
                            >
                              <div className="flex items-center justify-center">
                                Price
                                {getSortIcon('sale_price')}
                              </div>
                            </th>
                            <th className={cn(
                              "text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/12 hidden md:table-cell",
                              compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-3 sm:py-4"
                            )}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {sortedProducts.map((product: any, index: number) => {
                            const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
                            const stockDotColor = getStockStatusDotColor(product.quantity_in_stock, product.minimum_stock_level);
                            
                            return (
                              <tr
                                key={product.id}
                                data-product-id={product.id}
                                onClick={(e) => handleRowClick(e, product)}
                                onMouseEnter={() => setHoveredRowId(product.id)}
                                onMouseLeave={() => setHoveredRowId(null)}
                                className={cn(
                                  'group hover:bg-gray-100 hover:shadow-sm transition-all duration-200 border-b-2 border-gray-100',
                                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                  'cursor-pointer',
                                  compactMode && 'h-8'
                                )}
                              >
                                {/* Selection checkbox */}
                                <td 
                                  className={cn(
                                    "text-center w-12",
                                    compactMode ? "px-2 py-1" : "px-3 py-3"
                                  )} 
                                  onClick={(e) => e.stopPropagation()}
                                  data-interactive
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedProductIds.has(product.id)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      const newSet = new Set(selectedProductIds);
                                      if (e.target.checked) {
                                        newSet.add(product.id);
                                      } else {
                                        newSet.delete(product.id);
                                      }
                                      setSelectedProductIds(newSet);
                                    }}
                                    className={cn(
                                      "text-blue-600 rounded border-gray-300 focus:ring-blue-500",
                                      compactMode ? "w-3 h-3" : "w-4 h-4"
                                    )}
                                  />
                                </td>
                                {/* SKU column */}
                                <td className={cn(
                                  "text-left",
                                  compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-4"
                                )}>
                                  <span className={cn(
                                    "font-mono text-gray-900",
                                    compactMode ? "text-xs" : "text-xs sm:text-sm"
                                  )}>
                                    {product.sku || '---'}
                                  </span>
                                </td>
                                {/* Product column */}
                                <td className={cn(
                                  "w-1/4",
                                  compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-4"
                                )}>
                                  <div className={cn(
                                    "flex items-center",
                                    compactMode ? "gap-1.5" : "gap-2 sm:gap-3"
                                  )}>
                                    {/* Product image - only show if image exists */}
                                    {product.image_url && (
                                      <div className={cn("flex-shrink-0", compactMode ? "w-8 h-8" : "w-10 h-10")} onClick={(e) => e.stopPropagation()} data-interactive>
                                        <div className={cn("bg-gray-50 rounded-lg border flex items-center justify-center overflow-hidden", compactMode ? "w-8 h-8" : "w-10 h-10")}>
                                          <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => handleImagePreview(product.image_url)}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className={cn(
                                        "flex items-center flex-wrap",
                                        compactMode ? "gap-1" : "gap-2"
                                      )}>
                                        <h3 className={cn(
                                          "font-semibold text-gray-900 truncate",
                                          compactMode ? "text-xs" : "text-sm"
                                        )}>
                                          {product.name}
                                        </h3>
                                        {product.category_name && (
                                          <span className="text-xs text-gray-400 ml-1.5">
                                            • {product.category_name}
                                          </span>
                                        )}
                                      </div>
                                      {/* Barcode display - less prominent */}
                                      {product.barcode && (
                                        <p className={cn(
                                          "text-gray-500 font-mono",
                                          compactMode ? "text-[9px] mt-0.5" : "text-[10px] mt-0.5"
                                        )}>
                                          {product.barcode}
                                        </p>
                                      )}
                                      {product.description && !compactMode && (
                                        <p className="text-xs text-gray-500 truncate max-w-xs mt-1 hidden sm:block">
                                          {product.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Location column */}
                                <td className={cn(
                                  "text-center w-1/8 hidden md:table-cell",
                                  compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-4"
                                )}>
                                  <div className="flex items-center justify-center gap-1">
                                    <MapPin className={cn(
                                      "text-gray-400",
                                      compactMode ? "w-2.5 h-2.5" : "w-3 h-3"
                                    )} />
                                    <span className={cn(
                                      repetitiveLocations.has(product.location || '') ? "text-gray-400" : "text-gray-600",
                                      compactMode ? "text-xs" : "text-sm"
                                    )}>
                                      {product.location || '-'}
                                    </span>
                                  </div>
                                </td>

                                {/* Stock column */}
                                <td 
                                  className={cn(
                                    "text-center w-1/8",
                                    compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-4"
                                  )} 
                                  onClick={(e) => isMobile && e.stopPropagation()}
                                >
                                  <TooltipProvider delayDuration={150}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          data-interactive
                                          className={cn(
                                            compactMode ? "rounded-md p-0.5 transition-colors" : "space-y-1 rounded-md p-2 transition-colors",
                                            !isMobile && "cursor-pointer group hover:bg-blue-600"
                                          )}
                                          onClick={(e) => {
                                            if (!isMobile) {
                                              e.stopPropagation();
                                              handleStockAction(product, 'in');
                                            }
                                          }}
                                        >
                                          <div className={cn(
                                            "flex items-center justify-center",
                                            compactMode ? "gap-1" : "gap-2"
                                          )}>
                                            <div
                                              className={cn(
                                                'rounded-full',
                                                stockDotColor,
                                                Number(product.quantity_in_stock) === 0 ? 'animate-pulse' : '',
                                                compactMode ? 'w-1.5 h-1.5' : 'w-2 h-2'
                                              )}
                                            />
                                            <span
                                              className={cn(
                                                'font-semibold transition-colors',
                                                Number(product.quantity_in_stock) === 0
                                                  ? 'animate-pulse text-red-600'
                                                  : 'text-gray-900',
                                                !isMobile && 'group-hover:text-white',
                                                compactMode ? 'text-xs' : 'text-sm'
                                              )}
                                            >
                                              {formatStockQuantity(product.quantity_in_stock)}
                                            </span>
                                          </div>
                                          {/* Status label - only show in non-compact mode */}
                                          {!compactMode && (
                                            <div className={cn(
                                              "text-xs font-medium transition-colors",
                                              isMobile ? "text-gray-600" : "text-gray-600 group-hover:text-white/90"
                                            )}>
                                              {stockStatus}
                                            </div>
                                          )}
                                        </div>
                                      </TooltipTrigger>
                                      {!isMobile && (
                                        <TooltipContent side="top" align="center" sideOffset={8} className="z-[200000] max-w-xs shadow-lg">
                                          <p className="font-medium">
                                            {formatStockQuantity(product.quantity_in_stock)} in stock. Minimum: {formatStockQuantity(product.minimum_stock_level)}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-1">Status: {stockStatus}</p>
                                          {Number(product.quantity_in_stock) === 0 && (
                                            <p className="text-xs text-red-400 mt-1">⚠️ Out of stock!</p>
                                          )}
                                          {Number(product.quantity_in_stock) > 0 && Number(product.quantity_in_stock) <= Number(product.minimum_stock_level) && (
                                            <p className="text-xs text-orange-400 mt-1">⚠️ Low stock alert</p>
                                          )}
                                          <p className="text-xs text-gray-400 mt-1">Click to adjust stock</p>
                                        </TooltipContent>
                                      )}
                                    </Tooltip>
                                  </TooltipProvider>
                                </td>

                                {/* Date Added column */}
                                <td className={cn(
                                  "text-center w-1/8 hidden lg:table-cell",
                                  compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-4"
                                )}>
                                  <span className={cn(
                                    "text-gray-600",
                                    compactMode ? "text-xs" : "text-sm"
                                  )}>
                                    {product.created_at 
                                      ? new Date(product.created_at).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })
                                      : '-'}
                                  </span>
                                </td>

                                {/* Cost column */}
                                <td className={cn(
                                  "text-center w-1/8 hidden sm:table-cell",
                                  compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-4"
                                )}>
                                  <div className={cn(
                                    getPriceColor(product.purchase_price, 'text-gray-900'),
                                    "font-medium",
                                    compactMode ? "text-xs" : "text-sm"
                                  )}>
                                    ${product.purchase_price ? Number(product.purchase_price).toFixed(2) : '0.00'}
                                  </div>
                                </td>

                                {/* Price column */}
                                <td className={cn(
                                  "text-center w-1/8 hidden sm:table-cell",
                                  compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-4"
                                )}>
                                  <div className={cn(
                                    "flex items-center justify-center gap-1.5",
                                    getPriceColor(product.sale_price, 'text-green-600'),
                                    "font-medium",
                                    compactMode ? "text-xs" : "text-sm"
                                  )}>
                                    <span>
                                      ${product.sale_price ? Number(product.sale_price).toFixed(2) : '0.00'}
                                    </span>
                                    <button
                                      data-interactive
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductEdit(product);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded flex items-center justify-center"
                                      aria-label="Quick edit product"
                                    >
                                      <Edit className={cn(
                                        "text-blue-600",
                                        compactMode ? "w-3 h-3" : "w-3.5 h-3.5"
                                      )} />
                                    </button>
                                  </div>
                                </td>

                                {/* Actions column */}
                                <td 
                                  className={cn(
                                    "text-center w-1/12 hidden md:table-cell",
                                    compactMode ? "px-2 py-1" : "px-2 sm:px-4 py-4"
                                  )} 
                                  onClick={(e) => e.stopPropagation()}
                                  data-interactive
                                >
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm" className={cn(
                                        "p-0",
                                        compactMode ? "h-6 w-6" : "h-8 w-8"
                                      )}>
                                        <MoreVertical className={compactMode ? "w-3 h-3" : "w-4 h-4"} />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                      <DropdownMenuItem onClick={() => {
                                        if (isMobile) {
                                          setIsMobileProductDetailModalOpen(false);
                                        }
                                        handleStockAction(product, 'in');
                                      }}>
                                        <Plus className="w-4 h-4 mr-2 text-green-600" />
                                        <span className="flex-1">Adjust Stock</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => {
                                        if (isMobile) {
                                          setIsMobileProductDetailModalOpen(false);
                                        }
                                        handleProductEdit(product);
                                      }}>
                                        <Edit className="w-4 h-4 mr-2 text-blue-600" />
                                        <span className="flex-1">Edit</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        if (isMobile) {
                                          setIsMobileProductDetailModalOpen(false);
                                        }
                                        handleDuplicateProduct(product);
                                      }}>
                                        <Copy className="w-4 h-4 mr-2 text-purple-600" />
                                        <span className="flex-1">Duplicate</span>
                                      </DropdownMenuItem>
                                    
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => {
                                        if (isMobile) {
                                          setIsMobileProductDetailModalOpen(false);
                                        }
                                        handleDeleteProduct(product);
                                      }}>
                                        <Trash2 className="w-4 h-4 mr-2 text-gray-600" />
                                        <span className="flex-1">Delete</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Products Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Your inventory is empty. Add your first product to get started.
                </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Button
                    onClick={() => {
                      setScannedSKU('');
                      setPreFilledProductName('');
                      setIsAddModalOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Electronics, Food"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of the category"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="parent">Parent Category (Optional)</Label>
              <HierarchicalCategorySelector
                value={formData.parentCategoryId}
                onValueChange={(id, name) => setFormData(prev => ({ ...prev, parentCategoryId: id || null }))}
                placeholder="Select parent category..."
                allowCreate={false}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCategory} disabled={createCategory.isPending}>
              {createCategory.isPending ? 'Adding...' : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Sub Category Modal */}
      <Dialog 
        open={showAddSubCategoryModal} 
        onOpenChange={(open) => {
          setShowAddSubCategoryModal(open);
          if (!open) {
            // Reset form when modal closes
            setSubCategoryFormData({ name: '', description: '', parentCategoryId: null });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Sub Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sub-parent">Parent Category *</Label>
              {subCategoryFormData.parentCategoryId && (
                <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-900">
                    <span className="font-medium">Parent:</span>{' '}
                    {categories.find(c => c.id === subCategoryFormData.parentCategoryId)?.name || 'Unknown'}
                  </p>
                </div>
              )}
              <HierarchicalCategorySelector
                value={subCategoryFormData.parentCategoryId}
                onValueChange={(id, name) => setSubCategoryFormData(prev => ({ ...prev, parentCategoryId: id || null }))}
                placeholder="Select parent category..."
                allowCreate={false}
              />
              <p className="text-xs text-gray-500 mt-1">
                {subCategoryFormData.parentCategoryId 
                  ? 'You can change the parent category if needed'
                  : 'You must select a parent category for subcategories'}
              </p>
            </div>
            <div>
              <Label htmlFor="sub-name">Sub Category Name *</Label>
              <Input
                id="sub-name"
                value={subCategoryFormData.name}
                onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Laptops, Beverages"
              />
            </div>
            <div>
              <Label htmlFor="sub-description">Description</Label>
              <Textarea
                id="sub-description"
                value={subCategoryFormData.description}
                onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of the subcategory"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddSubCategoryModal(false);
                setSubCategoryFormData({ name: '', description: '', parentCategoryId: null });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSubCategory} 
              disabled={createCategory.isPending || !subCategoryFormData.parentCategoryId}
            >
              {createCategory.isPending ? 'Adding...' : 'Add Sub Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Category Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Electronics, Food"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of the category"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-parent">Parent Category</Label>
              <HierarchicalCategorySelector
                value={formData.parentCategoryId}
                onValueChange={(id, name) => setFormData(prev => ({ ...prev, parentCategoryId: id || null }))}
                placeholder="Select parent category..."
                allowCreate={false}
              />
            </div>
            {selectedCategory && (
              <div>
                <Button
                  variant="outline"
                  onClick={() => openCustomizationModal(selectedCategory)}
                  className="w-full"
                >
                  Customize Icon & Color
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={updateCategory.isPending}>
              {updateCategory.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.name}"?
              This action cannot be undone. If this category has children, they will be moved to this category's parent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Customization Modal */}
      {selectedCategory && (
        <CategoryCustomizationModal
          isOpen={showCustomizationModal}
          onClose={() => setShowCustomizationModal(false)}
          category={selectedCategory}
          onSave={handleCustomizationSave}
        />
      )}

      {/* Product Modals */}
      {selectedProduct && (
        <>
          <EditProductInfoModal
            isOpen={isEditInfoModalOpen}
            onClose={() => {
              setIsEditInfoModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            onProductUpdated={() => {
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
            }}
          />
        </>
      )}

      {selectedProduct && (
        <EditProductStockModal
          isOpen={isStockAdjustModalOpen}
          onClose={() => {
            setIsStockAdjustModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onProductUpdated={() => {
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
          }}
        />
      )}

      {/* Image Preview Modal */}
      {previewImageUrl && (
        <ImagePreviewModal
          isOpen={isImagePreviewOpen}
          onClose={() => {
            setIsImagePreviewOpen(false);
            setPreviewImageUrl(null);
          }}
          imageUrl={previewImageUrl}
          alt="Product preview"
        />
      )}

      {/* Add Product Modals */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setPreFilledProductName('');
          setScannedSKU('');
        }}
        onProductAdded={async () => {
          // Invalidate all categoryProducts queries to ensure all category views refresh
          await queryClient.invalidateQueries({ 
            queryKey: ['categoryProducts'],
            refetchType: 'active',
          });
          // Invalidate category analytics to refresh stats
          await queryClient.invalidateQueries({ 
            queryKey: ['categoryAnalytics'],
            refetchType: 'active',
          });
          // Invalidate product counts
          await queryClient.invalidateQueries({ 
            queryKey: ['categoryProductCounts'],
            refetchType: 'active',
          });
          // Invalidate all products analytics
          await queryClient.invalidateQueries({ 
            queryKey: ['allProductsAnalyticsWeekAgo'],
            refetchType: 'active',
          });
          await queryClient.invalidateQueries({ queryKey: ['products'] });
          // Invalidate products by categories queries
          await queryClient.invalidateQueries({ 
            queryKey: ['productsByCategories'],
            refetchType: 'active',
          });
          setIsAddModalOpen(false);
          setPreFilledProductName('');
          setScannedSKU('');
        }}
        preFilledSKU={scannedSKU}
        preFilledName={preFilledProductName}
        preFilledCategoryId={selectedCategoryIds.length === 1 ? selectedCategoryIds[0] : undefined}
      />

      {isBarcodeScannerOpen && (
        <BarcodeScanner
          onBarcodeDetected={handleBarcodeDetected}
          onClose={() => setIsBarcodeScannerOpen(false)}
          onScanSuccess={onScanSuccess}
          settings={scannerSettings}
        />
      )}

      {/* Mobile Product Detail Modal */}
      {selectedProduct && (
        <Dialog open={isMobileProductDetailModalOpen} onOpenChange={setIsMobileProductDetailModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Stock Information */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      getStockStatusDotColor(selectedProduct.quantity_in_stock, selectedProduct.minimum_stock_level),
                      Number(selectedProduct.quantity_in_stock) === 0 ? 'animate-pulse' : ''
                    )}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Stock</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatStockQuantity(selectedProduct.quantity_in_stock)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getStockStatus(selectedProduct.quantity_in_stock, selectedProduct.minimum_stock_level)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setIsMobileProductDetailModalOpen(false);
                    handleStockAction(selectedProduct, 'in');
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2 text-green-600" />
                  Adjust Stock
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileProductDetailModalOpen(false);
                    handleProductEdit(selectedProduct);
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2 text-blue-600" />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileProductDetailModalOpen(false);
                    handleDuplicateProduct(selectedProduct);
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-2 text-purple-600" />
                  Duplicate
                </Button>
       
                <div className="pt-2 border-t">
                  <Button
                    onClick={() => {
                      setIsMobileProductDetailModalOpen(false);
                      handleDeleteProduct(selectedProduct);
                    }}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
