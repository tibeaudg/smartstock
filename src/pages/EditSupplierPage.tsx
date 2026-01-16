/**
 * Edit Supplier Page
 * Full-page form for editing an existing supplier matching the design from screenshot
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import { ArrowLeft, Copy, Plus, Pencil, HelpCircle, Trash2 } from 'lucide-react';
import { useSupplier, useUpdateSupplier, useDeleteSupplier } from '@/hooks/useSuppliers';
import { SupplierUpdateData, SupplierAddress } from '@/types/supplierTypes';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function EditSupplierPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: supplier, isLoading } = useSupplier(id);
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();
  
  const [advancedMode, setAdvancedMode] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<SupplierUpdateData>>({});
  const [billingAddress, setBillingAddress] = useState<SupplierAddress>({});
  const [deliveryAddress, setDeliveryAddress] = useState<SupplierAddress>({});
  
  // Load supplier data when available
  useEffect(() => {
    if (supplier) {
      // Parse addresses if they're JSONB strings
      let billing: SupplierAddress = {};
      let delivery: SupplierAddress = {};
      
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
      
      if (supplier.delivery_address) {
        if (typeof supplier.delivery_address === 'string') {
          try {
            delivery = JSON.parse(supplier.delivery_address);
          } catch {
            delivery = {};
          }
        } else {
          delivery = supplier.delivery_address as SupplierAddress;
        }
      }
      
      setBillingAddress(billing);
      setDeliveryAddress(delivery);
      
      setFormData({
        legal_name: supplier.legal_name || supplier.name || '',
        commercial_name: supplier.commercial_name || supplier.name || '',
        company_number: supplier.company_number || '',
        extra_id: supplier.extra_id || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        mobile: supplier.mobile || '',
        fax: supplier.fax || '',
        website: supplier.website || '',
        iban: supplier.iban || '',
        bic: supplier.bic || '',
        payment_term: supplier.payment_term || 30,
        offer_validity_period: supplier.offer_validity_period || 30,
        standard_currency: supplier.standard_currency || 'EUR',
        language: supplier.language || 'nl',
        vat_liable: supplier.vat_liable ?? true,
        vat_deductible: supplier.vat_deductible ?? true,
        small_enterprise: supplier.small_enterprise || false,
        high_risk: supplier.high_risk || false,
        hide_iban_check: supplier.hide_iban_check || false,
        extend_payment_term: supplier.extend_payment_term || false,
        same_as_billing: supplier.same_as_billing || false,
        peppol_enabled: supplier.peppol_enabled || false,
        supplier_number: supplier.supplier_number || '',
        reference: supplier.reference || '',
        salutation: supplier.salutation || '',
        director_first_name: supplier.director_first_name || '',
        director_last_name: supplier.director_last_name || '',
        rpr_number: supplier.rpr_number || '',
        payment_method: supplier.payment_method || '',
        standard_paid: supplier.standard_paid || '',
        vat_type: supplier.vat_type || '',
        general_ledger_account: supplier.general_ledger_account || '',
        category: supplier.category || '',
        supplier_group: supplier.supplier_group || supplier.group || '',
        comments: supplier.comments || '',
      });
    }
  }, [supplier]);
  
  const handleSubmit = async (saveAndReturn: boolean = false) => {
    if (!id) return;
    
    // Validation
    if (!formData.legal_name) {
      toast.error('Legal name is required');
      return;
    }
    
    try {
      const submitData: SupplierUpdateData = {
        ...formData,
        name: formData.legal_name || formData.commercial_name || '', // Backward compatibility
        billing_address: billingAddress,
        delivery_address: formData.same_as_billing ? billingAddress : deliveryAddress,
      };
      
      await updateMutation.mutateAsync({ id, data: submitData });
      toast.success('Supplier updated successfully');
      
      if (saveAndReturn) {
        navigate('/dashboard/vendor-management');
      }
    } catch (error: any) {
      toast.error(`Failed to update supplier: ${error.message}`);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Supplier deleted successfully');
      navigate('/dashboard/vendor-management');
    } catch (error: any) {
      toast.error(`Failed to delete supplier: ${error.message}`);
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
    setBillingAddress({ ...billingAddress, [field]: value });
    if (formData.same_as_billing) {
      setDeliveryAddress({ ...billingAddress, [field]: value });
    }
  };
  
  const updateDeliveryAddress = (field: keyof SupplierAddress, value: string) => {
    setDeliveryAddress({ ...deliveryAddress, [field]: value });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Supplier Not Found</h1>
          <p className="text-gray-600 mb-6">The supplier you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard/vendor-management')}>
            Back to Suppliers
          </Button>
        </div>
      </div>
    );
  }
  
  const supplierName = supplier.legal_name || supplier.commercial_name || supplier.name || 'Supplier';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/vendor-management')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">{supplierName}</h1>
            </div>

          </div>
          
          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="border-b border-gray-200 bg-transparent p-0 h-auto">
              <TabsTrigger value="company" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                Company
              </TabsTrigger>
  
  
              <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="company" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Company Details */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company_number">Company Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="company_number"
                        value={formData.company_number || ''}
                        onChange={(e) => setFormData({ ...formData, company_number: e.target.value })}
                        placeholder="BE0832574952"
                      />
                      <Button variant="ghost" size="icon" className="text-blue-600">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  

                  <div className="grid gap-2">
                    <Label htmlFor="legal_name">
                      Name <span className="text-blue-500">*</span>
                    </Label>
                    <Input
                      id="legal_name"
                      value={formData.legal_name || ''}
                      onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                      placeholder="123inkt.be BV"
                      required
                    />
                  </div>
     
                  
      
                  
                  <div className="grid gap-2">
                    <Label htmlFor="payment_term">Payment Term</Label>
                    <Input
                      id="payment_term"
                      type="number"
                      value={formData.payment_term || 30}
                      onChange={(e) => setFormData({ ...formData, payment_term: parseInt(e.target.value) || 30 })}
                    />
                  </div>

                </div>
                
                {/* Right Column - Supplier Details */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="supplier_number">Supplier No.</Label>
                    <Input
                      id="supplier_number"
                      value={formData.supplier_number || ''}
                      onChange={(e) => setFormData({ ...formData, supplier_number: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  
       
                  
                  <div className="grid gap-2">
                    <Label htmlFor="director_first_name">First Name Director</Label>
                    <Input
                      id="director_first_name"
                      value={formData.director_first_name || ''}
                      onChange={(e) => setFormData({ ...formData, director_first_name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="director_last_name">Last Name Director</Label>
                    <Input
                      id="director_last_name"
                      value={formData.director_last_name || ''}
                      onChange={(e) => setFormData({ ...formData, director_last_name: e.target.value })}
                    />
                  </div>
     
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="info@example.com"
                      />
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">(One email per line)</p>
                  </div>
                  
 
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telephone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+32..."
                    />
                  </div>
      
                </div>
              </div>
              
              {/* Address Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Billing Address */}
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">BILLING ADDRESS</h3>
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
                      <Label htmlFor="billing_attention">Attention</Label>
                      <div className="flex gap-2">
                        <Input
                          id="billing_attention"
                          value={billingAddress.attention || ''}
                          onChange={(e) => updateBillingAddress('attention', e.target.value)}
                        />
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="billing_name">Commercial Name</Label>
                      <Input
                        id="billing_name"
                        value={billingAddress.name || ''}
                        onChange={(e) => updateBillingAddress('name', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="billing_country">Country</Label>
                      <Select
                        value={billingAddress.country || 'BE'}
                        onValueChange={(value) => updateBillingAddress('country', value)}
                      >
                        <SelectTrigger>
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
                        <Label htmlFor="billing_street">Street</Label>
                        <Input
                          id="billing_street"
                          value={billingAddress.street || ''}
                          onChange={(e) => updateBillingAddress('street', e.target.value)}
                          placeholder="Rijvisschestraat 110/4"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="billing_number">Nr</Label>
                        <Input
                          id="billing_number"
                          value={billingAddress.number || ''}
                          onChange={(e) => updateBillingAddress('number', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="billing_box">Box</Label>
                      <Input
                        id="billing_box"
                        value={billingAddress.box || ''}
                        onChange={(e) => updateBillingAddress('box', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="billing_postal_code">Postal Code</Label>
                      <Input
                        id="billing_postal_code"
                        value={billingAddress.postal_code || ''}
                        onChange={(e) => updateBillingAddress('postal_code', e.target.value)}
                        placeholder="9052"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="billing_municipality">Municipality</Label>
                      <Input
                        id="billing_municipality"
                        value={billingAddress.municipality || ''}
                        onChange={(e) => updateBillingAddress('municipality', e.target.value)}
                        placeholder="Zwijnaarde"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="billing_phone">Telephone</Label>
                      <Input
                        id="billing_phone"
                        value={billingAddress.phone || ''}
                        onChange={(e) => updateBillingAddress('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Delivery Address */}
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">DELIVERY ADDRESS</h3>
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
                      <Label htmlFor="delivery_attention">Attention</Label>
                      <div className="flex gap-2">
                        <Input
                          id="delivery_attention"
                          value={deliveryAddress.attention || ''}
                          onChange={(e) => updateDeliveryAddress('attention', e.target.value)}
                          disabled={formData.same_as_billing}
                        />
                        <Button variant="ghost" size="icon" disabled={formData.same_as_billing}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="delivery_name">Name</Label>
                      <Input
                        id="delivery_name"
                        value={deliveryAddress.name || ''}
                        onChange={(e) => updateDeliveryAddress('name', e.target.value)}
                        disabled={formData.same_as_billing}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="delivery_country">Country</Label>
                      <Select
                        value={deliveryAddress.country || 'BE'}
                        onValueChange={(value) => updateDeliveryAddress('country', value)}
                        disabled={formData.same_as_billing}
                      >
                        <SelectTrigger>
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
                        <Label htmlFor="delivery_street">Street</Label>
                        <Input
                          id="delivery_street"
                          value={deliveryAddress.street || ''}
                          onChange={(e) => updateDeliveryAddress('street', e.target.value)}
                          disabled={formData.same_as_billing}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="delivery_number">Nr</Label>
                        <Input
                          id="delivery_number"
                          value={deliveryAddress.number || ''}
                          onChange={(e) => updateDeliveryAddress('number', e.target.value)}
                          disabled={formData.same_as_billing}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="delivery_box">Box</Label>
                      <Input
                        id="delivery_box"
                        value={deliveryAddress.box || ''}
                        onChange={(e) => updateDeliveryAddress('box', e.target.value)}
                        disabled={formData.same_as_billing}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="delivery_postal_code">Postal Code</Label>
                      <Input
                        id="delivery_postal_code"
                        value={deliveryAddress.postal_code || ''}
                        onChange={(e) => updateDeliveryAddress('postal_code', e.target.value)}
                        disabled={formData.same_as_billing}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="delivery_municipality">Municipality</Label>
                      <Input
                        id="delivery_municipality"
                        value={deliveryAddress.municipality || ''}
                        onChange={(e) => updateDeliveryAddress('municipality', e.target.value)}
                        disabled={formData.same_as_billing}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="delivery_phone">Telephone</Label>
                      <Input
                        id="delivery_phone"
                        value={deliveryAddress.phone || ''}
                        onChange={(e) => updateDeliveryAddress('phone', e.target.value)}
                        disabled={formData.same_as_billing}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Group and Comments */}
              <div className="mt-8 space-y-4">
      
                
                <div className="grid gap-2">
                  <Label htmlFor="comments">Comments</Label>
                  <div className="relative">
                    <Textarea
                      id="comments"
                      value={formData.comments || ''}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      className="min-h-[120px]"
                      placeholder="Enter comments..."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-2"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Placeholder tabs */}

            <TabsContent value="history" className="mt-6">
              <p className="text-gray-500">History - Coming soon</p>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Footer Buttons */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => handleSubmit(false)}
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={updateMutation.isPending}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Save and Return
          </Button>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            onClick={() => navigate('/dashboard/vendor-management')}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{supplierName}</strong>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={deleteMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

