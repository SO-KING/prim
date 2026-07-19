import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ChevronLeft, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { api } from '../lib/api';
import type { Order } from '../types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const timelineSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'processing', label: 'Processing', icon: ShoppingBag },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  const cancelled = currentStatus === 'cancelled';
  const currentIndex = timelineSteps.findIndex((s) => s.key === currentStatus) + (cancelled ? 0 : 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
      {cancelled ? (
        <div className="flex items-center space-x-3 text-red-500">
          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">Order Cancelled</p>
            <p className="text-sm text-slate-500">This order has been cancelled</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {timelineSteps.map((step, i) => {
              const isComplete = i < currentIndex;
              const isCurrent = i === currentIndex;
              const Icon = step.icon;
              const isDelivered = step.key === 'delivered' && currentStatus === 'delivered';
              return (
                <div key={step.key} className="flex sm:flex-col items-center sm:items-center space-x-3 sm:space-x-0 sm:space-y-2 relative z-10">
                  <div className={`p-2 rounded-full transition-all duration-500 ${
                    isDelivered
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110'
                      : isComplete
                        ? 'bg-accent-500 text-white'
                        : isCurrent
                          ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-500 border-2 border-accent-500'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="sm:text-center">
                    <p className={`text-sm font-medium ${
                      isDelivered ? 'text-green-600 dark:text-green-400' :
                      isComplete || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div className={`hidden sm:block absolute top-5 left-10 h-0.5 transition-all duration-700 ${
                      isComplete ? 'bg-accent-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`} style={{ width: 'calc(100% - 2.5rem)', left: '2.5rem' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getOrder(Number(id))
        .then((data) => setOrder(data.order))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Order not found</h2>
        <Link to="/orders" className="text-accent-600 hover:text-accent-700 mt-2 inline-block">Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="inline-flex items-center text-sm text-accent-600 hover:text-accent-700 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{order.order_number}</h1>
          <p className="text-sm text-slate-500 mt-1">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Order Timeline */}
      <OrderTimeline currentStatus={order.status} />

      {/* Order Items */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white">Order Items</h2>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {order.items.map((item) => (
            <div key={item.id} className="px-6 py-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                {item.product_image ? (
                  <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><Package className="h-6 w-6 text-slate-400" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white">{item.product_name}</p>
                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Tax (15%)</span><span>${order.tax.toFixed(2)}</span></div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span><span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Details</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-slate-500 block">Payment Method</span>
              <span className="font-medium capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment Status</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[order.payment_status]}`}>
                {order.payment_status}
              </span>
            </div>
            {order.shipping_address && (
              <div>
                <span className="text-slate-500 block">Shipping Address</span>
                <span className="font-medium">{order.shipping_address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
