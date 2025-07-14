import React from 'react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  status: string | null;
  image_url?: string | null; // <-- toegevoegd
}

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded">
      <p className="text-sm text-gray-600">
        Voorraadniveau: <span className="font-medium">{product.quantity_in_stock}</span>
      </p>
      <p className="text-sm text-gray-600">
        Voorraad status: <span className="font-medium">{product.status ?? 'Onbekend'}</span>
      </p>
      <p className="text-sm text-gray-600">
        Prijs per stuk: <span className="font-medium">${product.unit_price.toFixed(2)}</span>
      </p>
    </div>
  );
};
