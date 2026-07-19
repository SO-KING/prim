import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CreditCard, MapPin, Globe, Building, MapPinned, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { useCartStore } from '../store/cartStore';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Switzerland', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Greece',
  'Japan', 'South Korea', 'China', 'India', 'Brazil', 'Mexico', 'Argentina',
  'Saudi Arabia', 'UAE', 'Egypt', 'Turkey',
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, fetchCart } = useCartStore();
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const getFullAddress = () => {
    const parts = [street, city, country, zipCode].filter(Boolean);
    return parts.join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !country) {
      toast.error('Please fill in the required address fields');
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.createOrder({
        shipping_address: getFullAddress(),
        payment_method: paymentMethod,
        notes,
      });
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = total;
  const shipping = subtotal >= 200 ? 0 : 15;
  const tax = subtotal * 0.15;
  const grandTotal = subtotal + shipping + tax;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Shipping */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="flex items-center text-lg font-semibold text-slate-900 dark:text-white mb-4">
              <MapPin className="h-5 w-5 mr-2 text-accent-500" /> Shipping Address
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Country *</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select country...</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">City *</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none"
                      placeholder="City"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">ZIP Code</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none"
                      placeholder="ZIP"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Street Address *</label>
                <div className="relative">
                  <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none"
                    placeholder="Street address, building, apartment"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="flex items-center text-lg font-semibold text-slate-900 dark:text-white mb-4">
              <CreditCard className="h-5 w-5 mr-2 text-accent-500" /> Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
<input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-accent-500" />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Cash on Delivery</span>
            </label>
            <label className="flex items-center p-3 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:border-accent-400 transition-colors">
              <input type="radio" name="payment" value="card" disabled checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-accent-500" />
                <span className="ml-3 text-sm font-medium">Credit Card (Coming Soon)</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="flex items-center text-lg font-semibold text-slate-900 dark:text-white mb-4">
              <Truck className="h-5 w-5 mr-2 text-accent-500" /> Order Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-sm focus:ring-2 focus:ring-accent-500 outline-none resize-none"
              placeholder="Any special instructions..."
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 truncate mr-2">{item.name} x{item.quantity}</span>
                  <span className="font-medium text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Tax (15%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                <span>Total</span><span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full px-6 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-accent-500/25 active:scale-[0.98]"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
