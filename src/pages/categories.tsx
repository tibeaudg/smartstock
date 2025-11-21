/**
 * Categories Management Page
 * Revamped with hierarchical categories, dual view modes, and enhanced features
 */

import React, { useState, useEffect } from 'react';
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
import { useCategoryTree, useCreateCategory, useUpdateCategory, useDeleteCategory, useCategoryRealtime, useCategoryProducts } from '@/hooks/useCategories';
import { useCategoryDragDrop } from '@/hooks/useCategoryDragDrop';
import { CategoryTreeView } from '@/components/categories/CategoryTreeView';
import { CategoryCustomizationModal } from '@/components/categories/CategoryCustomizationModal';
import { CategoryAnalytics } from '@/components/categories/CategoryAnalytics';
import { HierarchicalCategorySelector } from '@/components/categories/HierarchicalCategorySelector';
import { ProductCard } from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Grid3x3, List, Table2, Edit, Trash2, Copy, MapPin, MoreVertical, ChevronRight, ChevronDown, Palette, ArrowUpDown, ArrowUp, ArrowDown, Scan } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import type { CategoryTree, CategoryCreateData } from '@/types/categoryTypes';
import { getCategoryPath, getCategoryIdsIncludingDescendants } from '@/lib/categories/categoryUtils';
import { cn } from '@/lib/utils';
import { EditProductInfoModal } from '@/components/EditProductInfoModal';
import { EditProductStockModal } from '@/components/EditProductStockModal';
import { ManualStockAdjustModal } from '@/components/ManualStockAdjustModal';
import { ImagePreviewModal } from '@/components/ImagePreviewModal';
import { AddProductMethodModal } from '@/components/AddProductMethodModal';
import { AddProductModal } from '@/components/AddProductModal';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AllProductsAnalytics } from '@/components/categories/AllProductsAnalytics';
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null | 'all'>(null);
  // Default to table view on both mobile and desktop
  const [productViewMode, setProductViewMode] = useState<'grid' | 'list' | 'table'>(() => {
    if (typeof window !== 'undefined') {
      return 'table';
    }
    return 'table';
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // Sorting state - default to date_added descending (newest first)
  const [sortColumn, setSortColumn] = useState<string | null>('date_added');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Product modal states
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isMobileProductDetailModalOpen, setIsMobileProductDetailModalOpen] = useState(false);
  
  // Add product modal states
  const [isAddProductMethodModalOpen, setIsAddProductMethodModalOpen] = useState(false);
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
  const dragDrop = useCategoryDragDrop(categories);
  const { data: categoryProducts = [], isLoading: productsLoading } = useCategoryProducts(selectedCategoryId);
  const queryClient = useQueryClient();
  useCategoryRealtime();

  const handleAddCategory = async () => {
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

  const handleCategoryClick = (category: CategoryTree) => {
    setSelectedCategory(category);
    setSelectedCategoryId(category.id);
    
    // Expand the category if it has children
    if (category.children && category.children.length > 0) {
      setExpandedCategories(prev => {
        const next = new Set(prev);
        next.add(category.id);
        return next;
      });
    }
  };

  const handleToggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
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
      
      queryClient.invalidateQueries({ queryKey: ['categoryProducts', selectedCategoryId] });
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
      
      queryClient.invalidateQueries({ queryKey: ['categoryProducts', selectedCategoryId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
      
      queryClient.invalidateQueries({ queryKey: ['categoryProducts', selectedCategoryId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
      
      queryClient.invalidateQueries({ queryKey: ['categoryProducts', selectedCategoryId] });
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

  // Handler for add product method selection
  const handleAddProductMethodSelect = (method: 'manual' | 'scan') => {
    if (method === 'scan') {
      setIsBarcodeScannerOpen(true);
    } else {
      // Manual - open add product modal directly
      setScannedSKU('');
      setPreFilledProductName('');
      setIsAddModalOpen(true);
    }
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

  // Sort products
  const sortedProducts = React.useMemo(() => {
    if (!sortColumn) return categoryProducts;

    return [...categoryProducts].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
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
  }, [categoryProducts, sortColumn, sortDirection]);

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

  // State for mobile category pane visibility
  const [showCategoryPane, setShowCategoryPane] = useState(!isMobile || !selectedCategoryId);

  // On mobile, hide category pane when category is selected
  React.useEffect(() => {
    if (isMobile) {
      setShowCategoryPane(!selectedCategoryId);
    } else {
      setShowCategoryPane(true);
    }
  }, [isMobile, selectedCategoryId]);

  return (
    <div className={`h-[calc(100vh-8rem)] md:h-[calc(100vh-8rem)] ${isMobile ? 'm-2' : 'm-6'} rounded-lg border border-gray-200 flex flex-col overflow-hidden overscroll-none touch-pan-y`} style={{ touchAction: 'pan-y' }}>
      {/* Split-Pane Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative overscroll-none">
        {/* Left Pane - Category Tree */}
        <div className={cn(
          `${isMobile ? 'absolute inset-0 z-20' : 'w-[280px] md:w-[320px] lg:w-[360px]'} border-r bg-white flex flex-col flex-shrink-0 transition-transform duration-300`,
          isMobile && !showCategoryPane && '-translate-x-full'
        )}>
          {/* Left Pane Header - Fixed */}
          <div className="flex-shrink-0 px-4 py-3 border-b bg-gray-50">
            <Button
              onClick={() => {
                setFormData({ name: '', description: '', parentCategoryId: null });
                setShowAddModal(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </div>
          
          {/* Category Tree - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Show All Products Button - Always at top */}
            <div className="px-3 py-2 border-b">
              <button
                onClick={() => {
                  setSelectedCategoryId('all');
                  setSelectedCategory(null);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded transition-colors text-sm font-medium',
                  selectedCategoryId === 'all'
                    ? 'bg-blue-50 border-l-4 border-l-blue-600 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-900'
                )}
              >
                <Package className="w-4 h-4" />
                <span>Show All Products</span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading categories...</p>
                </div>
              </div>
            ) : tree.length === 0 ? (
              <div className="flex items-center justify-center py-12 px-4">
                <div className="text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No categories
                  </h3>
                  <p className="text-base text-gray-600 mb-4">
                    You have no categories yet. Create your first category to get started.
                  </p>
                  <Button
                    onClick={() => {
                      setFormData({ name: '', description: '', parentCategoryId: null });
                      setShowAddModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Category
                  </Button>
                </div>
              </div>
            ) : (
              <CategoryTreeView
                tree={tree}
                selectedCategoryId={selectedCategoryId}
                expanded={expandedCategories}
                onCategoryClick={handleCategoryClick}
                onToggleExpand={handleToggleExpand}
                onEdit={openEditModal}
                onDelete={openDeleteDialog}
                onAddChild={(parent) => {
                  setFormData({ name: '', description: '', parentCategoryId: parent.id });
                  setShowAddModal(true);
                }}
                activeId={dragDrop.activeId}
                isMoving={dragDrop.isMoving}
                onDragStart={dragDrop.handleDragStart}
                onDragOver={dragDrop.handleDragOver}
                onDragEnd={dragDrop.handleDragEnd}
                onDragCancel={dragDrop.handleDragCancel}
              />
            )}
          </div>
        </div>

        {/* Right Pane - Category Details & Products */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-w-0 min-h-0 relative">
          {selectedCategoryId ? (
            <>
              {/* Right Pane Header - Sticky on Mobile Only */}
              <div className="flex-shrink-0 px-3 md:px-4 lg:px-6 py-3 md:py-4 bg-white border-b sticky top-0 z-20 md:static md:z-auto">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {isMobile && selectedCategoryId && (
                    <button
                      onClick={() => setShowCategoryPane(true)}
                      className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors"
                      aria-label="Show categories"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                    </button>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                      {selectedCategoryId === 'all' 
                        ? 'All Products' 
                        : (selectedCategory?.name || categories.find(c => c.id === selectedCategoryId)?.name)}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {selectedCategoryId !== 'all' && (
                      <Button
                        onClick={() => {
                          setFormData({ name: '', description: '', parentCategoryId: selectedCategoryId });
                          setShowAddModal(true);
                        }}
                        variant="default"
                        size="sm"
                        className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white h-10 px-6"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="hidden md:inline">New Sub Category</span>
                        <span className="md:hidden">Sub</span>
                      </Button>
                    )}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <Button
                        variant={productViewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setProductViewMode('grid')}
                        className="h-8 w-8 p-0"
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </Button>
             
                      <Button
                        variant={productViewMode === 'table' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setProductViewMode('table')}
                        className="h-8 w-8 p-0"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section - Scrollable (includes stats) */}
              <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                {/* Stats Row - Scrolls with content */}
                {selectedCategoryId === 'all' ? (
                  <div className="px-3 md:px-4 lg:px-6 py-3 md:py-4 bg-white border-b">
                    <AllProductsAnalytics products={categoryProducts} />
                  </div>
                ) : selectedCategoryId && (
                  <div className="px-3 md:px-4 lg:px-6 py-3 md:py-4 bg-white border-b">
                    <CategoryAnalytics categoryId={selectedCategoryId} />
                  </div>
                )}
                
                <div className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">Products</h3>
                    <Button
                      onClick={() => {
                        setIsAddProductMethodModalOpen(true);
                      }}
                      variant="default"
                      size="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Add Product</span>
                    </Button>
                  </div>
                {productsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading products...</p>
                    </div>
                  </div>
                ) : categoryProducts.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No products found in this category</p>
                    </CardContent>
                  </Card>
                ) : productViewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categoryProducts.map((product: any) => (
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
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible">
                    <div className="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 -mx-3 md:mx-0">
                      <table className={cn("w-full divide-y divide-gray-200", !isMobile && "min-w-[640px]")}>
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
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
                              className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors hidden lg:table-cell"
                              onClick={() => handleSort('date_added')}
                            >
                              <div className="flex items-center justify-center">
                                Date Added
                                {getSortIcon('date_added')}
                              </div>
                            </th>
                            <th 
                              className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors hidden sm:table-cell"
                              onClick={() => handleSort('purchase_price')}
                            >
                              <div className="flex items-center justify-center">
                                Pricing
                                {getSortIcon('purchase_price')}
                              </div>
                            </th>
                            <th className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/12 hidden md:table-cell">
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
                                onClick={() => handleMobileRowClick(product)}
                                className={cn(
                                  'hover:bg-gray-100 hover:shadow-sm transition-all duration-200 border-b-2 border-gray-100',
                                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                  isMobile && 'cursor-pointer'
                                )}
                              >
                                {/* Product column */}
                                <td className="px-2 sm:px-4 py-3 w-1/3">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                      {product.image_url ? (
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-lg border flex items-center justify-center overflow-hidden">
                                          <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => handleImagePreview(product.image_url)}
                                          />
                                        </div>
                                      ) : (
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {product.name}
                                      </h3>
                                      {product.description && (
                                        <p className="text-xs text-gray-500 truncate max-w-xs mt-1 hidden sm:block">
                                          {product.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Location column */}
                                <td className="px-2 sm:px-4 py-3 text-center w-1/8 hidden md:table-cell">
                                  <div className="flex items-center justify-center gap-1">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {product.location || '-'}
                                    </span>
                                  </div>
                                </td>

                                {/* Stock column */}
                                <td className="px-2 sm:px-4 py-3 text-center w-1/8" onClick={(e) => isMobile && e.stopPropagation()}>
                                  <TooltipProvider delayDuration={150}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          className={cn(
                                            "space-y-1 rounded-md p-2 transition-colors",
                                            !isMobile && "cursor-pointer group hover:bg-blue-600"
                                          )}
                                          onClick={(e) => {
                                            if (!isMobile) {
                                              e.stopPropagation();
                                              handleStockAction(product, 'in');
                                            }
                                          }}
                                        >
                                          <div className="flex items-center justify-center gap-2">
                                            <div
                                              className={cn(
                                                'w-2 h-2 rounded-full',
                                                stockDotColor,
                                                Number(product.quantity_in_stock) === 0 ? 'animate-pulse' : ''
                                              )}
                                            />
                                            <span
                                              className={cn(
                                                'text-sm font-semibold transition-colors',
                                                Number(product.quantity_in_stock) === 0
                                                  ? 'animate-pulse text-red-600'
                                                  : 'text-gray-900',
                                                !isMobile && 'group-hover:text-white'
                                              )}
                                            >
                                              {formatStockQuantity(product.quantity_in_stock)}
                                            </span>
                                          </div>
                                          <div className={cn(
                                            "text-xs font-medium transition-colors",
                                            isMobile ? "text-gray-600" : "text-gray-600 group-hover:text-white/90"
                                          )}>
                                            {stockStatus}
                                          </div>
                                        </div>
                                      </TooltipTrigger>
                                      {!isMobile && (
                                        <TooltipContent side="top" align="center" sideOffset={8} className="z-[200000] max-w-xs shadow-lg">
                                          <p className="font-medium">
                                            {formatStockQuantity(product.quantity_in_stock)} in stock. Minimum: {formatStockQuantity(product.minimum_stock_level)}
                                          </p>
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
                                <td className="px-2 sm:px-4 py-3 text-center w-1/8 hidden lg:table-cell">
                                  <span className="text-sm text-gray-600">
                                    {product.created_at 
                                      ? new Date(product.created_at).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })
                                      : '-'}
                                  </span>
                                </td>

                                {/* Pricing column */}
                                <td className="px-2 sm:px-4 py-3 text-center w-1/8 hidden sm:table-cell">
                                  <div className="space-y-1">
                                    <div className="text-sm text-red-600 font-medium">
                                      ${product.purchase_price ? Number(product.purchase_price).toFixed(2) : '-'}
                                    </div>
                                    <div className="text-sm text-green-600 font-medium">
                                      ${product.sale_price ? Number(product.sale_price).toFixed(2) : '-'}
                                    </div>
                                  </div>
                                </td>

                                {/* Actions column */}
                                <td className="px-2 sm:px-4 py-3 text-center w-1/12 hidden md:table-cell" onClick={(e) => e.stopPropagation()}>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="w-4 h-4" />
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
                                      <DropdownMenuItem onClick={() => {
                                        if (isMobile) {
                                          setIsMobileProductDetailModalOpen(false);
                                        }
                                        handleMoveToLocation(product);
                                      }}>
                                        <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                                        <span className="flex-1">Move to Location</span>
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
                ) : (
                  <div className="space-y-2">
                    {categoryProducts.map((product: any) => (
                      <Card key={product.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base md:text-lg truncate">{product.name}</h3>
                                {product.description && (
                                  <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                                  <span>Stock: {product.quantity_in_stock}</span>
                                  {product.location && <span>Location: {product.location}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStockAction(product, 'in')}
                                className="whitespace-nowrap"
                              >
                                Adjust Stock
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleProductEdit(product)}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Category
                </h3>
                <p className="text-gray-600 mb-4">
                  Choose a category from the sidebar to view its details and products
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Button
                    onClick={() => {
                      setFormData({ name: '', description: '', parentCategoryId: null });
                      setShowAddModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Category
                  </Button>
                  <Button
                    onClick={() => {
                      setSubCategoryFormData({ name: '', description: '', parentCategoryId: null });
                      setShowAddSubCategoryModal(true);
                    }}
                    variant="default"
                    className="h-12 px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Sub Category
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
            <Button onClick={handleAddCategory} disabled={createCategory.isPending}>
              {createCategory.isPending ? 'Adding...' : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Sub Category Modal */}
      <Dialog open={showAddSubCategoryModal} onOpenChange={setShowAddSubCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Sub Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sub-parent">Parent Category *</Label>
              <HierarchicalCategorySelector
                value={subCategoryFormData.parentCategoryId}
                onValueChange={(id, name) => setSubCategoryFormData(prev => ({ ...prev, parentCategoryId: id || null }))}
                placeholder="Select parent category..."
                allowCreate={false}
              />
              <p className="text-xs text-gray-500 mt-1">You must select a parent category for subcategories</p>
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
            <Button variant="outline" onClick={() => setShowAddSubCategoryModal(false)}>
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
              queryClient.invalidateQueries({ queryKey: ['categoryProducts', selectedCategoryId] });
              queryClient.invalidateQueries({ queryKey: ['products'] });
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
            queryClient.invalidateQueries({ queryKey: ['categoryProducts', selectedCategoryId] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
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
      <AddProductMethodModal
        isOpen={isAddProductMethodModalOpen}
        onClose={() => setIsAddProductMethodModalOpen(false)}
        onSelectMethod={handleAddProductMethodSelect}
      />
      
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setPreFilledProductName('');
          setScannedSKU('');
        }}
        onProductAdded={async () => {
          queryClient.invalidateQueries({ queryKey: ['categoryProducts', selectedCategoryId] });
          queryClient.invalidateQueries({ queryKey: ['products'] });
          setIsAddModalOpen(false);
          setPreFilledProductName('');
          setScannedSKU('');
        }}
        preFilledSKU={scannedSKU}
        preFilledName={preFilledProductName}
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
                <Button
                  onClick={() => {
                    setIsMobileProductDetailModalOpen(false);
                    handleMoveToLocation(selectedProduct);
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                  Move to Location
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
