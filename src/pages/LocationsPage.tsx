import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Plus, Edit, Trash2, Package, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useLocations,
  useCreateLocation,
  useRenameLocation,
  useDeleteLocation,
} from '@/hooks/useLocations';
import type { LocationItem } from '@/hooks/useLocations';

export default function LocationsPage() {
  const navigate = useNavigate();

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addDescription, setAddDescription] = useState('');

  // Rename modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [newName, setNewName] = useState('');

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toDelete, setToDelete] = useState<LocationItem | null>(null);

  const { data: locations = [], isLoading } = useLocations();
  const createLocation = useCreateLocation();
  const renameLocation = useRenameLocation();
  const deleteLocation = useDeleteLocation();

  const filtered = searchQuery.trim()
    ? locations.filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : locations;

  // --- handlers ---

  const openAdd = () => {
    setAddName('');
    setAddDescription('');
    setShowAddModal(true);
  };

  const handleSubmitAdd = async () => {
    if (!addName.trim()) return;
    await createLocation.mutateAsync({ name: addName.trim(), description: addDescription });
    setShowAddModal(false);
  };

  const openEdit = (loc: LocationItem) => {
    setSelectedLocation(loc);
    setNewName(loc.name);
    setShowEditModal(true);
  };

  const handleSubmitRename = async () => {
    if (!selectedLocation || !newName.trim()) return;
    await renameLocation.mutateAsync({
      locationId: selectedLocation.id,
      oldName: selectedLocation.name,
      newName: newName.trim(),
    });
    setShowEditModal(false);
    setSelectedLocation(null);
  };

  const openDelete = (loc: LocationItem) => {
    setToDelete(loc);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    await deleteLocation.mutateAsync({ locationId: toDelete.id, name: toDelete.name });
    setShowDeleteDialog(false);
    setToDelete(null);
  };

  const handleView = (loc: LocationItem) => {
    navigate(`/dashboard/categories?location=${encodeURIComponent(loc.name)}`);
  };

  // --- render ---

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Search skeleton */}
        <div className="h-10 w-full max-w-md bg-gray-200 rounded animate-pulse" />

        {/* List skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse" />
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
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Renaming a location updates all assigned products automatically.
          </p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Location</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No locations match your search' : 'No locations yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {searchQuery
                ? 'Try a different search term.'
                : 'Create a location to get started, or assign a location to any product.'}
            </p>
            {!searchQuery && (
              <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Location
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {filtered.map((loc) => (
            <div key={loc.id ?? loc.name} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">{loc.name}</span>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                    <Package className="w-3 h-3" />
                    {loc.productCount} {loc.productCount === 1 ? 'product' : 'products'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleView(loc)} className="text-blue-600 hover:text-blue-700 text-xs">
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(loc)} className="text-xs">
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  Rename
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openDelete(loc)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Location Modal ── */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-name">Location Name *</Label>
              <Input
                id="add-name"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && addName.trim()) handleSubmitAdd(); }}
                placeholder="e.g. Bay 4, Shelf A3, Cold Storage"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="add-desc">Description <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Textarea
                id="add-desc"
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                placeholder="Optional notes about this location"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitAdd}
              disabled={createLocation.isPending || !addName.trim()}
            >
              {createLocation.isPending ? 'Adding...' : 'Add Location'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Rename Modal ── */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Location</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            All {selectedLocation?.productCount ?? 0} product(s) assigned to "{selectedLocation?.name}" will be updated.
          </p>
          <div className="space-y-2">
            <Label htmlFor="edit-name">New Name</Label>
            <Input
              id="edit-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newName.trim()) handleSubmitRename(); }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitRename}
              disabled={renameLocation.isPending || !newName.trim() || newName.trim() === selectedLocation?.name}
            >
              {renameLocation.isPending ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Location</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear the location from all {toDelete?.productCount ?? 0} product(s) assigned to
              "{toDelete?.name}" and remove it from the list. The products themselves will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteLocation.isPending}
            >
              {deleteLocation.isPending ? 'Removing...' : 'Remove Location'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
