import React from 'react';
import { ActivationHero } from './ActivationHero';
import { ActivationPathCards } from './ActivationPathCards';
import { ProductTablePreview } from './ProductTablePreview';
import { useActivationViewTracking } from './useActivationViewTracking';

export function ProductsActivationPanel() {
  useActivationViewTracking('products', true);

  return (
    <div className="space-y-6">
      <ActivationHero showDashboardLink />
      <ActivationPathCards source="products" />
      <ProductTablePreview />
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have a spreadsheet? Import takes about 5 minutes.
      </p>
    </div>
  );
}
