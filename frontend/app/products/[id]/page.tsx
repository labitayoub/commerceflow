'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/PageLayout';
import { getProductById } from '@/lib/api/products';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/format';
import { ShoppingCart, Package, ArrowLeft, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-24 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Produit introuvable
          </h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            Retour aux produits
          </Link>
        </div>
      </PageLayout>
    );
  }

  const stock = product.sku?.stock || 0;
  const isOutOfStock = stock === 0;
  const maxQuantity = Math.min(stock, 10); // Maximum 10 unités par commande

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${quantity} ${product.name} ajouté(s) au panier!`);
    }
  };

  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                <Package className="h-48 w-48 text-blue-300" />
              </div>

              {/* Détails */}
              <div className="space-y-6">
                {/* Catégorie */}
                {product.category && (
                  <Link
                    href={`/products?categoryId=${product.category.id}`}
                    className="inline-block text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {product.category.name}
                  </Link>
                )}

                {/* Titre */}
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>

                {/* Prix */}
                <div className="flex items-baseline space-x-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(Number(product.price))}
                  </span>
                  {!isOutOfStock && (
                    <span className="text-sm text-green-600 font-medium">
                      En stock ({stock} disponible{stock > 1 ? 's' : ''})
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="text-sm text-red-600 font-medium">
                      Rupture de stock
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      Description
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Séparateur */}
                <div className="border-t border-gray-200 my-6" />

                {/* Quantité et Ajout au panier */}
                {!isOutOfStock && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantité
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                          min={1}
                          max={maxQuantity}
                          className="w-20 text-center border border-gray-300 rounded-lg py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= maxQuantity}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                        <span className="text-sm text-gray-500">
                          Max: {maxQuantity}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Ajouter au panier</span>
                    </button>
                  </div>
                )}

                {isOutOfStock && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">
                      Ce produit est actuellement en rupture de stock.
                    </p>
                  </div>
                )}

                {/* Informations supplémentaires */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Référence:</span>
                    <span className="font-medium">{product.id.slice(0, 8)}</span>
                  </div>
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{product.sku.id.slice(0, 8)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className="font-medium">
                      {product.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Produits similaires (TODO) */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Vous aimerez aussi
            </h2>
            <div className="text-center py-8 text-gray-500">
              Fonctionnalité à venir
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
