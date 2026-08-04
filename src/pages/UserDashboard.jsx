import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import api, { BASE_URL } from '../api/axios';
import { useAuthStore } from '../store';
import Container from '../components/layout/Container';
import toast from 'react-hot-toast';
import {
  FiUser, FiPackage, FiHeart, FiMapPin, FiLock, FiEdit2, FiStar, FiX,
  FiTruck, FiDownload, FiChevronRight, FiShoppingBag
} from 'react-icons/fi';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

const STATUS_STYLE = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  Processing: 'bg-purple-50 text-purple-700 border-purple-200',
  Shipped: 'bg-orange-50 text-orange-700 border-orange-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  Returned: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function UserDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const [reviewModal, setReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab') || 'profile';
    setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'wishlist') fetchWishlist();
  }, [activeTab]);

  useEffect(() => {
    setFormData({ name: user?.name || '', phone: user?.phone || '' });
  }, [user]);

  const switchTab = (id) => {
    setActiveTab(id);
    setSearchParams(id === 'profile' ? {} : { tab: id });
    setEditMode(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/my-orders');
      setOrders(data.orders);
    } catch {} finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/profile');
      setWishlist(data.user.wishlist || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('phone', formData.phone);
      const { data } = await api.put('/users/profile', fd);
      updateUser(data.user);
      toast.success('Profile updated');
      setEditMode(false);
    } catch {
      toast.error('Failed to update');
    }
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
    } catch {
      toast.error('Invoice not available yet');
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
      images.forEach((img) => fd.append('images', img));

      await api.post(`/products/${productId}/review`, fd);
      toast.success('Thank you for your feedback');
      setReviewModal(false);
      setComment('');
      setRating(5);
      setVideo(null);
      setImages([]);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'security', label: 'Password', icon: FiLock },
  ];

  return (
    <>
      <Helmet>
        <title>Account | Jannat Rugs Co.</title>
      </Helmet>

      <div className="pt-20 sm:pt-24 min-h-screen bg-[#F5F5F5] text-left pb-16">
        <Container className="py-6 sm:py-8">
          {/* Page header — Flipkart/Myntra style */}
          <div className="mb-5 sm:mb-6">
            <p className="text-[11px] text-gray-500 mb-1">
              Home <span className="mx-1">/</span> Account
            </p>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
              Account
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
            {/* Sidebar */}
            <aside className="lg:col-span-3 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-[#FAF7F2]">
                <div className="w-11 h-11 rounded-full bg-[#C9A84C]/25 flex items-center justify-center text-[#1A1A1A] font-semibold text-base shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500">Hello,</p>
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate">{user?.name}</p>
                </div>
              </div>

              <nav className="py-1">
                {TABS.map(({ id, label, icon: Icon }) => {
                  const active = activeTab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => switchTab(id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-[13px] transition-colors cursor-pointer border-l-[3px] ${
                        active
                          ? 'bg-[#FAF7F2] text-[#1A1A1A] font-semibold border-[#C9A84C]'
                          : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-[#1A1A1A]'
                      }`}
                    >
                      <Icon size={16} className={active ? 'text-[#B69640]' : 'text-gray-400'} />
                      {label}
                      <FiChevronRight size={14} className={`ml-auto ${active ? 'text-[#B69640]' : 'text-gray-300'}`} />
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main content */}
            <div className="lg:col-span-9 min-w-0">
              {/* PROFILE */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">Personal Information</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Manage your account details</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center gap-1.5 text-[13px] font-medium text-[#B69640] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      <FiEdit2 size={14} />
                      {editMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="p-4 sm:p-5">
                    {editMode ? (
                      <form onSubmit={updateProfile} className="space-y-4 max-w-md">
                        <div>
                          <label className="text-[12px] font-medium text-gray-600 block mb-1.5">Full Name</label>
                          <input
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[12px] font-medium text-gray-600 block mb-1.5">Phone</label>
                          <input
                            value={formData.phone}
                            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15"
                          />
                        </div>
                        <button
                          type="submit"
                          className="h-11 px-6 rounded-md bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640] transition-colors cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                        {[
                          { label: 'Full Name', value: user?.name },
                          { label: 'Email Address', value: user?.email },
                          { label: 'Mobile Number', value: user?.phone || 'Not added' },
                          { label: 'Account Type', value: user?.role === 'admin' ? 'Administrator' : 'Customer' },
                        ].map((f) => (
                          <div key={f.label} className="text-left">
                            <p className="text-[12px] text-gray-500 mb-1">{f.label}</p>
                            <p className="text-[14px] font-medium text-[#1A1A1A] break-all">{f.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ORDERS */}
              {activeTab === 'orders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 sm:px-5 py-4">
                    <h2 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">My Orders</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Track, review, and download invoices</p>
                  </div>

                  {loading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-10 text-center text-sm text-gray-400">
                      Loading orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
                      <FiShoppingBag size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-[#1A1A1A] mb-1">No orders yet</p>
                      <p className="text-xs text-gray-500 mb-5">Start shopping our handmade collection</p>
                      <Link
                        to="/shop"
                        className="inline-flex h-10 px-5 items-center rounded-md bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640]"
                      >
                        Shop Now
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order._id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100">
                          <div className="text-left">
                            <p className="text-[13px] font-semibold text-[#1A1A1A]">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}{' '}
                              · {order.orderItems?.length} item(s)
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[11px] font-medium px-2.5 py-1 rounded border ${
                                STATUS_STYLE[order.orderStatus] || STATUS_STYLE.Pending
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                            <p className="text-sm font-bold text-[#1A1A1A]">
                              ₹{order.totalPrice?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <div className="px-4 sm:px-5 py-4 flex flex-wrap gap-3">
                          {order.orderItems?.map((item) => (
                            <div key={item._id} className="relative group">
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="w-16 h-16 rounded-md object-cover border border-gray-100"
                              />
                              {order.orderStatus === 'Delivered' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReviewProduct(item.product);
                                    setReviewModal(true);
                                  }}
                                  className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-md text-[10px] text-white font-medium cursor-pointer"
                                >
                                  <FiStar size={12} className="mb-0.5" />
                                  Review
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[12px] text-gray-500 flex items-center gap-1.5">
                            <FiTruck size={13} className="text-gray-400" />
                            Tracking: <span className="text-[#1A1A1A] font-medium">{order.trackingNumber || 'Not assigned'}</span>
                          </p>
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order._id)}
                            className="flex items-center gap-1.5 text-[12px] font-medium text-[#1A1A1A] hover:text-[#B69640] border border-gray-200 px-3 py-1.5 rounded-md hover:border-[#C9A84C]/40 transition-colors cursor-pointer"
                          >
                            <FiDownload size={12} />
                            Invoice
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {/* WISHLIST */}
              {activeTab === 'wishlist' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 sm:px-5 py-4 mb-3">
                    <h2 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">Wishlist</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Saved products for later</p>
                  </div>

                  {loading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-10 text-center text-sm text-gray-400">
                      Loading wishlist...
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
                      <FiHeart size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-[#1A1A1A] mb-1">Your wishlist is empty</p>
                      <p className="text-xs text-gray-500 mb-5">Save rugs you love while browsing</p>
                      <Link
                        to="/shop"
                        className="inline-flex h-10 px-5 items-center rounded-md bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640]"
                      >
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {wishlist.map((p) => (
                        <Link
                          key={p._id}
                          to={`/product/${p._id}`}
                          className="bg-white rounded-lg border border-gray-200 p-3 flex gap-3 hover:border-[#C9A84C]/40 hover:shadow-sm transition-all"
                        >
                          <img
                            src={getImageUrl(p.images?.[0])}
                            alt={p.name}
                            className="w-20 h-20 object-cover rounded-md border border-gray-100 shrink-0"
                          />
                          <div className="min-w-0 text-left flex flex-col justify-center">
                            <p className="text-[13px] font-medium text-[#1A1A1A] line-clamp-2 mb-1">{p.name}</p>
                            <p className="text-sm font-bold text-[#1A1A1A]">
                              ₹{(p.discountPrice || p.price)?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ADDRESSES */}
              {activeTab === 'addresses' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">Saved Addresses</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Delivery addresses for checkout</p>
                  </div>
                  <div className="p-8 sm:p-10 text-center">
                    <FiMapPin size={36} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-[#1A1A1A] mb-1">No saved addresses</p>
                    <p className="text-xs text-gray-500 mb-5 max-w-sm mx-auto">
                      Addresses you add during checkout will appear here for faster ordering.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-flex h-10 px-5 items-center rounded-md bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640]"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* SECURITY */}
              {activeTab === 'security' && <ChangePasswordForm />}
            </div>
          </div>
        </Container>

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

function ReviewModal({
  show,
  onClose,
  product,
  rating,
  setRating,
  comment,
  setComment,
  video,
  setVideo,
  images,
  setImages,
  saving,
  onSubmit,
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            className="bg-white w-full max-w-lg rounded-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto shadow-2xl text-left"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Write a Review</h2>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product?.name}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="flex justify-center gap-1.5 py-3 border-y border-gray-100">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 cursor-pointer"
                  >
                    <FiStar
                      size={28}
                      className={s <= rating ? 'text-[#C9A84C]' : 'text-gray-300'}
                      fill={s <= rating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[12px] font-medium text-gray-600 block mb-1.5">Your review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  placeholder="Share your experience with this rug..."
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 p-3 border border-dashed border-gray-200 rounded-md cursor-pointer hover:border-[#C9A84C]/50">
                  <div className="text-left min-w-0">
                    <p className="text-[12px] font-medium text-[#1A1A1A] truncate">
                      {video ? video.name : 'Add video'}
                    </p>
                    <p className="text-[10px] text-gray-400">Optional · Max 50MB</p>
                  </div>
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideo(e.target.files[0])} />
                </label>
                <label className="flex items-center gap-2.5 p-3 border border-dashed border-gray-200 rounded-md cursor-pointer hover:border-[#C9A84C]/50">
                  <div className="text-left min-w-0">
                    <p className="text-[12px] font-medium text-[#1A1A1A] truncate">
                      {images.length > 0 ? `${images.length} photo(s)` : 'Add photos'}
                    </p>
                    <p className="text-[10px] text-gray-400">Optional · Up to 5</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full h-11 rounded-md bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640] disabled:opacity-60 cursor-pointer"
              >
                {saving ? 'Submitting...' : 'Submit Review'}
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
    if (form.newPassword !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/change-password', {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password updated');
      setForm({ oldPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden max-w-lg"
    >
      <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">Change Password</h2>
        <p className="text-xs text-gray-500 mt-0.5">Keep your account secure</p>
      </div>
      <form onSubmit={submit} className="p-4 sm:p-5 space-y-4">
        {[
          { key: 'oldPassword', label: 'Current Password' },
          { key: 'newPassword', label: 'New Password' },
          { key: 'confirm', label: 'Confirm New Password' },
        ].map((f) => (
          <div key={f.key}>
            <label className="text-[12px] font-medium text-gray-600 block mb-1.5">{f.label}</label>
            <input
              type="password"
              value={form[f.key]}
              onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
              className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15"
              required
              minLength={6}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="h-11 px-6 rounded-md bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640] disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </motion.div>
  );
}
