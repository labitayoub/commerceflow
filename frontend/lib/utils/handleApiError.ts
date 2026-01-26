import { AxiosError } from 'axios';
import { ApiError } from '../types';

/**
 * Extrait et formate un message d'erreur depuis une réponse API
 */
export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    // Erreur avec réponse du serveur
    if (error.response?.data) {
      const apiError = error.response.data as ApiError;
      
      // Message personnalisé du backend
      if (apiError.message) {
        // Si c'est un tableau de messages (validation errors)
        if (Array.isArray(apiError.message)) {
          return apiError.message.join(', ');
        }
        return apiError.message;
      }
      
      // Message générique selon le code de statut
      switch (error.response.status) {
        case 400:
          return 'Requête invalide. Veuillez vérifier les données saisies.';
        case 401:
          return 'Non authentifié. Veuillez vous connecter.';
        case 403:
          return 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
        case 404:
          return 'Ressource non trouvée.';
        case 409:
          return 'Conflit : cette ressource existe déjà.';
        case 500:
          return 'Erreur serveur. Veuillez réessayer plus tard.';
        default:
          return `Erreur : ${error.response.status}`;
      }
    }
    
    // Erreur réseau (pas de réponse)
    if (error.request) {
      return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    }
  }
  
  // Erreur inconnue
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Une erreur inattendue est survenue.';
}

/**
 * Affiche une erreur dans la console en mode développement
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[API Error${context ? ` - ${context}` : ''}]:`, error);
  }
}
