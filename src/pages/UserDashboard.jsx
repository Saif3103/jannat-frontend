import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiBell, FiLock, FiEdit2 } from 'react-icons/fi';
import api from '../api/axios';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

const STATUS_COLORS = { Pending: 'amber', Confirmed: 'blue', Processing: 'purple', Shipped: 'orange', Delivered: 'green', Cancelled: 'red', Returned: 'gray' };

export default function UserDashboard() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { user, updateUser, getProfile } = useAuthStore();
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'wishlist') fetchWishlist();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try { const { data } = await api.get('/orders/my-orders'); setOrders(data.orders); }
    catch {} finally { setLoading(false); }
  };

  const fetchWishlist = async () => {
    setLoading(true);
    try { const { data } = await api.get('/users/profile'); setWishlist(data.user.wishlist || []); }
    catch {} finally { setLoading(false); }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('phone', formData.phone);
      const { data } = await api.put('/users/profile', fd);
      updateUser(data.user);
      toast.success('Profile updated!');
      setEditMode(false);
    } catch { toast.error('Failed to update'); }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'orders', label: 'My Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'security', label: 'Security', icon: FiLock },
  ];

  return (
    <>
      <Helmet><title>My Dashboard | Jannat Rugs Co.</title></Helmet>
      <div className="pt-24 min-h-screen max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-luxury text-4xl text-white mb-8">My Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="glass-card p-4 h-fit">
            <div className="text-center mb-6 pb-6 border-b border-amber-900/20">
              <div className="w-20 h-20 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 font-bold text-3xl font-luxury mx-auto mb-3">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <p className="text-amber-100 font-medium">{user?.name}</p>
              <p className="text-amber-100/40 text-xs truncate">{user?.email}</p>
            </div>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all mb-1 ${activeTab === id ? 'bg-amber-500/15 text-amber-400 border-l-2 border-amber-500' : 'text-amber-100/60 hover:text-amber-400 hover:bg-amber-500/5'}`}>
                <Icon size={16} />{label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* PROFILE */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-luxury text-2xl text-amber-400">Profile Information</h2>
                  <button onClick={() => setEditMode(!editMode)} className="flex items-center gap-2 btn-outline-gold text-xs py-2 px-4">
                    <FiEdit2 size={13} /> {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editMode ? (
                  <form onSubmit={updateProfile} className="space-y-4 max-w-md">
                    <div>
                      <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Full Name</label>
                      <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="input-luxury" required />
                    </div>
                    <div>
                      <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Phone</label>
                      <input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="input-luxury" />
                    </div>
                    <button type="submit" className="btn-gold py-2.5 px-8">Save Changes</button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{ label: 'Full Name', value: user?.name }, { label: 'Email', value: user?.email }, { label: 'Phone', value: user?.phone || 'Not set' }, { label: 'Account Type', value: user?.role === 'admin' ? 'Administrator' : 'Customer' }].map(f => (
                      <div key={f.label} className="border border-amber-900/20 rounded-lg p-4">
                        <p className="text-xs text-amber-100/40 uppercase tracking-wider mb-1">{f.label}</p>
                        <p className="text-amber-100">{f.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ORDERS */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="font-luxury text-2xl text-amber-400 mb-4">My Orders</h2>
                {loading ? <p className="text-amber-100/40 text-center py-10">Loading...</p>
                  : orders.length === 0 ? (
                    <div className="glass-card p-10 text-center">
                      <FiPackage size={48} className="text-amber-900/40 mx-auto mb-4" />
                      <p className="text-amber-100/30 font-luxury text-xl mb-4">No Orders Yet</p>
                      <Link to="/shop" className="btn-gold text-xs py-2.5 px-6 inline-flex">Start Shopping</Link>
                    </div>
                  ) : orders.map(order => (
                    <div key={order._id} className="glass-card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="text-amber-100 font-medium text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-amber-100/40 text-xs">{new Date(order.createdAt).toLocaleDateString()} • {order.orderItems?.length} item(s)</p>
                        </div>
                        <div className="text-right">
                          <span className={`badge-gold text-xs ${order.orderStatus === 'Delivered' ? 'bg-emerald-900 text-emerald-300' : order.orderStatus === 'Cancelled' ? 'bg-red-900 text-red-300' : ''}`}>
                            {order.orderStatus}
                          </span>
                          <p className="text-amber-400 font-bold mt-1">₹{order.totalPrice?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {order.orderItems?.slice(0, 3).map(item => (
                          <img key={item._id} src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-amber-900/20" />
                        ))}
                        {order.orderItems?.length > 3 && <span className="text-amber-100/40 text-xs">+{order.orderItems.length - 3} more</span>}
                      </div>
                      <div className="mt-3 text-xs text-amber-100/40">Tracking: <span className="text-amber-400 font-medium">{order.trackingNumber}</span></div>
                    </div>
                  ))}
              </motion.div>
            )}

            {/* WISHLIST */}
            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-luxury text-2xl text-amber-400 mb-6">My Wishlist</h2>
                {loading ? <p className="text-amber-100/40 text-center py-10">Loading...</p>
                  : wishlist.length === 0 ? (
                    <div className="glass-card p-10 text-center">
                      <FiHeart size={48} className="text-amber-900/40 mx-auto mb-4" />
                      <p className="text-amber-100/30 font-luxury text-xl mb-4">Your wishlist is empty</p>
                      <Link to="/shop" className="btn-gold text-xs py-2.5 px-6 inline-flex">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlist.map(p => (
                        <Link key={p._id} to={`/product/${p._id}`} className="glass-card p-4 flex gap-3 hover:border-amber-700/30 transition-all">
                          <img src={p.images?.[0]} alt={p.name} className="w-20 h-20 object-cover rounded-lg" />
                          <div>
                            <p className="text-amber-100 text-sm font-medium mb-1">{p.name}</p>
                            <p className="text-amber-400 font-bold">₹{(p.discountPrice || p.price)?.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
              </motion.div>
            )}

            {/* SECURITY */}
            {activeTab === 'security' && (
              <ChangePasswordForm />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ChangePasswordForm() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.put('/users/change-password', { oldPassword: form.oldPassword, newPassword: form.newPassword });
      toast.success('Password changed successfully!');
      setForm({ oldPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 max-w-md">
      <h2 className="font-luxury text-2xl text-amber-400 mb-6">Change Password</h2>
      <form onSubmit={submit} className="space-y-4">
        {[{ key: 'oldPassword', label: 'Current Password' }, { key: 'newPassword', label: 'New Password' }, { key: 'confirm', label: 'Confirm New Password' }].map(f => (
          <div key={f.key}>
            <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">{f.label}</label>
            <input type="password" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="input-luxury" required minLength={6} />
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-gold py-2.5 px-8 w-full">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </motion.div>
  );
}
