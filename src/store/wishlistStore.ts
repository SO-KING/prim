import { create } from 'zustand';
import { api } from '../lib/api';

export interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  name_ar?: string;
  price: number;
  compare_price?: number;
  images: string;
  stock: number;
  slug: string;
  rating: number;
  reviews_count: number;
  category_name?: string;
  category_slug?: string;
  created_at: string;
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isWishlisted: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const data = await api.getWishlist();
      set({ items: data.items });
    } catch {
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId) => {
    const data = await api.toggleWishlist(productId);
    if (data.wishlisted) {
      const product = await api.getProductById(productId);
      set((state) => ({
        items: [{
          id: product.id,
          product_id: product.id,
          name: product.name,
          name_ar: product.name_ar,
          price: product.price,
          compare_price: product.compare_price,
          images: product.images,
          stock: product.stock,
          slug: product.slug,
          rating: product.rating,
          reviews_count: product.reviews_count,
          category_name: product.category_name,
          category_slug: product.category_slug,
          created_at: new Date().toISOString(),
        }, ...state.items],
      }));
    } else {
      set((state) => ({
        items: state.items.filter((i) => i.product_id !== productId),
      }));
    }
    return data.wishlisted;
  },

  isWishlisted: (productId) => {
    return get().items.some((i) => i.product_id === productId);
  },
}));
