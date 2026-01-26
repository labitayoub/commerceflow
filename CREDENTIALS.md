# 🔐 Identifiants de Test - CommerceFlow

## Compte Administrateur

Pour accéder à l'interface d'administration et gérer les produits, catégories, commandes et utilisateurs :

- **Email:** `admin@commerceflow.com`
- **Mot de passe:** `admin123`

### Fonctionnalités Admin

Une fois connecté avec le compte admin, vous aurez accès à :

- **Dashboard Admin** : `/admin`
  - Statistiques globales (commandes, revenus, produits, utilisateurs)
  - Actions rapides

- **Gestion des Produits** : `/admin/products`
  - Créer, modifier, supprimer des produits
  - Gérer les stocks (SKU)
  - Activer/Désactiver des produits

- **Gestion des Catégories** : `/admin/categories`
  - Créer, modifier, supprimer des catégories
  - Organiser les produits par catégorie

- **Gestion des Commandes** : `/admin/orders`
  - Voir toutes les commandes
  - Mettre à jour le statut des commandes
  - Détails des commandes

- **Gestion des Utilisateurs** : `/admin/users`
  - Liste de tous les utilisateurs
  - Voir les détails des utilisateurs

## Compte Client de Test

Pour tester l'expérience client, vous pouvez créer un nouveau compte via `/register` ou utiliser un compte existant si vous en avez créé un.

### Fonctionnalités Client

- Navigation des produits par catégorie
- Recherche et filtres
- Ajout au panier (nécessite connexion)
- Passage de commande
- Suivi des commandes : `/orders`

---

## 🚀 Démarrage Rapide

1. **Backend** : `cd backend && npm run dev:start`
2. **Frontend** : `cd frontend && pnpm dev`
3. **Accéder à l'application** : http://localhost:3001
4. **Se connecter en admin** avec les identifiants ci-dessus
