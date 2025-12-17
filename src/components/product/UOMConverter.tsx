import React, { useState } from 'react';
import { useUOMConversions } from '@/hooks/useUOMConversions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Calculator } from 'lucide-react';

interface UOMConverterProps {
  productId: string;
}

export const UOMConverter: React.FC<UOMConverterProps> = ({ productId }) => {
  const {
    conversions,
    isLoading,
    createConversion,
    updateConversion,
    deleteConversion,
    getConversionFactor,
    isCreating,
    isUpdating,
    isDeleting,
  } = useUOMConversions(productId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    from_uom: '',
    to_uom: '',
    conversion_factor: 1.0,
  });

  const handleCreate = () => {
    if (!formData.from_uom || !formData.to_uom || formData.conversion_factor <= 0) {
      return;
    }

    createConversion(
      {
        product_id: productId,
        ...formData,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setFormData({ from_uom: '', to_uom: '', conversion_factor: 1.0 });
        },
      }
    );
  };

  const handleUpdate = () => {
    if (!editingId || formData.conversion_factor <= 0) return;

    updateConversion(
      {
        id: editingId,
        conversion_factor: formData.conversion_factor,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingId(null);
          setFormData({ from_uom: '', to_uom: '', conversion_factor: 1.0 });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this conversion?')) {
      deleteConversion(id);
    }
  };

  const handleEdit = (conversion: any) => {
    setEditingId(conversion.id);
    setFormData({
      from_uom: conversion.from_uom,
      to_uom: conversion.to_uom,
      conversion_factor: conversion.conversion_factor,
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading conversions...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold">Unit of Measure Conversions</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingId(null);
            setFormData({ from_uom: '', to_uom: '', conversion_factor: 1.0 });
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Conversion
        </Button>
      </div>

      {conversions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No UOM conversions defined</p>
          <p className="text-sm mt-2">Add conversions to enable automatic unit conversion</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From UOM</TableHead>
                <TableHead>To UOM</TableHead>
                <TableHead className="text-right">Conversion Factor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversions.map((conversion) => (
                <TableRow key={conversion.id}>
                  <TableCell className="font-medium">{conversion.from_uom}</TableCell>
                  <TableCell>{conversion.to_uom}</TableCell>
                  <TableCell className="text-right font-mono">
                    {conversion.conversion_factor}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(conversion)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(conversion.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit UOM Conversion' : 'Add UOM Conversion'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>From UOM</Label>
              <Input
                value={formData.from_uom}
                onChange={(e) =>
                  setFormData({ ...formData, from_uom: e.target.value })
                }
                placeholder="e.g., liter"
                disabled={!!editingId}
              />
            </div>
            <div>
              <Label>To UOM</Label>
              <Input
                value={formData.to_uom}
                onChange={(e) =>
                  setFormData({ ...formData, to_uom: e.target.value })
                }
                placeholder="e.g., milliliter"
                disabled={!!editingId}
              />
            </div>
            <div>
              <Label>Conversion Factor</Label>
              <Input
                type="number"
                step="0.0001"
                min="0.0001"
                value={formData.conversion_factor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conversion_factor: parseFloat(e.target.value) || 1.0,
                  })
                }
                placeholder="1.0"
              />
              <p className="text-xs text-gray-500 mt-1">
                How many "{formData.to_uom}" equal 1 "{formData.from_uom}"?
                <br />
                Example: 1 liter = 1000 milliliters, so factor = 1000
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={editingId ? handleUpdate : handleCreate}
              disabled={
                isCreating ||
                isUpdating ||
                !formData.from_uom ||
                !formData.to_uom ||
                formData.conversion_factor <= 0
              }
            >
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

