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
      <h1 className="font-luxury text-2xl text-white mb-6">Users ({users.length})</h1>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                {['Name', 'Email', 'Phone', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-amber-100/40 text-xs uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-amber-900/10">
                  {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-8 shimmer rounded" /></td>)}
                </tr>
              )) : users.map(user => (
                <tr key={user._id} className="border-b border-amber-900/10 hover:bg-amber-500/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 text-xs font-bold">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-amber-100">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-amber-100/60">{user.email}</td>
                  <td className="px-4 py-3 text-amber-100/50">{user.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-amber-900/30 text-amber-400' : 'bg-blue-900/20 text-blue-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-amber-100/40 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${user.isActive ? 'bg-emerald-900/20 text-emerald-400' : 'bg-red-900/20 text-red-400'}`}>
                      {user.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== 'admin' && (
                      <button onClick={() => toggle(user._id)}
                        className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-red-400/60 hover:text-red-400 hover:bg-red-900/10' : 'text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-900/10'}`}
                        title={user.isActive ? 'Block User' : 'Activate User'}>
                        {user.isActive ? <FiUserX size={15} /> : <FiUserCheck size={15} />}
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
