/**
 * Edit Customer Page
 * Full-page form for editing an existing customer - layout matches Create Customer exactly
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Copy, Pencil, Trash2 } from 'lucide-react';
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
import { useCustomer, useUpdateCustomer, useDeleteCustomer } from '@/hooks/useCustomers';
import { CustomerUpdateData, CustomerAddress } from '@/types/customerTypes';
import { toast } from 'sonner';
import { PageFormLayout } from '@/components/PageFormLayout';

const emptyAddress: CustomerAddress = {
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

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomer(id);
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const [activeTab, setActiveTab] = useState('company');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [formData, setFormData] = useState<Partial<CustomerUpdateData>>({});
  const [billingAddress, setBillingAddress] = useState<CustomerAddress>(emptyAddress);
  const [deliveryAddress, setDeliveryAddress] = useState<CustomerAddress>(emptyAddress);

  useEffect(() => {
    if (customer) {
      let billing: CustomerAddress = { ...emptyAddress };
      let delivery: CustomerAddress = { ...emptyAddress };

      if (customer.billing_address) {
        if (typeof customer.billing_address === 'string') {
          try {
            billing = { ...emptyAddress, ...JSON.parse(customer.billing_address) };
          } catch {
            billing = { ...emptyAddress };
          }
        } else {
          billing = { ...emptyAddress, ...(customer.billing_address as CustomerAddress) };
        }
      }
      if (customer.delivery_address) {
        if (typeof customer.delivery_address === 'string') {
          try {
            delivery = { ...emptyAddress, ...JSON.parse(customer.delivery_address) };
          } catch {
            delivery = { ...emptyAddress };
          }
        } else {
          delivery = { ...emptyAddress, ...(customer.delivery_address as CustomerAddress) };
        }
      } else if (customer.same_as_billing) {
        delivery = { ...billing };
      }

      setBillingAddress(billing);
      setDeliveryAddress(delivery);
      setFormData({
        legal_name: customer.legal_name || customer.name || '',
        commercial_name: customer.commercial_name || customer.name || '',
        company_number: customer.company_number || '',
        extra_id: customer.extra_id || '',
        email: customer.email || '',
        phone: customer.phone || '',
        mobile: customer.mobile || '',
        fax: customer.fax || '',
        website: customer.website || '',
        iban: customer.iban || '',
        bic: customer.bic || '',
        payment_term: customer.payment_term || 30,
        offer_validity_period: customer.offer_validity_period || 30,
        standard_currency: customer.standard_currency || 'EUR',
        language: customer.language || 'nl',
        vat_liable: customer.vat_liable ?? true,
        vat_deductible: customer.vat_deductible ?? true,
        small_enterprise: customer.small_enterprise || false,
        high_risk: customer.high_risk || false,
        hide_iban_check: customer.hide_iban_check || false,
        extend_payment_term: customer.extend_payment_term || false,
        same_as_billing: customer.same_as_billing || false,
        customer_number: customer.customer_number || '',
        reference: customer.reference || '',
        salutation: customer.salutation || '',
        director_first_name: customer.director_first_name || '',
        director_last_name: customer.director_last_name || '',
        rpr_number: customer.rpr_number || '',
        payment_method: customer.payment_method || '',
        standard_paid: customer.standard_paid || '',
        vat_type: customer.vat_type || '',
        general_ledger_account: customer.general_ledger_account || '',
        category: customer.category || '',
        comments: customer.comments || '',
      });
    }
  }, [customer]);

  const handleSubmit = async () => {
    if (!id) return;
    if (!formData.legal_name) {
      toast.error('Legal name is required');
      return;
    }

    try {
      const submitData: CustomerUpdateData = {
        ...formData,
        name: formData.legal_name || formData.commercial_name || '',
        billing_address: billingAddress,
        delivery_address: formData.same_as_billing ? billingAddress : deliveryAddress,
      };

      await updateMutation.mutateAsync({ id, data: submitData });
      toast.success('Customer updated successfully');
      navigate('/dashboard/customer-management');
    } catch (error: any) {
      toast.error(`Failed to update customer: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Customer deleted successfully');
      navigate('/dashboard/customer-management');
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error(`Failed to delete customer: ${error.message}`);
    }
  };

  const copyBillingToDelivery = () => {
    setDeliveryAddress({ ...billingAddress });
    setFormData({ ...formData, same_as_billing: true });
  };

  const copyDeliveryToBilling = () => {
    setBillingAddress({ ...deliveryAddress });
  };

  const updateBillingAddress = (field: keyof CustomerAddress, value: string) => {
    const nextBilling = { ...billingAddress, [field]: value };
    setBillingAddress(nextBilling);
    if (formData.same_as_billing) {
      setDeliveryAddress(nextBilling);
    }
  };

  const updateDeliveryAddress = (field: keyof CustomerAddress, value: string) => {
    setDeliveryAddress({ ...deliveryAddress, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Customer not found.</p>
        <Button variant="outline" onClick={() => navigate('/dashboard/customer-management')}>
          Back to customers
        </Button>
      </div>
    );
  }

  const customerName = customer.legal_name || customer.commercial_name || customer.name || 'Customer';

  return (
    <>
      <div className="h-screen flex flex-col min-h-0 p-6">
        <PageFormLayout
          title="Edit Customer"
          backTo="/dashboard/customer-management"
          backLabel="Back"
          primaryAction={
            <Button
              onClick={handleSubmit}
              disabled={updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          }
          secondaryContent={
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard/customer-management')}>
                Cancel
              </Button>
            </>
          }
        >
          <div className="space-y-6 h-screen">
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="company" className="mt-0 space-y-6">
                  {/* Company & Contact - matches Create Customer */}
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
                          value={formData.legal_name || ''}
                          onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                          placeholder="123inkt.be BV"
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
                          value={formData.payment_term || 30}
                          onChange={(e) => setFormData({ ...formData, payment_term: parseInt(e.target.value) || 30 })}
                          className="border-gray-300 focus:border-gray-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="customer_number" className="text-gray-900">Customer No.</Label>
                        <Input
                          id="customer_number"
                          value={formData.customer_number || ''}
                          onChange={(e) => setFormData({ ...formData, customer_number: e.target.value })}
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

                  {/* Billing & Delivery Address - matches Create Customer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          checked={formData.same_as_billing || false}
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

                  {/* Comments */}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{customerName}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
