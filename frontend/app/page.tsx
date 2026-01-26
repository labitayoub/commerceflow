'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/lib/api/products';
import { getCategories } from '@/lib/api/categories';
import { Product, Category } from '@/lib/types';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupère les 6 premiers produits en vedette
        const productsResponse = await getProducts({ limit: 6, page: 1 });
        setFeaturedProducts(productsResponse.data);

        // Récupère toutes les catégories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 text-blue-100">
              <Sparkles className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wide">
                Bienvenue sur CommerceFlow
              </span>
              <Sparkles className="h-6 w-6" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Votre marketplace
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                en ligne
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-blue-100">
              Découvrez une large sélection de produits de qualité. 
              Livraison rapide et paiement sécurisé.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/products"
                className="group px-8 py-4 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 flex items-center space-x-2"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Voir les produits</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/category"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                Parcourir les catégories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Parcourir par catégorie
            </h2>
            <p className="text-gray-600">
              Trouvez exactement ce que vous cherchez
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/products?categoryId=${category.id}`}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 text-center hover:scale-105"
                >
                  <div className="h-16 w-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          )}

          {categories.length > 4 && (
            <div className="text-center mt-8">
              <Link
                href="/category"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>Voir toutes les catégories</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Produits en vedette
              </h2>
              <p className="text-gray-600">
                Découvrez notre sélection du moment
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Voir tout</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="text-center mt-8 sm:hidden">
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <span>Voir tous les produits</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucun produit disponible pour le moment.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Prêt à commencer vos achats ?
          </h2>
          <p className="text-lg text-blue-100">
            Créez un compte gratuitement et profitez de nos offres exclusives
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105"
          >
            S&apos;inscrire maintenant
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
