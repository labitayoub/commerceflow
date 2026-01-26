'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import * as authApi from '@/lib/api/auth';
import { handleApiError } from '@/lib/utils/handleApiError';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions pour gérer les cookies
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialisation : Récupère l'utilisateur depuis localStorage au montage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Vérifie que le token est toujours valide en récupérant le profil
          try {
            const profile = await authApi.getProfile();
            setUser(profile);
            localStorage.setItem('user', JSON.stringify(profile));
          } catch (error) {
            // Token invalide, on nettoie
            console.error('Token invalide:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            deleteCookie('token');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Définir le cookie après l'hydratation (séparé pour éviter les erreurs d'hydratation)
  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      // Délai pour s'assurer que l'hydratation est terminée
      const timer = setTimeout(() => {
        setCookie('token', token, 7);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [token]);

  /**
   * Connexion
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      // Sauvegarde du token et de l'utilisateur
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Sauvegarde aussi dans un cookie pour le middleware
      setCookie('token', response.accessToken, 7);
      
      setToken(response.accessToken);
      setUser(response.user);
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  };

  /**
   * Inscription
   */
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await authApi.register({ email, password, firstName, lastName });
      
      // Sauvegarde automatique après inscription
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Sauvegarde aussi dans un cookie pour le middleware
      setCookie('token', response.accessToken, 7);
      
      setToken(response.accessToken);
      setUser(response.user);
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  };

  /**
   * Déconnexion
   */
  const logout = () => {
    authApi.logout();
    
    // Supprime le cookie
    deleteCookie('token');
    
    // Vide aussi le panier
    localStorage.removeItem('commerceflow_cart');
    
    // Déclenche un événement personnalisé pour notifier le CartContext
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-cleared'));
    }
    
    setToken(null);
    setUser(null);
  };

  /**
   * Rafraîchit les données utilisateur
   */
  const refreshUser = async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook pour utiliser le contexte d'authentification
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
