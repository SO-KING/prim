import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../lib/api';
import AnimatedSection from '../../components/AnimatedSection';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats()
      .then((data) => {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setLowStock(data.lowStock);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, gradient: 'from-blue-500 to-blue-700', shadow: 'shadow-blue-500/20' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, gradient: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-500/20' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, gradient: 'from-emerald-500 to-emerald-700', shadow: 'shadow-emerald-500/20' },
    { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, gradient: 'from-amber-500 to-amber-700', shadow: 'shadow-amber-500/20' },
  ];

  const statusIcon: Record<string, any> = {
    pending: Clock,
    confirmed: CheckCircle,
    cancelled: XCircle,
  };
  const statusColor: Record<string, string> = {
    pending: 'text-yellow-500',
    confirmed: 'text-emerald-500',
    cancelled: 'text-red-500',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <AnimatedSection className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-accent-600 uppercase tracking-wider">Dashboard</span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">Admin Overview</h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent-500 to-amber-600 flex items-center justify-center shadow-lg shadow-accent-500/25">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <AnimatedSection key={card.label} delay={i * 80}>
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</p>
                </div>
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </AnimatedSection>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <AnimatedSection delay={200}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <ShoppingCart className="h-5 w-5 text-accent-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
              </div>
              <Link to="/admin/orders" className="inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
                View All <ArrowRight className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
              </Link>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentOrders.slice(0, 5).map((order: any) => {
                const StatusIcon = statusIcon[order.status] || Clock;
                const sColor = statusColor[order.status] || 'text-slate-500';
                return (
                  <div key={order.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <StatusIcon className={`h-4 w-4 ${sColor}`} />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{order.order_number}</p>
                        <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()} — <span className="capitalize">{order.status}</span></p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</span>
                  </div>
                );
              })}
              {recentOrders.length === 0 && (
                <div className="px-6 py-12 text-center text-sm text-slate-500">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  No orders yet
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Low Stock */}
        <AnimatedSection delay={300}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Low Stock Products</h2>
              </div>
              <Link to="/admin/products" className="inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
                Manage <ArrowRight className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
              </Link>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {lowStock.map((product: any) => (
                <div key={product.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Package className="h-4 w-4 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{product.name}</p>
                  </div>
                  <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-lg ${product.stock === 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'}`}>
                    {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                  </span>
                </div>
              ))}
              {lowStock.length === 0 && (
                <div className="px-6 py-12 text-center text-sm text-slate-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
                  All products well stocked
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
