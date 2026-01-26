import apiClient from './client';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types';

/**
 * Récupère toutes les catégories
 */
export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
}

/**
 * Récupère une catégorie par ID
 */
export async function getCategoryById(id: string): Promise<Category> {
  const response = await apiClient.get<Category>(`/categories/${id}`);
  return response.data;
}

/**
 * Crée une nouvelle catégorie (ADMIN)
 */
export async function createCategory(data: CreateCategoryDto): Promise<Category> {
  const response = await apiClient.post<Category>('/categories', data);
  return response.data;
}

/**
 * Met à jour une catégorie (ADMIN)
 */
export async function updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
  const response = await apiClient.patch<Category>(`/categories/${id}`, data);
  return response.data;
}

/**
 * Supprime une catégorie (ADMIN)
 */
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
