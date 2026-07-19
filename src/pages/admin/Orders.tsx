import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import type { Order, Pagination } from '../../types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const loadOrders = (page = 1) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page) };
    if (filterStatus) params.status = filterStatus;

    api.getAdminOrders(params)
      .then((data) => {
        setOrders(data.orders);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, [filterStatus]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.updateOrder(id, { status });
      toast.success('Order updated');
      loadOrders(pagination.page);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Orders</h1>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 focus:ring-2 focus:ring-accent-500 outline-none">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                <th className="text-left px-6 py-3 font-medium text-slate-500">Order</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Customer</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Items</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Total</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Date</th>
                <th className="text-right px-6 py-3 font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{order.order_number}</td>
                  <td className="px-6 py-4 text-slate-500">User #{order.user_id}</td>
                  <td className="px-6 py-4">{order.items?.length || 0}</td>
                  <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1.5 focus:ring-2 focus:ring-accent-500 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => loadOrders(page)} className={`w-8 h-8 rounded-lg text-xs font-medium ${page === pagination.page ? 'bg-accent-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}>
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
