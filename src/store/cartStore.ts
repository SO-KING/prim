import { create } from 'zustand';
import { mockProducts } from '../lib/mockData';
import type { CartItem } from '../types';

interface CartItemLocal {
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

interface CartStore {
  items: CartItemLocal[];
  total: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  loading: false,

  fetchCart: async () => {
    set({ loading: false });
  },

  addItem: async (productId, quantity = 1) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) throw new Error('Product not found');
    const images = typeof product.images === 'string' ? product.images : JSON.stringify(product.images);
    const existing = get().items.find((i) => i.product_id === productId);
    let newItems: CartItemLocal[];
    if (existing) {
      newItems = get().items.map((i) =>
        i.product_id === productId ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      const item: CartItemLocal = {
        id: Date.now(),
        product_id: product.id,
        name: product.name,
        name_ar: product.name_ar,
        price: product.price,
        compare_price: product.compare_price,
        images,
        stock: product.stock,
        slug: product.slug,
        quantity,
      };
      newItems = [item, ...get().items];
    }
    const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    set({ items: newItems as any, total });
  },

  updateQuantity: async (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    const newItems = get().items.map((i) => (i.id === id ? { ...i, quantity } : i));
    const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    set({ items: newItems as any, total });
  },

  removeItem: async (id) => {
    const newItems = get().items.filter((i) => i.id !== id);
    const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    set({ items: newItems as any, total });
  },

  clearCart: async () => {
    set({ items: [], total: 0 });
  },

  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
