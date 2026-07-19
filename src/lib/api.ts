const API_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    request<{ user: any; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ user: any; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => request<{ user: any }>('/auth/me'),

  updateProfile: (data: { name?: string; phone?: string; address?: string }) =>
    request<{ user: any }>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ products: any[]; pagination: any }>(`/products${query}`);
  },

  getFeaturedProducts: () => request<{ products: any[] }>('/products/featured'),

  getProduct: (slug: string) => request<{ product: any; reviews: any[]; related: any[] }>(`/products/${slug}`),

  // Categories
  getCategories: () => request<{ categories: any[] }>('/categories'),

  // Cart
  getCart: () => request<{ items: any[]; total: number }>('/cart'),

  addToCart: (product_id: number, quantity?: number) =>
    request<{ items: any[]; total: number }>('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),

  updateCartItem: (id: number, quantity: number) =>
    request<{ items: any[]; total: number }>(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),

  removeCartItem: (id: number) =>
    request<{ items: any[]; total: number }>(`/cart/${id}`, { method: 'DELETE' }),

  clearCart: () => request<{ items: any[]; total: number }>('/cart', { method: 'DELETE' }),

  // Orders
  getOrders: (params?: Record<string, string>) =>
    request<{ orders: any[]; pagination: any }>('/orders' + (params ? '?' + new URLSearchParams(params).toString() : '')),

  getOrder: (id: number) => request<{ order: any }>(`/orders/${id}`),

  createOrder: (data: { shipping_address: string; payment_method: string; notes?: string }) =>
    request<{ order: any }>('/orders', { method: 'POST', body: JSON.stringify(data) }),

  // Reviews
  addReview: (data: { product_id: number; rating: number; comment?: string }) =>
    request<{ review: any }>('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // Wishlist
  getWishlist: () => request<{ items: any[] }>('/wishlist'),

  toggleWishlist: (product_id: number) =>
    request<{ wishlisted: boolean }>('/wishlist', { method: 'POST', body: JSON.stringify({ product_id }) }),

  removeFromWishlist: (product_id: number) =>
    request<{ message: string }>(`/wishlist/${product_id}`, { method: 'DELETE' }),

  checkWishlist: (product_id: number) =>
    request<{ wishlisted: boolean }>(`/wishlist/check/${product_id}`),

  getProductById: (id: number) =>
    request<{ product: any }>(`/products/id/${id}`).then((d) => d.product),

  // Admin
  getAdminStats: () => request<{ stats: any; recentOrders: any[]; ordersByStatus: any[]; lowStock: any[] }>('/admin/stats'),

  getAdminProducts: (params?: Record<string, string>) =>
    request<{ products: any[]; pagination: any }>('/admin/products' + (params ? '?' + new URLSearchParams(params).toString() : '')),

  createProduct: (data: any) =>
    request<{ product: any }>('/admin/products', { method: 'POST', body: JSON.stringify(data) }),

  updateProduct: (id: number, data: any) =>
    request<{ product: any }>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteProduct: (id: number) =>
    request<{ message: string }>(`/admin/products/${id}`, { method: 'DELETE' }),

  getAdminOrders: (params?: Record<string, string>) =>
    request<{ orders: any[]; pagination: any }>('/admin/orders' + (params ? '?' + new URLSearchParams(params).toString() : '')),

  updateOrder: (id: number, data: { status?: string; payment_status?: string }) =>
    request<{ order: any }>(`/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getAdminUsers: (params?: Record<string, string>) =>
    request<{ users: any[]; pagination: any }>('/admin/users' + (params ? '?' + new URLSearchParams(params).toString() : '')),
};
