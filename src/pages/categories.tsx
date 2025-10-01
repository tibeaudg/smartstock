import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package, Tag, Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

// Fetch function outside component for React Query
const fetchCategories = async (userId: string): Promise<Category[]> => {
  // First get all categories for the current user
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    throw categoriesError;
  }

  // Then get product count for each category
  const categoriesWithCount = await Promise.all(
    (categoriesData || []).map(async (category) => {
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id);

      if (countError) {
        console.error('Error counting products for category:', category.id, countError);
        return { ...category, product_count: 0 };
      }

      return { ...category, product_count: count || 0 };
    })
  );

  return categoriesWithCount;
};

export default function CategorysPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Use React Query for caching
  const {
    data: categories = [],
    isLoading: loading,
    error: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ['categories', user?.id],
    queryFn: () => user ? fetchCategories(user.id) : [],
    enabled: !!user,
    refetchOnWindowFocus: false, // Don't refetch on tab switch
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collect
    // @ts-expect-error: keepPreviousData is supported in v5
    keepPreviousData: true,
  });

  // Mobile tab switcher state
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'suppliers'>('categories');

  // Update active tab based on current route
  useEffect(() => {
    if (location.pathname.includes('/categories')) {
      setActiveTab('categories');
    } else if (location.pathname.includes('/suppliers')) {
      setActiveTab('suppliers');
    } else {
      setActiveTab('products');
    }
  }, [location.pathname]);

  // Handle tab change
  const handleTabChange = (tab: 'products' | 'categories' | 'suppliers') => {
    setActiveTab(tab);
    switch (tab) {
      case 'categories':
        navigate('/dashboard/categories');
        break;
      case 'suppliers':
        navigate('/dashboard/suppliers');
        break;
      default:
        navigate('/dashboard/stock');
        break;
    }
  };

  // Real-time updates for categories
  useEffect(() => {
    if (!user?.id) return;

    const categoriesChannel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('Category change detected, refreshing...');
          queryClient.invalidateQueries({ queryKey: ['categories', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(categoriesChannel);
    };
  }, [user?.id, queryClient]);

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category naam is verplicht');
      return;
    }

    if (!user) {
      toast.error('Je moet ingelogd zijn om Categoryën toe te voegen');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        toast.error(`Fout bij het toevoegen van Category: ${error.message}`);
        return;
      }

      toast.success('Category succesvol toegevoegd!');
      setShowAddModal(false);
      setFormData({ name: '', description: '' });
      queryClient.invalidateQueries({ queryKey: ['categories', user.id] });
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Onverwachte fout bij het toevoegen van Category');
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error('Category naam is verplicht');
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null
        })
        .eq('id', selectedCategory.id);

      if (error) {
        console.error('Error updating category:', error);
        toast.error(`Fout bij het bijwerken van Category: ${error.message}`);
        return;
      }

      toast.success('Category succesvol bijgewerkt!');
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '' });
      queryClient.invalidateQueries({ queryKey: ['categories', user.id] });
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Onverwachte fout bij het bijwerken van Category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      // Check if category is used in products
      const { data: productsUsingCategory, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('category_name', selectedCategory.name)
        .limit(1);

      if (checkError) {
        console.error('Error checking category usage:', checkError);
        toast.error('Fout bij het controleren van Category gebruik');
        return;
      }

      if (productsUsingCategory && productsUsingCategory.length > 0) {
        toast.error('Deze Category kan niet worden verwijderd omdat er producten aan gekoppeld zijn');
        setShowDeleteModal(false);
        setSelectedCategory(null);
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', selectedCategory.id);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error(`Fout bij het verwijderen van Category: ${error.message}`);
        return;
      }

      toast.success('Category succesvol verwijderd!');
      setShowDeleteModal(false);
      setSelectedCategory(null);
      queryClient.invalidateQueries({ queryKey: ['categories', user.id] });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Onverwachte fout bij het verwijderen van Category');
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setSelectedCategory(null);
  };

  const handleCategoryClick = (category: Category) => {
    console.log('🖱️ Category clicked:', category);
    // Navigate to products page with category filter
    navigate('/dashboard/stock', { 
      state: { 
        filterType: 'category', 
        filterValue: category.id,
        filterName: category.name 
      } 
    });
    console.log('🚀 Navigating to stock with state:', { 
      filterType: 'category', 
      filterValue: category.id,
      filterName: category.name 
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">U bent niet ingelogd</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'px-2 py-4' : 'container mx-auto px-4 py-8'}`}>
      <div className={`${isMobile ? 'w-full' : 'max-w-6xl mx-auto'}`}>
        {/* Mobile Tab Switcher - Only show on mobile */}
        {isMobile && (
          <div className="mb-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <div className="flex space-x-1">
                <button
                  onClick={() => handleTabChange('products')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'products'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Producten</span>
                  <span className="sm:hidden">Prod</span>
                </button>
                <button
                  onClick={() => handleTabChange('categories')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'categories'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Categoryën</span>
                  <span className="sm:hidden">Cat</span>
                </button>
                <button
                  onClick={() => handleTabChange('suppliers')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'suppliers'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Leveranciers</span>
                  <span className="sm:hidden">Lev</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className={`${isMobile ? 'mb-6' : 'mb-8'}`}>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
            Manage Categories
          </h1>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
            Manage your product categories for better organization of your stock
          </p>
        </div>

        {/* Add Category Button */}
        <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
          <Button 
            onClick={() => setShowAddModal(true)} 
            className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}
          >
            <Plus className="w-4 h-4" />
            New Category
          </Button>
        </div>

        {/* categories List */}
        <div className={`grid gap-3 ${isMobile ? '' : 'gap-4'}`}>
          {loading ? (
            <Card>
              <CardContent className={`${isMobile ? 'p-6' : 'p-8'}`}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">categories loading...</p>
                </div>
              </CardContent>
            </Card>
          ) : categories.length === 0 ? (
            <Card>
              <CardContent className={`${isMobile ? 'p-6' : 'p-8'}`}>
                <div className="text-center">
                  <Package className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-gray-400 mx-auto mb-4`} />
                  <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-gray-900 mb-2`}>
                    No categories
                  </h3>
                  <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 mb-4`}>
                    You have no categories yet. Create your first category to get started.
                  </p>
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className={isMobile ? 'w-full' : ''}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    First Category
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            categories.map((category) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCategoryClick(category)}
              >
                <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900`}>
                          {category.name}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {category.product_count || 0} product{category.product_count !== 1 ? 'en' : ''}
                        </span>
                      </div>
                      {category.description && (
                        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
                          {category.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Aangemaakt op {new Date(category.created_at).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <div className={`flex gap-2 ${isMobile ? 'ml-3' : ''}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(category);
                        }}
                        className={isMobile ? 'px-2 py-1' : ''}
                      >
                        <Edit className="w-4 h-4" />
                        {!isMobile && <span className="ml-1">Edit</span>}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(category);
                        }}
                        className={`${isMobile ? 'px-2 py-1' : ''} text-red-600 hover:text-red-700 hover:bg-red-50`}
                      >
                        <Trash2 className="w-4 h-4" />
                        {!isMobile && <span className="ml-1">Delete</span>}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
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
                placeholder="Bijv. Electronics, Food"
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
            <Button onClick={handleAddCategory}>
              Add Category
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
                placeholder="Bijv. Electronics, Food"
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
            <Button onClick={handleEditCategory}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the category "{selectedCategory?.name}"? 
              This action cannot be undone.
            </p>
            <p className="text-sm text-gray-500">
              Let op: categories that are in use by products cannot be deleted.
              categories that are in use by products cannot be deleted.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
