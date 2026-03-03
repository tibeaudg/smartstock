/**
 * Edit Supplier Page
 * Form for editing an existing supplier
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { ArrowLeft, Trash2 } from 'lucide-react';
import {
  useSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from '@/hooks/useSuppliers';
import { SupplierUpdateData, SupplierAddress } from '@/types/supplierTypes';
import { toast } from 'sonner';

export default function EditSupplierPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: supplier, isLoading } = useSupplier(id);
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [formData, setFormData] = useState<Partial<SupplierUpdateData>>({});
  const [billingAddress, setBillingAddress] = useState<SupplierAddress>({});

  useEffect(() => {
    if (supplier) {
      let billing: SupplierAddress = {};
      if (supplier.billing_address) {
        if (typeof supplier.billing_address === 'string') {
          try {
            billing = JSON.parse(supplier.billing_address);
          } catch {
            billing = {};
          }
        } else {
          billing = supplier.billing_address as SupplierAddress;
        }
      }
      setBillingAddress(billing);
      setFormData({
        name: supplier.name || '',
        legal_name: supplier.legal_name || '',
        commercial_name: supplier.commercial_name || '',
        company_number: supplier.company_number || '',
        supplier_number: supplier.supplier_number || '',
        contact_person: supplier.contact_person || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        mobile: supplier.mobile || '',
        address: supplier.address || '',
        payment_term: supplier.payment_term ?? 30,
        language: supplier.language || 'nl',
        standard_currency: supplier.standard_currency || 'EUR',
        comments: supplier.comments || '',
      });
    }
  }, [supplier]);

  const handleSubmit = async () => {
    if (!id) return;
    const name = formData.legal_name || formData.commercial_name || formData.name;
    if (!name?.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          ...formData,
          name: name.trim(),
          billing_address: billingAddress,
        },
      });
      toast.success('Supplier updated');
      navigate('/dashboard/suppliers');
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Supplier deleted');
      navigate('/dashboard/suppliers');
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  const updateBilling = (field: keyof SupplierAddress, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Supplier not found.</p>
        <Button variant="outline" onClick={() => navigate('/dashboard/suppliers')}>
          Back to suppliers
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/suppliers')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Edit Supplier
            </h1>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="legal_name">Legal name</Label>
                <Input
                  id="legal_name"
                  value={formData.legal_name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, legal_name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company_number">Company number</Label>
                <Input
                  id="company_number"
                  value={formData.company_number || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, company_number: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact_person">Contact person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_person: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Billing address
              </h3>
              <div className="grid gap-2">
                <Label>Street</Label>
                <Input
                  value={billingAddress.street || ''}
                  onChange={(e) => updateBilling('street', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label>Number</Label>
                  <Input
                    value={billingAddress.number || ''}
                    onChange={(e) => updateBilling('number', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Box</Label>
                  <Input
                    value={billingAddress.box || ''}
                    onChange={(e) => updateBilling('box', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label>Postal code</Label>
                  <Input
                    value={billingAddress.postal_code || ''}
                    onChange={(e) => updateBilling('postal_code', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Municipality</Label>
                  <Input
                    value={billingAddress.municipality || ''}
                    onChange={(e) => updateBilling('municipality', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Country</Label>
                <Input
                  value={billingAddress.country || ''}
                  onChange={(e) => updateBilling('country', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Comments</Label>
                <Textarea
                  value={formData.comments || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-800">
            <Button variant="outline" onClick={() => navigate('/dashboard/suppliers')}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete supplier?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this supplier. Products linked to this
              supplier will have their supplier reference removed. This cannot be
              undone.
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
