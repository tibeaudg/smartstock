/**
 * Vendor Management Page
 * Database-integrated view for managing suppliers with CRUD operations
 */

import React, { useState, useMemo } from 'react';
import { 
  useSuppliers, 
  useCreateSupplier, 
  useUpdateSupplier, 
  useDeleteSupplier,
  useSupplierRealtime 
} from '@/hooks/useSuppliers'; // Assumed hook location
import { Supplier, SupplierCreateData } from '../types/supplierTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Truck, 
  Mail, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsUpDown, 
  ChevronUp, 
  ChevronDown, 
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type SortColumn = 'name' | 'email';
type SortDirection = 'asc' | 'desc';

export default function VendorManagementPage() {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Form state
  const [formData, setFormData] = useState<Omit<SupplierCreateData, 'branch_id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Database Hooks
  const { data: suppliers = [], isLoading } = useSuppliers();
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();
  
  // Enable Real-time listener
  useSupplierRealtime();

  // Logic: Filtering
  const filteredSuppliers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return suppliers;
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.email.toLowerCase().includes(query)
    );
  }, [suppliers, searchQuery]);

  // Logic: Sorting
  const sortedSuppliers = useMemo(() => {
    return [...filteredSuppliers].sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      const comparison = aVal.toString().localeCompare(bVal.toString());
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredSuppliers, sortColumn, sortDirection]);

  // Logic: Pagination
  const totalPages = Math.ceil(sortedSuppliers.length / itemsPerPage);
  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleAdd = async () => {
    if (!formData.name) {
      toast.error('Name and Email are required');
      return;
    }
    try {
      await createMutation.mutateAsync(formData);
      setShowAddModal(false);
      resetForm();
      toast.success('Supplier added successfully');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async () => {
    if (!selectedSupplier) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedSupplier.id,
        data: formData
      });
      setShowEditModal(false);
      setSelectedSupplier(null);
      toast.success('Supplier updated');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!selectedSupplier) return;
    try {
      await deleteMutation.mutateAsync(selectedSupplier.id);
      setShowDeleteDialog(false);
      setSelectedSupplier(null);
      toast.success('Supplier removed');
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '', });
  };

  const openEdit = (s: Supplier) => {
    setSelectedSupplier(s);
    setFormData({
      name: s.name,
      email: s.email,
      phone: s.phone || '',
      address: s.address || '',
    });
    setShowEditModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">

<div className="h-full flex-col-2 w-full">
  {/* Header */}
  <div className="border-b px-6 py-4">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage suppliers, track component costs, and calculate delivery speed
        </p>
      </div>
      <Button 
        onClick={() => { resetForm(); setShowAddModal(true); }} 
        className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Supplier
      </Button>
    </div>
  </div>

  {/* Search and Filters */}
  <div className="px-6 py-4">
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  </div>
</div>

      {/* Main Table Content */}
      <Card className="border-none shadow-sm overflow-hidden">
        {sortedSuppliers.length === 0 ? (
          <div className="p-20 text-center">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No suppliers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b font-bold text-gray-700">
                <tr>
                  <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2">Name <ChevronsUpDown className="w-3 h-3"/></div>
                  </th>
                  <th className="p-4 hidden md:table-cell">Contact</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-500 md:hidden">{s.email}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center text-sm text-gray-600 gap-2"><Mail className="w-3 h-3"/> {s.email}</div>
                      {s.phone && <div className="flex items-center text-sm text-gray-600 gap-2"><Phone className="w-3 h-3"/> {s.phone}</div>}
                    </td>
                   
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedSupplier(s); setShowDeleteDialog(true); }} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination UI - Mirrored from Categories */}
        <div className="flex items-center justify-between px-4 py-4 bg-white border-t">
          <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">Page {currentPage} of {totalPages || 1}</span>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddModal || showEditModal} onOpenChange={(val) => { if(!val){ setShowAddModal(false); setShowEditModal(false); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{showAddModal ? 'New Supplier' : 'Edit Supplier'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Supplier Name</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Tech Corp" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="info@tech.com" />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1..." />
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</Button>
            <Button onClick={showAddModal ? handleAdd : handleUpdate} disabled={createMutation.isPending || updateMutation.isPending}>
              {showAddModal ? 'Create Supplier' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedSupplier?.name}</strong>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    

</>
  );
}
