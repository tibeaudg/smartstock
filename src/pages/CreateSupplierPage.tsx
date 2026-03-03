/**
 * Create Supplier Page
 * Form for creating a new supplier (vendors you purchase from)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { useCreateSupplier } from '@/hooks/useSuppliers';
import { SupplierCreateData, SupplierAddress } from '@/types/supplierTypes';
import { toast } from 'sonner';

const emptyAddress: SupplierAddress = {
  attention: '',
  name: '',
  country: 'BE',
  street: '',
  number: '',
  box: '',
  postal_code: '',
  municipality: '',
  phone: '',
};

export default function CreateSupplierPage() {
  const navigate = useNavigate();
  const createMutation = useCreateSupplier();

  const [formData, setFormData] = useState<Partial<SupplierCreateData>>({
    name: '',
    legal_name: '',
    commercial_name: '',
    company_number: '',
    supplier_number: '',
    contact_person: '',
    email: '',
    phone: '',
    mobile: '',
    address: '',
    payment_term: 30,
    language: 'nl',
    standard_currency: 'EUR',
  });

  const [billingAddress, setBillingAddress] = useState<SupplierAddress>(emptyAddress);

  const handleSubmit = async () => {
    const name = formData.legal_name || formData.commercial_name || formData.name;
    if (!name?.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const submitData: SupplierCreateData = {
        ...formData,
        name: name.trim(),
        billing_address: billingAddress,
        delivery_address: formData.same_as_billing ? billingAddress : billingAddress,
      } as SupplierCreateData;

      await createMutation.mutateAsync(submitData);
      toast.success('Supplier created successfully');
      navigate('/dashboard/suppliers');
    } catch (error: any) {
      toast.error(`Failed to create supplier: ${error.message}`);
    }
  };

  const updateBilling = (field: keyof SupplierAddress, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            New Supplier
          </h1>
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
                  placeholder="Supplier name"
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
                  placeholder="Registered company name"
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
                  placeholder="BE0832574952"
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
              disabled={createMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Supplier'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
