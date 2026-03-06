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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Copy, Pencil } from 'lucide-react';
import { useCreateSupplier } from '@/hooks/useSuppliers';
import { SupplierCreateData, SupplierAddress } from '@/types/supplierTypes';
import { toast } from 'sonner';
import { PageFormLayout } from '@/components/PageFormLayout';

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
  const [activeTab, setActiveTab] = useState('company');

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
    same_as_billing: false,
    comments: '',
  });

  const [billingAddress, setBillingAddress] = useState<SupplierAddress>(emptyAddress);
  const [deliveryAddress, setDeliveryAddress] = useState<SupplierAddress>(emptyAddress);

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
        delivery_address: formData.same_as_billing ? billingAddress : deliveryAddress,
      } as SupplierCreateData;

      await createMutation.mutateAsync(submitData);
      toast.success('Supplier created successfully');
      navigate('/dashboard/suppliers');
    } catch (error: any) {
      const msg = error?.message || 'Unknown error';
      toast.error(msg === 'Supplier already exists' ? msg : `Failed to create supplier: ${msg}`);
    }
  };

  const copyBillingToDelivery = () => {
    setDeliveryAddress({ ...billingAddress });
    setFormData({ ...formData, same_as_billing: true });
  };

  const copyDeliveryToBilling = () => {
    setBillingAddress({ ...deliveryAddress });
  };

  const updateBillingAddress = (field: keyof SupplierAddress, value: string) => {
    const nextBilling = { ...billingAddress, [field]: value };
    setBillingAddress(nextBilling);
    if (formData.same_as_billing) {
      setDeliveryAddress(nextBilling);
    }
  };

  const updateDeliveryAddress = (field: keyof SupplierAddress, value: string) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-screen flex flex-col min-h-0 p-6">
      <PageFormLayout
        title="Create Supplier"
        backTo="/dashboard/suppliers"
        backLabel="Back"
        primaryAction={
          <Button onClick={handleSubmit} disabled={createMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
            {createMutation.isPending ? 'Creating...' : 'Create Supplier'}
          </Button>
        }
      >
        <div className="space-y-6 h-screen">

          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="company" className="mt-0 space-y-6">
                {/* Company & Contact - Add Product style section */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="company_number" className="text-gray-900">Company Number</Label>
                      <Input
                        id="company_number"
                        value={formData.company_number || ''}
                        onChange={(e) => setFormData({ ...formData, company_number: e.target.value })}
                        placeholder="BE0832574952"
                        className="border-gray-300 focus:border-gray-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="legal_name" className="text-gray-900">
                        Name <span className="text-blue-500">*</span>
                      </Label>
                      <Input
                        id="legal_name"
                        value={formData.legal_name || formData.commercial_name || formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                        placeholder="Supplier name"
                        required
                        className="border-gray-300 focus:border-gray-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bic" className="text-gray-900">BIC</Label>
                      <Input
                        id="bic"
                        value={formData.bic || ''}
                        onChange={(e) => setFormData({ ...formData, bic: e.target.value })}
                        className="border-gray-300 focus:border-gray-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="payment_term" className="text-gray-900">Payment Term</Label>
                      <Input
                        id="payment_term"
                        type="number"
                        value={formData.payment_term ?? 30}
                        onChange={(e) => setFormData({ ...formData, payment_term: parseInt(e.target.value) || 30 })}
                        className="border-gray-300 focus:border-gray-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="supplier_number" className="text-gray-900">Supplier No.</Label>
                      <Input
                        id="supplier_number"
                        value={formData.supplier_number || ''}
                        onChange={(e) => setFormData({ ...formData, supplier_number: e.target.value })}
                        placeholder="0"
                        className="border-gray-300 focus:border-gray-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="director_first_name" className="text-gray-900">First Name Director</Label>
                        <Input
                          id="director_first_name"
                          value={formData.director_first_name || ''}
                          onChange={(e) => setFormData({ ...formData, director_first_name: e.target.value })}
                          className="border-gray-300 focus:border-gray-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="director_last_name" className="text-gray-900">Last Name Director</Label>
                        <Input
                          id="director_last_name"
                          value={formData.director_last_name || ''}
                          onChange={(e) => setFormData({ ...formData, director_last_name: e.target.value })}
                          className="border-gray-300 focus:border-gray-500"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-gray-900">Email</Label>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="info@example.com"
                          className="border-gray-300 focus:border-gray-500 flex-1"
                        />
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">(One email per line)</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="text-gray-900">Telephone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+32..."
                        className="border-gray-300 focus:border-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing & Delivery Address - Add Product style sections side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Billing Address */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Billing Address</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyBillingToDelivery}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="billing_attention" className="text-gray-900">Attention</Label>
                        <div className="flex gap-2">
                          <Input
                            id="billing_attention"
                            value={billingAddress.attention || ''}
                            onChange={(e) => updateBillingAddress('attention', e.target.value)}
                            className="border-gray-300 focus:border-gray-500 flex-1"
                          />
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="billing_name" className="text-gray-900">Commercial Name</Label>
                        <Input
                          id="billing_name"
                          value={billingAddress.name || ''}
                          onChange={(e) => updateBillingAddress('name', e.target.value)}
                          className="border-gray-300 focus:border-gray-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="billing_country" className="text-gray-900">Country</Label>
                        <Select
                          value={billingAddress.country || 'BE'}
                          onValueChange={(value) => updateBillingAddress('country', value)}
                        >
                          <SelectTrigger className="border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BE">Belgium</SelectItem>
                            <SelectItem value="NL">Netherlands</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 grid gap-2">
                          <Label htmlFor="billing_street" className="text-gray-900">Street</Label>
                          <Input
                            id="billing_street"
                            value={billingAddress.street || ''}
                            onChange={(e) => updateBillingAddress('street', e.target.value)}
                            placeholder="Rijvisschestraat 110/4"
                            className="border-gray-300 focus:border-gray-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="billing_number" className="text-gray-900">Nr</Label>
                          <Input
                            id="billing_number"
                            value={billingAddress.number || ''}
                            onChange={(e) => updateBillingAddress('number', e.target.value)}
                            className="border-gray-300 focus:border-gray-500"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="billing_box" className="text-gray-900">Box</Label>
                        <Input
                          id="billing_box"
                          value={billingAddress.box || ''}
                          onChange={(e) => updateBillingAddress('box', e.target.value)}
                          className="border-gray-300 focus:border-gray-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                          <Label htmlFor="billing_postal_code" className="text-gray-900">Postal Code</Label>
                          <Input
                            id="billing_postal_code"
                            value={billingAddress.postal_code || ''}
                            onChange={(e) => updateBillingAddress('postal_code', e.target.value)}
                            placeholder="9052"
                            className="border-gray-300 focus:border-gray-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="billing_municipality" className="text-gray-900">Municipality</Label>
                          <Input
                            id="billing_municipality"
                            value={billingAddress.municipality || ''}
                            onChange={(e) => updateBillingAddress('municipality', e.target.value)}
                            placeholder="Zwijnaarde"
                            className="border-gray-300 focus:border-gray-500"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="billing_phone" className="text-gray-900">Telephone</Label>
                        <Input
                          id="billing_phone"
                          value={billingAddress.phone || ''}
                          onChange={(e) => updateBillingAddress('phone', e.target.value)}
                          className="border-gray-300 focus:border-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Delivery Address</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyDeliveryToBilling}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Switch
                        checked={formData.same_as_billing ?? false}
                        onCheckedChange={(checked) => {
                          setFormData({ ...formData, same_as_billing: checked });
                          if (checked) {
                            setDeliveryAddress({ ...billingAddress });
                          }
                        }}
                      />
                      <Label>Same as billing address</Label>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="delivery_attention" className="text-gray-900">Attention</Label>
                        <div className="flex gap-2">
                          <Input
                            id="delivery_attention"
                            value={deliveryAddress.attention || ''}
                            onChange={(e) => updateDeliveryAddress('attention', e.target.value)}
                            disabled={formData.same_as_billing}
                            className="border-gray-300 focus:border-gray-500 flex-1"
                          />
                          <Button variant="ghost" size="icon" disabled={formData.same_as_billing}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="delivery_name" className="text-gray-900">Name</Label>
                        <Input
                          id="delivery_name"
                          value={deliveryAddress.name || ''}
                          onChange={(e) => updateDeliveryAddress('name', e.target.value)}
                          disabled={formData.same_as_billing}
                          className="border-gray-300 focus:border-gray-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="delivery_country" className="text-gray-900">Country</Label>
                        <Select
                          value={deliveryAddress.country || 'BE'}
                          onValueChange={(value) => updateDeliveryAddress('country', value)}
                          disabled={formData.same_as_billing}
                        >
                          <SelectTrigger className="border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BE">Belgium</SelectItem>
                            <SelectItem value="NL">Netherlands</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 grid gap-2">
                          <Label htmlFor="delivery_street" className="text-gray-900">Street</Label>
                          <Input
                            id="delivery_street"
                            value={deliveryAddress.street || ''}
                            onChange={(e) => updateDeliveryAddress('street', e.target.value)}
                            disabled={formData.same_as_billing}
                            className="border-gray-300 focus:border-gray-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="delivery_number" className="text-gray-900">Nr</Label>
                          <Input
                            id="delivery_number"
                            value={deliveryAddress.number || ''}
                            onChange={(e) => updateDeliveryAddress('number', e.target.value)}
                            disabled={formData.same_as_billing}
                            className="border-gray-300 focus:border-gray-500"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="delivery_box" className="text-gray-900">Box</Label>
                        <Input
                          id="delivery_box"
                          value={deliveryAddress.box || ''}
                          onChange={(e) => updateDeliveryAddress('box', e.target.value)}
                          disabled={formData.same_as_billing}
                          className="border-gray-300 focus:border-gray-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                          <Label htmlFor="delivery_postal_code" className="text-gray-900">Postal Code</Label>
                          <Input
                            id="delivery_postal_code"
                            value={deliveryAddress.postal_code || ''}
                            onChange={(e) => updateDeliveryAddress('postal_code', e.target.value)}
                            disabled={formData.same_as_billing}
                            className="border-gray-300 focus:border-gray-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="delivery_municipality" className="text-gray-900">Municipality</Label>
                          <Input
                            id="delivery_municipality"
                            value={deliveryAddress.municipality || ''}
                            onChange={(e) => updateDeliveryAddress('municipality', e.target.value)}
                            disabled={formData.same_as_billing}
                            className="border-gray-300 focus:border-gray-500"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="delivery_phone" className="text-gray-900">Telephone</Label>
                        <Input
                          id="delivery_phone"
                          value={deliveryAddress.phone || ''}
                          onChange={(e) => updateDeliveryAddress('phone', e.target.value)}
                          disabled={formData.same_as_billing}
                          className="border-gray-300 focus:border-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments - Add Product style section */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="grid gap-2">
                    <Label htmlFor="comments" className="text-gray-900">Comments</Label>
                    <Textarea
                      id="comments"
                      value={formData.comments || ''}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      className="min-h-[120px] border-gray-300 focus:border-gray-500 resize-none"
                      placeholder="Enter comments..."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <p className="text-gray-500">History - Coming soon</p>
              </TabsContent>
            </Tabs>
          </div>

        </div>
      </PageFormLayout>
    </div>
  );
}
