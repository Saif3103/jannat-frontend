import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_COLORS = { Pending: '#C9A84C', Confirmed: '#3b82f6', Processing: '#8b5cf6', Shipped: '#f97316', Delivered: '#22c55e', Cancelled: '#ef4444' };

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then(r => setAnalytics(r.data.analytics)).finally(() => setLoading(false));
  }, []);

  const stats = analytics ? [
    { label: 'Total Products', value: analytics.totalProducts, icon: FiPackage, color: '#C9A84C' },
    { label: 'Total Orders', value: analytics.totalOrders, icon: FiShoppingBag, color: '#3b82f6' },
    { label: 'Total Users', value: analytics.totalUsers, icon: FiUsers, color: '#22c55e' },
    { label: 'Total Revenue', value: `₹${analytics.totalRevenue?.toLocaleString()}`, icon: FiDollarSign, color: '#f97316' },
  ] : [];

  return (
    <AdminLayout>
      <Helmet><title>Admin Dashboard | Jannat Rugs Co.</title></Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="font-luxury text-3xl text-white mb-1">Dashboard</h1>
          <p className="text-amber-100/40 text-sm">Welcome back, Admin! Here's what's happening.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {loading ? [...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 shimmer h-28 rounded-2xl" />
          )) : stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} className="glass-card p-6 rounded-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-amber-100/50 text-xs uppercase tracking-wider mb-2">{s.label}</p>
                  <p className="font-luxury text-3xl" style={{ color: s.color }}>{s.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-amber-100 font-medium">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs text-amber-400 hover:text-amber-300">View All →</Link>
            </div>
            <div className="space-y-3">
              {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-12 shimmer rounded-lg" />) :
                analytics?.recentOrders?.map(order => (
                  <div key={order._id} className="flex items-center justify-between py-2 border-b border-amber-900/10 last:border-0">
                    <div>
                      <p className="text-amber-100 text-sm font-medium">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-amber-100/40 text-xs">{order.user?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 text-sm font-medium">₹{order.totalPrice?.toLocaleString()}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${STATUS_COLORS[order.orderStatus]}20`, color: STATUS_COLORS[order.orderStatus] }}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Order by Status */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-amber-100 font-medium mb-5">Orders By Status</h2>
            <div className="space-y-3">
              {loading ? [...Array(5)].map((_, i) => <div key={i} className="h-10 shimmer rounded" />) :
                analytics?.ordersByStatus?.map(s => (
                  <div key={s._id} className="flex items-center gap-3">
                    <span className="text-xs w-24 text-amber-100/60">{s._id}</span>
                    <div className="flex-1 h-2 rounded-full bg-amber-950/50 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{
                        width: `${Math.min(100, (s.count / (analytics?.totalOrders || 1)) * 100)}%`,
                        background: STATUS_COLORS[s._id] || '#C9A84C'
                      }} />
                    </div>
                    <span className="text-xs text-amber-100/50 w-6 text-right">{s.count}</span>
                  </div>
                ))}
            </div>

            {/* Top Products */}
            <h2 className="text-amber-100 font-medium mt-6 mb-4">Top Products</h2>
            <div className="space-y-3">
              {analytics?.topProducts?.map(p => (
                <div key={p._id} className="flex items-center gap-3">
                  <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-100 text-xs truncate">{p.name}</p>
                    <p className="text-amber-100/40 text-xs">{p.numReviews} reviews</p>
                  </div>
                  <span className="text-amber-400 text-xs font-medium">₹{p.price?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Product', path: '/admin/products', color: '#C9A84C' },
            { label: 'Manage Orders', path: '/admin/orders', color: '#3b82f6' },
            { label: 'View Messages', path: '/admin/settings', color: '#22c55e' },
            { label: 'Site Settings', path: '/admin/settings', color: '#8b5cf6' },
          ].map(l => (
            <Link key={l.label} to={l.path}
              className="glass-card p-4 text-center hover:border-amber-700/40 transition-all rounded-xl text-sm font-medium"
              style={{ color: l.color }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
