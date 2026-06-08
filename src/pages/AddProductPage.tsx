import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAddProductModal } from '@/hooks/AddProductModalContext';

/**
 * Deep-link shim: /dashboard/products/new?quick=1&sku=... opens the add-product modal
 * and redirects back to the products list.
 */
export default function AddProductPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { openAddProduct } = useAddProductModal();

  useEffect(() => {
    const quick = searchParams.get('quick') === '1';
    openAddProduct({
      mode: quick ? 'quick' : 'full',
      preFilledSKU: searchParams.get('sku') || undefined,
      preFilledName: searchParams.get('name') || undefined,
      preFilledCategoryId: searchParams.get('categoryId') || undefined,
    });
    navigate('/dashboard/categories', { replace: true });
  }, [navigate, openAddProduct, searchParams]);

  return null;
}
