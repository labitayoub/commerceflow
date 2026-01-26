import apiClient from './client';
import { 
  Product, 
  CreateProductDto, 
  UpdateProductDto, 
  FilterProductDto, 
  PaginatedResponse 
} from '../types';

/**
 * Récupère tous les produits avec filtres et pagination
 */
export async function getProducts(filters?: FilterProductDto): Promise<PaginatedResponse<Product>> {
  const response = await apiClient.get<PaginatedResponse<Product>>('/products', {
    params: filters,
  });
  return response.data;
}

/**
 * Récupère un produit par ID
 */
export async function getProductById(id: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

/**
 * Crée un nouveau produit (ADMIN)
 */
export async function createProduct(data: CreateProductDto): Promise<Product> {
  const response = await apiClient.post<Product>('/products', data);
  return response.data;
}

/**
 * Met à jour un produit (ADMIN)
 */
export async function updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
  const response = await apiClient.patch<Product>(`/products/${id}`, data);
  return response.data;
}

/**
 * Supprime un produit (ADMIN)
 */
export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
