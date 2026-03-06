import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PageFormLayout } from '@/components/PageFormLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBranches } from '@/hooks/useBranches';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowRight, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string | null;
}

export default function CreateBOMPage() {
  const navigate = useNavigate();
  const { activeBranch } = useBranches();
  const [selectedProductId, setSelectedProductId] = useState('');

  const { data: availableProducts = [] } = useQuery<Product[]>({
    queryKey: ['availableProductsForBOM', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('branch_id', activeBranch.branch_id)
        .eq('is_variant', false)
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!activeBranch,
  });

  const handleContinue = () => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }
    navigate(`/dashboard/bom/edit/${selectedProductId}?create=true`);
  };

  return (
    <div className="h-screen p-6 flex flex-col rounded-lg"> 
    <PageFormLayout
      title="Create Bill of Materials"
      backTo="/dashboard/bom"
      backLabel="Back"
      primaryAction={
        <Button onClick={handleContinue} disabled={!selectedProductId}>
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Select a product to create a BOM for.
          </p>
          <div>
            <Label htmlFor="product-select" className="text-gray-900 tracking-tight">
              Select Product
            </Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger id="product-select" className="mt-1">
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2 border-b mb-1">
                  <Link to="/dashboard/products/new">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Product
                    </Button>
                  </Link>
                </div>
                {availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} {product.sku && `(${product.sku})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </PageFormLayout>
    </div>
  );
}
