import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiArrowRight, FiMessageSquare, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_COLORS = { 
  Pending: '#C9A84C', 
  Confirmed: '#3b82f6', 
  Processing: '#8b5cf6', 
  Shipped: '#f97316', 
  Delivered: '#22c55e', 
  Cancelled: '#ef4444' 
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then(r => setAnalytics(r.data.analytics)).finally(() => setLoading(false));
  }, []);

  const stats = analytics ? [
    { label: 'TOTAL PRODUCTS', value: analytics.totalProducts, icon: FiPackage, color: '#C9A84C', bg: '#FFF9E6' },
    { label: 'TOTAL ORDERS', value: analytics.totalOrders, icon: FiShoppingBag, color: '#3b82f6', bg: '#EEF2FF' },
    { label: 'TOTAL USERS', value: analytics.totalUsers, icon: FiUsers, color: '#22c55e', bg: '#ECFDF5' },
    { label: 'TOTAL REVENUE', value: `₹${analytics.totalRevenue?.toLocaleString()}`, icon: FiDollarSign, color: '#f97316', bg: '#FFF7ED' },
  ] : [];

  return (
    <AdminLayout>
      <Helmet><title>Admin Dashboard | Jannat Rugs Co.</title></Helmet>
      <div className="space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading ? [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 p-6 h-32 rounded-2xl shimmer" />
          )) : stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} className="bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-2xl text-[#222] font-bold">{s.value}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-7 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[#222] font-bold text-lg tracking-tight">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs text-[#C9A84C] font-bold hover:underline flex items-center gap-1 transition-all">View All <FiArrowRight /></Link>
            </div>
            <div className="space-y-6">
              {loading ? [...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl shimmer" />) :
                analytics?.recentOrders?.map(order => (
                  <div key={order._id} className="flex items-center justify-between group py-1">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#C9A84C] border border-gray-100 group-hover:bg-[#FFF9E6] transition-all">
                        <FiShoppingBag size={18} />
                      </div>
                      <div>
                        <p className="text-[#222] text-sm font-bold">#{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-gray-400 text-xs font-medium">{order.user?.name || 'Guest'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#222] text-sm font-bold">₹{order.totalPrice?.toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block mt-1 ${
                        order.orderStatus === 'Delivered' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Panels */}
          <div className="lg:col-span-5 space-y-8">
            {/* Orders By Status */}
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h2 className="text-[#222] font-bold text-lg mb-8 tracking-tight">Orders By Status</h2>
              <div className="space-y-6">
                {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-50 rounded-xl shimmer" />) :
                  analytics?.ordersByStatus?.slice(0, 3).map(s => (
                    <div key={s._id} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold tracking-tight">
                        <span className="text-gray-600 uppercase">{s._id}</span>
                        <span className="text-gray-400">{s.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (s.count / (analytics?.totalOrders || 1)) * 100)}%` }}
                          className="h-full rounded-full transition-all duration-1000" style={{ background: STATUS_COLORS[s._id] || '#C9A84C' }} />
                      </div>
                    </div>
                  ))}
              </div>

              <h2 className="text-[#222] font-bold text-lg mt-12 mb-8 tracking-tight">Top Products</h2>
              <div className="space-y-6">
                {analytics?.topProducts?.slice(0, 5).map(p => (
                  <div key={p._id} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#222] text-sm font-bold truncate tracking-tight">{p.name}</p>
                      <p className="text-gray-400 text-[10px] font-bold mt-0.5 uppercase tracking-widest">{p.numReviews} reviews</p>
                    </div>
                    <span className="text-[#C9A84C] text-sm font-bold">₹{p.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
          {[
            { label: 'Add Product', path: '/admin/products', icon: FiPackage, color: '#C9A84C', bg: '#FFF9E6' },
            { label: 'Manage Orders', path: '/admin/orders', icon: FiShoppingBag, color: '#3b82f6', bg: '#EEF2FF' },
            { label: 'View Messages', path: '/admin/settings', icon: FiMessageSquare, color: '#22c55e', bg: '#ECFDF5' },
            { label: 'Site Settings', path: '/admin/settings', icon: FiSettings, color: '#8b5cf6', bg: '#F5F3FF' },
          ].map(l => (
            <Link key={l.label} to={l.path}
              className="bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-center gap-3 hover:shadow-md transition-all group shadow-sm">
              <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: l.bg }}>
                <l.icon size={20} style={{ color: l.color }} />
              </div>
              <span className="text-[#222] text-sm font-bold tracking-tight group-hover:text-[#C9A84C] transition-colors">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
