import { create } from 'zustand';
import { api } from '../lib/api';
import type { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
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
    set({ loading: true });
    try {
      const data = await api.getCart();
      set({ items: data.items, total: data.total });
    } catch {
      set({ items: [], total: 0 });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    const data = await api.addToCart(productId, quantity);
    set({ items: data.items, total: data.total });
  },

  updateQuantity: async (id, quantity) => {
    const data = await api.updateCartItem(id, quantity);
    set({ items: data.items, total: data.total });
  },

  removeItem: async (id) => {
    const data = await api.removeCartItem(id);
    set({ items: data.items, total: data.total });
  },

  clearCart: async () => {
    const data = await api.clearCart();
    set({ items: data.items, total: data.total });
  },

  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
