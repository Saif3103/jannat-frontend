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
    { label: 'TOTAL PRODUCTS', value: analytics.totalProducts, icon: FiPackage, color: '#C9A84C', bg: 'rgba(201, 168, 76, 0.1)' },
    { label: 'TOTAL ORDERS', value: analytics.totalOrders, icon: FiShoppingBag, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'TOTAL USERS', value: analytics.totalUsers, icon: FiUsers, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
    { label: 'TOTAL REVENUE', value: `₹${analytics.totalRevenue?.toLocaleString()}`, icon: FiDollarSign, color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
  ] : [];

  return (
    <AdminLayout>
      <Helmet><title>Admin Dashboard | Jannat Rugs Co.</title></Helmet>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {loading ? [...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#151515] border border-white/5 p-6 h-32 rounded-3xl shimmer" />
          )) : stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }} className="bg-[#151515] border border-white/5 p-6 rounded-[32px] flex items-center justify-between shadow-xl">
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
                <p className="font-luxury text-[32px] text-white leading-none">{s.value}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: s.bg }}>
                <s.icon size={26} style={{ color: s.color }} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-7 bg-[#151515] border border-white/5 p-8 rounded-[32px] shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[#C9A84C] font-bold text-lg tracking-tight">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs text-gray-400 hover:text-[#C9A84C] flex items-center gap-1 transition-colors">View All <FiArrowRight /></Link>
            </div>
            <div className="space-y-6">
              {loading ? [...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-2xl shimmer" />) :
                analytics?.recentOrders?.map(order => (
                  <div key={order._id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#C9A84C] border border-white/5 group-hover:border-[#C9A84C]/30 transition-all">
                        <FiShoppingBag size={20} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold tracking-tight">#{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{order.user?.name || 'Guest'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#C9A84C] text-sm font-bold">₹{order.totalPrice?.toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg inline-block mt-1 ${
                        order.orderStatus === 'Delivered' ? 'text-[#22c55e] bg-[#22c55e]/10' : 'text-[#3b82f6] bg-[#3b82f6]/10'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-5 space-y-6">
            {/* Order by Status */}
            <div className="bg-[#151515] border border-white/5 p-8 rounded-[32px] shadow-xl">
              <h2 className="text-[#C9A84C] font-bold text-lg mb-8">Orders By Status</h2>
              <div className="space-y-6">
                {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-10 bg-white/5 rounded-xl shimmer" />) :
                  analytics?.ordersByStatus?.slice(0, 3).map(s => (
                    <div key={s._id} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-300 font-medium">{s._id}</span>
                        <span className="text-gray-500">{s.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (s.count / (analytics?.totalOrders || 1)) * 100)}%` }}
                          className="h-full rounded-full transition-all duration-1000" style={{ background: STATUS_COLORS[s._id] || '#C9A84C' }} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-[#151515] border border-white/5 p-8 rounded-[32px] shadow-xl">
              <h2 className="text-[#C9A84C] font-bold text-lg mb-8">Top Products</h2>
              <div className="space-y-6">
                {analytics?.topProducts?.slice(0, 5).map(p => (
                  <div key={p._id} className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/5 shadow-lg">
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate tracking-tight">{p.name}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-widest">{p.numReviews} reviews</p>
                    </div>
                    <span className="text-[#C9A84C] text-sm font-bold">₹{p.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
          {[
            { label: 'Add Product', path: '/admin/products', icon: FiPackage, color: '#C9A84C', border: 'border-[#C9A84C]/30' },
            { label: 'Manage Orders', path: '/admin/orders', icon: FiShoppingBag, color: '#3b82f6', border: 'border-[#3b82f6]/30' },
            { label: 'View Messages', path: '/admin/settings', icon: FiMessageSquare, color: '#22c55e', border: 'border-[#22c55e]/30' },
            { label: 'Site Settings', path: '/admin/settings', icon: FiSettings, color: '#8b5cf6', border: 'border-[#8b5cf6]/30' },
          ].map(l => (
            <Link key={l.label} to={l.path}
              className={`bg-[#151515] ${l.border} border p-6 rounded-[28px] flex items-center justify-center gap-3 hover:bg-white/5 transition-all group shadow-lg`}>
              <l.icon size={20} style={{ color: l.color }} />
              <span className="text-white text-sm font-bold tracking-tight group-hover:text-[#C9A84C] transition-colors">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
