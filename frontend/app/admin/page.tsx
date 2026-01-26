"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // TODO: Vérifier le rôle admin
    // if (user.role !== 'ADMIN') {
    //   router.push('/');
    //   return;
    // }

    const fetchStats = async () => {
      try {
        // TODO: Implémenter l'API des statistiques
        // const data = await getAdminStats();
        // setStats(data);
        
        // Données simulées pour l'instant
        setStats({
          totalOrders: 156,
          totalRevenue: 45670.50,
          totalProducts: 48,
          totalUsers: 342,
          recentOrders: [],
          topProducts: []
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router]);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const statCards = [
    {
      title: "Commandes",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-blue-500",
      link: "/admin/orders"
    },
    {
      title: "Revenus",
      value: `${(stats?.totalRevenue || 0).toFixed(2)}€`,
      icon: DollarSign,
      color: "bg-green-500",
      link: "/admin/orders"
    },
    {
      title: "Produits",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "bg-purple-500",
      link: "/admin/products"
    },
    {
      title: "Utilisateurs",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-orange-500",
      link: "/admin/users"
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord Admin
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.link}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12% vs mois dernier</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/products"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-center"
          >
            <Package className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Gérer les produits</h3>
            <p className="text-sm text-gray-500">Ajouter, modifier ou supprimer des produits</p>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-center"
          >
            <Activity className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Gérer les catégories</h3>
            <p className="text-sm text-gray-500">Organiser les catégories de produits</p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-center"
          >
            <ShoppingCart className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Gérer les commandes</h3>
            <p className="text-sm text-gray-500">Suivre et mettre à jour les commandes</p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-center"
          >
            <Users className="h-12 w-12 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Gérer les utilisateurs</h3>
            <p className="text-sm text-gray-500">Voir et gérer les utilisateurs</p>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
