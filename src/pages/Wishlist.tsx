import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, ShoppingCart, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../App';

export default function Wishlist() {
  const { user } = useAuth();
  const { items, loading, fetchWishlist, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const handleAddToCart = async (productId: number) => {
    try {
      await addItem(productId);
      toast.success('Added to cart!');
    } catch {
      toast.error('Please sign in first');
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await toggleWishlist(productId);
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Sign in to view your wishlist</h2>
        <p className="text-slate-500 mb-6">Save your favorite items for later.</p>
        <Link to="/login" className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">My Wishlist</h1>
          <p className="text-sm text-slate-500 mt-1">{items.length} items saved</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center px-4 py-2 bg-accent-500 text-white text-sm font-medium rounded-xl hover:bg-accent-600 transition-all shadow-lg active:scale-[0.98]"
        >
          Browse Products
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-slate-200 dark:bg-slate-700" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h3>
          <p className="text-slate-500 mb-6">Start adding items you love!</p>
          <Link to="/products" className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => {
            const images = JSON.parse(item.images || '[]');
            const discount = item.compare_price ? Math.round((1 - item.price / item.compare_price) * 100) : 0;
            return (
              <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300">
                <Link to={`/products/${item.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {images[0] ? (
                      <img src={images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><Package className="h-8 w-8 text-slate-400" /></div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg shadow">-{discount}%</span>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); handleRemove(item.product_id); }}
                      className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-lg"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </Link>
                <div className="p-3">
                  <p className="text-xs text-accent-600 font-medium mb-0.5">{item.category_name}</p>
                  <Link to={`/products/${item.slug}`} className="font-semibold text-sm text-slate-900 dark:text-white hover:text-accent-500 transition-colors line-clamp-1 block">
                    {item.name}
                  </Link>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-3 w-3 ${star <= Math.round(item.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 ml-1">({item.reviews_count})</span>
                  </div>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white">${item.price.toFixed(2)}</span>
                    {item.compare_price && (
                      <span className="text-xs text-slate-400 line-through">${item.compare_price.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(item.product_id)}
                    className="mt-2 w-full inline-flex items-center justify-center px-3 py-2 bg-accent-500 text-white text-xs font-semibold rounded-lg hover:bg-accent-600 transition-all active:scale-[0.98]"
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
