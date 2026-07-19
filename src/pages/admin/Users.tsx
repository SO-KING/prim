import { useState, useEffect } from 'react';
import { Users as UsersIcon } from 'lucide-react';
import { api } from '../../lib/api';
import type { Pagination } from '../../types';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const loadUsers = (page = 1) => {
    setLoading(true);
    api.getAdminUsers({ page: String(page) })
      .then((data) => {
        setUsers(data.users);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">Users</h1>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                <th className="text-left px-6 py-3 font-medium text-slate-500">User</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Email</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Role</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Orders</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Total Spent</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No users found</td></tr>
              ) : users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-sm font-medium text-accent-600">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.orderCount}</td>
                  <td className="px-6 py-4 font-medium">${(user.totalSpent || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => loadUsers(page)} className={`w-8 h-8 rounded-lg text-xs font-medium ${page === pagination.page ? 'bg-accent-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}>
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
