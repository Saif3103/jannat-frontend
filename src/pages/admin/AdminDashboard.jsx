import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign,
  FiArrowRight, FiMessageSquare, FiSettings, FiPlus
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_COLORS = {
  Pending: '#C9A84C',
  Confirmed: '#3b82f6',
  Processing: '#8b5cf6',
  Shipped: '#f97316',
  Delivered: '#22c55e',
  Cancelled: '#ef4444',
};

const STATUS_BADGE = {
  Pending: 'bg-amber-50 text-amber-700',
  Confirmed: 'bg-blue-50 text-blue-700',
  Processing: 'bg-purple-50 text-purple-700',
  Shipped: 'bg-orange-50 text-orange-700',
  Delivered: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-red-50 text-red-700',
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then((r) => setAnalytics(r.data.analytics)).finally(() => setLoading(false));
  }, []);

  const stats = analytics
    ? [
        { label: 'Products', value: analytics.totalProducts, icon: FiPackage, color: '#B69640', bg: '#FFF8E8' },
        { label: 'Orders', value: analytics.totalOrders, icon: FiShoppingBag, color: '#2563eb', bg: '#EFF6FF' },
        { label: 'Customers', value: analytics.totalUsers, icon: FiUsers, color: '#059669', bg: '#ECFDF5' },
        {
          label: 'Revenue',
          value: `₹${Number(analytics.totalRevenue || 0).toLocaleString('en-IN')}`,
          icon: FiDollarSign,
          color: '#ea580c',
          bg: '#FFF7ED',
        },
      ]
    : [];

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard | Jannat Rugs Co.</title>
      </Helmet>

      <div className="space-y-5 sm:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 h-[100px] sm:h-[112px] rounded-2xl animate-pulse" />
              ))
            : stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gray-100 rounded-2xl p-3.5 sm:p-5 shadow-sm flex flex-col justify-between min-h-[100px] sm:min-h-[112px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] sm:text-xs font-medium text-gray-500">{s.label}</p>
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: s.bg }}
                    >
                      <s.icon size={16} style={{ color: s.color }} />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight mt-2 break-all">
                    {s.value}
                  </p>
                </motion.div>
              ))}
        </div>

        {/* Quick actions — mobile friendly */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: 'Add Product', path: '/admin/products', icon: FiPlus, color: '#B69640', bg: '#FFF8E8' },
            { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag, color: '#2563eb', bg: '#EFF6FF' },
            { label: 'Messages', path: '/admin/settings', icon: FiMessageSquare, color: '#059669', bg: '#ECFDF5' },
            { label: 'Settings', path: '/admin/settings', icon: FiSettings, color: '#7c3aed', bg: '#F5F3FF' },
          ].map((l) => (
            <Link
              key={l.label}
              to={l.path}
              className="bg-white border border-gray-100 rounded-2xl px-3 py-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 hover:shadow-md transition-all shadow-sm"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: l.bg }}
              >
                <l.icon size={16} style={{ color: l.color }} />
              </div>
              <span className="text-[12px] sm:text-sm font-semibold text-[#1A1A1A] leading-tight">
                {l.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Recent Orders */}
          <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
              <h2 className="text-[15px] sm:text-base font-bold text-[#1A1A1A]">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-xs font-semibold text-[#B69640] hover:text-[#1A1A1A] flex items-center gap-1"
              >
                View all <FiArrowRight size={12} />
              </Link>
            </div>

            <div className="divide-y divide-gray-50">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 mx-4 my-2 bg-gray-50 rounded-xl animate-pulse" />
                  ))
                : analytics?.recentOrders?.length
                  ? analytics.recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 hover:bg-gray-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#C9A84C]/15 flex items-center justify-center text-[#B69640] shrink-0">
                            <FiShoppingBag size={16} />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-sm font-semibold text-[#1A1A1A]">
                              #{order._id.slice(-6).toUpperCase()}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">
                              {order.user?.name || 'Guest'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-[#1A1A1A]">
                            ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                          </p>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${
                              STATUS_BADGE[order.orderStatus] || 'bg-gray-50 text-gray-600'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  : (
                    <div className="px-4 py-10 text-center text-sm text-gray-400">No recent orders</div>
                  )}
            </div>
          </div>

          {/* Status + Top products */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5">
              <h2 className="text-[15px] sm:text-base font-bold text-[#1A1A1A] mb-4">Orders by status</h2>
              <div className="space-y-4">
                {loading
                  ? [...Array(3)].map((_, i) => (
                      <div key={i} className="h-8 bg-gray-50 rounded-lg animate-pulse" />
                    ))
                  : analytics?.ordersByStatus?.slice(0, 5).map((s) => (
                      <div key={s._id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[12px]">
                          <span className="font-medium text-gray-600">{s._id}</span>
                          <span className="font-semibold text-gray-400">{s.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(100, (s.count / (analytics?.totalOrders || 1)) * 100)}%`,
                            }}
                            className="h-full rounded-full"
                            style={{ background: STATUS_COLORS[s._id] || '#C9A84C' }}
                          />
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] sm:text-base font-bold text-[#1A1A1A]">Top products</h2>
                <Link to="/admin/products" className="text-xs font-semibold text-[#B69640]">
                  Manage
                </Link>
              </div>
              <div className="space-y-3">
                {analytics?.topProducts?.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-400">{p.numReviews || 0} reviews</p>
                    </div>
                    <span className="text-[13px] font-bold text-[#1A1A1A] shrink-0">
                      ₹{Number(p.discountPrice || p.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                {!loading && !analytics?.topProducts?.length && (
                  <p className="text-sm text-gray-400 text-center py-4">No products yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
