export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  description_ar?: string;
  price: number;
  compare_price?: number;
  images: string;
  category_id: number;
  category_name?: string;
  category_name_ar?: string;
  category_slug?: string;
  stock: number;
  rating: number;
  reviews_count: number;
  featured: number;
  specifications: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  description_ar?: string;
  image?: string;
  products_count?: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  name_ar?: string;
  price: number;
  compare_price?: number;
  images: string;
  stock: number;
  slug: string;
  quantity: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  shipping_address?: string;
  payment_method: string;
  payment_status: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
