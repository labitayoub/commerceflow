"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { getOrderById, Order } from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils/format";
import { Package, MapPin, CreditCard, Clock, CheckCircle, XCircle, Truck, ArrowLeft } from "lucide-react";

const statusIcons: Record<string, any> = {
  PENDING: Clock,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
};

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-600 bg-yellow-50",
  PROCESSING: "text-blue-600 bg-blue-50",
  SHIPPED: "text-purple-600 bg-purple-50",
  DELIVERED: "text-green-600 bg-green-50",
  CANCELLED: "text-red-600 bg-red-50",
};

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PROCESSING: "En traitement",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Erreur lors du chargement de la commande:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, user, router]);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded" />
              <div className="h-48 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!order) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Commande introuvable
          </h2>
          <button
            onClick={() => router.push("/orders")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Retour aux commandes
          </button>
        </div>
      </PageLayout>
    );
  }

  const StatusIcon = statusIcons[order.status] || Package;
  const statusColor = statusColors[order.status] || "text-gray-600 bg-gray-50";
  const statusLabel = statusLabels[order.status] || order.status;

  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push("/orders")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour aux commandes</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Détails de la commande */}
            <div className="lg:col-span-2 space-y-6">
              {/* En-tête */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Commande #{order.id.substring(0, 8)}
                    </h1>
                    <p className="text-sm text-gray-500">
                      Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${statusColor}`}>
                    <StatusIcon className="h-5 w-5" />
                    <span className="font-medium">{statusLabel}</span>
                  </div>
                </div>
              </div>

              {/* Articles */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Articles commandés
                  </h2>
                </div>

                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.product?.name || 'Produit'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Quantité: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatPrice(parseFloat(item.price) * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(parseFloat(item.price))} / unité
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Adresse de livraison
                    </h2>
                  </div>
                  {order.shippingAddress && (
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Adresse de facturation
                    </h2>
                  </div>
                  {order.billingAddress && (
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>{order.billingAddress.street}</p>
                      <p>{order.billingAddress.postalCode} {order.billingAddress.city}</p>
                      <p>{order.billingAddress.country}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Résumé
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(parseFloat(order.total))}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(parseFloat(order.total))}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => router.push("/products")}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
