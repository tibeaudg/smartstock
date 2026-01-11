/**
 * Categories Management Page
 * Table-based view for managing categories with CRUD operations
 */

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Tags, Edit, Trash2, Search, Filter, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Eye, ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  useCategoryRealtime
} from '@/hooks/useCategories';
import type { Category, CategoryCreateData } from '@/types/categoryTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CycleCount } from '@/types/stockTypes';
import { CreateCycleCountModal } from '@/components/cycle-count/CreateCycleCountModal';
import { CycleCountDetail } from '@/components/cycle-count/CycleCountDetail';
import { getCategoryProductCounts } from '@/lib/categories/categoryService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SortColumn = 'name' | 'products';
type SortDirection = 'asc' | 'desc';

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
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn | null>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
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

  // Cycle counts (recent) - small integration copied from cycle-count page
  const queryClient = useQueryClient();
  const [showCreateCycleModal, setShowCreateCycleModal] = useState(false);
  const [selectedCycleCount, setSelectedCycleCount] = useState<CycleCount | null>(null);
  const [cycleSearchQuery, setCycleSearchQuery] = useState('');

  const { data: cycleCounts = [], isLoading: countsLoading, refetch: refetchCounts } = useQuery<CycleCount[]>({
    queryKey: ['cycleCounts', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch?.branch_id) return [];
      const { data, error } = await supabase
        .from('cycle_counts')
        .select(`*, items:cycle_count_items(*)`)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!activeBranch?.branch_id,
  });

  const filteredCycleCounts = cycleCounts.filter(count => {
    if (cycleSearchQuery) {
      const q = cycleSearchQuery.toLowerCase();
      return (
        count.count_number.toLowerCase().includes(q) ||
        count.notes?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCycleCreated = () => {
    setShowCreateCycleModal(false);
    refetchCounts();
    queryClient.invalidateQueries({ queryKey: ['cycleCounts'] });
  };

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

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  // Sort categories
  const sortedCategories = useMemo(() => {
    if (!sortColumn) return filteredCategories;
    
    return [...filteredCategories].sort((a, b) => {
      let comparison = 0;
      
      switch (sortColumn) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'products':
          const aCount = productCounts?.get(a.id) ?? 0;
          const bCount = productCounts?.get(b.id) ?? 0;
          comparison = aCount - bCount;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredCategories, sortColumn, sortDirection, productCounts]);

  // Pagination
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = sortedCategories.slice(startIndex, endIndex);

  // Reset to page 1 when filters/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

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

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-gray-700" />
      : <ChevronDown className="w-4 h-4 text-gray-700" />;
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


      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>

        <Button onClick={handleAddCategory} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </Button>
        <Button onClick={() => setShowCreateCycleModal(true)} variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Cycle Count</span>
          <span className="sm:hidden">Count</span>
        </Button>
      </div>

      {/* Categories Table */}
      {sortedCategories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Tags className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No categories yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ? 'No categories match your search.' : 'Create your first category to organize your products.'}
            </p>
            {!searchQuery && (
            <Button onClick={handleAddCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Category
            </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('products')}
                  >
                    <div className="flex items-center gap-2">
                      Products
                      {getSortIcon('products')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCategories.map((category) => {
                  const productCount = productCounts?.get(category.id) ?? 0;
                  
                  return (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {productCount > 0 ? `${productCount} products` : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProducts(category)}
                            className="h-8 px-3"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            className="h-8 px-3"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategoryClick(category)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Results per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 px-3"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {(() => {
                  const pages: (number | string)[] = [];
                  
                  if (totalPages <= 7) {
                    // Show all pages if 7 or fewer
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Always show first page
                    pages.push(1);
                    
                    if (currentPage > 3) {
                      pages.push('...');
                    }
                    
                    // Show pages around current page
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    
                    for (let i = start; i <= end; i++) {
                      if (i !== 1 && i !== totalPages) {
                        pages.push(i);
                      }
                    }
                    
                    if (currentPage < totalPages - 2) {
                      pages.push('...');
                    }
                    
                    // Always show last page
                    pages.push(totalPages);
                  }
                  
                  return pages.map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    
                    const pageNum = page as number;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "h-8 min-w-[2rem]",
                          currentPage === pageNum && "bg-blue-600 hover:bg-blue-700 text-white"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  });
                })()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-3"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Cycle Counts (small integration) */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Recent Cycle Counts</h3>
        {countsLoading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCycleCounts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <ClipboardCheck className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No recent cycle counts</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredCycleCounts.slice(0, 5).map((count) => (
              <Card key={count.id} className="hover:shadow transition-shadow cursor-pointer" onClick={() => setSelectedCycleCount(count)}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{count.count_number}</h4>
                        <Badge className={count.status ? (count.status === 'completed' ? 'bg-yellow-100 text-yellow-800' : count.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800') : 'bg-gray-100 text-gray-800'}>
                          {count.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(count.count_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-sm text-gray-600">Items: {count.total_items_counted}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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

      {/* Cycle Count Modals */}
      {showCreateCycleModal && (
        <CreateCycleCountModal
          isOpen={showCreateCycleModal}
          onClose={() => setShowCreateCycleModal(false)}
          onCountCreated={handleCycleCreated}
        />
      )}

      {selectedCycleCount && (
        <CycleCountDetail
          cycleCount={selectedCycleCount}
          isOpen={!!selectedCycleCount}
          onClose={() => setSelectedCycleCount(null)}
          onCountUpdated={refetchCounts}
        />
      )}
    </div>
  );
}
