import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import api, { BASE_URL } from '../api/axios';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiLock, FiEdit2, FiStar, FiX, FiUpload, FiTruck, FiShield, FiSend, FiDownload } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

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

  // Review states
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

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

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/invoices/order/${orderId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Invoice not generated yet or failed to download');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewProduct) return;
    const productId = reviewProduct?._id || reviewProduct;
    if (!productId || productId === 'undefined') {
      toast.error('Invalid product information');
      return;
    }
    
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('rating', rating);
      fd.append('comment', comment);
      if (video) {
        if (video.size > 50 * 1024 * 1024) {
          toast.error('Video size should be less than 50MB');
          setSaving(false);
          return;
        }
        fd.append('video', video);
      }
      images.forEach(img => fd.append('images', img));

      await api.post(`/products/${productId}/review`, fd);
      toast.success('Thank you for your feedback!');
      setReviewModal(false);
      setComment(''); setRating(5); setVideo(null); setImages([]);
      fetchOrders(); // Refresh to reflect reviewed status (if backend handled alreadyReviewed)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSaving(false); }
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
              <div className="w-20 h-20 rounded-full bg-amber-900/30 flex items-center justify-center text-[#1A1A1A] font-bold text-3xl font-luxury mx-auto mb-3">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <p className="text-[#1A1A1A] font-medium">{user?.name}</p>
              <p className="text-[#1A1A1A]/40 text-xs truncate">{user?.email}</p>
            </div>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all mb-1 ${activeTab === id ? 'bg-amber-500/15 text-[#1A1A1A] border-l-2 border-amber-500' : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-amber-500/5'}`}>
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
                  <h2 className="font-luxury text-2xl text-[#1A1A1A]">Profile Information</h2>
                  <button onClick={() => setEditMode(!editMode)} className="flex items-center gap-2 btn-outline-gold text-xs py-2 px-4">
                    <FiEdit2 size={13} /> {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editMode ? (
                  <form onSubmit={updateProfile} className="space-y-4 max-w-md">
                    <div>
                      <label className="text-xs text-[#1A1A1A]/50 block mb-1.5 uppercase tracking-wider">Full Name</label>
                      <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="input-luxury" required />
                    </div>
                    <div>
                      <label className="text-xs text-[#1A1A1A]/50 block mb-1.5 uppercase tracking-wider">Phone</label>
                      <input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="input-luxury" />
                    </div>
                    <button type="submit" className="btn-gold py-2.5 px-8">Save Changes</button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{ label: 'Full Name', value: user?.name }, { label: 'Email', value: user?.email }, { label: 'Phone', value: user?.phone || 'Not set' }, { label: 'Account Type', value: user?.role === 'admin' ? 'Administrator' : 'Customer' }].map(f => (
                      <div key={f.label} className="border border-amber-900/20 rounded-lg p-4">
                        <p className="text-xs text-[#1A1A1A]/40 uppercase tracking-wider mb-1">{f.label}</p>
                        <p className="text-[#1A1A1A]">{f.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ORDERS */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="font-luxury text-2xl text-[#1A1A1A] mb-4">My Orders</h2>
                {loading ? <p className="text-[#1A1A1A]/40 text-center py-10">Loading...</p>
                  : orders.length === 0 ? (
                    <div className="glass-card p-10 text-center">
                      <FiPackage size={48} className="text-[#1A1A1A]/40 mx-auto mb-4" />
                      <p className="text-[#1A1A1A]/30 font-luxury text-xl mb-4">No Orders Yet</p>
                      <Link to="/shop" className="btn-gold text-xs py-2.5 px-6 inline-flex">Start Shopping</Link>
                    </div>
                  ) : orders.map(order => (
                    <div key={order._id} className="glass-card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="text-[#1A1A1A] font-medium text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-[#1A1A1A]/40 text-xs">{new Date(order.createdAt).toLocaleDateString()} • {order.orderItems?.length} item(s)</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className={`badge-gold text-xs ${order.orderStatus === 'Delivered' ? 'bg-emerald-900 text-emerald-300' : order.orderStatus === 'Cancelled' ? 'bg-red-900 text-red-300' : ''}`}>
                            {order.orderStatus}
                          </span>
                          <p className="text-[#1A1A1A] font-bold mt-1 mb-2">₹{order.totalPrice?.toLocaleString()}</p>
                          <button onClick={() => handleDownloadInvoice(order._id)} className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A] hover:text-amber-600 transition-colors flex items-center gap-1 border border-[#1A1A1A]/20 px-2 py-1 rounded">
                            <FiDownload size={10} /> INVOICE
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {order.orderItems?.map(item => (
                          <div key={item._id} className="relative group">
                            <img src={getImageUrl(item.image)} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-amber-900/20" />
                            {order.orderStatus === 'Delivered' && (
                              <button 
                                onClick={() => { setReviewProduct(item.product); setReviewModal(true); }}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-xl text-[10px] text-[#1A1A1A] font-bold"
                              >
                                <FiStar size={12} className="mb-0.5" /> REVIEW
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest">Tracking: <span className="text-[#1A1A1A] font-medium">{order.trackingNumber || 'N/A'}</span></div>
                        {order.orderStatus === 'Delivered' && (
                          <p className="text-[9px] text-[#1A1A1A] font-bold uppercase tracking-widest">Click item to Review</p>
                        )}
                      </div>
                    </div>
                  ))}
              </motion.div>
            )}

            {/* WISHLIST */}
            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-luxury text-2xl text-[#1A1A1A] mb-6">My Wishlist</h2>
                {loading ? <p className="text-[#1A1A1A]/40 text-center py-10">Loading...</p>
                  : wishlist.length === 0 ? (
                    <div className="glass-card p-10 text-center">
                      <FiHeart size={48} className="text-[#1A1A1A]/40 mx-auto mb-4" />
                      <p className="text-[#1A1A1A]/30 font-luxury text-xl mb-4">Your wishlist is empty</p>
                      <Link to="/shop" className="btn-gold text-xs py-2.5 px-6 inline-flex">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlist.map(p => (
                        <Link key={p._id} to={`/product/${p._id}`} className="glass-card p-4 flex gap-3 hover:border-amber-700/30 transition-all">
                          <img src={p.images?.[0]} alt={p.name} className="w-20 h-20 object-cover rounded-lg" />
                          <div>
                            <p className="text-[#1A1A1A] text-sm font-medium mb-1">{p.name}</p>
                            <p className="text-[#1A1A1A] font-bold">₹{(p.discountPrice || p.price)?.toLocaleString()}</p>
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

        <ReviewModal 
          show={reviewModal} 
          onClose={() => setReviewModal(false)}
          product={reviewProduct}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          video={video}
          setVideo={setVideo}
          images={images}
          setImages={setImages}
          saving={saving}
          onSubmit={handleReviewSubmit}
        />
      </div>
    </>
  );
}

function ReviewModal({ show, onClose, product, rating, setRating, comment, setComment, video, setVideo, images, setImages, saving, onSubmit }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="glass-card w-full max-w-xl rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto border-amber-500/20 shadow-[0_0_100px_rgba(201,168,76,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-luxury text-2xl text-[#1A1A1A]">Verified Experience</h2>
                <p className="text-[10px] text-[#1A1A1A]/30 uppercase tracking-[0.2em] mt-1">Reviewing: {product?.name}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-[#1A1A1A]/40"><FiX size={20} /></button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Rating */}
              <div className="flex justify-center gap-2 py-4 border-y border-amber-900/10">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setRating(s)} className="transition-transform hover:scale-125">
                    <FiStar size={32} className={s <= rating ? 'text-[#1A1A1A] fill-amber-400 shadow-lg' : 'text-[#1A1A1A]'} fill={s <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>

              {/* Comment */}
              <div>
                <label className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest block mb-2">Detailed Feedback</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={4}
                  placeholder="Tell us about the texture, color depth, and how it complements your room..."
                  className="w-full bg-white/5 border border-amber-900/20 rounded-2xl px-5 py-4 text-sm text-[#1A1A1A] focus:outline-none focus:border-amber-500/40 transition-all resize-none" />
              </div>

              {/* Media Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest block mb-2">Video Experience</label>
                  <label className="flex items-center gap-3 p-3 border border-dashed border-amber-900/30 rounded-2xl cursor-pointer hover:border-amber-500/50 bg-white/5 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#1A1A1A]"><FiTruck size={18} /></div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] text-[#1A1A1A]/80 font-medium truncate">{video ? video.name : 'Upload Video'}</p>
                      <p className="text-[8px] text-[#1A1A1A]/30">VERIFIED VIDEO REVIEW</p>
                    </div>
                    <input type="file" accept="video/*" className="hidden" onChange={e => setVideo(e.target.files[0])} />
                  </label>
                </div>
                <div>
                  <label className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest block mb-2">Visual Gallery ({images.length}/5)</label>
                  <label className="flex items-center gap-3 p-3 border border-dashed border-amber-900/30 rounded-2xl cursor-pointer hover:border-amber-500/50 bg-white/5 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#1A1A1A]"><FiHeart size={18} /></div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] text-[#1A1A1A]/80 font-medium truncate">{images.length > 0 ? `${images.length} Photos selected` : 'Upload Photos'}</p>
                      <p className="text-[8px] text-[#1A1A1A]/30">HIGH-QUALITY IMAGES</p>
                    </div>
                    <input type="file" accept="image/*" multiple className="hidden" 
                      onChange={e => setImages(Array.from(e.target.files).slice(0, 5))} />
                  </label>
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full btn-gold py-4 rounded-2xl font-luxury text-lg tracking-widest shadow-xl shadow-amber-500/10">
                {saving ? 'Publishing Review...' : 'Post Verified Review'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
      <h2 className="font-luxury text-2xl text-[#1A1A1A] mb-6">Change Password</h2>
      <form onSubmit={submit} className="space-y-4">
        {[{ key: 'oldPassword', label: 'Current Password' }, { key: 'newPassword', label: 'New Password' }, { key: 'confirm', label: 'Confirm New Password' }].map(f => (
          <div key={f.key}>
            <label className="text-xs text-[#1A1A1A]/50 block mb-1.5 uppercase tracking-wider">{f.label}</label>
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
