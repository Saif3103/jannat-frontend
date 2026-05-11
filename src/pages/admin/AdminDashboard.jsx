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
    { label: 'TOTAL PRODUCTS', value: analytics.totalProducts, icon: FiPackage, color: '#C9A84C' },
    { label: 'TOTAL ORDERS', value: analytics.totalOrders, icon: FiShoppingBag, color: '#3b82f6' },
    { label: 'TOTAL USERS', value: analytics.totalUsers, icon: FiUsers, color: '#22c55e' },
    { label: 'TOTAL REVENUE', value: `₹${analytics.totalRevenue?.toLocaleString()}`, icon: FiDollarSign, color: '#f97316' },
  ] : [];

  return (
    <AdminLayout>
      <Helmet><title>Admin Dashboard | Jannat Rugs Co.</title></Helmet>
      <div className="space-y-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading ? [...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#151515] border border-white/5 p-8 h-36 rounded-[2.5rem] shimmer" />
          )) : stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} className="bg-[#151515] border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl hover:border-white/20 transition-all group">
              <div>
                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">{s.label}</p>
                <p className="text-4xl text-white font-medium leading-none tracking-tight">{s.value}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                <s.icon size={28} style={{ color: s.color }} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-7 bg-[#151515] border border-white/10 p-10 rounded-[3rem] shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[#C9A84C] font-bold text-xl tracking-tight">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-gray-500 hover:text-[#C9A84C] flex items-center gap-2 transition-all font-medium">View All <FiArrowRight /></Link>
            </div>
            <div className="space-y-8">
              {loading ? [...Array(5)].map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-3xl shimmer" />) :
                analytics?.recentOrders?.map(order => (
                  <div key={order._id} className="flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center text-[#C9A84C] border border-white/5 group-hover:border-[#C9A84C]/30 transition-all shadow-inner">
                        <FiShoppingBag size={22} />
                      </div>
                      <div>
                        <p className="text-white text-base font-bold tracking-tight">#{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-gray-500 text-sm font-medium mt-0.5">{order.user?.name || 'Saif Ali'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#C9A84C] text-base font-bold tracking-tight">₹{order.totalPrice?.toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full inline-block mt-2 ${
                        order.orderStatus === 'Delivered' ? 'text-[#22c55e] bg-[#22c55e]/10' : 'text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/20'
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
            <div className="bg-[#151515] border border-white/10 p-10 rounded-[3rem] shadow-2xl">
              <h2 className="text-[#C9A84C] font-bold text-xl mb-10 tracking-tight">Orders By Status</h2>
              <div className="space-y-8">
                {loading ? [...Array(2)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-2xl shimmer" />) :
                  analytics?.ordersByStatus?.slice(0, 2).map(s => (
                    <div key={s._id} className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold tracking-tight">
                        <span className="text-gray-300">{s._id}</span>
                        <span className="text-gray-500">{s.count}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/5">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (s.count / (analytics?.totalOrders || 1)) * 100)}%` }}
                          className="h-full rounded-full transition-all duration-1000 shadow-lg" style={{ background: STATUS_COLORS[s._id] || '#C9A84C' }} />
                      </div>
                    </div>
                  ))}
              </div>

              {/* Top Products nested inside right panels area but as a separate block below if needed, 
                  but the screenshot shows it below "Orders By Status" inside the same column. */}
              <h2 className="text-[#C9A84C] font-bold text-xl mt-14 mb-10 tracking-tight">Top Products</h2>
              <div className="space-y-8">
                {analytics?.topProducts?.slice(0, 5).map(p => (
                  <div key={p._id} className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl transition-transform group-hover:scale-105">
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-[15px] font-bold truncate tracking-tight">{p.name}</p>
                      <p className="text-gray-500 text-[11px] font-bold mt-1 uppercase tracking-[0.15em]">{p.numReviews} reviews</p>
                    </div>
                    <span className="text-[#C9A84C] text-[15px] font-bold tracking-tight">₹{p.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-6">
          {[
            { label: 'Add Product', path: '/admin/products', icon: FiPackage, color: '#C9A84C', border: 'border-[#C9A84C]/40' },
            { label: 'Manage Orders', path: '/admin/orders', icon: FiShoppingBag, color: '#3b82f6', border: 'border-[#3b82f6]/40' },
            { label: 'View Messages', path: '/admin/settings', icon: FiMessageSquare, color: '#22c55e', border: 'border-[#22c55e]/40' },
            { label: 'Site Settings', path: '/admin/settings', icon: FiSettings, color: '#8b5cf6', border: 'border-[#8b5cf6]/40' },
          ].map(l => (
            <Link key={l.label} to={l.path}
              className={`bg-[#151515] ${l.border} border-2 p-8 rounded-[2.5rem] flex items-center justify-center gap-4 hover:bg-white/5 transition-all group shadow-2xl`}>
              <l.icon size={24} style={{ color: l.color }} className="group-hover:scale-125 transition-transform" />
              <span className="text-white text-base font-bold tracking-tight">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
