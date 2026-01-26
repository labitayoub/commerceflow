'use client';

import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/format';
import { ShoppingCart, Package } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation vers la page produit
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const stock = product.sku?.stock || 0;
  const isOutOfStock = stock === 0;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col">
        {/* Image placeholder */}
        <div className="relative aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
            <Package className="h-24 w-24 text-blue-300 group-hover:scale-110 transition-transform duration-200" />
          </div>
          
          {/* Badge rupture de stock */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Rupture de stock
            </div>
          )}
          
          {/* Badge catégorie */}
          {product.category && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
              {product.category.name}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">
              {product.description}
            </p>
          )}

          <div className="mt-auto space-y-3">
            {/* Prix et stock */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(Number(product.price))}
              </span>
              <span className="text-sm text-gray-500">
                Stock: {stock}
              </span>
            </div>

            {/* Bouton Ajouter au panier */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
