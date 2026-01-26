import api from './client';

export interface CreateOrderDto {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  total: string;
  shippingAddress: any;
  billingAddress?: any;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: string;
    product: {
      id: string;
      name: string;
      price: string;
    };
  }>;
}

export const createOrder = async (orderData: CreateOrderDto): Promise<Order> => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getUserOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
