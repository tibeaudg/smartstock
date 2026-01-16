import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useCustomers, 
  useDeleteCustomer,
  useCustomerRealtime 
} from '@/hooks/useCustomers';
import { Customer } from '../types/customerTypes';
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
  ArrowUpDown
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type SortColumn = 'name' | 'email';
type SortDirection = 'asc' | 'desc';

// Go to page input component
const GoToPageInput: React.FC<{ totalPages: number; onPageChange: (page: number) => void }> = ({ totalPages, onPageChange }) => {
  const [pageInput, setPageInput] = useState('');

  const handleGo = () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPageInput('');
    }
  };

  return (
    <>
      <Input
        type="number"
        min={1}
        max={totalPages}
        className="w-16 h-8"
        value={pageInput}
        onChange={(e) => setPageInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleGo();
          }
        }}
        placeholder="Page"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleGo}
      >
        Go
      </Button>
    </>
  );
};

export default function CustomerManagementPage() {
  const navigate = useNavigate();
  
  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Selected suppliers for bulk actions
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());

  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Database Hooks
  const { data: customers = [], isLoading } = useCustomers();
  const deleteMutation = useDeleteCustomer();
  
  // Enable Real-time listener
  useCustomerRealtime();

  // Logic: Filtering
  const filteredCustomers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return customers;
    return customers.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.email.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  // Logic: Sorting
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      const comparison = aVal.toString().localeCompare(bVal.toString());
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredCustomers, sortColumn, sortDirection]);

  // Logic: Pagination
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const paginatedCustomers = sortedCustomers.slice(
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
    if (!selectedCustomer) return;
    try {
      await deleteMutation.mutateAsync(selectedCustomer.id);
      setShowDeleteDialog(false);
      setSelectedCustomer(null);
      toast.success('Customer removed');
    } catch (e) {
      console.error(e);
    }
  };
  
  const toggleSelectCustomer = (id: string) => {
    setSelectedCustomerIds(prev => {
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
    if (selectedCustomerIds.size === paginatedCustomers.length) {
      setSelectedCustomerIds(new Set());
    } else {
      setSelectedCustomerIds(new Set(paginatedCustomers.map(c => c.id)));
    }
  };
  
  // Helper function to get municipality from address
  const getMunicipality = (customer: Customer): string => {
    if (customer.municipality) return customer.municipality;
    
    // Try to parse from billing_address
    if (customer.billing_address) {
      let address: any = {};
      if (typeof customer.billing_address === 'string') {
        try {
          address = JSON.parse(customer.billing_address);
        } catch {
          return '';
        }
      } else {
        address = customer.billing_address;
      }
      return address.municipality || '';
    }
    
    return '';
  };
  
  // Helper function to get postal code and municipality combined
  const getPostalCodeAndMunicipality = (customer: Customer): string => {
    if (customer.municipality) {
      // Try to get postal code from address
      if (customer.billing_address) {
        let address: any = {};
        if (typeof customer.billing_address === 'string') {
          try {
            address = JSON.parse(customer.billing_address);
          } catch {
              return customer.municipality;
          }
        } else {
          address = customer.billing_address;
        }
        if (address.postal_code) {
          return `${address.postal_code} ${customer.municipality}`;
        }
      }
      return customer.municipality;
    }
    
    // Try to parse from billing_address
    if (customer.billing_address) {
      let address: any = {};
      if (typeof customer.billing_address === 'string') {
        try {
          address = JSON.parse(customer.billing_address);
        } catch {
          return '';
        }
      } else {
        address = customer.billing_address;
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
    <div className="space-y-6 p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage customers, track component costs, and calculate delivery speed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => navigate('/dashboard/customer-management/new')} 
            className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Table Content */}
      <Card className="border-none shadow-sm overflow-hidden">
        {sortedCustomers.length === 0 ? (
          <div className="p-20 text-center">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 w-12">
                    <Checkbox
                      checked={paginatedCustomers.length > 0 && selectedCustomerIds.size === paginatedCustomers.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nr</th>
                  <th 
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {sortColumn === 'name' && (
                        <ArrowUpDown className={cn(
                          "w-3 h-3",
                          sortDirection === 'asc' ? 'rotate-180' : ''
                        )} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipality</th>
                  <th 
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {sortColumn === 'email' && (
                        <ArrowUpDown className={cn(
                          "w-3 h-3",
                          sortDirection === 'asc' ? 'rotate-180' : ''
                        )} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedCustomers.map((c, index) => {
                  const customerName = c.legal_name || c.commercial_name || c.name || '';
                  const companyNumber = c.company_number || '';
                  const municipality = getPostalCodeAndMunicipality(c);
                  const isSelected = selectedCustomerIds.has(c.id);
                  
                  return (
                    <tr 
                      key={c.id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                      onClick={(e) => {
                        // Don't navigate if clicking on checkbox
                        if ((e.target as HTMLElement).closest('button, [role="checkbox"]')) {
                          return;
                        }
                        navigate(`/dashboard/customer-management/${c.id}/edit`);
                      }}
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectCustomer(c.id)}
                        />
                      </td>
                      <td className="p-4 text-gray-600">{c.customer_number || index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{customerName}</div>
                      </td>
                      <td className="p-4 text-gray-600">{companyNumber}</td>
                      <td className="p-4 text-gray-600">
                        {c.contact_person || '-'}
                      </td>
                      <td className="p-4 text-gray-600">{municipality || '-'}</td>
                      <td className="p-4 text-gray-600">{c.email || '-'}</td>
                      <td className="p-4 text-gray-600">{c.phone || '-'}</td>
                      <td className="p-4 text-gray-600">{c.mobile || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 ">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Showing per page</span>
            <Select value={itemsPerPage.toString()} onValueChange={(v) => {
              setItemsPerPage(Number(v));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Show 10</SelectItem>
                <SelectItem value="12">Show 12</SelectItem>
                <SelectItem value="24">Show 24</SelectItem>
                <SelectItem value="50">Show 50</SelectItem>
                <SelectItem value="100">Show 100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedCustomers.length)} of {sortedCustomers.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                if (totalPages > 5 && i === 4 && pageNum < totalPages - 1) {
                  return (
                    <React.Fragment key={pageNum}>
                      <span className="px-2">...</span>
                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </React.Fragment>
                  );
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Go to page</span>
            <GoToPageInput
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedCustomer?.name}</strong>. 
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
