/**
 * Categories Management Page
 * Card-based view for managing categories with CRUD operations
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Tags, Edit, Trash2, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory,
  useCategoryRealtime,
  useCategoryTree,
  type Category 
} from '@/hooks/useCategories';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { CategoryCreateData } from '@/types/categoryTypes';
import { useQuery } from '@tanstack/react-query';
import { getCategoryProductCounts } from '@/lib/categories/categoryService';

export default function CategoriesPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Hooks
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  useCategoryRealtime();

  // Get product counts for categories
  const { data: productCounts } = useQuery({
    queryKey: ['categoryProductCounts', user?.id, activeBranch?.branch_id],
    queryFn: () => {
      if (!user) return new Map<string, number>();
      return getCategoryProductCounts(user.id, activeBranch?.branch_id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Show all categories (not just root categories)
  const displayedCategories = categories;

  const handleAddCategory = () => {
    setFormData({ name: '', description: '' });
    setShowAddModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setShowEditModal(true);
  };

  const handleDeleteCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const handleViewProducts = (category: Category) => {
    navigate(`/dashboard/categories?category=${encodeURIComponent(category.id)}`);
  };

  const handleSubmitAdd = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const categoryData: CategoryCreateData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        parent_category_id: null, // Root category
        is_active: true,
      };
      await createCategory.mutateAsync(categoryData);
      setShowAddModal(false);
      setFormData({ name: '', description: '' });
      toast.success('Category created successfully');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleSubmitEdit = async () => {
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
        },
      });
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '' });
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategoryMutation.mutateAsync(selectedCategory.id);
      setShowDeleteDialog(false);
      setSelectedCategory(null);
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Categories</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your product categories
          </p>
        </div>
        <Button onClick={handleAddCategory} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Categories Grid */}
      {displayedCategories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Tags className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No categories yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first category to organize your products.
            </p>
            <Button onClick={handleAddCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              productCount={productCounts?.get(category.id) ?? 0}
              onEdit={() => handleEditCategory(category)}
              onDelete={() => handleDeleteCategoryClick(category)}
              onViewProducts={() => handleViewProducts(category)}
            />
          ))}
        </div>
      )}

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
                placeholder="e.g. Electronics, Clothing, Food"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.name.trim()) {
                    handleSubmitAdd();
                  }
                }}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAdd} disabled={createCategory.isPending || !formData.name.trim()}>
              {createCategory.isPending ? 'Adding...' : 'Add Category'}
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
                placeholder="e.g. Electronics, Clothing, Food"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.name.trim()) {
                    handleSubmitEdit();
                  }
                }}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit} disabled={updateCategory.isPending || !formData.name.trim()}>
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
              This action cannot be undone. Products in this category will have their category set to empty.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCategoryMutation.isPending}
            >
              {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface CategoryCardProps {
  category: Category;
  productCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onViewProducts: () => void;
}

function CategoryCard({ category, productCount, onEdit, onDelete, onViewProducts }: CategoryCardProps) {
  // Get icon component
  const IconComponent = category.icon 
    ? (LucideIcons[category.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
    : Tags;

  const categoryColor = category.color || '#6B7280';
  const bgColor = category.color ? categoryColor : '#E5E7EB';
  const iconColor = category.color ? '#FFFFFF' : '#6B7280';

  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={onViewProducts}>
      <CardContent className="p-6">
        {/* Header with actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: bgColor }}
            >
              <IconComponent className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
                {category.name}
              </h3>
              {!category.is_active && (
                <Badge variant="secondary" className="mt-1 text-xs">Inactive</Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onViewProducts();
              }}>
                <Package className="w-4 h-4 mr-2" />
                View Products
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {category.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {category.description}
          </p>
        )}

        {/* Product count */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {productCount} {productCount === 1 ? 'product' : 'products'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewProducts();
            }}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

