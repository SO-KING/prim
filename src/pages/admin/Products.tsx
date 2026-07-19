import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import type { Product, Category, Pagination } from '../../types';

const emptyProduct = {
  name: '', price: '', compare_price: '', stock: '0', category_id: '', description: '', featured: 0,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyProduct);

  const loadProducts = (page = 1) => {
    setLoading(true);
    api.getAdminProducts({ page: String(page) })
      .then((data) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    api.getCategories().then((data) => setCategories(data.categories));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: String(product.price),
      compare_price: product.compare_price ? String(product.compare_price) : '',
      stock: String(product.stock),
      category_id: String(product.category_id || ''),
      description: product.description || '',
      featured: product.featured,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      stock: Number(form.stock),
      category_id: form.category_id ? Number(form.category_id) : null,
      description: form.description,
      featured: form.featured,
      images: [],
    };

    try {
      if (editing) {
        await api.updateProduct(editing.id, data);
        toast.success('Product updated!');
      } else {
        await api.createProduct(data);
        toast.success('Product created!');
      }
      setShowModal(false);
      loadProducts(pagination.page);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      toast.success('Product deleted');
      loadProducts(pagination.page);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Products</h1>
        <button onClick={openCreate} className="inline-flex items-center px-4 py-2 bg-accent-500 text-white font-medium rounded-xl hover:bg-accent-600 transition-all text-sm">
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                <th className="text-left px-6 py-3 font-medium text-slate-500">Product</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Price</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Stock</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Category</th>
                <th className="text-right px-6 py-3 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No products</td></tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-slate-400" />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={product.stock <= 5 ? 'text-red-500 font-medium' : ''}>{product.stock}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{product.category_name || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(product)} className="p-1.5 text-slate-400 hover:text-accent-500 transition-colors"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors ml-1"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => loadProducts(page)} className={`w-8 h-8 rounded-lg text-xs font-medium ${page === pagination.page ? 'bg-accent-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}>
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{editing ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Product name" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none" required />
              <div className="grid grid-cols-2 gap-4">
                <input value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} type="number" step="0.01" placeholder="Price" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none" required />
                <input value={form.compare_price} onChange={(e) => setForm({...form, compare_price: e.target.value})} type="number" step="0.01" placeholder="Compare price" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} type="number" placeholder="Stock" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none" />
                <select value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none appearance-none cursor-pointer">
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} placeholder="Description" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none resize-none" />
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={form.featured === 1} onChange={(e) => setForm({...form, featured: e.target.checked ? 1 : 0})} className="h-4 w-4 rounded border-slate-300 text-accent-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Featured product</span>
              </label>
              <div className="flex space-x-3 pt-2">
                <button type="submit" className="flex-1 px-4 py-2.5 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-all text-sm">
                  {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
