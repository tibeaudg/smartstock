import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tags, Plus, Edit, Trash2, Package, Eye, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useNavigate } from 'react-router-dom';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCategoryRealtime,
} from '@/hooks/useCategories';
import type { Category } from '@/types/categoryTypes';
import { useQuery } from '@tanstack/react-query';
import { getCategoryProductCounts } from '@/lib/categories/categoryService';

export default function CategoriesPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addDescription, setAddDescription] = useState('');

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  useCategoryRealtime();

  const { data: productCounts } = useQuery({
    queryKey: ['categoryProductCounts', user?.id, activeBranch?.branch_id],
    queryFn: () => {
      if (!user) return new Map<string, number>();
      return getCategoryProductCounts(user.id, activeBranch?.branch_id);
    },
    enabled: !!user,
    staleTime: 0,
    gcTime: 0,
  });

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  // --- handlers ---

  const openAdd = () => {
    setAddName('');
    setAddDescription('');
    setShowAddModal(true);
  };

  const handleSubmitAdd = async () => {
    if (!addName.trim()) return;
    try {
      await createCategory.mutateAsync({ name: addName.trim(), description: addDescription.trim() || null });
      setShowAddModal(false);
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowEditModal(true);
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

  const handleDeleteCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
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

  const handleViewProducts = (category: Category) => {
    navigate(`/dashboard/categories?category=${encodeURIComponent(category.id)}`);
  };

  // --- render ---

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-full max-w-md bg-gray-200 rounded animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex gap-1">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Renaming a category updates all assigned products automatically.
          </p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Tags className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No categories match your search' : 'No categories yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {searchQuery
                ? 'Try a different search term.'
                : 'Create a category to get started, or assign a category to any product.'}
            </p>
            {!searchQuery && (
              <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Category
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {filtered.map((category) => {
            const productCount = productCounts?.get(category.id) ?? 0;
            return (
              <div key={category.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                      <Package className="w-3 h-3" />
                      {productCount} {productCount === 1 ? 'product' : 'products'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleViewProducts(category)} className="text-blue-600 hover:text-blue-700 text-xs">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)} className="text-xs">
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCategoryClick(category)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Create a new category to organize your products.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-name">Name <span className="text-gray-400 font-normal">*</span></Label>
              <Input
                id="add-name"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && addName.trim()) handleSubmitAdd(); }}
                placeholder="e.g. Electronics, Clothing, Food"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-desc">Description <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Textarea
                id="add-desc"
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                placeholder="Optional description of this category"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitAdd}
              disabled={createCategory.isPending || !addName.trim()}
            >
              {createCategory.isPending ? 'Adding...' : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              All {productCounts?.get(selectedCategory?.id ?? '') ?? 0} product(s) assigned to "{selectedCategory?.name}" will be updated.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Name <span className="text-gray-400 font-normal">*</span></Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter' && formData.name.trim()) handleSubmitEdit(); }}
                placeholder="e.g. Electronics, Clothing, Food"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-description">Description <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of the category"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitEdit}
              disabled={updateCategory.isPending || !formData.name.trim()}
            >
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
              This will clear the category from all {productCounts?.get(selectedCategory?.id ?? '') ?? 0} product(s) assigned to
              "{selectedCategory?.name}" and remove it from the list. The products themselves will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCategoryMutation.isPending}
            >
              {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete Category'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
