import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Crée une instance Axios configurée
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 secondes
});

/**
 * Intercepteur de requête : Ajoute le token JWT à chaque requête
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Récupère le token depuis localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Ajoute le token au header Authorization si disponible
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse : Gère les erreurs globalement
 */
apiClient.interceptors.response.use(
  (response) => {
    // Retourne directement les données de la réponse
    return response;
  },
  (error: AxiosError) => {
    // Gère les erreurs d'authentification (401)
    if (error.response?.status === 401) {
      // Supprime le token invalide
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      // Redirige vers la page de login si on n'y est pas déjà
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Gère les erreurs d'autorisation (403)
    if (error.response?.status === 403) {
      console.error('Accès refusé : vous n\'avez pas les permissions nécessaires');
    }
    
    // Gère les erreurs serveur (500+)
    if (error.response?.status && error.response.status >= 500) {
      console.error('Erreur serveur : veuillez réessayer plus tard');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
