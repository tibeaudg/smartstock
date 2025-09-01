import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Truck, Mail, Phone, MapPin, Package, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';

interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export default function SuppliersPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

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

  useEffect(() => {
    if (user) {
      fetchSuppliers();
    }
  }, [user]);

  const fetchSuppliers = async () => {
    try {
      // First get all suppliers
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (suppliersError) {
        console.error('Error fetching suppliers:', suppliersError);
        toast.error('Fout bij het ophalen van leveranciers');
        return;
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

      setSuppliers(suppliersWithCount);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Onverwachte fout bij het ophalen van leveranciers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    if (!formData.name.trim()) {
      toast.error('Leverancier naam is verplicht');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          address: formData.address.trim() || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding supplier:', error);
        toast.error(`Fout bij het toevoegen van leverancier: ${error.message}`);
        return;
      }

      toast.success('Leverancier succesvol toegevoegd!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', address: '' });
      fetchSuppliers();
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error('Onverwachte fout bij het toevoegen van leverancier');
    }
  };

  const handleEditSupplier = async () => {
    if (!selectedSupplier || !formData.name.trim()) {
      toast.error('Leverancier naam is verplicht');
      return;
    }

    try {
      const { error } = await supabase
        .from('suppliers')
        .update({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          address: formData.address.trim() || null
        })
        .eq('id', selectedSupplier.id);

      if (error) {
        console.error('Error updating supplier:', error);
        toast.error(`Fout bij het bijwerken van leverancier: ${error.message}`);
        return;
      }

      toast.success('Leverancier succesvol bijgewerkt!');
      setShowEditModal(false);
      setSelectedSupplier(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
      fetchSuppliers();
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Onverwachte fout bij het bijwerken van leverancier');
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
        toast.error('Fout bij het controleren van leverancier gebruik');
        return;
      }

      if (productsUsingSupplier && productsUsingSupplier.length > 0) {
        toast.error('Deze leverancier kan niet worden verwijderd omdat er producten aan gekoppeld zijn');
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
        toast.error(`Fout bij het verwijderen van leverancier: ${error.message}`);
        return;
      }

      toast.success('Leverancier succesvol verwijderd!');
      setShowDeleteModal(false);
      setSelectedSupplier(null);
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Onverwachte fout bij het verwijderen van leverancier');
    }
  };

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
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
                  <span className="hidden sm:inline">Categorieën</span>
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
            Leveranciers Beheren
          </h1>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
            Beheer uw leveranciers voor betere organisatie van uw inkoop en voorraad
          </p>
        </div>

        {/* Add Supplier Button */}
        <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
          <Button 
            onClick={() => setShowAddModal(true)} 
            className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}
          >
            <Plus className="w-4 h-4" />
            Nieuwe Leverancier
          </Button>
        </div>

        {/* Suppliers List */}
        <div className={`grid gap-3 ${isMobile ? '' : 'gap-4'}`}>
          {loading ? (
            <Card>
              <CardContent className={`${isMobile ? 'p-6' : 'p-8'}`}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Leveranciers laden...</p>
                </div>
              </CardContent>
            </Card>
          ) : suppliers.length === 0 ? (
            <Card>
              <CardContent className={`${isMobile ? 'p-6' : 'p-8'}`}>
                <div className="text-center">
                  <Truck className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-gray-400 mx-auto mb-4`} />
                  <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-gray-900 mb-2`}>
                    Geen leveranciers
                  </h3>
                  <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 mb-4`}>
                    U heeft nog geen leveranciers aangemaakt. Maak uw eerste leverancier aan om te beginnen.
                  </p>
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className={isMobile ? 'w-full' : ''}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Eerste Leverancier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            suppliers.map((supplier) => (
              <Card 
                key={supplier.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSupplierClick(supplier)}
              >
                <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900`}>
                          {supplier.name}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {supplier.product_count || 0} product{supplier.product_count !== 1 ? 'en' : ''}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        {supplier.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{supplier.email}</span>
                          </div>
                        )}
                        {supplier.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{supplier.phone}</span>
                          </div>
                        )}
                        {supplier.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{supplier.address}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Aangemaakt op {new Date(supplier.created_at).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <div className={`flex gap-2 ${isMobile ? 'ml-3' : ''}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(supplier);
                        }}
                        className={isMobile ? 'px-2 py-1' : ''}
                      >
                        <Edit className="w-4 h-4" />
                        {!isMobile && <span className="ml-1">Bewerken</span>}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(supplier);
                        }}
                        className={`${isMobile ? 'px-2 py-1' : ''} text-red-600 hover:text-red-700 hover:bg-red-50`}
                      >
                        <Trash2 className="w-4 h-4" />
                        {!isMobile && <span className="ml-1">Verwijderen</span>}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Supplier Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe Leverancier Toevoegen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Leverancier Naam *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Naam van de leverancier"
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@leverancier.nl"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefoon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+31 6 12345678"
              />
            </div>
            <div>
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Straat, huisnummer, postcode en plaats"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Annuleren
            </Button>
            <Button onClick={handleAddSupplier}>
              Leverancier Toevoegen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leverancier Bewerken</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Leverancier Naam *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Naam van de leverancier"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">E-mail</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@leverancier.nl"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Telefoon</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+31 6 12345678"
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Adres</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Straat, huisnummer, postcode en plaats"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Annuleren
            </Button>
            <Button onClick={handleEditSupplier}>
              Wijzigingen Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Supplier Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leverancier Verwijderen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Weet u zeker dat u de leverancier "{selectedSupplier?.name}" wilt verwijderen? 
              Deze actie kan niet ongedaan worden gemaakt.
            </p>
            <p className="text-sm text-gray-500">
              Let op: Leveranciers die in gebruik zijn door producten kunnen niet worden verwijderd.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annuleren
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSupplier}
              className="bg-red-600 hover:bg-red-700"
            >
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
