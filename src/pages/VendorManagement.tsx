/**
 * Vendor Management Page
 * Database-integrated view for managing suppliers with CRUD operations
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useSuppliers, 
  useDeleteSupplier,
  useSupplierRealtime 
} from '@/hooks/useSuppliers';
import { Supplier } from '../types/supplierTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
  Trash2, 
  Truck, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsUpDown
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

type SortColumn = 'name' | 'email';
type SortDirection = 'asc' | 'desc';

export default function VendorManagementPage() {
  const navigate = useNavigate();
  
  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  // Selected suppliers for bulk actions
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<Set<string>>(new Set());

  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Database Hooks
  const { data: suppliers = [], isLoading } = useSuppliers();
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
  
  const toggleSelectSupplier = (id: string) => {
    setSelectedSupplierIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  const toggleSelectAll = () => {
    if (selectedSupplierIds.size === paginatedSuppliers.length) {
      setSelectedSupplierIds(new Set());
    } else {
      setSelectedSupplierIds(new Set(paginatedSuppliers.map(s => s.id)));
    }
  };
  
  // Helper function to get municipality from address
  const getMunicipality = (supplier: Supplier): string => {
    if (supplier.municipality) return supplier.municipality;
    
    // Try to parse from billing_address
    if (supplier.billing_address) {
      let address: any = {};
      if (typeof supplier.billing_address === 'string') {
        try {
          address = JSON.parse(supplier.billing_address);
        } catch {
          return '';
        }
      } else {
        address = supplier.billing_address;
      }
      return address.municipality || '';
    }
    
    return '';
  };
  
  // Helper function to get postal code and municipality combined
  const getPostalCodeAndMunicipality = (supplier: Supplier): string => {
    if (supplier.municipality) {
      // Try to get postal code from address
      if (supplier.billing_address) {
        let address: any = {};
        if (typeof supplier.billing_address === 'string') {
          try {
            address = JSON.parse(supplier.billing_address);
          } catch {
            return supplier.municipality;
          }
        } else {
          address = supplier.billing_address;
        }
        if (address.postal_code) {
          return `${address.postal_code} ${supplier.municipality}`;
        }
      }
      return supplier.municipality;
    }
    
    // Try to parse from billing_address
    if (supplier.billing_address) {
      let address: any = {};
      if (typeof supplier.billing_address === 'string') {
        try {
          address = JSON.parse(supplier.billing_address);
        } catch {
          return '';
        }
      } else {
        address = supplier.billing_address;
      }
      if (address.postal_code && address.municipality) {
        return `${address.postal_code} ${address.municipality}`;
      }
      return address.municipality || '';
    }
    
    return '';
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
        onClick={() => navigate('/dashboard/vendor-management/new')} 
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
                  <th className="p-4 w-12">
                    <Checkbox
                      checked={paginatedSuppliers.length > 0 && selectedSupplierIds.size === paginatedSuppliers.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-4">Nr</th>
                  <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2">Name <ChevronsUpDown className="w-3 h-3"/></div>
                  </th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Municipality</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Mobile</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedSuppliers.map((s, index) => {
                  const supplierName = s.legal_name || s.commercial_name || s.name || '';
                  const companyNumber = s.company_number || '';
                  const municipality = getPostalCodeAndMunicipality(s);
                  const isSelected = selectedSupplierIds.has(s.id);
                  
                  return (
                    <tr 
                      key={s.id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                      onClick={(e) => {
                        // Don't navigate if clicking on checkbox
                        if ((e.target as HTMLElement).closest('button, [role="checkbox"]')) {
                          return;
                        }
                        navigate(`/dashboard/vendor-management/${s.id}/edit`);
                      }}
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectSupplier(s.id)}
                        />
                      </td>
                      <td className="p-4 text-gray-600">{s.supplier_number || index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{supplierName}</div>
                      </td>
                      <td className="p-4 text-gray-600">{companyNumber}</td>
                      <td className="p-4 text-gray-600">
                        {s.contact_person || '-'}
                      </td>
                      <td className="p-4 text-gray-600">{municipality || '-'}</td>
                      <td className="p-4 text-gray-600">{s.email || '-'}</td>
                      <td className="p-4 text-gray-600">{s.phone || '-'}</td>
                      <td className="p-4 text-gray-600">{s.mobile || '-'}</td>
                    </tr>
                  );
                })}
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
