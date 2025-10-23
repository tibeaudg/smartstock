import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Truck, Mail, Phone, MapPin, Package, Tag, Search, Upload, Download, CheckSquare, Square, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  address: string | null;
  company: string | null;
  municipality: string | null;
  group: string | null;
  peppol_enabled: boolean;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

// Fetch function outside component for React Query
const fetchSuppliers = async (userId: string): Promise<Supplier[]> => {
  // First get all suppliers for the current user
  const { data: suppliersData, error: suppliersError } = await supabase
    .from('suppliers')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (suppliersError) {
    console.error('Error fetching suppliers:', suppliersError);
    throw suppliersError;
  }

  // Then get product count for each supplier
  const suppliersWithCount = await Promise.all(
    (suppliersData || []).map(async (supplier) => {
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', supplier.id);

      if (countError) {
        console.error('Error counting products for supplier:', supplier.id, countError);
        return { ...supplier, product_count: 0 };
      }

      return { ...supplier, product_count: count || 0 };
    })
  );

  return suppliersWithCount;
};

export default function SuppliersPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mobile: '',
    address: '',
    company: '',
    municipality: '',
    group: '',
    peppol_enabled: false
  });

  // Use React Query for caching
  const {
    data: suppliers = [],
    isLoading: loading,
    error: suppliersError,
  } = useQuery<Supplier[]>({
    queryKey: ['suppliers', user?.id],
    queryFn: () => user ? fetchSuppliers(user.id) : [],
    enabled: !!user,
    refetchOnWindowFocus: false, // Don't refetch on tab switch
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collect
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  // Filter suppliers based on search term
  const filteredSuppliers = Array.isArray(suppliers) ? suppliers.filter((supplier: Supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.municipality?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Mobile tab switcher state
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'suppliers'>('suppliers');

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

  // Real-time updates for suppliers
  useEffect(() => {
    if (!user?.id) return;

    const suppliersChannel = supabase
      .channel('suppliers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'suppliers',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('Supplier change detected, refreshing...');
          queryClient.invalidateQueries({ queryKey: ['suppliers', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(suppliersChannel);
    };
  }, [user?.id, queryClient]);

  const handleAddSupplier = async () => {
    if (!formData.name.trim()) {
      toast.error('Supplier name is required');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to add suppliers');
      return;
    }

    try {
      const { data, error } = await (supabase
        .from('suppliers') as any)
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          mobile: formData.mobile.trim() || null,
          address: formData.address.trim() || null,
          company: formData.company.trim() || null,
          municipality: formData.municipality.trim() || null,
          group: formData.group.trim() || null,
          peppol_enabled: formData.peppol_enabled,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding supplier:', error);
        toast.error(`Error adding supplier: ${error.message}`);
        return;
      }

      toast.success('Supplier successfully added!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', mobile: '', address: '', company: '', municipality: '', group: '', peppol_enabled: false });
      queryClient.invalidateQueries({ queryKey: ['suppliers', user.id] });
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error('Unexpected error adding supplier');
    }
  };

  const handleEditSupplier = async () => {
    if (!selectedSupplier || !formData.name.trim()) {
      toast.error('Supplier name is required');
      return;
    }

    try {
      const { error } = await (supabase
        .from('suppliers') as any)
        .update({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          mobile: formData.mobile.trim() || null,
          address: formData.address.trim() || null,
          company: formData.company.trim() || null,
          municipality: formData.municipality.trim() || null,
          group: formData.group.trim() || null,
          peppol_enabled: formData.peppol_enabled
        })
        .eq('id', selectedSupplier.id);

      if (error) {
        console.error('Error updating supplier:', error);
        toast.error(`Error updating supplier: ${error.message}`);
        return;
      }

      toast.success('Supplier successfully updated!');
      setShowEditModal(false);
      setSelectedSupplier(null);
      setFormData({ name: '', email: '', phone: '', mobile: '', address: '', company: '', municipality: '', group: '', peppol_enabled: false });
      queryClient.invalidateQueries({ queryKey: ['suppliers', user.id] });
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Unexpected error updating supplier');
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplier) return;

    try {
      // Check if supplier is used in products
      const { data: productsUsingSupplier, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('supplier_name', selectedSupplier.name)
        .limit(1);

      if (checkError) {
        console.error('Error checking supplier usage:', checkError);
        toast.error('Error checking supplier usage');
        return;
      }

      if (productsUsingSupplier && productsUsingSupplier.length > 0) {
        toast.error('This supplier cannot be deleted because it is associated with products');
        setShowDeleteModal(false);
        setSelectedSupplier(null);
        return;
      }

      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', selectedSupplier.id);

      if (error) {
        console.error('Error deleting supplier:', error);
          toast.error(`Error deleting supplier: ${error.message}`);
        return;
      }

      toast.success('Supplier successfully deleted!');
      setShowDeleteModal(false);
      setSelectedSupplier(null);
      queryClient.invalidateQueries({ queryKey: ['suppliers', user.id] });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Unexpected error deleting supplier');
    }
  };

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email || '',
      phone: supplier.phone || '',
      mobile: supplier.mobile || '',
      address: supplier.address || '',
      company: supplier.company || '',
      municipality: supplier.municipality || '',
      group: supplier.group || '',
      peppol_enabled: supplier.peppol_enabled || false
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', mobile: '', address: '', company: '', municipality: '', group: '', peppol_enabled: false });
    setSelectedSupplier(null);
  };

  const handleSupplierClick = (supplier: Supplier) => {
    console.log('🖱️ Supplier clicked:', supplier);
    // Navigate to products page with supplier filter
    navigate('/dashboard/stock', { 
      state: { 
        filterType: 'supplier', 
        filterValue: supplier.id,
        filterName: supplier.name 
      } 
    });
    console.log('🚀 Navigating to stock with state:', { 
      filterType: 'supplier', 
      filterValue: supplier.id,
      filterName: supplier.name 
    });
  };

  const handleSelectSupplier = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSuppliers.length === filteredSuppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(filteredSuppliers.map(s => s.id));
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

  return (
    <div className="space-y-2">
      {/* Header Section with Title and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
            Manage Suppliers
          </h1>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
            Manage your suppliers for better organization of your stock
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            className="h-9 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            variant="outline"
            className="h-9 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="h-9 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex items-center gap-2 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Suppliers List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading suppliers...</p>
            </div>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No suppliers found
              </h3>
              <p className="text-base text-gray-600 mb-4">
                You have no suppliers yet. Create your first supplier to get started.
              </p>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </div>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <Card 
              key={supplier.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {supplier.name}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {supplier.product_count || 0} product{(supplier.product_count || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{supplier.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{supplier.phone || 'No phone'}</span>
                      </div>
                    </div>
                    {supplier.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <MapPin className="w-4 h-4" />
                        <span>{supplier.address}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/dashboard/purchase-orders', { 
                        state: { 
                          preSelectedVendor: supplier.id,
                          preSelectedVendorName: supplier.name 
                        } 
                      })}
                      className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                      title="Create Purchase Order"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(supplier)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteModal(supplier)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Supplier Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Supplier Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Supplier name"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@supplier.nl"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+31 6 12345678"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="+31 6 12345678"
                />
              </div>
              <div>
                <Label htmlFor="municipality">Municipality</Label>
                <Input
                  id="municipality"
                  value={formData.municipality}
                  onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                  placeholder="City, postal code"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Street, house number, postal code and city"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="group">Group</Label>
                <Input
                  id="group"
                  value={formData.group}
                  onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                  placeholder="Supplier group"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="peppol_enabled"
                  checked={formData.peppol_enabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, peppol_enabled: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="peppol_enabled">Verstuurt via Peppol</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSupplier} className="bg-blue-600 hover:bg-blue-700 text-white">
              Add Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Supplier Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Name of the supplier"
                />
              </div>
              <div>
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@supplier.nl"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+31 6 12345678"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-mobile">Mobile</Label>
                <Input
                  id="edit-mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="+31 6 12345678"
                />
              </div>
              <div>
                <Label htmlFor="edit-municipality">Municipality</Label>
                <Input
                  id="edit-municipality"
                  value={formData.municipality}
                  onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                  placeholder="City, postal code"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Street, house number, postal code and city"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-group">Group</Label>
                <Input
                  id="edit-group"
                  value={formData.group}
                  onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                  placeholder="Supplier group"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-peppol_enabled"
                  checked={formData.peppol_enabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, peppol_enabled: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="edit-peppol_enabled">Verstuurt via Peppol</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSupplier} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Supplier Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the supplier "{selectedSupplier?.name}"? 
              This action cannot be undone.
            </p>
            <p className="text-sm text-gray-500">
              Let op: Suppliers that are in use by products cannot be deleted.
              Suppliers that are in use by products cannot be deleted.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSupplier}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
