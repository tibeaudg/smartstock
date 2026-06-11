import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageFormLayout } from '@/components/PageFormLayout';
import { AddVariantForm } from '@/components/products/AddVariantForm';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { Product } from '@/types/stockTypes';
import { Loader2 } from 'lucide-react';
export default function AddVariantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeBranch } = useBranches();
  const [parentProduct, setParentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const formId = 'add-variant-form';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !activeBranch?.branch_id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('branch_id', activeBranch.branch_id)
        .single();
      if (error || !data) {
        navigate('/dashboard/categories');
        return;
      }
      setParentProduct(data as Product);
      setLoading(false);
    };
    void fetchProduct();
  }, [id, activeBranch?.branch_id, navigate]);

  const backTo = id ? `/dashboard/products/${id}` : '/dashboard/categories';

  if (loading || !parentProduct) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col min-h-0 p-6">
      <PageFormLayout
        title="Add variant"
        backTo={backTo}
        backLabel="Back"
        primaryAction={
          <Button type="submit" form={formId} className="bg-blue-600 hover:bg-blue-700">
            Add variant
          </Button>
        }
      >
        <AddVariantForm
          formId={formId}
          parentProduct={parentProduct}
          onSuccess={() => navigate(backTo)}
          onCancel={() => navigate(backTo)}
        />
      </PageFormLayout>
    </div>
  );
}
