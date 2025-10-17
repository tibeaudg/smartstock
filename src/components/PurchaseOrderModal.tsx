import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Send, 
  Plus, 
  X, 
  Calendar,
  User,
  Truck,
  Package,
  Mail,
  CheckCircle,
  Building,
  MapPin,
  Phone,
  Mail as MailIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { ProductSearch } from './purchase-orders/ProductSearch';
import { useMobile } from '@/hooks/use-mobile';

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseOrderAdded: () => void;
  preSelectedVendor?: string;
  preSelectedVendorName?: string;
}

interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  current_stock: number;
  unit_price: number;
  barcode?: string;
}

interface SelectedProduct extends Product {
  quantity: number;
  unit_price: number;
  total_price: number;
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  onPurchaseOrderAdded,
  preSelectedVendor,
  preSelectedVendorName
}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { isMobile } = useMobile();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: General Information
  const [selectedVendor, setSelectedVendor] = useState<Supplier | null>(null);
  const [vendors, setVendors] = useState<Supplier[]>([]);
  const [vendorSearch, setVendorSearch] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('due_on_receipt');
  const [shipmentPreference, setShipmentPreference] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [terms, setTerms] = useState('');

  // Step 2: Delivery Details
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  const [deliveryZipcode, setDeliveryZipcode] = useState('');

  // Step 3: Products
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Step 4: Email
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  // Load vendors on mount
  useEffect(() => {
    if (isOpen && user) {
      loadVendors();
    }
  }, [isOpen, user]);

  // Pre-select vendor if provided
  useEffect(() => {
    if (preSelectedVendor && vendors.length > 0) {
      const vendor = vendors.find(v => v.id === preSelectedVendor);
      if (vendor) {
        setSelectedVendor(vendor);
      }
    }
  }, [preSelectedVendor, vendors]);

  // Update email fields when vendor changes
  useEffect(() => {
    if (selectedVendor) {
      setRecipientEmail(selectedVendor.email || '');
      setEmailSubject(`Purchase Order - ${selectedVendor.name}`);
      setEmailBody(`Dear ${selectedVendor.name},\n\nPlease find attached our purchase order.\n\nThank you for your business.\n\nBest regards`);
    }
  }, [selectedVendor]);

  const loadVendors = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Error loading vendors:', error);
        return;
      }

      setVendors(data || []);
    } catch (error) {
      console.error('Error loading vendors:', error);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const handleProductSelect = (product: Product, quantity: number) => {
    const selectedProduct: SelectedProduct = {
      ...product,
      quantity,
      unit_price: product.unit_price,
      total_price: product.unit_price * quantity
    };

    setSelectedProducts(prev => [...prev, selectedProduct]);
    setSelectedProductIds(prev => [...prev, product.id]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    setSelectedProductIds(prev => prev.filter(id => id !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, quantity, total_price: p.unit_price * quantity }
        : p
    ));
  };

  const handleUnitPriceChange = (productId: string, unitPrice: number) => {
    setSelectedProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, unit_price: unitPrice, total_price: unitPrice * p.quantity }
        : p
    ));
  };

  const totalAmount = selectedProducts.reduce((sum, product) => sum + product.total_price, 0);

  const handleSaveAsDraft = async () => {
    if (!user || !selectedVendor) {
      toast.error('Please select a vendor');
      return;
    }

    setLoading(true);
    try {
      const { data: purchaseOrder, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          vendor_id: selectedVendor.id,
          user_id: user.id,
          branch_id: activeBranch?.id,
          status: 'quote',
          payment_status: 'unpaid',
          payment_terms: paymentTerms,
          expected_delivery_date: expectedDeliveryDate || null,
          assigned_to: assignedTo || null,
          shipping_carrier: shipmentPreference || null,
          warehouse_location: warehouseLocation || null,
          delivery_street: deliveryStreet || null,
          delivery_country: deliveryCountry || null,
          delivery_city: deliveryCity || null,
          delivery_state: deliveryState || null,
          delivery_zipcode: deliveryZipcode || null,
          order_note: orderNote || null,
          terms: terms || null,
          total_amount: totalAmount
        })
        .select()
        .single();

      if (poError) {
        console.error('Error creating purchase order:', poError);
        toast.error('Error creating purchase order');
        return;
      }

      // Add purchase order items
      if (selectedProducts.length > 0) {
        const items = selectedProducts.map(product => ({
          purchase_order_id: purchaseOrder.id,
          product_id: product.id,
          quantity: product.quantity,
          unit_price: product.unit_price,
          total_price: product.total_price
        }));

        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(items);

        if (itemsError) {
          console.error('Error adding purchase order items:', itemsError);
          toast.error('Error adding products to purchase order');
          return;
        }
      }

      toast.success('Purchase order saved as draft');
      onPurchaseOrderAdded();
      onClose();
    } catch (error) {
      console.error('Error saving purchase order:', error);
      toast.error('Error saving purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedVendor) {
      toast.error('Please select a vendor');
      return;
    }

    setLoading(true);
    try {
      const { data: purchaseOrder, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          vendor_id: selectedVendor.id,
          user_id: user.id,
          branch_id: activeBranch?.id,
          status: 'ordered',
          payment_status: 'unpaid',
          payment_terms: paymentTerms,
          expected_delivery_date: expectedDeliveryDate || null,
          assigned_to: assignedTo || null,
          shipping_carrier: shipmentPreference || null,
          warehouse_location: warehouseLocation || null,
          delivery_street: deliveryStreet || null,
          delivery_country: deliveryCountry || null,
          delivery_city: deliveryCity || null,
          delivery_state: deliveryState || null,
          delivery_zipcode: deliveryZipcode || null,
          order_note: orderNote || null,
          terms: terms || null,
          total_amount: totalAmount
        })
        .select()
        .single();

      if (poError) {
        console.error('Error creating purchase order:', poError);
        toast.error('Error creating purchase order');
        return;
      }

      // Add purchase order items
      if (selectedProducts.length > 0) {
        const items = selectedProducts.map(product => ({
          purchase_order_id: purchaseOrder.id,
          product_id: product.id,
          quantity: product.quantity,
          unit_price: product.unit_price,
          total_price: product.total_price
        }));

        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(items);

        if (itemsError) {
          console.error('Error adding purchase order items:', itemsError);
          toast.error('Error adding products to purchase order');
          return;
        }
      }

      // TODO: Send email if enabled
      if (sendEmail && recipientEmail) {
        // Email sending will be implemented in the email service
        console.log('Email would be sent to:', recipientEmail);
      }

      toast.success('Purchase order created successfully');
      onPurchaseOrderAdded();
      onClose();
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error('Error creating purchase order');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedVendor(null);
    setVendorSearch('');
    setExpectedDeliveryDate('');
    setAssignedTo('');
    setPaymentTerms('due_on_receipt');
    setShipmentPreference('');
    setOrderNote('');
    setTerms('');
    setWarehouseLocation('');
    setDeliveryStreet('');
    setDeliveryCountry('');
    setDeliveryCity('');
    setDeliveryState('');
    setDeliveryZipcode('');
    setSelectedProducts([]);
    setSelectedProductIds([]);
    setEmailSubject('');
    setEmailBody('');
    setRecipientEmail('');
    setCcEmail('');
    setSendEmail(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-6">
      {[
        { step: 1, label: 'General Information', icon: User },
        { step: 2, label: 'Delivery Details', icon: Truck },
        { step: 3, label: 'Product', icon: Package },
        { step: 4, label: 'Send Email', icon: Mail }
      ].map(({ step, label, icon: Icon }) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === step 
              ? 'bg-green-600 text-white' 
              : currentStep > step 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
          }`}>
            {currentStep > step ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
          </div>
          <span className={`ml-2 text-sm ${
            currentStep === step ? 'text-green-600 font-medium' : 'text-gray-500'
          }`}>
            {label}
          </span>
          {step < 4 && <div className="w-8 h-px bg-gray-200 mx-4" />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vendor">Vendor</Label>
          <div className="relative">
            <Input
              id="vendor"
              placeholder="Select vendor"
              value={selectedVendor?.name || ''}
              onChange={(e) => setVendorSearch(e.target.value)}
              className="pr-10"
            />
            {selectedVendor && (
              <button
                onClick={() => setSelectedVendor(null)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          {vendorSearch && !selectedVendor && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setVendorSearch('');
                  }}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {vendor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{vendor.name}</p>
                      <p className="text-xs text-gray-500">{vendor.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="delivery-date">Expected delivery date</Label>
          <div className="relative">
            <Input
              id="delivery-date"
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assigned-to">Assign to</Label>
          <Input
            id="assigned-to"
            placeholder="Select employee"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="payment-terms">Payment terms</Label>
          <select
            id="payment-terms"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="due_on_receipt">Due on receipt</option>
            <option value="net_15">Net 15</option>
            <option value="net_30">Net 30</option>
            <option value="net_60">Net 60</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="shipment-preference">Shipment preference</Label>
        <select
          id="shipment-preference"
          value={shipmentPreference}
          onChange={(e) => setShipmentPreference(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select carrier</option>
          <option value="UPS">UPS</option>
          <option value="FedEx">FedEx</option>
          <option value="DHL">DHL</option>
          <option value="CMA CGM">CMA CGM</option>
        </select>
      </div>

      <div>
        <Label htmlFor="order-note">Order note</Label>
        <Textarea
          id="order-note"
          placeholder="Add note"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="terms">Term</Label>
        <Input
          id="terms"
          placeholder="Add term"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="warehouse-location">Warehouse location</Label>
          <Input
            id="warehouse-location"
            placeholder="Select warehouse"
            value={warehouseLocation}
            onChange={(e) => setWarehouseLocation(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="delivery-street">Street</Label>
          <Input
            id="delivery-street"
            placeholder="3286 Mattson Street"
            value={deliveryStreet}
            onChange={(e) => setDeliveryStreet(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="delivery-country">Country</Label>
          <select
            id="delivery-country"
            value={deliveryCountry}
            onChange={(e) => setDeliveryCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select country</option>
            <option value="US">🇺🇸 United States</option>
            <option value="CA">🇨🇦 Canada</option>
            <option value="GB">🇬🇧 United Kingdom</option>
            <option value="DE">🇩🇪 Germany</option>
            <option value="FR">🇫🇷 France</option>
            <option value="NL">🇳🇱 Netherlands</option>
          </select>
        </div>
        <div>
          <Label htmlFor="delivery-city">City</Label>
          <Input
            id="delivery-city"
            placeholder="West Virginia"
            value={deliveryCity}
            onChange={(e) => setDeliveryCity(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="delivery-state">State</Label>
          <Input
            id="delivery-state"
            placeholder="Deerfield"
            value={deliveryState}
            onChange={(e) => setDeliveryState(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="delivery-zipcode">Zipcode</Label>
          <Input
            id="delivery-zipcode"
            placeholder="53531"
            value={deliveryZipcode}
            onChange={(e) => setDeliveryZipcode(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-lg mb-4">Add Product to order</h3>
        <ProductSearch
          onProductSelect={handleProductSelect}
          selectedProductIds={selectedProductIds}
        />
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Selected Products</h3>
          {selectedProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    {product.barcode && (
                      <p className="text-sm text-gray-500">SKU: {product.barcode}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(product.id, Math.max(1, product.quantity - 1))}
                        className="w-8 h-8 p-0"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        +
                      </Button>
                    </div>

                    <div className="w-24">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={product.unit_price}
                        onChange={(e) => handleUnitPriceChange(product.id, parseFloat(e.target.value) || 0)}
                        className="text-right"
                      />
                    </div>

                    <div className="w-20 text-right">
                      <span className="font-medium">${product.total_price.toFixed(2)}</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-lg font-medium">Total Amount:</span>
            <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}

      {selectedProducts.length === 0 && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products selected yet
          </h3>
          <p className="text-sm text-gray-600">
            Search and add products to your purchase order.
          </p>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="email-subject">Email Subject</Label>
        <Input
          id="email-subject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          placeholder="Purchase Order - [PO-XXX]"
        />
      </div>

      <div>
        <Label htmlFor="email-body">Email Body</Label>
        <Textarea
          id="email-body"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          placeholder="Dear [Vendor Name],\n\nPlease find attached our purchase order.\n\nThank you for your business.\n\nBest regards"
          rows={6}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="recipient-email">Recipient Email</Label>
          <Input
            id="recipient-email"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="vendor@example.com"
          />
        </div>
        <div>
          <Label htmlFor="cc-email">CC (Optional)</Label>
          <Input
            id="cc-email"
            type="email"
            value={ccEmail}
            onChange={(e) => setCcEmail(e.target.value)}
            placeholder="manager@example.com"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="send-email"
          checked={sendEmail}
          onChange={(e) => setSendEmail(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="send-email">Send email to vendor</Label>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Email Preview</h4>
        <div className="text-sm text-blue-800">
          <p><strong>To:</strong> {recipientEmail || 'vendor@example.com'}</p>
          <p><strong>Subject:</strong> {emailSubject || 'Purchase Order - [PO-XXX]'}</p>
          <div className="mt-2 whitespace-pre-wrap">
            {emailBody || 'Dear [Vendor Name],\n\nPlease find attached our purchase order.\n\nThank you for your business.\n\nBest regards'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isMobile ? 'w-full h-full max-h-full rounded-none' : ''}`}>
        <DialogHeader>
          <DialogTitle>Add Purchase Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {renderStepIndicator()}

          <div className="min-h-[400px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          <div className="flex justify-between pt-6 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSaveAsDraft}
                disabled={loading}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
