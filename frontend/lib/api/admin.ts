import api from './client';

// Admin Orders
export const getAllOrders = async () => {
  const response = await api.get('/orders/admin/all');
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.patch(`/orders/admin/${orderId}/status`, { status });
  return response.data;
};

// Admin Products
export const createProduct = async (productData: any) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (productId: string, productData: any) => {
  const response = await api.patch(`/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

// Admin Categories
export const createCategory = async (categoryData: any) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

export const updateCategory = async (categoryId: string, categoryData: any) => {
  const response = await api.patch(`/categories/${categoryId}`, categoryData);
  return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
};

// Admin Users
export const getAllUsers = async () => {
  const response = await api.get('/auth/users');
  return response.data;
};

export const updateUserRole = async (userId: string, role: string) => {
  const response = await api.patch(`/auth/users/${userId}/role`, { role });
  return response.data;
};

// Admin Stats
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};
