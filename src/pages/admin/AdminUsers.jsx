import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiUserX, FiUserCheck } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/users/admin/all'); setUsers(data.users); }
    catch {} finally { setLoading(false); }
  };

  const toggle = async (id) => {
    try { await api.put(`/users/admin/${id}/toggle`); toast.success('Status updated'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <Helmet><title>Users | Admin</title></Helmet>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
        <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-100">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                {['Name', 'Email', 'Phone', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-gray-500 text-[10px] uppercase tracking-wider font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? [...Array(6)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-5 bg-gray-100 animate-pulse rounded w-full" /></td>)}
                </tr>
              )) : users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold border border-gray-200 group-hover:bg-white group-hover:border-blue-200 transition-colors">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-gray-900 font-semibold">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{user.email}</td>
                  <td className="px-6 py-4 text-gray-500">{user.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-amber-50 text-[#1A1A1A] border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${user.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {user.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== 'admin' && (
                      <button onClick={() => toggle(user._id)}
                        className={`p-2 rounded-xl transition-all ${user.isActive ? 'text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 shadow-sm' : 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 shadow-sm'}`}
                        title={user.isActive ? 'Block User' : 'Activate User'}>
                        {user.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
