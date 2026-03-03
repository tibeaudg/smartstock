import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useSuppliers,
  useDeleteSupplier,
  useSupplierRealtime,
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
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Trash2,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type SortColumn = 'name' | 'email';
type SortDirection = 'asc' | 'desc';

const GoToPageInput: React.FC<{
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ totalPages, onPageChange }) => {
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
          if (e.key === 'Enter') handleGo();
        }}
        placeholder="Page"
      />
      <Button variant="outline" size="sm" onClick={handleGo}>
        Go
      </Button>
    </>
  );
};

function getPostalCodeAndMunicipality(s: Supplier): string {
  if (s.municipality) return s.municipality;
  if (s.billing_address) {
    let address: any = {};
    if (typeof s.billing_address === 'string') {
      try {
        address = JSON.parse(s.billing_address);
      } catch {
        return '';
      }
    } else {
      address = s.billing_address;
    }
    if (address.postal_code && address.municipality) {
      return `${address.postal_code} ${address.municipality}`;
    }
    return address.municipality || '';
  }
  return '';
}

export default function SuppliersPage() {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const { data: suppliers = [], isLoading } = useSuppliers();
  const deleteMutation = useDeleteSupplier();
  useSupplierRealtime();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return suppliers;
    return suppliers.filter(
      (s) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q) ||
        (s.legal_name || '').toLowerCase().includes(q) ||
        (s.commercial_name || '').toLowerCase().includes(q)
    );
  }, [suppliers, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = (a[sortColumn] || '').toString();
      const bVal = (b[sortColumn] || '').toString();
      const comp = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? comp : -comp;
    });
  }, [filtered, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    if (!selectedSupplier) return;
    try {
      const idsToDelete = selectedIds.size > 0 ? Array.from(selectedIds) : [selectedSupplier.id];
      for (const id of idsToDelete) {
        await deleteMutation.mutateAsync(id);
      }
      setShowDeleteDialog(false);
      setSelectedSupplier(null);
      setSelectedIds(new Set());
      toast.success(
        idsToDelete.length === 1 ? 'Supplier removed' : `${idsToDelete.length} suppliers removed`
      );
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((s) => s.id)));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Supplier Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage suppliers, track contact details, and link to purchase orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => {
                const firstId = Array.from(selectedIds)[0];
                const s = suppliers.find((x) => x.id === firstId);
                if (s) {
                  setSelectedSupplier(s);
                  setShowDeleteDialog(true);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete ({selectedIds.size})
            </Button>
          )}
          <Button
            onClick={() => navigate('/dashboard/suppliers/new')}
            className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Supplier
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        {sorted.length === 0 ? (
          <div className="p-20 text-center">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No suppliers found.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/dashboard/suppliers/new')}
            >
              Add your first supplier
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b">
                <tr>
                  <th className="px-4 py-2 w-12">
                    <Checkbox
                      checked={
                        paginated.length > 0 && selectedIds.size === paginated.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Nr</th>
                  <th
                    className="px-4 py-2 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {sortColumn === 'name' && (
                        <ArrowUpDown
                          className={cn(
                            'w-3 h-3',
                            sortDirection === 'asc' ? 'rotate-180' : ''
                          )}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Company
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th
                    className="px-4 py-2 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {sortColumn === 'email' && (
                        <ArrowUpDown
                          className={cn(
                            'w-3 h-3',
                            sortDirection === 'asc' ? 'rotate-180' : ''
                          )}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {paginated.map((s, idx) => {
                  const displayName =
                    s.legal_name || s.commercial_name || s.name || '';
                  const location = getPostalCodeAndMunicipality(s);
                  const isSelected = selectedIds.has(s.id);

                  return (
                    <tr
                      key={s.id}
                      className={cn(
                        'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors',
                        isSelected && 'bg-blue-50 dark:bg-blue-500/10'
                      )}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button, [role="checkbox"]'))
                          return;
                        navigate(`/dashboard/suppliers/${s.id}/edit`);
                      }}
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(s.id)}
                        />
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {s.supplier_number || idx + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {displayName}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {s.company_number || '-'}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {s.contact_person || '-'}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {location || '-'}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {s.email || '-'}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {s.phone || s.mobile || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {sorted.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing per page
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(v) => {
                setItemsPerPage(Number(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum =
                totalPages <= 5
                  ? i + 1
                  : currentPage <= 3
                    ? i + 1
                    : currentPage >= totalPages - 2
                      ? totalPages - 4 + i
                      : currentPage - 2 + i;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Go to</span>
            <GoToPageInput totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedIds.size > 1
                ? `Delete ${selectedIds.size} suppliers?`
                : 'Delete supplier?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedIds.size > 1 ? (
                <>This will permanently delete {selectedIds.size} suppliers. This cannot be undone.</>
              ) : (
                <>
                  This will permanently delete{' '}
                  <strong>
                    {selectedSupplier?.legal_name ||
                      selectedSupplier?.commercial_name ||
                      selectedSupplier?.name}
                  </strong>
                  . This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
