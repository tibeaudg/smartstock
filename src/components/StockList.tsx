import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database, TablesUpdate } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Trash2,
  X,
  Minus,
  Tag,
  Truck,
  Eye,
  EyeOff,
  Settings,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Upload,
  ShoppingBasket,
  Palette,
  MoreVertical,
  MapPin,
  AlertCircle,
  Archive,
  Copy,
  PackageOpen,
  Grid3x3,
  List,
  Heart,
  Scan,
  Download
} from 'lucide-react';
import { ProductActionModal } from './ProductActionModal';
import { EditProductModal } from './EditProductModal';
import { EditProductInfoModal } from './EditProductInfoModal';
import { StockMovementForm } from './stock/StockMovementForm';
import { ProductFilters } from './ProductFilters';
import { EnhancedProductFilters } from './EnhancedProductFilters';
import { ImagePreviewModal } from './ImagePreviewModal';
import { AddProductModal } from './AddProductModal';
import { EditProductStockModal } from './EditProductStockModal';
import { VariantSelectionModal } from './VariantSelectionModal';
import { AddVariantModal } from './AddVariantModal';
import { BulkImportModal } from './BulkImportModal';
import { ManualStockAdjustModal } from './ManualStockAdjustModal';
import { StockOperationModal } from './StockOperationModal';
import { BarcodeScanner } from './BarcodeScanner';
import { ProductCard } from './ProductCard';
import { FirstProductFeedbackModal } from './FirstProductFeedbackModal';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Upload as UploadIcon } from 'lucide-react';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { useProductCount } from '@/hooks/useDashboardData';
import { useSubscription } from '@/hooks/useSubscription';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';

const getStockStatus = (quantity: number, minLevel: number) => {
  // Ensure we're working with numbers
  const qty = Number(quantity);
  const min = Number(minLevel);
  
  if (qty === 0) return 'Out of Stock';
  if (qty > 0 && qty <= min) return 'Low Stock';
  return 'In Stock';
};

const getStockStatusVariant = (status: string) => {
  switch (status) {
    case 'In Stock': return 'success';
    case 'Low Stock': return 'warning';
    case 'Out of Stock': return 'destructive';
    default: return 'destructive';
  }
};

// Helper function to get stock status dot color
const getStockStatusDotColor = (quantity: number, minLevel: number) => {
  // Ensure we're working with numbers
  const qty = Number(quantity);
  const min = Number(minLevel);
  
  if (qty === 0) return 'bg-red-500';
  if (qty > 0 && qty <= min) return 'bg-orange-500';
  return 'bg-green-500';
};

// Helper function to get stock pill color classes
const getStockPillColor = (quantity: number, minLevel: number) => {
  const qty = Number(quantity);
  const min = Number(minLevel);
  if (qty === 0) return 'bg-red-100 text-red-700 border-red-200 border';
  if (qty > 0 && qty <= min) return 'bg-yellow-100 text-yellow-700 border-yellow-200 border';
  return 'bg-green-100 text-green-700 border-green-200 border';
};

// Helper function to format variant attributes
const formatVariantAttributes = (attributes: Record<string, unknown> | null): string[] => {
  if (!attributes) return [];
  
  const formatted: string[] = [];
  Object.entries(attributes).forEach(([key, value]) => {
    if (value && typeof value === 'string') {
      formatted.push(`${key}: ${value}`);
    }
  });
  return formatted;
};

// Helper function to normalize quantity display
const formatStockQuantity = (quantity: number | string): string => {
  const parsed = Number(quantity);
  if (Number.isNaN(parsed)) return '0';
  return parsed.toLocaleString('en-US');
};

// Helper function to get stock level percentage for visual bar
const getStockLevelPercentage = (current: number, minimum: number): number => {
  if (minimum === 0) return 100;
  return Math.min((current / minimum) * 100, 100);
};

// Helper function to get stockable products (variants if they exist, otherwise parent products)
const getStockableProducts = (products: Product[]): Product[] => {
  const stockable: Product[] = [];
  products.forEach(product => {
    if (product.is_variant) {
      stockable.push(product);
    } else {
      // Check if product has variants
      const hasVariants = products.some(p => p.parent_product_id === product.id);
      if (!hasVariants) {
        stockable.push(product);
      }
    }
  });
  return stockable;
};

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  purchase_price: number;
  sale_price: number;
  status: string | null;
  category_id: string | null;
  category_name: string | null;
  image_url?: string | null;
  location?: string | null;
  sku?: string | null;
  barcode?: string | null;
  is_variant?: boolean;
  parent_product_id?: string | null;
  variant_name?: string | null;
  variant_attributes?: Record<string, unknown> | null;
  variant_sku?: string | null;
  variant_barcode?: string | null;
  is_favorite?: boolean;
}

interface StockTransaction {
  id: string;
  created_at: string;
  product_id: string;
  product_name: string;
  transaction_type: 'incoming' | 'outgoing';
  quantity: number;
  unit_price: number | string;
  total_value?: number | string;
  reference_number: string | null;
  notes: string | null;
  branch_id: string;
  created_by: string;
  variant_id?: string | null;
  variant_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

type StockAction = 'in' | 'out';

// Photo Upload Placeholder Component
interface PhotoUploadPlaceholderProps {
  productId: string;
  size?: 'small' | 'medium' | 'large';
  onUploadSuccess?: (imageUrl: string) => void;
}

export const PhotoUploadPlaceholder: React.FC<PhotoUploadPlaceholderProps> = ({ 
  productId, 
  size = 'medium',
  onUploadSuccess 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const sizeClasses = {
    small: 'w-14 h-14',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const handleFileUpload = async (file: File) => {
    if (!user || !file) return;

    // Validate file type - only allow specific image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
      toast.error('Invalid file extension');
      return;
    }

    setIsUploading(true);

    try {
      // Create unique filename
      const fileName = `${user.id}/${productId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Update product with new image URL
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('id', productId);

      if (updateError) throw updateError;

      toast.success('Product photo uploaded successfully');
      onUploadSuccess?.(publicUrl);
      
      // Refresh the page after a short delay to show the updated image
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <TooltipProvider>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`${sizeClasses[size]} rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : (
              <Plus className={`${iconSizes[size]} text-gray-400 transition-colors ${isDragging ? 'text-blue-500' : 'hover:text-blue-500'}`} />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Add Product Photo</p>
          <p className="text-xs text-gray-400">Click or drag to upload</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Product Detail Drawer Component
interface ProductDetailDrawerProps {
  product: Product;
  isOpen: boolean;
  columnCount: number;
}

const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({ product, isOpen, columnCount }) => {
  const { activeBranch } = useBranches();
  const [stockHistory, setStockHistory] = useState<StockTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchStockHistory = useCallback(async () => {
    if (!activeBranch?.branch_id) return;
    
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('stock_transactions')
        .select('*')
        .eq('product_id', product.id)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching stock history:', error);
        setStockHistory([]);
      } else {
        setStockHistory(data || []);
      }
    } catch (error) {
      console.error('Error fetching stock history:', error);
      setStockHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [activeBranch?.branch_id, product.id]);

  // Fetch recent stock history when drawer opens
  useEffect(() => {
    if (isOpen && product.id) {
      fetchStockHistory();
    }
  }, [isOpen, product.id, fetchStockHistory]);

  if (!isOpen) return null;

  return (
    <tr className="bg-gray-50 border-t border-b border-gray-200">
      
      <td colSpan={columnCount} className="px-4 py-4">
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Details</h3>
              
              {product.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {product.variant_sku && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">SKU</label>
                    <p className="text-sm text-gray-900 mt-1 font-mono">{product.variant_sku}</p>
                  </div>
                )}
                
                {product.variant_barcode && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Barcode</label>
                    <p className="text-sm text-gray-900 mt-1 font-mono">{product.variant_barcode}</p>
                  </div>
                )}
              </div>

              {product.location && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {product.location}
                  </p>
                </div>
              )}


              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Price</label>
                  <p className="text-sm text-red-600 font-semibold mt-1">
                    ${product.purchase_price ? Number(product.purchase_price).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Sale Price</label>
                  <p className="text-sm text-green-600 font-semibold mt-1">
                    ${product.sale_price ? Number(product.sale_price).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Margin</label>
                  <p className="text-sm text-blue-600 font-semibold mt-1">
                    ${product.sale_price && product.purchase_price 
                      ? (Number(product.sale_price) - Number(product.purchase_price)).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Stock History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Recent Stock History</h3>
              
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : stockHistory.length > 0 ? (
                <div className="space-y-2">
                  {stockHistory.map((transaction, index) => (
                    <div 
                      key={transaction.id || index} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.transaction_type === 'incoming' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.transaction_type === 'incoming' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.transaction_type === 'incoming' ? 'Stock In' : 'Stock Out'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          transaction.transaction_type === 'incoming' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.transaction_type === 'incoming' ? '+' : '-'}{Math.abs(transaction.quantity)}
                        </p>
                        {transaction.notes && (
                          <p className="text-xs text-gray-500 max-w-[150px] truncate">{transaction.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm">No stock history available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

// EditableCell component for inline editing
interface EditableCellProps {
  value: string | number;
  onSave: (newValue: string | number) => Promise<void>;
  type?: 'text' | 'number';
  className?: string;
  compactMode?: boolean;
  placeholder?: string;
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onSave,
  type = 'text',
  className = '',
  compactMode = false,
  placeholder = '',
  isEditing: externalIsEditing,
  onEditingChange
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const [isSaving, setIsSaving] = useState(false);

  // Use external editing state if provided, otherwise use internal
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = externalIsEditing !== undefined 
    ? (editing: boolean) => onEditingChange?.(editing)
    : setInternalIsEditing;

  // Sync editValue when value changes (but not while editing)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(String(value));
    }
  }, [value, isEditing]);

  // Auto-start editing when external isEditing becomes true
  useEffect(() => {
    if (externalIsEditing && !internalIsEditing && !isSaving) {
      setInternalIsEditing(true);
      setEditValue(String(value));
    }
  }, [externalIsEditing, value, isSaving, internalIsEditing]);

  const handleClick = () => {
    if (!isSaving) {
      setIsEditing(true);
      setEditValue(String(value));
    }
  };

  const handleSave = async () => {
    if (editValue === String(value)) {
      setIsEditing(false);
      if (externalIsEditing !== undefined && onEditingChange) {
        onEditingChange(false);
      }
      return;
    }

    setIsSaving(true);
    try {
      const finalValue = type === 'number' ? Number(editValue) : editValue;
      await onSave(finalValue);
      setIsEditing(false);
      if (externalIsEditing !== undefined && onEditingChange) {
        onEditingChange(false);
      }
    } catch (error) {
      console.error('Error saving:', error);
      setEditValue(String(value)); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
    if (externalIsEditing !== undefined && onEditingChange) {
      onEditingChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        disabled={isSaving}
        className={cn(
          "h-7 px-2 text-sm border-blue-500 focus:border-blue-500 focus:ring-blue-500",
          compactMode && "h-6 text-xs",
          className
        )}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 transition-colors min-h-[28px] flex items-center",
        compactMode && "min-h-[24px]",
        className
      )}
      title="Click to edit"
    >
      {isSaving ? (
        <span className="text-gray-400 text-xs">Saving...</span>
      ) : (
        <span>{value || placeholder || '-'}</span>
      )}
    </div>
  );
};

interface ProductRowProps {
  product: Product;
  isVariant?: boolean;
  isSelected?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  variantCount?: number;
  columnVisibility: Record<string, boolean>;
  compactMode?: boolean;
  onToggleExpand?: () => void;
  onSelect?: (id: string) => void;
  onStockAction: (product: Product, action: StockAction) => void;
  onEdit: (product: Product) => void;
  onAddVariant?: (product: Product) => void;
  onImagePreview: (url: string) => void;
  isAdmin?: boolean;
  isDetailExpanded?: boolean;
  onToggleDetailExpand?: () => void;
  onImageUpload?: () => void;
  onDuplicate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onMoveToLocation?: (product: Product) => void;
  onFieldUpdate?: (productId: string, field: string, value: string | number) => Promise<void>;
  onStockUpdate?: (productId: string, newQuantity: number) => Promise<void>;
  rowIndex?: number;
  isFocused?: boolean;
  isEditingStock?: boolean;
  onStartEditingStock?: () => void;
  rowRef?: (node: HTMLTableRowElement | null) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  isVariant = false,
  isSelected = false,
  hasChildren = false,
  isExpanded = false,
  variantCount = 0,
  columnVisibility,
  compactMode = false,
  onToggleExpand,
  onSelect,
  onStockAction,
  onEdit,
  onAddVariant,
  onImagePreview,
  isAdmin = false,
  isDetailExpanded = false,
  onToggleDetailExpand,
  onImageUpload,
  onDuplicate,  
  onDelete,
  onMoveToLocation,
  onFieldUpdate,
  onStockUpdate,
  rowIndex = 0,
  isFocused = false,
  isEditingStock = false,
  onStartEditingStock,
  rowRef
}) => {
  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
  const stockLevelPercentage = getStockLevelPercentage(product.quantity_in_stock, product.minimum_stock_level);
  const variantAttributes = formatVariantAttributes(product.variant_attributes);

  // Determine row background color for alternating pattern
  const getRowBackgroundColor = () => {
    if (isVariant) return 'bg-blue-50/20';
    return rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50';
  };

  return (
    <tr 
      ref={rowRef}
      tabIndex={0}
      className={cn(
        `${getRowBackgroundColor()} hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100`,
        compactMode && 'h-8',
        isFocused && 'ring-2 ring-blue-500 ring-offset-1 outline-none'
      )}
    >
      {/* Selection checkbox */}
      {isAdmin && (
        <td className={cn(
          "text-center w-12",
          compactMode ? "px-2 py-1" : "px-3 py-2"
        )} onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.(product.id)}
            className={cn(
              "text-blue-600 rounded border-gray-300 focus:ring-blue-500",
              compactMode ? "w-3 h-3" : "w-4 h-4"
            )}
          />
        </td>
      )}

      {/* Product column */}
      {columnVisibility.product && (
        <td className={cn(
          "w-1/4",
          compactMode ? "px-2 py-1" : "px-3 py-2"
        )}>
          <div className={cn(
            "flex items-center",
            compactMode ? "gap-1.5" : "gap-2"
          )}>
            {/* Expand/Collapse indicator for variants */}
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand?.();
                }}
                className="p-1 flex-shrink-0 hover:bg-blue-100 rounded transition-colors"
                title="Toggle variants"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4 text-blue-600" />}
              </button>
            )}
            
            {/* Variant indent */}
            {isVariant && <div className="w-6" />}

            {/* Product icon */}
            <div className="flex-shrink-0">
              {isVariant ? (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Palette className="w-4 h-4 text-purple-600" />
                </div>
              ) : (
                <div className="">
                </div>
              )}
            </div>

            {/* Product image - strict 40px x 40px */}
            <div className="flex-shrink-0 w-10 h-10" onClick={(e) => e.stopPropagation()}>
              {product.image_url ? (
                <div className="w-10 h-10 bg-gray-50 rounded border flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={`${product.name} product image`}
                    className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onImagePreview(product.image_url!)}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                  <PhotoUploadPlaceholder
                    productId={product.id}
                    size="small"
                    onUploadSuccess={() => onImageUpload?.()}
                  />
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                "flex items-center flex-wrap",
                compactMode ? "gap-1" : "gap-2"
              )}>
                {onFieldUpdate ? (
                  <EditableCell
                    value={product.name}
                    onSave={async (newValue) => {
                      await onFieldUpdate(product.id, 'name', String(newValue));
                    }}
                    type="text"
                    compactMode={compactMode}
                    className="font-semibold text-gray-900 truncate flex-1"
                  />
                ) : (
                  <h3 className={cn(
                    "font-semibold text-gray-900 truncate",
                    compactMode ? "text-xs" : "text-sm"
                  )}>
                    {product.name}
                  </h3>
                )}
                {product.category_name && (
                  <Badge className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border-0">
                    {product.category_name}
                  </Badge>
                )}
                {isVariant && product.variant_name && (
                  <span className="text-gray-600 text-sm"> - {product.variant_name}</span>
                )}

                {hasChildren && !isExpanded && variantCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs hidden md:inline-flex">
                    {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
                  </Badge>
                )}
              </div>
              
              {/* Variant attributes */}
              {isVariant && variantAttributes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {variantAttributes.map((attr, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-50">
                      {attr}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </td>
      )}

      {/* SKU column */}
      {columnVisibility.sku && (
        <td className={cn(
          "text-left w-1/12",
          compactMode ? "px-2 py-1" : "px-3 py-2"
        )}>
          {!hasChildren && onFieldUpdate ? (
            <EditableCell
              value={(isVariant ? product.variant_sku : product.sku) || ''}
              onSave={async (newValue) => {
                const field = isVariant ? 'variant_sku' : 'sku';
                await onFieldUpdate(product.id, field, String(newValue));
              }}
              type="text"
              compactMode={compactMode}
              className="font-mono font-medium text-gray-900"
              placeholder="SKU"
            />
          ) : !hasChildren ? (
            <span className={cn(
              "text-gray-900 font-mono font-medium",
              compactMode ? "text-xs" : "text-sm"
            )}>
              {(isVariant ? product.variant_sku : product.sku) || '-'}
            </span>
          ) : null}
        </td>
      )}

      {/* Location column */}
      {columnVisibility.location && (
        <td className={cn(
          "text-center w-1/8",
          compactMode ? "px-2 py-1" : "px-3 py-2"
        )}>
          {!hasChildren && (
            <div className="flex items-center justify-center gap-1">
              <MapPin className={cn(
                "text-gray-400",
                compactMode ? "w-2.5 h-2.5" : "w-3 h-3"
              )} />
              {onFieldUpdate ? (
                <EditableCell
                  value={product.location || ''}
                  onSave={async (newValue) => {
                    await onFieldUpdate(product.id, 'location', String(newValue));
                  }}
                  type="text"
                  compactMode={compactMode}
                  className="text-gray-600"
                  placeholder="Location"
                />
              ) : (
                <span className={cn(
                  "text-gray-600",
                  compactMode ? "text-xs" : "text-sm"
                )}>
                  {product.location || '-'}
                </span>
              )}
            </div>
          )}
        </td>
      )}

      {/* Stock column with Status */}
      {columnVisibility.current && (
        <td className={cn(
          "text-center w-1/8",
          compactMode ? "px-2 py-1" : "px-3 py-2"
        )}>
          {!hasChildren && (
            <div className="flex items-center justify-center">
              {onStockUpdate ? (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <EditableCell
                          value={product.quantity_in_stock}
                          onSave={async (newValue) => {
                            await onStockUpdate(product.id, Number(newValue));
                            setEditingCell(null);
                          }}
                          type="number"
                          compactMode={compactMode}
                          isEditing={isEditingStock}
                          onEditingChange={(editing) => {
                            if (!editing) {
                              setEditingCell(null);
                            }
                          }}
                          className={cn(
                            "font-semibold inline-flex items-center justify-center",
                            getStockPillColor(product.quantity_in_stock, product.minimum_stock_level),
                            compactMode ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"
                          )}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      sideOffset={8}
                      className="z-[200000] max-w-xs shadow-lg"
                    >
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
                      <p className="text-xs text-gray-400 mt-1">Click to edit quantity</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="inline-flex"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStockAction(product, 'in');
                        }}
                      >
                        <Badge
                          className={cn(
                            "font-semibold cursor-pointer transition-colors hover:opacity-80",
                            getStockPillColor(product.quantity_in_stock, product.minimum_stock_level),
                            compactMode ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"
                          )}
                        >
                          {formatStockQuantity(product.quantity_in_stock)}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      sideOffset={8}
                      className="z-[200000] max-w-xs shadow-lg"
                    >
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
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
        </td>
      )}

      {/* Category column */}
      {columnVisibility.category && (
        <td className={cn(
          "text-center w-1/8",
          compactMode ? "px-2 py-1" : "px-3 py-2"
        )}>
          {!hasChildren && (
            <span className={cn(
              "text-gray-600",
              compactMode ? "text-xs" : "text-sm"
            )}>
              {product.category_name || '-'}
            </span>
          )}
        </td>
      )}


      {/* Cost column */}
      {columnVisibility.purchasePrice && (
        <td className={cn(
          "text-center w-1/8",
          compactMode ? "px-2 py-1" : "px-3 py-2"
        )}>
          {!hasChildren && (
            <div className={cn(
              "text-red-600 font-medium",
              compactMode ? "text-xs" : "text-sm"
            )}>
              ${product.purchase_price ? Number(product.purchase_price).toFixed(2) : '-'}
            </div>
          )}
        </td>
      )}

      {/* Price column */}
      {columnVisibility.salePrice && (
        <td className={cn(
          "text-center w-1/8",
          compactMode ? "px-2 py-1" : "px-3 py-2"
        )}>
          {!hasChildren && (
            <div className={cn(
              "text-green-600 font-medium",
              compactMode ? "text-xs" : "text-sm"
            )}>
              ${product.sale_price ? Number(product.sale_price).toFixed(2) : '-'}
            </div>
          )}
        </td>
      )}

      {/* Actions column */}
      {columnVisibility.actions && (
        <td className="px-3 py-2 text-center w-1/12" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Stock Actions - Only show for variants, not parent products */}
              {!hasChildren && (
                <DropdownMenuItem onClick={() => onStockAction(product, 'in')}>
                  <Plus className="w-4 h-4 mr-2 text-green-600" />
                  <span className="flex-1">Adjust Stock</span>
                </DropdownMenuItem>
              )}
              
              {hasChildren && onAddVariant && (
                <DropdownMenuItem onClick={() => onAddVariant(product)}>
                  <Plus className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="flex-1">Add Variant</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {/* Primary Actions */}
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="w-4 h-4 mr-2 text-blue-600" />
                <span className="flex-1">Edit</span>
              </DropdownMenuItem>
              
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(product)}>
                  <Copy className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="flex-1">Duplicate</span>
                </DropdownMenuItem>
              )}
              
              {onMoveToLocation && (
                <DropdownMenuItem onClick={() => onMoveToLocation(product)}>
                  <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="flex-1">Move to Location</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {/* Destructive Actions */}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete(product)}>
                  <Trash2 className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="flex-1">Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      )}
    </tr>
  );
};

// Mobile Product Detail Drawer Component
interface MobileProductDetailDrawerProps {
  product: Product;
  isOpen: boolean;
}

const MobileProductDetailDrawer: React.FC<MobileProductDetailDrawerProps> = ({ product, isOpen }) => {
  const { activeBranch } = useBranches();
  const [stockHistory, setStockHistory] = useState<StockTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchStockHistory = useCallback(async () => {
    if (!activeBranch?.branch_id) return;
    
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('stock_transactions')
        .select('*')
        .eq('product_id', product.id)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching stock history:', error);
        setStockHistory([]);
      } else {
        setStockHistory(data || []);
      }
    } catch (error) {
      console.error('Error fetching stock history:', error);
      setStockHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [activeBranch?.branch_id, product.id]);

  // Fetch recent stock history when drawer opens
  useEffect(() => {
    if (isOpen && product.id) {
      fetchStockHistory();
    }
  }, [isOpen, product.id, fetchStockHistory]);

  if (!isOpen) return null;

  return (
    <div className="mt-3 bg-white rounded-lg border-2 border-blue-200 p-4 shadow-sm">
      <div className="space-y-4">
        {/* Product Details Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Product Details</h4>
          
          {product.description && (
            <div>
              <label className="text-xs font-medium text-gray-700">Description</label>
              <p className="text-xs text-gray-600 mt-1">{product.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            {product.variant_sku && (
              <div>
                <label className="text-xs font-medium text-gray-700">SKU</label>
                <p className="text-xs text-gray-900 mt-1 font-mono">{product.variant_sku}</p>
              </div>
            )}
            
            {product.variant_barcode && (
              <div>
                <label className="text-xs font-medium text-gray-700">Barcode</label>
                <p className="text-xs text-gray-900 mt-1 font-mono">{product.variant_barcode}</p>
              </div>
            )}
          </div>

          {product.location && (
            <div>
              <label className="text-xs font-medium text-gray-700">Location</label>
              <p className="text-xs text-gray-900 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                {product.location}
              </p>
            </div>
          )}


          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Purchase</label>
              <p className="text-xs text-red-600 font-semibold mt-1">
                ${product.purchase_price ? Number(product.purchase_price).toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Sale</label>
              <p className="text-xs text-green-600 font-semibold mt-1">
                ${product.sale_price ? Number(product.sale_price).toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Margin</label>
              <p className="text-xs text-blue-600 font-semibold mt-1">
                ${product.sale_price && product.purchase_price 
                  ? (Number(product.sale_price) - Number(product.purchase_price)).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Stock History Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Recent Stock History</h4>
          
          {loadingHistory ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          ) : stockHistory.length > 0 ? (
            <div className="space-y-2">
              {stockHistory.map((transaction, index) => (
                <div 
                  key={transaction.id || index} 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === 'incoming' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.transaction_type === 'incoming' ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {transaction.transaction_type === 'incoming' ? 'In' : 'Out'}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${
                      transaction.transaction_type === 'incoming' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'incoming' ? '+' : '-'}{Math.abs(transaction.quantity)}
                    </p>
                    {transaction.notes && (
                      <p className="text-[10px] text-gray-500 max-w-[100px] truncate">{transaction.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-gray-500">
              <AlertCircle className="w-6 h-6 mb-1" />
              <p className="text-xs">No history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mobile Product List Item Component
interface MobileProductListItemProps {
  product: Product;
  isVariant?: boolean;
  isSelected?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  variantCount?: number;
  onToggleExpand?: () => void;
  onSelect?: (id: string) => void;
  onStockAction: (product: Product, action: StockAction) => void;
  onEdit: (product: Product) => void;
  onAddVariant?: (product: Product) => void;
  onImagePreview: (url: string) => void;
  isAdmin?: boolean;
  isDetailExpanded?: boolean;
  onToggleDetailExpand?: () => void;
  onImageUpload?: () => void;
  onDuplicate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onMoveToLocation?: (product: Product) => void;
}

const MobileProductListItem: React.FC<MobileProductListItemProps> = ({
  product,
  isVariant = false,
  isSelected = false,
  hasChildren = false,
  isExpanded = false,
  variantCount = 0,
  onToggleExpand,
  onSelect,
  onStockAction,
  onEdit,
  onAddVariant,
  onImagePreview,
  isAdmin = false,
  isDetailExpanded = false,
  onToggleDetailExpand,
  onImageUpload,
  onDuplicate,
  onDelete,
  onMoveToLocation
}) => {
  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
  const variantAttributes = formatVariantAttributes(product.variant_attributes);

  return (
    <div className={`${isVariant ? 'ml-4' : ''}`}>
      <div className="bg-white border-b border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          {/* Selection checkbox */}
          {isAdmin && (
            <div onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect?.(product.id)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Expand/Collapse indicator for variants */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              className="p-1 flex-shrink-0 hover:bg-blue-50 rounded transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4 text-blue-600" />}
            </button>
          )}

          {/* Product image */}
          <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {product.image_url ? (
              <div className="w-12 h-12 bg-gray-50 rounded-lg border flex items-center justify-center overflow-hidden">
                <img
                  src={product.image_url}
                  alt={`${product.name} product image`}
                  className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onImagePreview(product.image_url!)}
                />
              </div>
            ) : (
              <PhotoUploadPlaceholder
                productId={product.id}
                size="medium"
                onUploadSuccess={() => onImageUpload?.()}
              />
            )}
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
                {isVariant && product.variant_name && (
                  <span className="text-gray-600"> - {product.variant_name}</span>
                )}
              </h3>
              
              {hasChildren && !isExpanded && variantCount > 0 && (
                <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs hidden md:inline-flex">
                  {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
                </Badge>
              )}
            </div>
            
            {/* Variant attributes */}
            {isVariant && variantAttributes.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {variantAttributes.map((attr, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-gray-50">
                    {attr}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Description */}
            {product.description && (
              <p className="text-xs text-gray-500 truncate">
                {product.description}
              </p>
            )}

            {/* Additional info row */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {/* Stock status */}
                {!hasChildren && (
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getStockStatusDotColor(product.quantity_in_stock, product.minimum_stock_level)}`} />
                    <span className="font-medium">{formatStockQuantity(product.quantity_in_stock)}</span>
                    <span className="text-gray-400">in stock</span>
                  </div>
                )}
                
                {/* Category */}
                {product.category_name && (
                  <span>{product.category_name}</span>
                )}
              </div>

            </div>
          </div>

          {/* Actions dropdown for non-variant items */}
          {!hasChildren && (
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="flex-1">Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onStockAction(product, 'in')}>
                    <Plus className="w-4 h-4 mr-2 text-green-600" />
                    <span className="flex-1">Adjust Stock</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Actions dropdown for products with children */}
          {hasChildren && (
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {onAddVariant && (
                    <DropdownMenuItem onClick={() => onAddVariant(product)}>
                      <Plus className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="flex-1">Add Variant</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="flex-1">Edit</span>
                  </DropdownMenuItem>
                  {onDuplicate && (
                    <DropdownMenuItem onClick={() => onDuplicate(product)}>
                      <Copy className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="flex-1">Duplicate</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(product)}>
                      <Trash2 className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="flex-1">Delete</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Detail Drawer */}
      {hasChildren && (
        <MobileProductDetailDrawer
          product={product}
          isOpen={isDetailExpanded}
        />
      )}
    </div>
  );
};

// Mobile Product Card Component
interface MobileProductCardProps {
  product: Product;
  isVariant?: boolean;
  isSelected?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  variantCount?: number;
  onToggleExpand?: () => void;
  onSelect?: (id: string) => void;
  onStockAction: (product: Product, action: StockAction) => void;
  onEdit: (product: Product) => void;
  onAddVariant?: (product: Product) => void;
  onImagePreview: (url: string) => void;
  isAdmin?: boolean;
  isDetailExpanded?: boolean;
  onToggleDetailExpand?: () => void;
  onImageUpload?: () => void;
  onDuplicate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onMoveToLocation?: (product: Product) => void;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({
  product,
  isVariant = false,
  isSelected = false,
  hasChildren = false,
  isExpanded = false,
  variantCount = 0,
  onToggleExpand,
  onSelect,
  onStockAction,
  onEdit,
  onAddVariant,
  onImagePreview,
  isAdmin = false,
  isDetailExpanded = false,
  onToggleDetailExpand,
  onImageUpload,
  onDuplicate,
  onDelete,
  onMoveToLocation
}) => {
  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
  const stockLevelPercentage = getStockLevelPercentage(product.quantity_in_stock, product.minimum_stock_level);
  const variantAttributes = formatVariantAttributes(product.variant_attributes);

  return (
    <div className={`${isVariant ? 'ml-6' : ''}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {/* Image section with overlay */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <img 
                src={product.image_url} 
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onImagePreview(product.image_url!)}
                alt={`${product.name} product image`}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PhotoUploadPlaceholder 
                productId={product.id} 
                size="large"
              />
            </div>
          )}
          
          {/* Favorite button - top right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // onFavoriteToggle(product.id, !product.is_favorite);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${product.is_favorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
          
          {/* Dark gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Product name and details on overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-white/90 mb-2">
              {isVariant ? 'Variant' : (product.category_name || 'Product')}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {formatStockQuantity(product.quantity_in_stock)} in stock
              </span>
            </div>
          </div>
        </div>
        
        {/* Actions dropdown at bottom center */}
        <div className="p-4 flex justify-center">
          {!hasChildren ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-6 py-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  <MoreVertical className="w-4 h-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Edit className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="flex-1">Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onStockAction(product, 'in')}>
                  <Plus className="w-4 h-4 mr-2 text-green-600" />
                  <span className="flex-1">Adjust Stock</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="px-6 py-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => onStockAction(product, 'in')}
            >
              Adjust Stock
            </Button>
          )}
        </div>
      </div>
      
      {/* Product Detail Drawer - only show for products with variants */}
      {hasChildren && (
        <MobileProductDetailDrawer
          product={product}
          isOpen={isDetailExpanded}
        />
      )}
    </div>
  );
};

const fetchProducts = async (
  branchId: string,
  previousData: Product[] = [],
  options: { skipRetry?: boolean; expectedCount?: number } = {},
  page: number = 1,
  perPage: number = 50
) => {
  const expectedCount = options.expectedCount ?? 0;
  const performFetch = async (): Promise<Product[]> => {
    
    // Haal eerst de producten op
    const from = Math.max(0, (page - 1) * perPage);
    const to = from + perPage - 1;
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('branch_id', branchId)
      .order('name')
      .range(from, to);
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw productsError;
    }
    
    if (!products || products.length === 0) {
      return [];
    }

    // Type fix: specify product type so TS knows about category_id and supplier_id
    const typedProducts = products as Array<{
      id: string;
      name: string;
      description: string | null;
      quantity_in_stock: number;
      minimum_stock_level: number;
      unit_price: number;
      purchase_price: number;
      sale_price: number;
      status: string | null;
      category_id: string | null;
      supplier_id: string | null;
      branch_id: string;
      image_url: string | null;
      location: string | null;
      sku: string | null;
      is_variant: boolean;
      parent_product_id: string | null;
      variant_name: string | null;
      variant_attributes: Record<string, unknown> | null;
      variant_sku: string | null;
      variant_barcode: string | null;
      is_favorite: boolean;
      [key: string]: unknown;
    }>;

    // Haal de unieke Category IDs op
    const categoryIds = [
      ...new Set(typedProducts.map(p => p.category_id).filter((id): id is string => Boolean(id)))
    ];

    // Haal Category namen op
    let categories: { [key: string]: string } = {};

    if (categoryIds.length > 0) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);
      
      if (!categoryError && categoryData) {
        categories = categoryData.reduce((acc: { [key: string]: string }, cat: { id: string; name: string }) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {} as { [key: string]: string });
      }
    }
    
    // Voeg de namen toe aan de producten
    const transformedData = typedProducts.map(product => ({
      ...product,
      category_name: product.category_id ? categories[product.category_id] || null : null
    }));
    
    return transformedData;
  };

  try {
    const result = await performFetch();

    if (result.length === 0 && previousData.length > 0 && !options.skipRetry) {
      console.warn('[StockList] Empty product result despite cached data. Attempting session refresh before retrying.');
      try {
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          throw refreshError;
        }

        if (!refreshed?.session) {
          throw new Error('No session returned after refreshSession');
        }

        const retryResult = await fetchProducts(branchId, previousData, {
          skipRetry: true,
          expectedCount,
        });
        if (retryResult.length === 0) {
          console.warn('[StockList] Retry after session refresh still returned no products. Falling back to cached data.');
          return previousData;
        }

        return retryResult;
      } catch (retryError) {
        console.error('[StockList] Failed to refresh session or refetch products. Falling back to cached data.', retryError);
        return previousData;
      }
    }

    if (result.length === 0 && expectedCount > 0 && previousData.length > 0) {
      console.warn('[StockList] DB returned 0 products but usage count indicates data exists. Keeping cached list.');
      return previousData;
    }

    return result;
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    if (previousData.length > 0 && !options.skipRetry) {
      console.warn('[StockList] Returning cached products because fetch failed.');
      return previousData;
    }
    throw error;
  }
};

export const StockList = () => {
  const { user, userProfile } = useAuth();
  const { t } = useTranslation();
  const { activeBranch, loading: branchesLoading, hasNoBranches } = useBranches();
  const queryClient = useQueryClient();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  const { productCount: branchProductCount } = useProductCount();
  const { productCount: subscriptionProductCount } = useSubscription();

  // Check if user is admin
  const isAdmin = userProfile?.is_owner === true;

  // Pagination
  const PER_PAGE = 50;
  const [page, setPage] = useState(1);

  // Enhanced filter state
  const [filters, setFilters] = useState({
    searchTerm: '',
    categoryFilter: 'all',
    stockStatusFilter: 'all',
    locationFilter: 'all',
    minPriceFilter: '',
    maxPriceFilter: '',
    minStockFilter: '',
    maxStockFilter: '',
    selectedSizes: [] as string[],
    selectedColors: [] as string[],
    favoritesFilter: false,
  });

  // View mode state with localStorage persistence
  const [viewMode, setViewMode] = useState<'list' | 'card'>(() => {
    const saved = localStorage.getItem('stockViewMode');
    return (saved as 'list' | 'card') || 'list';
  });
  
  // State voor filter namen (voor weergave)
  const [categoryFilterName, setCategoryFilterName] = useState('');
  
  // State voor Categoryën (voor filter namen)
  const [categories, setCategorys] = useState<Array<{ id: string; name: string }>>([]);

  // State voor modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isProductActionModalOpen, setIsProductActionModalOpen] = useState(false);
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);
  const [isVariantSelectionModalOpen, setIsVariantSelectionModalOpen] = useState(false);
  const [isManualStockModalOpen, setIsManualStockModalOpen] = useState(false);

  // Keyboard navigation state
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: 'stock' } | null>(null);
  const tableRef = React.useRef<HTMLTableElement>(null);
  const rowRefs = React.useRef<Map<number, HTMLTableRowElement>>(new Map());

  // Scan-to-action state
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const barcodeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  // Test state variable
  const [isStockOperationModalOpen, setIsStockOperationModalOpen] = useState(false);

  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAction, setSelectedAction] = useState<StockAction>('in');
  const [scannedSKU, setScannedSKU] = useState<string>('');
  const [preFilledProductName, setPreFilledProductName] = useState<string>('');
  const [selectedOperationType, setSelectedOperationType] = useState<'scan' | 'manual'>('scan');
  const [productVariants, setProductVariants] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);

  // State voor bulk selectie (desktop)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // State voor image preview
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');

  // State voor add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // State for feedback modal
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  // Debug feedback modal state changes
  useEffect(() => {
    console.log('[StockList] Feedback modal state changed to:', isFeedbackModalOpen);
  }, [isFeedbackModalOpen]);

  // State voor bulk import modal
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);

  // Mobile tab switcher state
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    product: true,
    sku: true,
    current: true,
    category: true,
    location: true,
    purchasePrice: true,
    salePrice: true,
    actions: true
  });

  // Compact mode state - default to true
  const [compactMode, setCompactMode] = useState(true);

  // Parent row expand/collapse
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const toggleExpand = (parentId: string) => {
    setExpandedParents(prev => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  // Product detail drawer expand/collapse
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const toggleDetailExpand = (productId: string) => {
    setExpandedDetails(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Load column visibility from localStorage on component mount
  useEffect(() => {
    const savedVisibility = localStorage.getItem('stockTableColumnVisibility');
    if (savedVisibility) {
      try {
        const parsed = JSON.parse(savedVisibility);
        setColumnVisibility(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved column visibility:', error);
      }
    }
  }, []);

  // Save column visibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stockTableColumnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // Compact mode is always true (default) - no longer using localStorage
  // Removed localStorage loading and saving to ensure compact mode is always the default

  // Toggle column visibility
  const toggleColumnVisibility = (column: keyof typeof columnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Update active tab based on current route
  useEffect(() => {
    if (location.pathname.includes('/categories')) {
      setActiveTab('categories');
    } else {
      setActiveTab('products');
    }
  }, [location.pathname]);

  // Check for filters from navigation state
  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      const { filterType, filterValue, filterName } = location.state;
      
      // Use a callback approach to ensure state updates are applied correctly
      if (filterType === 'category' && filterValue) {
        // Batch all state updates together
        Promise.resolve().then(() => {
          setFilters(prev => ({
            ...prev,
            categoryFilter: filterValue,
            searchTerm: '',
            stockStatusFilter: 'all',
            locationFilter: 'all',
            minPriceFilter: '',
            maxPriceFilter: '',
            minStockFilter: '',
            maxStockFilter: '',
            selectedSizes: [],
            selectedColors: [],
          }));
          setCategoryFilterName(filterName || '');
        });
      }
      
      // Clear navigation state after a longer delay to ensure filters are applied
      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 1000);
    }
  }, [location.state, navigate]); 

  // Debug logging voor filter wijzigingen
  useEffect(() => {
    console.log('🔄 Filters changed:', { 
      filters,
      categoryFilterName
    });
    
    // Log wanneer filters daadwerkelijk worden toegepast
    if (filters.categoryFilter !== 'all' && filters.categoryFilter !== '') {
      // Category filter applied
    }
  }, [filters, categoryFilterName]);

  // Extra effect om te controleren of filters correct zijn ingesteld
  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      const { filterType, filterValue, filterName } = location.state;
      
      // Check if filters are actually set after a delay
      setTimeout(() => {
        if (filterType === 'category' && filters.categoryFilter === filterValue) {
          // Category filter correctly applied
        } else {
          console.log('❌ Filter not applied correctly:', {
            filterType,
            filterValue,
            currentCategoryFilter: filters.categoryFilter
          });
        }
      }, 200);
    }
  }, [location.state, filters.categoryFilter]);

  // Clear filters when component unmounts or branch changes
  useEffect(() => {
    if (activeBranch?.branch_id) {
      // Reset filters when branch changes
      clearAllFilters();
      
      // Force refetch to get fresh data
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  }, [activeBranch?.branch_id, queryClient]);

  // Cleanup effect for filters when component unmounts
  useEffect(() => {
    return () => {
      clearAllFilters();
    };
  }, []);

  // Reset to first page when branch changes
  useEffect(() => {
    setPage(1);
  }, [activeBranch?.branch_id]);

  // Haal Categoryën op
  useEffect(() => {
    if (user) {
      fetchCategorys();
    }
  }, [user]);

  const fetchCategorys = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategorys(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  // Handle tab change
  const handleTabChange = (tab: 'products' | 'categories') => {
    setActiveTab(tab);
    switch (tab) {
      case 'categories':
        navigate('/dashboard/categories');
        break;
      default:
        navigate('/dashboard/stock');
        break;
    }
  };

  // Clear all filters function
  const clearAllFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      categoryFilter: 'all',
      stockStatusFilter: 'all',
      locationFilter: 'all',
      minPriceFilter: '',
      maxPriceFilter: '',
      minStockFilter: '',
      maxStockFilter: '',
      selectedSizes: [],
      selectedColors: [],
      favoritesFilter: false,
    });
    setCategoryFilterName('');
  }, []);

  // Handle first product added callback - simplified
  const handleFirstProductAdded = useCallback(() => {
    console.log('[StockList] First product added callback triggered - showing modal');
    setIsFeedbackModalOpen(true);
  }, []);

  // Save view mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('stockViewMode', viewMode);
  }, [viewMode]);

  // Tel actieve filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm !== '') count++;
    if (filters.categoryFilter !== 'all' && filters.categoryFilter !== '') count++;
    if (filters.stockStatusFilter !== 'all') count++;
    if (filters.locationFilter !== 'all' && filters.locationFilter !== '') count++;
    if (filters.minPriceFilter !== '') count++;
    if (filters.maxPriceFilter !== '') count++;
    if (filters.minStockFilter !== '') count++;
    if (filters.maxStockFilter !== '') count++;
    if (filters.selectedSizes.length > 0) count++;
    if (filters.selectedColors.length > 0) count++;
    if (filters.favoritesFilter) count++;
    return count;
  }, [filters]);

  // Filter products based on all filter criteria
  const {
    data: products = [],
    isLoading: loading,
    error: productsError,
    refetch
  } = useQuery<Product[]>({
    queryKey: ['products', activeBranch?.branch_id, page],
    queryFn: async () => {
      if (!activeBranch || !activeBranch.branch_id || !user) {
        return [];
      }
      const cachedProducts = queryClient.getQueryData<Product[]>(['products', activeBranch.branch_id, page]) || [];
      const expectedCount = Math.max(
        subscriptionProductCount ?? 0,
        branchProductCount ?? 0,
        cachedProducts.length
      );
      return fetchProducts(activeBranch.branch_id, cachedProducts, { expectedCount }, page, PER_PAGE);
    },
    enabled: !!user && !!activeBranch && !!activeBranch.branch_id,
    refetchOnWindowFocus: false, // Disabled for better tab switching performance
    refetchOnMount: false, // Use cache; invalidate explicitly when data changes
    networkMode: 'offlineFirst', // Show cached data immediately while revalidating
    staleTime: 1000 * 60 * 15, // Keep data fresh for 15 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collect
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  // Fetch total count for pagination
  const { data: totalCount = 0 } = useQuery<number>({
    queryKey: ['products-total-count', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch?.branch_id || !user) return 0;
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', activeBranch.branch_id);
      if (error) {
        console.error('Error fetching products count:', error);
        return 0;
      }
      return count ?? 0;
    },
    enabled: !!user && !!activeBranch && !!activeBranch.branch_id,
    staleTime: 1000 * 60 * 5,
  });

  const totalPages = useMemo(() => Math.max(1, Math.ceil((totalCount || 0) / PER_PAGE)), [totalCount]);

  // Clamp page if totalCount shrinks
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  // Handle errors with useEffect
  useEffect(() => {
    if (productsError) {
      console.error('Products fetch error:', productsError);
    }
  }, [productsError]);

  // Force resolve stuck loading state after 10 seconds
  useEffect(() => {
    if (loading && products.length === 0) {
      const timeoutId = setTimeout(() => {
        console.warn('[StockList] Loading state stuck for 10 seconds, forcing resolution');
        // Cancel the query to show cached data if available
        queryClient.cancelQueries({ 
          queryKey: ['products', activeBranch?.branch_id] 
        });
        // If still no data, try to refetch once more
        if (products.length === 0) {
          refetch();
        }
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [loading, products.length, activeBranch?.branch_id, queryClient, refetch]);

  // Real-time updates voor producten - throttled to prevent excessive updates
  useEffect(() => {
    if (!user?.id || !activeBranch?.branch_id) return;

    let timeoutId: NodeJS.Timeout;
    
    const throttledInvalidate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['products', activeBranch.branch_id] });
      }, 1000); // Throttle to max 1 update per second
    };

    const productsChannel = supabase
      .channel('products-changes-' + activeBranch.branch_id)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        throttledInvalidate
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_transactions',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        throttledInvalidate
      )
      .subscribe();

    return () => {
      clearTimeout(timeoutId);
      supabase.removeChannel(productsChannel);
    };
  }, [user?.id, activeBranch?.branch_id, queryClient]);

  const productsTyped: Product[] = Array.isArray(products) ? products : [];

  const filteredProducts = useMemo(() => {
    console.log('🔍 Filtering products with:', { 
      filters, 
      totalProducts: productsTyped.length,
      categoryFilterName
    });
    
    const filtered = productsTyped.filter((product) => {
      const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
      
      // Category filter
      const matchesCategory = filters.categoryFilter === 'all' || filters.categoryFilter === '' || product.category_id === filters.categoryFilter;
      
      // Location filter
      const matchesLocation = filters.locationFilter === 'all' || filters.locationFilter === '' || product.location === filters.locationFilter;
      
      // Search term filter
      const matchesSearch = filters.searchTerm === '' || 
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      // Stock status filter
      const matchesStockStatus = filters.stockStatusFilter === 'all' || 
        (filters.stockStatusFilter === 'in-stock' && stockStatus === 'In Stock') ||
        (filters.stockStatusFilter === 'low-stock' && stockStatus === 'Low Stock') ||
        (filters.stockStatusFilter === 'out-of-stock' && stockStatus === 'Out of Stock');

      // Favorites filter
      const matchesFavorites = !filters.favoritesFilter || product.is_favorite;

      // Price range filter
      const matchesMinPrice = filters.minPriceFilter === '' || product.unit_price >= parseFloat(filters.minPriceFilter);
      const matchesMaxPrice = filters.maxPriceFilter === '' || product.unit_price <= parseFloat(filters.maxPriceFilter);

      // Stock quantity range filter
      const matchesMinStock = filters.minStockFilter === '' || product.quantity_in_stock >= parseInt(filters.minStockFilter);
      const matchesMaxStock = filters.maxStockFilter === '' || product.quantity_in_stock <= parseInt(filters.maxStockFilter);

      // Attributes filter (Size and Color)
      let matchesAttributes = true;
      if (filters.selectedSizes.length > 0 || filters.selectedColors.length > 0) {
        matchesAttributes = false;
        
        if (product.variant_attributes) {
          const attrs = typeof product.variant_attributes === 'string' 
            ? JSON.parse(product.variant_attributes) 
            : product.variant_attributes;
          
          // Check if any selected size matches
          const matchesSize = filters.selectedSizes.length === 0 || 
            filters.selectedSizes.some(size => 
              Object.entries(attrs).some(([key, value]) => 
                key.toLowerCase().includes('size') && value === size
              )
            );
          
          // Check if any selected color matches
          const matchesColor = filters.selectedColors.length === 0 || 
            filters.selectedColors.some(color => 
              Object.entries(attrs).some(([key, value]) => 
                key.toLowerCase().includes('color') && value === color
              )
            );
          
          matchesAttributes = matchesSize && matchesColor;
        }
      }

      // Enhanced logging for category filter
      if (filters.categoryFilter !== 'all' && filters.categoryFilter !== '') {
        console.log('📋 Product category check:', { 
          productName: product.name, 
          productCategoryId: product.category_id, 
          categoryFilter: filters.categoryFilter, 
          matchesCategory,
          productType: typeof product.category_id,
          filterType: typeof filters.categoryFilter
        });
      }

      return matchesCategory && matchesLocation && matchesSearch && matchesStockStatus && 
             matchesFavorites && matchesMinPrice && matchesMaxPrice && matchesMinStock && matchesMaxStock && matchesAttributes;
    });
    
    
    
    // Log detailed filtering info
    if (filters.categoryFilter !== 'all' && filters.categoryFilter !== '') {
      const categoryProducts = productsTyped.filter(p => p.category_id === filters.categoryFilter);
      
    }
    
    return filtered;
  }, [productsTyped, filters]);

  // Group products by parent (parent = non-variant). Variants under parent.
  const grouped = useMemo(() => {
    const byId: Record<string, Product> = {};
    productsTyped.forEach(p => { byId[p.id] = p; });
    const parentsMap: Record<string, Product> = {};
    const children: Record<string, Product[]> = {};
    filteredProducts.forEach(p => {
      if (p.is_variant && p.parent_product_id) {
        const parentId = p.parent_product_id;
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(p);
        // Zorg dat parent zichtbaar is, ook als die zelf niet in filtered zat
        const parent = byId[parentId];
        if (parent) parentsMap[parentId] = parent;
      } else {
        parentsMap[p.id] = p;
      }
    });
    const parents = Object.values(parentsMap).sort((a, b) => a.name.localeCompare(b.name));
    Object.values(children).forEach(list => list.sort((a, b) => (a.variant_name || '').localeCompare(b.variant_name || '')));
    return { parents, children };
  }, [filteredProducts, productsTyped]);

  // Create flat list of visible rows for keyboard navigation (parents + expanded children)
  const visibleRows = useMemo(() => {
    const rows: Array<{ product: Product; isVariant: boolean; parentIndex: number; childIndex?: number }> = [];
    grouped.parents.forEach((parent, parentIndex) => {
      rows.push({ product: parent, isVariant: false, parentIndex });
      if (expandedParents[parent.id] && grouped.children[parent.id]) {
        grouped.children[parent.id].forEach((child, childIndex) => {
          rows.push({ product: child, isVariant: true, parentIndex, childIndex });
        });
      }
    });
    return rows;
  }, [grouped, expandedParents]);

  // Handle select all checkbox change
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };


  // Add escape key handler for clearing filters
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // If editing a cell, cancel editing first
        if (editingCell) {
          setEditingCell(null);
          event.stopPropagation();
          return;
        }
        clearAllFilters();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [clearAllFilters, editingCell]);

  // Keyboard navigation handlers
  const handleKeyboardNavigation = useCallback((e: KeyboardEvent) => {
    // Don't intercept if user is typing in an input, textarea, or contenteditable
    const activeElement = document.activeElement;
    if (
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
       activeElement.tagName === 'TEXTAREA' ||
       activeElement.isContentEditable ||
       (activeElement as HTMLElement).closest('[contenteditable="true"]'))
    ) {
      return;
    }

    // Only handle navigation in list view
    if (viewMode !== 'list') return;

    // Arrow key navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      
      if (visibleRows.length === 0) return;

      const currentIndex = focusedRowIndex ?? -1;
      let newIndex: number;

      if (e.key === 'ArrowDown') {
        newIndex = currentIndex < visibleRows.length - 1 ? currentIndex + 1 : currentIndex;
      } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      }

      setFocusedRowIndex(newIndex);
      
      // Scroll to focused row
      const rowElement = rowRefs.current.get(newIndex);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    // Enter key to edit stock
    if (e.key === 'Enter' && focusedRowIndex !== null && !editingCell) {
      e.preventDefault();
      const row = visibleRows[focusedRowIndex];
      if (row && !row.isVariant && !grouped.children[row.product.id]) {
        // Only allow editing for non-variant products without children
        setEditingCell({ rowIndex: focusedRowIndex, field: 'stock' });
      }
    }
  }, [focusedRowIndex, visibleRows, viewMode, editingCell, grouped]);

  // Keyboard navigation effect
  useEffect(() => {
    if (viewMode === 'list') {
      window.addEventListener('keydown', handleKeyboardNavigation);
      return () => window.removeEventListener('keydown', handleKeyboardNavigation);
    }
  }, [handleKeyboardNavigation, viewMode]);

  // Scan-to-action: Detect barcode input (8+ numeric characters)
  const handleBarcodeScan = useCallback(async (barcode: string) => {
    if (!activeBranch?.branch_id) {
      toast.error('No active branch selected');
      return;
    }

    try {
      // Search for products by barcode, variant_barcode, or sku
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .or(`barcode.eq.${barcode},variant_barcode.eq.${barcode},sku.eq.${barcode}`)
        .limit(50);

      if (error) {
        console.error('Error searching for product:', error);
        toast.error('Error searching for product');
        return;
      }

      if (!products || products.length === 0) {
        toast.info(`No product found with barcode: ${barcode}`);
        return;
      }

      if (products.length === 1) {
        // Single match - open product detail view
        const product = products[0] as Product;
        toast.success(`Found: ${product.name}`);
        
        // If product has variants, expand it
        if (!product.is_variant && grouped.children[product.id]) {
          setExpandedParents(prev => ({ ...prev, [product.id]: true }));
        }
        
        // Open detail drawer if product has variants
        if (grouped.children[product.id] && grouped.children[product.id].length > 0) {
          setExpandedDetails(prev => ({ ...prev, [product.id]: true }));
        }
        
        // Focus on the product row
        const rowIndex = visibleRows.findIndex(r => r.product.id === product.id);
        if (rowIndex >= 0) {
          setFocusedRowIndex(rowIndex);
          const rowElement = rowRefs.current.get(rowIndex);
          if (rowElement) {
            rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      } else {
        // Multiple matches - filter list to show matches
        toast.success(`Found ${products.length} products matching barcode`);
        const productIds = products.map(p => p.id);
        // Note: This would require adding a filter by product IDs
        // For now, we'll just show a message and focus on first match
        const firstProduct = products[0] as Product;
        const rowIndex = visibleRows.findIndex(r => r.product.id === firstProduct.id);
        if (rowIndex >= 0) {
          setFocusedRowIndex(rowIndex);
          const rowElement = rowRefs.current.get(rowIndex);
          if (rowElement) {
            rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    } catch (error) {
      console.error('Error processing barcode scan:', error);
      toast.error('Error processing barcode scan');
    }
  }, [activeBranch, grouped, visibleRows]);

  // Scan-to-action detection effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input, textarea, or contenteditable
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
         activeElement.tagName === 'TEXTAREA' ||
         activeElement.isContentEditable ||
         (activeElement as HTMLElement).closest('[contenteditable="true"]'))
      ) {
        return;
      }

      // Only process numeric keys
      if (/^[0-9]$/.test(e.key)) {
        // Clear existing timeout
        if (barcodeTimeoutRef.current) {
          clearTimeout(barcodeTimeoutRef.current);
        }

        // Add to buffer
        setBarcodeBuffer(prev => {
          const newBuffer = prev + e.key;
          
          // Check if buffer is 8+ characters (barcode detected)
          if (newBuffer.length >= 8) {
            // Process barcode immediately
            handleBarcodeScan(newBuffer);
            return ''; // Clear buffer
          }
          
          return newBuffer;
        });

        // Set timeout to clear buffer if no more input
        barcodeTimeoutRef.current = setTimeout(() => {
          setBarcodeBuffer('');
        }, 500);
      } else {
        // Non-numeric key - clear buffer
        if (barcodeBuffer.length > 0) {
          setBarcodeBuffer('');
          if (barcodeTimeoutRef.current) {
            clearTimeout(barcodeTimeoutRef.current);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (barcodeTimeoutRef.current) {
        clearTimeout(barcodeTimeoutRef.current);
      }
    };
  }, [barcodeBuffer, handleBarcodeScan]);

  // Bulk action handlers


  const handleBulkExport = () => {
    try {
      // Get selected products data
      const selectedProducts = productsTyped.filter(p => selectedProductIds.includes(p.id));
      
      // Create CSV data
      const csvHeaders = [
        'Name',
        'Description',
        'Category',
        'Location',
        'Stock Level',
        'Minimum Stock',
        'Purchase Price',
        'Sale Price',
        'Status'
      ];
      
      const csvData = selectedProducts.map(product => [
        product.name,
        product.description || '',
        product.category_name || '',
        product.location || '',
        product.quantity_in_stock,
        product.minimum_stock_level,
        product.purchase_price,
        product.unit_price,
        getStockStatus(product.quantity_in_stock, product.minimum_stock_level)
      ]);
      
      // Create and download CSV
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Successfully exported ${selectedProductIds.length} product${selectedProductIds.length !== 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Error exporting products');
    }
  };

  // Export all products to Excel
  const handleExportToExcel = () => {
    try {
      const exportData = filteredProducts.map(product => ({
        Name: product.name,
        Description: product.description || '',
        Category: product.category_name || '',
        Location: product.location || '',
        'Stock Level': product.quantity_in_stock,
        'Minimum Stock': product.minimum_stock_level,
        'Purchase Price': product.purchase_price,
        'Sale Price': product.unit_price,
        Status: getStockStatus(product.quantity_in_stock, product.minimum_stock_level),
        'Variant Name': product.variant_name || '',
        'Variant SKU': product.variant_sku || '',
        'Variant Barcode': product.variant_barcode || '',
        'Is Variant': product.is_variant ? 'Yes' : 'No',
        'Parent Product ID': product.parent_product_id || '',
        'Is Favorite': product.is_favorite ? 'Yes' : 'No'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Products');
      
      // Set column widths
      ws['!cols'] = [
        { wch: 25 }, // Name
        { wch: 30 }, // Description
        { wch: 15 }, // Category
        { wch: 15 }, // Location
        { wch: 12 }, // Stock Level
        { wch: 15 }, // Minimum Stock
        { wch: 15 }, // Purchase Price
        { wch: 12 }, // Sale Price
        { wch: 12 }, // Status
        { wch: 20 }, // Variant Name
        { wch: 15 }, // Variant SKU
        { wch: 15 }, // Variant Barcode
        { wch: 10 }, // Is Variant
        { wch: 20 }, // Parent Product ID
        { wch: 10 }, // Is Favorite
      ];

      XLSX.writeFile(wb, `products_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Successfully exported ${filteredProducts.length} products to Excel`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Error exporting to Excel');
    }
  };

  // Export all products to CSV
  const handleExportToCSV = () => {
    try {
      const csvHeaders = [
        'Name',
        'Description',
        'Category',
        'Location',
        'Stock Level',
        'Minimum Stock',
        'Purchase Price',
        'Sale Price',
        'Status',
        'Variant Name',
        'Variant SKU',
        'Variant Barcode',
        'Is Variant',
        'Parent Product ID',
        'Is Favorite'
      ];
      
      const csvData = filteredProducts.map(product => [
        product.name,
        product.description || '',
        product.category_name || '',
        product.location || '',
        product.quantity_in_stock,
        product.minimum_stock_level,
        product.purchase_price,
        product.unit_price,
        getStockStatus(product.quantity_in_stock, product.minimum_stock_level),
        product.variant_name || '',
        product.variant_sku || '',
        product.variant_barcode || '',
        product.is_variant ? 'Yes' : 'No',
        product.parent_product_id || '',
        product.is_favorite ? 'Yes' : 'No'
      ]);
      
      // Create and download CSV
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Successfully exported ${filteredProducts.length} products to CSV`);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Error exporting to CSV');
    }
  };

  // Functie om varianten van een product op te halen
  const fetchProductVariants = async (productId: string): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch?.branch_id)
        .order('variant_name');
      
      if (error) {
        console.error('Error fetching variants:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching variants:', error);
      return [];
    }
  };

  const handleStockAction = async (product: Product, action: StockAction) => {
    // Controleer of dit product varianten heeft
    const variants = await fetchProductVariants(product.id);
    
    if (variants.length > 0) {
      // Product heeft varianten - toon variant selectie modal
      setSelectedProduct(product);
      setSelectedAction(action);
      setProductVariants(variants);
      setIsVariantSelectionModalOpen(true);
    } else {
      // Geen varianten - ga direct naar stock modal
      setSelectedProduct(product);
      setSelectedAction(action);
      setIsEditModalOpen(true);
    }
  };

  // Handler for inline stock quantity update
  const handleInlineStockUpdate = async (productId: string, newQuantity: number) => {
    if (!activeBranch?.branch_id || !user) {
      toast.error('No active branch or user');
      return;
    }

    try {
      // Get current product
      const product = productsTyped.find(p => p.id === productId);
      if (!product) {
        toast.error('Product not found');
        return;
      }

      const currentQuantity = Number(product.quantity_in_stock) || 0;
      const quantityDiff = newQuantity - currentQuantity;

      if (quantityDiff === 0) {
        return; // No change
      }

      // Create stock transaction
      const transactionType = quantityDiff > 0 ? 'incoming' : 'outgoing';
      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          product_id: productId,
          product_name: product.is_variant && product.variant_name ? `${product.name} - ${product.variant_name}` : product.name,
          transaction_type: transactionType,
          quantity: Math.abs(quantityDiff),
          unit_price: product.unit_price,
          reference_number: `INLINE_${Date.now()}`,
          notes: `Stock updated inline from ${currentQuantity} to ${newQuantity}`,
          user_id: user.id,
          created_by: user.id,
          branch_id: activeBranch.branch_id,
          variant_id: product.is_variant ? productId : null,
          variant_name: product.is_variant ? product.variant_name : null
        });

      if (transactionError) {
        throw transactionError;
      }

      // Update product quantity
      const { error: updateError } = await supabase
        .from('products')
        .update({ quantity_in_stock: newQuantity })
        .eq('id', productId);

      if (updateError) {
        throw updateError;
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['products', activeBranch.branch_id] });
      toast.success(`Stock updated to ${newQuantity}`);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
      throw error;
    }
  };

  // Handler for inline field updates (SKU, name, location, etc.)
  const handleInlineFieldUpdate = async (productId: string, field: string, value: string | number) => {
    if (!activeBranch?.branch_id || !user) {
      toast.error('No active branch or user');
      return;
    }

    try {
      const updateData: Record<string, unknown> = { [field]: value };

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) {
        throw error;
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['products', activeBranch.branch_id] });
      toast.success(`${field} updated`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);
      throw error;
    }
  };

  // Mobile action handlers
  const handleMobileStockIn = async () => {
    if (selectedProduct) {
      setSelectedAction('in');
      setIsProductActionModalOpen(false);
      
      // Controleer of dit product varianten heeft
      const variants = await fetchProductVariants(selectedProduct.id);
      
      if (variants.length > 0) {
        setProductVariants(variants);
        setIsVariantSelectionModalOpen(true);
      } else {
        setIsEditModalOpen(true);
      }
    }
  };

  const handleMobileStockOut = async () => {
    if (selectedProduct) {
      setSelectedAction('out');
      setIsProductActionModalOpen(false);
      
      // Controleer of dit product varianten heeft
      const variants = await fetchProductVariants(selectedProduct.id);
      
      if (variants.length > 0) {
        setProductVariants(variants);
        setIsVariantSelectionModalOpen(true);
      } else {
        setIsEditModalOpen(true);
      }
    }
  };

  const handleOpenStockAdjustModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedAction('in');
    setIsEditModalOpen(true);
  };

  // Event listener for custom event from ManualStockAdjustModal
  useEffect(() => {
    const handleOpenAddProductModalEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ name?: string }>).detail;
      setPreFilledProductName(detail?.name?.trim() || '');
      setIsAddModalOpen(true);
    };

    window.addEventListener('openAddProductModal', handleOpenAddProductModalEvent);
    
    return () => {
      window.removeEventListener('openAddProductModal', handleOpenAddProductModalEvent);
    };
  }, []);


  // Handler for stock operation selection (scan only)
  const handleStockOperationSelect = (operation: 'in' | 'out', type: 'scan' | 'manual') => {
    setSelectedAction(operation);
    setSelectedOperationType(type);
    
    if (type === 'scan') {
      setIsBarcodeScannerOpen(true);
    }
    // Manual operations now go directly to ManualStockAdjustModal
  };

  // Handler for barcode detection
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
        const foundProduct = products[0] as Product;
        setSelectedProduct(foundProduct);
        setIsEditModalOpen(true);
        toast.success(`Product found: ${foundProduct.name}`);
      } else {
        // Product not found - open add product modal with pre-filled SKU
        setScannedSKU(barcode);
        setPreFilledProductName('');
        setIsAddModalOpen(true);
        toast.info('Product not found - will create new product');
      }
    } catch (error) {
      console.error('Error processing scanned barcode:', error);
      toast.error('Error processing scanned barcode');
    }
  };

  const handleMobileEdit = () => {
    setIsProductActionModalOpen(false);
    setIsEditInfoModalOpen(true);
  };

  // Handler for adding new variant to parent product
  const handleAddVariant = (product: Product) => {
    setSelectedProduct(product);
    setIsAddVariantModalOpen(true);
  };

  // Functie om variant selectie af te handelen
  const handleVariantSelected = (variant: Product) => {
    setSelectedVariant(variant);
    setIsVariantSelectionModalOpen(false);
    setIsEditModalOpen(true);
  };

  // Back navigation handlers
  const handleBackToActionModal = () => {
    setIsEditModalOpen(false);
    setIsEditInfoModalOpen(false);
    setIsProductActionModalOpen(true);
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(productId => productId !== id)
        : [...prev, id];
      
      // Update selectAll state based on whether all products are selected
      const allSelected = newSelection.length === filteredProducts.length;
      setSelectAll(allSelected);
      
      return newSelection;
    });
  };

  // Duplicate product handler
  const handleDuplicateProduct = async (product: Product) => {
    if (!activeBranch) return;

    try {
      // Create a copy of the product with a new name
      const { id, ...productData } = product;
      
      const duplicatedProduct = {
        ...productData,
        name: `${product.name} (Copy)`,
        branch_id: activeBranch.branch_id,
      };

      const { error } = await supabase
        .from('products')
        .insert([duplicatedProduct]);

      if (error) throw error;

      toast.success('Product duplicated successfully');
      
      // Refresh product list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      refetch();
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Failed to duplicate product');
    }
  };

  // Archive product handler
  const handleArchiveProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'out_of_stock' })
        .eq('id', product.id);

      if (error) throw error;

      toast.success('Product archived successfully');
      
      // Refresh product list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      refetch();
    } catch (error) {
      console.error('Error archiving product:', error);
      toast.error('Failed to archive product');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
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

      setSelectedProductIds((prev) => prev.filter((id) => id !== product.id));
      setSelectAll(false);

      queryClient.invalidateQueries({ queryKey: ['dashboardData', activeBranch?.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch?.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });

      refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Move to location handler
  const handleMoveToLocation = async (product: Product) => {
    // Show a prompt to enter new location
    const newLocation = prompt('Enter new location for this product:', product.location || '');
    
    if (newLocation === null) return; // User cancelled
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ location: newLocation })
        .eq('id', product.id);

      if (error) throw error;

      toast.success('Product location updated successfully');
      
      // Refresh product list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      refetch();
    } catch (error) {
      console.error('Error updating product location:', error);
      toast.error('Failed to update product location');
    }
  };

  // Favorite toggle handler
  const handleFavoriteToggle = async (productId: string, isFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_favorite: isFavorite })
        .eq('id', productId);
      
      if (error) throw error;
      
      toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
      refetch();
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProductIds);
      
      if (error) throw error;
      
      toast.success(t('stock.success.productsDeleted', { count: selectedProductIds.length }));
      setSelectedProductIds([]);
      setSelectAll(false);
      
      // Invalideer alle relevante queries om dashboard te refreshen
      queryClient.invalidateQueries({ queryKey: ['dashboardData', activeBranch?.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch?.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      refetch();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Error deleting products');
    }
  };

  // Test functie voor filters
  const testFilters = () => {
    
    console.log('Current filters:', {
      filters,
      categoryFilterName
    });
    
    
    console.log('Products:', productsTyped.map(p => ({
      id: p.id,
      name: p.name,
      category_id: p.category_id,
      category_name: p.category_name
    })));
    
    // Test filtering logic
    if (filters.categoryFilter !== 'all' && filters.categoryFilter !== '') {
      const matchingProducts = productsTyped.filter(p => p.category_id === filters.categoryFilter);
      
      matchingProducts.forEach(p => {
        
      });
      
      // Test if the filter is working correctly
      const allProducts = productsTyped.length;
      const filteredCount = matchingProducts.length;
      
    }
    
  };

  // Debug effect voor filters
  useEffect(() => {
    if (location.pathname.includes('/stock')) {
      
      testFilters();
    }
  }, [location.pathname, filters.categoryFilter, filters.searchTerm, productsTyped]);

  // Treat branch loading as page loading to avoid flashing "No branch selected"
  if (branchesLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading products</h2>
          <p className="text-gray-600 mb-4">
            Er is een probleem opgetreden bij het ophalen van de productgegevens.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  // Only show "No branch selected" when branches have finished loading and none is active
  if (!activeBranch && !branchesLoading && !hasNoBranches) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No branch selected</h2>
          <p className="text-gray-600">Select a branch to view products.</p>
        </div>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-3 sm:space-y-4">
                   
        {/* Only show products content when on products tab */}
        {activeTab === 'products' && (
        
          <div className="">        
            {/* Filter Header */}
            {((filters.categoryFilter && filters.categoryFilter !== 'all' && filters.categoryFilter !== '') || 
              (filters.searchTerm && filters.searchTerm !== '') ||
              (filters.locationFilter && filters.locationFilter !== 'all' && filters.locationFilter !== '') ||
              (filters.stockStatusFilter && filters.stockStatusFilter !== 'all') ||
              (filters.selectedSizes.length > 0) ||
              (filters.selectedColors.length > 0) ||
              (filters.minPriceFilter && filters.minPriceFilter !== '') ||
              (filters.maxPriceFilter && filters.maxPriceFilter !== '') ||
              (filters.minStockFilter && filters.minStockFilter !== '') ||
              (filters.maxStockFilter && filters.maxStockFilter !== '')) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 filter-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-blue-900">
                      Filtered on:
                    </span>
                    {filters.categoryFilter && filters.categoryFilter !== 'all' && filters.categoryFilter !== '' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Category: {categoryFilterName || 'Filtered'}
                      </Badge>
                    )}
                    {filters.searchTerm && filters.searchTerm !== '' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Search: "{filters.searchTerm}"
                      </Badge>
                    )}
                    {filters.locationFilter && filters.locationFilter !== 'all' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Location: {filters.locationFilter}
                      </Badge>
                    )}
                    {filters.stockStatusFilter && filters.stockStatusFilter !== 'all' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Status: {filters.stockStatusFilter === 'in-stock' ? 'In Stock' : 
                                filters.stockStatusFilter === 'low-stock' ? 'Low Stock' : 
                                filters.stockStatusFilter === 'out-of-stock' ? 'Out of Stock' : filters.stockStatusFilter}
                      </Badge>
                    )}
                    {filters.selectedSizes.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Sizes: {filters.selectedSizes.join(', ')}
                      </Badge>
                    )}
                    {filters.selectedColors.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Colors: {filters.selectedColors.join(', ')}
                      </Badge>
                    )}
                    {(filters.minPriceFilter && filters.minPriceFilter !== '') || (filters.maxPriceFilter && filters.maxPriceFilter !== '') && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Price: {filters.minPriceFilter && `$${filters.minPriceFilter}`}{filters.minPriceFilter && filters.maxPriceFilter && ' - '}{filters.maxPriceFilter && `$${filters.maxPriceFilter}`}
                      </Badge>
                    )}
                    {(filters.minStockFilter && filters.minStockFilter !== '') || (filters.maxStockFilter && filters.maxStockFilter !== '') && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Stock: {filters.minStockFilter && filters.minStockFilter}{filters.minStockFilter && filters.maxStockFilter && ' - '}{filters.maxStockFilter && filters.maxStockFilter}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Search and Advanced Filters - Right above table */}
            <div className="mb-4">
              <EnhancedProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearAllFilters}
                activeFiltersCount={activeFilterCount}
              />
            </div>

              {/* Pagination Controls (Mobile) */}
              <div className="flex items-center justify-end gap-1 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent border-none"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {(() => {
                  const nums: number[] = [];
                  if (page - 1 >= 1) nums.push(page - 1);
                  nums.push(page);
                  if (page + 1 <= totalPages) nums.push(page + 1);
                  return nums.map(n => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`h-8 min-w-8 px-3 rounded-md border text-sm ${
                        n === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {n}
                    </button>
                  ));
                })()}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent border-none"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4 " />
                </Button>
         
              </div>  

            {/* Mobile Product Views */}
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 gap-4">
                {getStockableProducts(filteredProducts).map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isVariant={product.is_variant}
                    onFavoriteToggle={handleFavoriteToggle}
                    onStockAction={handleStockAction}
                    onEdit={(product) => {
                      setSelectedProduct(product);
                      setIsEditInfoModalOpen(true);
                    }}
                    onImagePreview={(url) => {
                      setPreviewImageUrl(url);
                      setIsImagePreviewOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {grouped.parents.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="flex flex-col items-center gap-6">
                      {/* Empty state illustration */}
                      <div className="relative">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Search className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {productsTyped.length === 0 ? 'No products yet' : 'No matching products'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm">
                          {productsTyped.length === 0 
                            ? 'Get started by adding your first product to track inventory and manage stock levels.'
                            : 'Try adjusting your filters or search terms to find what you\'re looking for.'
                          }
                        </p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-3">
                        {productsTyped.length === 0 ? (
                          <Button
                            onClick={() => {
                              setPreFilledProductName('');
                              setIsAddModalOpen(true);
                            }}
                            className="px-6"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Product
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={clearAllFilters}>
                            <X className="w-4 h-4 mr-2" />
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {grouped.parents.map((parent) => {
                      const parentChecked = selectedProductIds.includes(parent.id);
                      const hasChildren = (grouped.children[parent.id]?.length || 0) > 0;
                      const variantCount = grouped.children[parent.id]?.length || 0;
                      const isExpanded = expandedParents[parent.id] || false;
                      const parentDetailExpanded = expandedDetails[parent.id] || false;
                      
                      return (
                        <React.Fragment key={parent.id}>
                          <MobileProductListItem
                            product={parent}
                            isSelected={parentChecked}
                            hasChildren={hasChildren}
                            isExpanded={isExpanded}
                            variantCount={variantCount}
                            onToggleExpand={() => toggleExpand(parent.id)}
                            onSelect={handleSelectProduct}
                            onStockAction={handleStockAction}
                            onEdit={(product) => {
                              setSelectedProduct(product);
                              setIsEditInfoModalOpen(true);
                            }}
                            onAddVariant={handleAddVariant}
                            onImagePreview={(url) => {
                              setPreviewImageUrl(url);
                              setIsImagePreviewOpen(true);
                            }}
                            isAdmin={isAdmin}
                            isDetailExpanded={parentDetailExpanded}
                            onToggleDetailExpand={hasChildren ? () => toggleDetailExpand(parent.id) : undefined}
                            onImageUpload={() => refetch()}
                            onDuplicate={handleDuplicateProduct}
                            onDelete={handleDeleteProduct}
                            onMoveToLocation={handleMoveToLocation}
                          />
                          
                          {isExpanded && hasChildren && (
                            grouped.children[parent.id].map((child) => {
                              const childChecked = selectedProductIds.includes(child.id);
                              const childDetailExpanded = expandedDetails[child.id] || false;
                              return (
                                <MobileProductListItem
                                  key={child.id}
                                  product={child}
                                  isVariant={true}
                                  isSelected={childChecked}
                                  onSelect={handleSelectProduct}
                                  onStockAction={handleStockAction}
                                  onEdit={(product) => {
                                    setSelectedProduct(product);
                                    setIsEditInfoModalOpen(true);
                                  }}
                                  onImagePreview={(url) => {
                                    setPreviewImageUrl(url);
                                    setIsImagePreviewOpen(true);
                                  }}
                                  isAdmin={isAdmin}
                                  isDetailExpanded={childDetailExpanded}
                                  onToggleDetailExpand={() => toggleDetailExpand(child.id)}
                                  onImageUpload={() => refetch()}
                                  onDuplicate={handleDuplicateProduct}
                                  onDelete={handleDeleteProduct}
                                  onMoveToLocation={handleMoveToLocation}
                                />
                              );
                            })
                          )}
                          
                          {/* Empty state for no variants */}
                          {isExpanded && !hasChildren && (
                            <div className="bg-gray-50 border-b border-gray-200 px-4 py-6 ml-8">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">No variants yet</p>
                                  <p className="text-xs text-gray-500">Add variants to organize different sizes, colors, or options</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedProduct(parent);
                                    setIsAddVariantModalOpen(true);
                                  }}
                                  className="text-xs"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Variant
                                </Button>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Pagination Controls (Mobile) */}
            <div className="flex items-center justify-center gap-1 py-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {(() => {
                const nums: number[] = [];
                if (page - 1 >= 1) nums.push(page - 1);
                nums.push(page);
                if (page + 1 <= totalPages) nums.push(page + 1);
                return nums.map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-8 min-w-8 px-3 rounded-md border text-sm ${n === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    {n}
                  </button>
                ));
              })()}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="ml-2 text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Manage Categories
              </h3>
              <Button onClick={() => navigate('/dashboard/categories')}>
                <Tag className="w-4 h-4 mr-2" />
                To categories
              </Button>
            </div>
          </div>
        )}


        {/* All modals for mobile view */}
        <ProductActionModal
          isOpen={isProductActionModalOpen}
          onClose={() => {
            setIsProductActionModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onEdit={handleMobileEdit}
          onStockIn={handleMobileStockIn}
          onStockOut={handleMobileStockOut}
        />
        <ImagePreviewModal
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
          imageUrl={previewImageUrl}
          alt="Product photo preview"
        />
        {selectedProduct && (
          <EditProductStockModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              setSelectedAction(null);
              setSelectedVariant(null);
            }}
            onProductUpdated={() => {
              // Clear filters when product is updated to show all products
              clearAllFilters();
              
              // Force refetch to get updated data
              queryClient.invalidateQueries({ queryKey: ['products'] });
              refetch();
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              setSelectedAction(null);
              setSelectedVariant(null);
            }}
            product={selectedVariant || selectedProduct}
            actionType={selectedAction!}
            onBack={handleBackToActionModal}
          />
        )}
        {selectedProduct && (
          <EditProductInfoModal
            isOpen={isEditInfoModalOpen}
            onClose={() => {
              setIsEditInfoModalOpen(false);
              setSelectedProduct(null);
            }}
            onProductUpdated={() => {
              // Clear filters when product is updated to show all products
              clearAllFilters();
              
              // Force refetch to get updated data
              queryClient.invalidateQueries({ queryKey: ['products'] });
              refetch();
              setIsEditInfoModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            onBack={handleBackToActionModal}
          />
        )}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setPreFilledProductName('');
          }}
          onProductAdded={async () => {
            // Clear filters when new product is added to show all products
            clearAllFilters();

            if (activeBranch?.branch_id) {
              await queryClient.invalidateQueries({
                queryKey: ['products', activeBranch.branch_id],
                refetchType: 'active',
              });
              await queryClient.refetchQueries({
                queryKey: ['products', activeBranch.branch_id],
                type: 'active',
              });
            } else {
              await queryClient.invalidateQueries({
                queryKey: ['products'],
                refetchType: 'active',
              });
            }

            refetch();
            setIsAddModalOpen(false);
            setPreFilledProductName('');
          }}
          onFirstProductAdded={() => {
            console.log('[StockList] onFirstProductAdded callback called directly');
            handleFirstProductAdded();
          }}
          preFilledSKU={scannedSKU}
          preFilledName={preFilledProductName}
        />
        
        <ManualStockAdjustModal
          isOpen={isManualStockModalOpen}
          onClose={() => setIsManualStockModalOpen(false)}
          onProductUpdated={() => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            refetch();
          }}
          defaultAction={selectedAction}
        />
        <VariantSelectionModal
          isOpen={isVariantSelectionModalOpen}
          onClose={() => {
            setIsVariantSelectionModalOpen(false);
            setProductVariants([]);
            setSelectedVariant(null);
          }}
          product={selectedProduct}
          variants={productVariants}
          actionType={selectedAction}
          onVariantSelected={handleVariantSelected}
        />
        <BulkImportModal
          isOpen={isBulkImportModalOpen}
          onClose={() => setIsBulkImportModalOpen(false)}
          onImportComplete={() => {
            // Clear filters when products are imported to show all products
            clearAllFilters();
            
            // Force refetch to get updated data
            queryClient.invalidateQueries({ queryKey: ['products'] });
            refetch();
          }}
        />
        <StockOperationModal
          isOpen={isStockOperationModalOpen}
          onClose={() => setIsStockOperationModalOpen(false)}
          onSelectOperation={handleStockOperationSelect}
          defaultType={selectedOperationType}
        />
        {isBarcodeScannerOpen && (
          <BarcodeScanner
            onBarcodeDetected={handleBarcodeDetected}
            onClose={() => setIsBarcodeScannerOpen(false)}
            onScanSuccess={onScanSuccess}
            settings={scannerSettings}
          />
        )}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="space-y-2">


      {/* Filter Header - Active Filters Display */}
      {((filters.categoryFilter && filters.categoryFilter !== 'all' && filters.categoryFilter !== '') || 
        (filters.searchTerm && filters.searchTerm !== '') ||
        (filters.locationFilter && filters.locationFilter !== 'all' && filters.locationFilter !== '') ||
        (filters.stockStatusFilter && filters.stockStatusFilter !== 'all') ||
        (filters.selectedSizes.length > 0) ||
        (filters.selectedColors.length > 0) ||
        (filters.minPriceFilter && filters.minPriceFilter !== '') ||
        (filters.maxPriceFilter && filters.maxPriceFilter !== '') ||
        (filters.minStockFilter && filters.minStockFilter !== '') ||
        (filters.maxStockFilter && filters.maxStockFilter !== '')) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-blue-900">
                Active filters:
              </span>
              {filters.categoryFilter && filters.categoryFilter !== 'all' && filters.categoryFilter !== '' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Category: {categoryFilterName || 'Filtered'}
                </Badge>
              )}
              {filters.searchTerm && filters.searchTerm !== '' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Search: "{filters.searchTerm}"
                </Badge>
              )}
              {filters.locationFilter && filters.locationFilter !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Location: {filters.locationFilter}
                </Badge>
              )}
              {filters.stockStatusFilter && filters.stockStatusFilter !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Status: {filters.stockStatusFilter === 'in-stock' ? 'In Stock' : 
                          filters.stockStatusFilter === 'low-stock' ? 'Low Stock' : 
                          filters.stockStatusFilter === 'out-of-stock' ? 'Out of Stock' : filters.stockStatusFilter}
                </Badge>
              )}
              {filters.selectedSizes.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Sizes: {filters.selectedSizes.join(', ')}
                </Badge>
              )}
              {filters.selectedColors.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Colors: {filters.selectedColors.join(', ')}
                </Badge>
              )}
              {(filters.minPriceFilter && filters.minPriceFilter !== '') || (filters.maxPriceFilter && filters.maxPriceFilter !== '') && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Price: {filters.minPriceFilter && `$${filters.minPriceFilter}`}{filters.minPriceFilter && filters.maxPriceFilter && ' - '}{filters.maxPriceFilter && `$${filters.maxPriceFilter}`}
                </Badge>
              )}
              {(filters.minStockFilter && filters.minStockFilter !== '') || (filters.maxStockFilter && filters.maxStockFilter !== '') && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Stock: {filters.minStockFilter && filters.minStockFilter}{filters.minStockFilter && filters.maxStockFilter && ' - '}{filters.maxStockFilter && filters.maxStockFilter}
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-blue-700 border-blue-300 hover:bg-blue-100 h-7 text-xs shrink-0"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Consolidated Search and Filter Row */}
      <div className="flex items-center gap-2 py-2">
        <div className="relative flex-1">
          <Search className="bg-white absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="pl-9 h-9"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 shrink-0"
          onClick={() => {
            // This button will trigger a filter panel (to be implemented separately)
            toast.info('Advanced filter panel coming soon');
          }}
        >
          <Filter className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Status Bar - Repositioned */}
      <div className="flex items-center justify-between py-1 px-1">
        <div className="text-xs text-gray-500">
          Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedProductIds.length > 0 && (
            <div className="text-xs text-blue-600 font-medium mr-2">
              {selectedProductIds.length} selected
            </div>
          )}
          {/* Pagination Controls (Desktop) */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {(() => {
              const nums: number[] = [];
              if (page - 1 >= 1) nums.push(page - 1);
              nums.push(page);
              if (page + 1 <= totalPages) nums.push(page + 1);
              return nums.map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 min-w-8 px-3 rounded-md border text-sm ${
                    n === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {n}
                </button>
              ));
            })()}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedProductIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-900">
                  {selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Bulk delete functionality
                    const confirmDelete = window.confirm(
                      `Are you sure you want to delete ${selectedProductIds.length} product${selectedProductIds.length !== 1 ? 's' : ''}? This will also delete all related transactions and purchase order items. This action cannot be undone.`
                    );
                    if (confirmDelete) {
                      handleBulkDelete();
                    }
                  }}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Bulk export functionality
                    handleBulkExport();
                  }}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Export Selected
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProductIds([])}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {getStockableProducts(filteredProducts).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isVariant={product.is_variant}
              onFavoriteToggle={handleFavoriteToggle}
              onStockAction={handleStockAction}
              onEdit={(product) => {
                setSelectedProduct(product);
                setIsEditInfoModalOpen(true);
              }}
              onImagePreview={(url) => {
                setPreviewImageUrl(url);
                setIsImagePreviewOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white overflow-visible">
          <div className="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {isAdmin && (
                  <th className={cn(
                    "text-center w-12",
                    compactMode ? "px-2 py-1.5" : "px-3 py-4"
                  )}>
                    <input
                      type="checkbox"
                      checked={selectAll && filteredProducts.length > 0}
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                      className={cn(
                        "text-blue-600 rounded border-gray-300 focus:ring-blue-500",
                        compactMode ? "w-3 h-3" : "w-4 h-4"
                      )}
                    />
                  </th>
                )}
                {columnVisibility.product && (
                  <th className={cn(
                    "text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/3",
                    compactMode ? "px-2 py-1.5" : "px-3 py-3"
                  )}>
                    Product
                  </th>
                )}
                {columnVisibility.sku && (
                  <th className={cn(
                    "text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/12",
                    compactMode ? "px-2 py-1.5" : "px-3 py-3"
                  )}>
                    SKU
                  </th>
                )}
                {columnVisibility.location && (
                  <th className={cn(
                    "text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8",
                    compactMode ? "px-2 py-1.5" : "px-3 py-3"
                  )}>
                    Location
                  </th>
                )}
                {columnVisibility.current && (
                  <th className={cn(
                    "text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8",
                    compactMode ? "px-2 py-1.5" : "px-3 py-3"
                  )}>
                    Stock Level
                  </th>
                )}

                {columnVisibility.category && (
                  <th className={cn(
                    "text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8",
                    compactMode ? "px-2 py-1.5" : "px-3 py-3"
                  )}>
                    Category
                  </th>
                )}
                {columnVisibility.purchasePrice && (
                  <th className={cn(
                    "text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8",
                    compactMode ? "px-2 py-1.5" : "px-3 py-3"
                  )}>
                    Cost
                  </th>
                )}
                {columnVisibility.salePrice && (
                  <th className={cn(
                    "text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8",
                    compactMode ? "px-2 py-1.5" : "px-3 py-3"
                  )}>
                    Price
                  </th>
                )}
                {columnVisibility.actions && (
                  <th className={cn(
                    "text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/12",
                    compactMode ? "px-2 py-1.5" : "px-3 py-3"
                  )}>
                    Actions
                  </th>
                )}    
              </tr>
            </thead>
            <tbody className="bg-white">
              {grouped.parents.length === 0 ? (
                <tr>
                  <td colSpan={
                    (isAdmin ? 1 : 0) + 
                    Object.values(columnVisibility).filter(Boolean).length
                  } className="px-4 py-16">
                    <div className="flex flex-col items-center gap-6">
                      {/* Empty state illustration */}
                      <div className="relative">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <Search className="w-2.5 h-2.5 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-2 text-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {productsTyped.length === 0 ? 'No products yet' : 'No matching products'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-md">
                          {productsTyped.length === 0 
                            ? 'Get started by adding your first product to track inventory and manage stock levels.'
                            : 'Try adjusting your filters or search terms to find what you\'re looking for.'
                          }
                        </p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-3">
                        {productsTyped.length === 0 ? (
                          <Button
                            onClick={() => {
                              setPreFilledProductName('');
                              setIsAddModalOpen(true);
                            }}
                            className="px-6"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Product
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={clearAllFilters}>
                            <X className="w-4 h-4 mr-2" />
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                visibleRows.map((row, rowIndex) => {
                  const { product, isVariant } = row;
                  const isChecked = selectedProductIds.includes(product.id);
                  const hasChildren = (grouped.children[product.id]?.length || 0) > 0;
                  const variantCount = grouped.children[product.id]?.length || 0;
                  const isExpanded = expandedParents[product.id] || false;
                  const isDetailExpanded = expandedDetails[product.id] || false;
                  const isFocused = focusedRowIndex === rowIndex;
                  const isEditingStock = editingCell?.rowIndex === rowIndex && editingCell?.field === 'stock';
                  const totalColumns = (isAdmin ? 1 : 0) + Object.values(columnVisibility).filter(Boolean).length;
                  
                  return (
                    <React.Fragment key={product.id}>
                      <ProductRow
                        product={product}
                        isVariant={isVariant}
                        isSelected={isChecked}
                        hasChildren={hasChildren}
                        isExpanded={isExpanded}
                        variantCount={variantCount}
                        columnVisibility={columnVisibility}
                        compactMode={compactMode}
                        onToggleExpand={() => toggleExpand(product.id)}
                        onSelect={handleSelectProduct}
                        onStockAction={handleStockAction}
                        onEdit={(product) => {
                          setSelectedProduct(product);
                          setIsEditInfoModalOpen(true);
                        }}
                        onAddVariant={handleAddVariant}
                        onImagePreview={(url) => {
                          setPreviewImageUrl(url);
                          setIsImagePreviewOpen(true);
                        }}
                        isAdmin={isAdmin}
                        isDetailExpanded={isDetailExpanded}
                        onToggleDetailExpand={hasChildren ? () => toggleDetailExpand(product.id) : undefined}
                        onImageUpload={() => refetch()}
                        onDuplicate={handleDuplicateProduct}
                        onDelete={handleDeleteProduct}
                        onMoveToLocation={handleMoveToLocation}
                        onFieldUpdate={handleInlineFieldUpdate}
                        onStockUpdate={handleInlineStockUpdate}
                        rowIndex={rowIndex}
                        isFocused={isFocused}
                        isEditingStock={isEditingStock}
                        onStartEditingStock={() => setEditingCell({ rowIndex, field: 'stock' })}
                        rowRef={(node) => {
                          if (node) {
                            rowRefs.current.set(rowIndex, node);
                          } else {
                            rowRefs.current.delete(rowIndex);
                          }
                        }}
                      />
                      
                      {/* Product Detail Drawer - only show for products with variants */}
                      {hasChildren && (
                        <ProductDetailDrawer
                          product={product}
                          isOpen={isDetailExpanded}
                          columnCount={totalColumns}
                        />
                      )}
                      
                      {/* Empty state for no variants - Desktop */}
                      {isExpanded && !hasChildren && (
                        <tr>
                          <td colSpan={
                            (isAdmin ? 1 : 0) + 
                            Object.values(columnVisibility).filter(Boolean).length
                          } className="px-4 py-8">
                            <div className="flex flex-col items-center gap-4 ml-8">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">No variants yet</p>
                                <p className="text-xs text-gray-500">Add variants to organize different sizes, colors, or options</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedProduct(parent);
                                  setIsAddVariantModalOpen(true);
                                }}
                                className="text-xs"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Variant
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
      {/* Bottom Pagination Controls (Desktop) */}
      <div className="flex items-center justify-center gap-1 py-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {(() => {
          const nums: number[] = [];
          if (page - 1 >= 1) nums.push(page - 1);
          nums.push(page);
          if (page + 1 <= totalPages) nums.push(page + 1);
          return nums.map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`h-8 min-w-8 px-3 rounded-md border text-sm ${n === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {n}
            </button>
          ));
        })()}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

      </div>
      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        imageUrl={previewImageUrl}
        alt="Productfoto preview"
      />
      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            setSelectedAction(null);
            setSelectedVariant(null);
          }}
          onProductUpdated={() => {
            refetch();
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            setSelectedAction(null);
            setSelectedVariant(null);
          }}
          product={selectedVariant || selectedProduct}
          actionType={selectedAction}
        />
      )}

      {selectedProduct && (
        <EditProductInfoModal
          isOpen={isEditInfoModalOpen}
          onClose={() => {
            setIsEditInfoModalOpen(false);
            setSelectedProduct(null);
          }}
          onProductUpdated={() => {
            refetch();
            setIsEditInfoModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={() => {
          refetch();
          setIsAddModalOpen(false);
        }}
      />
      <VariantSelectionModal
        isOpen={isVariantSelectionModalOpen}
        onClose={() => {
          setIsVariantSelectionModalOpen(false);
          setProductVariants([]);
          setSelectedVariant(null);
        }}
        product={selectedProduct}
        variants={productVariants}
        actionType={selectedAction}
        onVariantSelected={handleVariantSelected}
      />
      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onImportComplete={() => {
          // Refresh products after import
          queryClient.invalidateQueries({ queryKey: ['products'] });
          refetch();
        }}
      />
      <AddVariantModal
        isOpen={isAddVariantModalOpen}
        onClose={() => {
          setIsAddVariantModalOpen(false);
          setSelectedProduct(null);
        }}
        onVariantAdded={() => {
          // Refresh products after variant is added
          queryClient.invalidateQueries({ queryKey: ['products'] });
          refetch();
        }}
        parentProduct={selectedProduct}
      />
      <StockOperationModal
        isOpen={isStockOperationModalOpen}
        onClose={() => setIsStockOperationModalOpen(false)}
        onSelectOperation={handleStockOperationSelect}
        defaultType={selectedOperationType}
      />
      <ManualStockAdjustModal
        isOpen={isManualStockModalOpen}
        onClose={() => setIsManualStockModalOpen(false)}
        onProductUpdated={() => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          refetch();
        }}
        defaultAction={selectedAction}
      />
      {isBarcodeScannerOpen && (
        <BarcodeScanner
          onBarcodeDetected={handleBarcodeDetected}
          onClose={() => setIsBarcodeScannerOpen(false)}
          onScanSuccess={onScanSuccess}
          settings={scannerSettings}
        />
      )}
        <FirstProductFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => {
            console.log('[StockList] Closing feedback modal');
            setIsFeedbackModalOpen(false);
          }}
        />
        
    </div>
  );
};


