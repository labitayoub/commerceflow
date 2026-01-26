import apiClient from './client';
import { AuthResponse, LoginDto, RegisterDto, User } from '../types';

/**
 * Connexion utilisateur
 */
export async function login(credentials: LoginDto): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

/**
 * Inscription utilisateur
 */
export async function register(userData: RegisterDto): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', userData);
  return response.data;
}

/**
 * Récupère le profil de l'utilisateur connecté
 */
export async function getProfile(): Promise<User> {
  const response = await apiClient.get<User>('/auth/profile');
  return response.data;
}

/**
 * Déconnexion (côté client uniquement - supprime le token)
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
