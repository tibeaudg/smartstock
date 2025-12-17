/**
 * Locations/Warehouses Management Page
 * Card-based view for managing warehouses with CRUD operations
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
import { Plus, Warehouse as WarehouseIcon, Edit, Trash2, Package, MapPin, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { 
  useWarehouses, 
  useCreateWarehouse, 
  useUpdateWarehouse, 
  useDeleteWarehouse,
  useWarehouseProductCount,
  useWarehouseRealtime,
  type Warehouse 
} from '@/hooks/useWarehouses';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

export default function WarehousePage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Hooks
  const { data: warehouses = [], isLoading } = useWarehouses();
  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();
  const deleteWarehouse = useDeleteWarehouse();
  useWarehouseRealtime();

  const handleAddWarehouse = () => {
    setFormData({ name: '', description: '' });
    setShowAddModal(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      description: warehouse.description || '',
    });
    setShowEditModal(true);
  };

  const handleDeleteWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowDeleteDialog(true);
  };

  const handleViewProducts = (warehouse: Warehouse) => {
    navigate(`/dashboard/categories?warehouse=${encodeURIComponent(warehouse.name)}`);
  };

  const handleSubmitAdd = async () => {
    if (!formData.name.trim()) {
      toast.error('Warehouse name is required');
      return;
    }

    try {
      await createWarehouse.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        branch_id: activeBranch?.branch_id || null,
      });
      setShowAddModal(false);
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding warehouse:', error);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedWarehouse || !formData.name.trim()) {
      toast.error('Warehouse name is required');
      return;
    }

    try {
      await updateWarehouse.mutateAsync({
        warehouseId: selectedWarehouse.id,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
        },
      });
      setShowEditModal(false);
      setSelectedWarehouse(null);
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Error updating warehouse:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedWarehouse) return;

    try {
      await deleteWarehouse.mutateAsync(selectedWarehouse.id);
      setShowDeleteDialog(false);
      setSelectedWarehouse(null);
    } catch (error) {
      console.error('Error deleting warehouse:', error);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Warehouses</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your warehouse locations
          </p>
        </div>
        <Button onClick={handleAddWarehouse} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Location</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Warehouses Grid */}
      {warehouses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <WarehouseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No locations yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first warehouse location to get started.
            </p>
            <Button onClick={handleAddWarehouse}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Location
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {warehouses.map((warehouse) => (
            <WarehouseCard
              key={warehouse.id}
              warehouse={warehouse}
              onEdit={() => handleEditWarehouse(warehouse)}
              onDelete={() => handleDeleteWarehouse(warehouse)}
              onViewProducts={() => handleViewProducts(warehouse)}
            />
          ))}
        </div>
      )}

      {/* Add Warehouse Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Main Warehouse, Storage Room A"
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
                placeholder="Optional description of the location"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAdd} disabled={createWarehouse.isPending || !formData.name.trim()}>
              {createWarehouse.isPending ? 'Adding...' : 'Add Location'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Warehouse Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Location Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Main Warehouse, Storage Room A"
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
                placeholder="Optional description of the location"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit} disabled={updateWarehouse.isPending || !formData.name.trim()}>
              {updateWarehouse.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Warehouse Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the location "{selectedWarehouse?.name}"?
              This action cannot be undone. Products in this location will have their location set to empty.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteWarehouse.isPending}
            >
              {deleteWarehouse.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface WarehouseCardProps {
  warehouse: Warehouse;
  onEdit: () => void;
  onDelete: () => void;
  onViewProducts: () => void;
}

function WarehouseCard({ warehouse, onEdit, onDelete, onViewProducts }: WarehouseCardProps) {
  const { activeBranch } = useBranches();
  const { data: productCount = 0 } = useWarehouseProductCount(warehouse.name);

  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={onViewProducts}>
      <CardContent className="p-6">
        {/* Header with actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
                {warehouse.name}
              </h3>
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
        {warehouse.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {warehouse.description}
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

