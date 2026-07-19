import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import type { Order, Pagination } from '../types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders()
      .then((data) => {
        setOrders(data.orders);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-slate-500 mb-6">Start shopping to see your orders here.</p>
          <Link to="/products" className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-all shadow-lg hover:shadow-accent-500/25 active:scale-[0.98]">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{order.order_number}</p>
                  <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-slate-100 text-slate-800'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{order.items.length} item(s)</span>
                <span className="font-semibold text-slate-900 dark:text-white">${order.total.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
