import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';

export default function CartPage() {
  const { items, total, loading, fetchCart, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95">
          Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => {
          const images = JSON.parse(item.images || '[]');
          return (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
              <Link to={`/products/${item.slug}`} className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                {images[0] ? <img src={images[0]} alt={item.name} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><Package className="h-6 w-6 text-slate-400" /></div>}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.slug}`} className="font-semibold text-slate-900 dark:text-white hover:text-accent-500 transition-colors line-clamp-1">{item.name}</Link>
                <p className="text-sm text-slate-500 mt-0.5">${item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700"><Minus className="h-3 w-3" /></button>
                <span className="px-3 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700"><Plus className="h-3 w-3" /></button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-semibold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button onClick={() => { removeItem(item.id); toast.success('Item removed'); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Shipping</span>
            <span>{total >= 200 ? 'Free' : '$15.00'}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Tax (15%)</span>
            <span>${(total * 0.15).toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
            <span>Total</span>
            <span>${(total + (total >= 200 ? 0 : 15) + total * 0.15).toFixed(2)}</span>
          </div>
        </div>
        <Link to="/checkout" className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-[0.98]">
          Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
