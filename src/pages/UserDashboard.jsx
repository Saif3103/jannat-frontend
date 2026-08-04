import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import api, { BASE_URL } from '../api/axios';
import { useAuthStore, useSettingsStore } from '../store';
import Container from '../components/layout/Container';
import toast from 'react-hot-toast';
import {
  FiUser, FiPackage, FiHeart, FiMapPin, FiLock, FiEdit2, FiStar, FiX,
  FiTruck, FiDownload, FiChevronRight, FiShoppingBag, FiCheck, FiClock,
  FiUpload, FiPhone,
} from 'react-icons/fi';
import { generateInvoicePdf } from '../utils/generateInvoice';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

const TRACK_STEPS = ['Ordered', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const PAYMENT_LABELS = {
  COD: 'Cash on Delivery',
  BankTransfer: 'Bank Transfer',
  PayAfterConfirm: 'Pay After Confirm',
  Razorpay: 'Online',
  UPI: 'UPI',
  Card: 'Card',
  Wallet: 'Wallet',
};

function getFriendlyStatus(order) {
  const os = order.orderStatus || 'Pending';
  const ps = order.paymentStatus || '';
  const method = order.paymentMethod || '';

  if (os === 'Cancelled') {
    return {
      label: 'Cancelled',
      hint: 'This order was cancelled',
      tone: 'bg-red-50 text-red-700 border-red-200',
      group: 'cancelled',
    };
  }
  if (os === 'Returned') {
    return {
      label: 'Returned',
      hint: 'Return completed',
      tone: 'bg-gray-50 text-gray-600 border-gray-200',
      group: 'cancelled',
    };
  }
  if (os === 'Delivered') {
    return {
      label: 'Delivered',
      hint: order.deliveredAt
        ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
        : 'Your order has been delivered',
      tone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      group: 'delivered',
    };
  }
  if (os === 'Shipped' || os === 'Out for Delivery') {
    return {
      label: os === 'Out for Delivery' ? 'Out for Delivery' : 'Shipped',
      hint: order.trackingNumber
        ? `Tracking: ${order.trackingNumber}`
        : 'Your order is on the way',
      tone: 'bg-sky-50 text-sky-700 border-sky-200',
      group: 'shipped',
    };
  }
  if (method === 'BankTransfer' && (ps === 'AwaitingProof' || os === 'Awaiting Payment')) {
    return {
      label: 'Awaiting Payment',
      hint: 'Upload bank transfer proof to continue',
      tone: 'bg-amber-50 text-amber-800 border-amber-200',
      group: 'pending',
      action: 'proof',
    };
  }
  if (method === 'BankTransfer' && (ps === 'UnderReview' || os === 'Payment Pending')) {
    return {
      label: 'Payment Under Review',
      hint: 'We are verifying your payment proof',
      tone: 'bg-blue-50 text-blue-700 border-blue-200',
      group: 'pending',
    };
  }
  if (
    os === 'Awaiting Confirmation' ||
    (method === 'PayAfterConfirm' && ['Pending', 'Awaiting Confirmation'].includes(os))
  ) {
    return {
      label: 'Awaiting Confirmation',
      hint: 'Our team will call you to confirm this order',
      tone: 'bg-violet-50 text-violet-700 border-violet-200',
      group: 'pending',
      action: 'call',
    };
  }
  if (['Confirmed', 'Paid', 'Payment Received'].includes(os)) {
    return {
      label: 'Confirmed',
      hint: 'Order confirmed — preparing for packing',
      tone: 'bg-blue-50 text-blue-700 border-blue-200',
      group: 'pending',
    };
  }
  if (['Processing', 'Quality Check', 'Packed'].includes(os)) {
    return {
      label: os === 'Packed' ? 'Packed' : 'Processing',
      hint: 'Your rug is being prepared with care',
      tone: 'bg-purple-50 text-purple-700 border-purple-200',
      group: 'pending',
    };
  }
  return {
    label: os || 'Ordered',
    hint: 'We have received your order',
    tone: 'bg-amber-50 text-amber-700 border-amber-200',
    group: 'pending',
  };
}

function getTrackStepIndex(order) {
  const os = (order.orderStatus || '').toLowerCase();
  if (os.includes('cancel') || os.includes('return')) return -1;
  if (os.includes('deliver')) return 4;
  if (os.includes('out for') || os.includes('ship')) return 3;
  if (os.includes('pack') || os.includes('quality') || os.includes('process')) return 2;
  if (
    os.includes('confirm') ||
    os.includes('paid') ||
    os.includes('payment received') ||
    (order.paymentMethod === 'BankTransfer' && order.paymentStatus === 'Verified')
  ) {
    return 1;
  }
  return 0;
}

export default function UserDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
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

  const handleDownloadInvoice = async (order) => {
    try {
      generateInvoicePdf(order, useSettingsStore.getState().settings || {});
      toast.success('Invoice downloaded');
    } catch {
      toast.error('Could not generate invoice');
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

              {/* ORDERS — Flipkart-style tracking */}
              {activeTab === 'orders' && (() => {
                const FILTERS = [
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: 'In Progress' },
                  { id: 'shipped', label: 'Shipped' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'cancelled', label: 'Cancelled' },
                ];
                const filtered = orders.filter((o) => {
                  if (orderFilter === 'all') return true;
                  return getFriendlyStatus(o).group === orderFilter;
                });

                return (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 sm:px-5 py-4">
                      <h2 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">My Orders</h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Track status step-by-step — clear updates & easy actions
                      </p>
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
                        {FILTERS.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setOrderFilter(f.id)}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors cursor-pointer ${
                              orderFilter === f.id
                                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
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
                    ) : filtered.length === 0 ? (
                      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
                        No orders in this filter
                      </div>
                    ) : (
                      filtered.map((order) => {
                        const status = getFriendlyStatus(order);
                        const stepIdx = getTrackStepIndex(order);
                        const isOpen = expandedOrder === order._id;
                        const displayId =
                          order.orderIdDisplay ||
                          order.trackingNumber ||
                          `#${String(order._id).slice(-8).toUpperCase()}`;
                        const history = order.statusHistory?.length
                          ? [...order.statusHistory].reverse()
                          : [
                              {
                                status: order.orderStatus,
                                message: status.hint,
                                timestamp: order.createdAt,
                              },
                            ];

                        return (
                          <div
                            key={order._id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-gray-100 bg-[#FAFAFA]">
                              <div>
                                <p className="text-[13px] font-semibold text-[#1A1A1A]">{displayId}</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                  {' · '}
                                  {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod || 'COD'}
                                </p>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full border ${status.tone}`}
                                >
                                  {status.label}
                                </span>
                                <p className="text-sm font-bold text-[#1A1A1A] mt-1.5">
                                  ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>

                            <div className="px-4 sm:px-5 pt-3 flex items-start gap-2">
                              {status.action === 'proof' ? (
                                <FiUpload size={14} className="text-amber-600 mt-0.5 shrink-0" />
                              ) : status.action === 'call' ? (
                                <FiPhone size={14} className="text-violet-600 mt-0.5 shrink-0" />
                              ) : stepIdx >= 4 ? (
                                <FiCheck size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                              ) : (
                                <FiClock size={14} className="text-[#C9A84C] mt-0.5 shrink-0" />
                              )}
                              <p className="text-[13px] text-gray-700 leading-snug">{status.hint}</p>
                            </div>

                            {stepIdx >= 0 && (
                              <div className="px-4 sm:px-5 py-4">
                                <div className="flex items-start justify-between gap-1">
                                  {TRACK_STEPS.map((label, i) => {
                                    const done = i <= stepIdx;
                                    const current = i === stepIdx;
                                    return (
                                      <div key={label} className="flex-1 flex flex-col items-center min-w-0 relative">
                                        {i < TRACK_STEPS.length - 1 && (
                                          <div
                                            className={`absolute top-[9px] left-[50%] right-[-50%] h-0.5 ${
                                              i < stepIdx ? 'bg-emerald-500' : 'bg-gray-200'
                                            }`}
                                          />
                                        )}
                                        <div
                                          className={`relative z-[1] w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 ${
                                            done
                                              ? 'bg-emerald-500 border-emerald-500 text-white'
                                              : 'bg-white border-gray-300'
                                          } ${current && done ? 'ring-2 ring-emerald-200' : ''}`}
                                        >
                                          {done && <FiCheck size={10} strokeWidth={3} />}
                                        </div>
                                        <p
                                          className={`mt-1.5 text-[9px] sm:text-[10px] text-center leading-tight px-0.5 ${
                                            done ? 'text-emerald-700 font-semibold' : 'text-gray-400'
                                          }`}
                                        >
                                          {label}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="px-4 sm:px-5 pb-3 space-y-3">
                              {order.orderItems?.map((item, idx) => (
                                <div key={item._id || idx} className="flex gap-3">
                                  <img
                                    src={getImageUrl(item.image)}
                                    alt={item.name}
                                    className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-lg object-cover border border-gray-100 shrink-0"
                                  />
                                  <div className="min-w-0 flex-1 text-left">
                                    <p className="text-[13px] font-medium text-[#1A1A1A] line-clamp-2">
                                      {item.name}
                                    </p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                      {[item.size, item.color].filter(Boolean).join(' · ') || 'Handmade rug'}
                                      {' · Qty '}
                                      {item.quantity || 1}
                                    </p>
                                    <p className="text-[13px] font-semibold text-[#1A1A1A] mt-1">
                                      ₹{Number(item.price || 0).toLocaleString('en-IN')}
                                    </p>
                                  </div>
                                  {order.orderStatus === 'Delivered' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReviewProduct(item.product);
                                        setReviewModal(true);
                                      }}
                                      className="self-start shrink-0 text-[11px] font-medium text-[#B69640] border border-[#C9A84C]/40 px-2.5 py-1 rounded-md hover:bg-[#C9A84C]/10 cursor-pointer"
                                    >
                                      <span className="inline-flex items-center gap-1">
                                        <FiStar size={11} /> Rate
                                      </span>
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className="px-4 sm:px-5 py-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
                              {status.action === 'proof' && (
                                <Link
                                  to={`/payment-proof/${order._id}`}
                                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] text-[12px] font-semibold hover:bg-[#B69640]"
                                >
                                  <FiUpload size={13} />
                                  Upload Payment Proof
                                </Link>
                              )}
                              <button
                                type="button"
                                onClick={() => setExpandedOrder(isOpen ? null : order._id)}
                                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 text-[12px] font-medium text-[#1A1A1A] hover:border-[#C9A84C]/50 cursor-pointer"
                              >
                                <FiTruck size={13} />
                                {isOpen ? 'Hide details' : 'Track details'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadInvoice(order)}
                                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 text-[12px] font-medium text-[#1A1A1A] hover:border-[#C9A84C]/50 cursor-pointer"
                              >
                                <FiDownload size={13} />
                                Invoice
                              </button>
                              <Link
                                to="/shop"
                                className="inline-flex items-center gap-1 h-9 px-3 rounded-lg text-[12px] font-medium text-gray-500 hover:text-[#1A1A1A]"
                              >
                                Buy again <FiChevronRight size={13} />
                              </Link>
                            </div>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden border-t border-gray-100 bg-[#FAFAFA]"
                                >
                                  <div className="px-4 sm:px-5 py-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">
                                      Order updates
                                    </p>
                                    {history.map((h, i) => (
                                      <div key={i} className="flex gap-3 pb-3 last:pb-0">
                                        <div className="flex flex-col items-center">
                                          <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-1.5" />
                                          {i < history.length - 1 && (
                                            <div className="w-px flex-1 bg-gray-200 my-1" />
                                          )}
                                        </div>
                                        <div className="pb-1">
                                          <p className="text-[13px] font-medium text-[#1A1A1A]">{h.status}</p>
                                          {h.message && (
                                            <p className="text-[12px] text-gray-500 mt-0.5">{h.message}</p>
                                          )}
                                          <p className="text-[11px] text-gray-400 mt-0.5">
                                            {h.timestamp
                                              ? new Date(h.timestamp).toLocaleString('en-IN', {
                                                  day: 'numeric',
                                                  month: 'short',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                                })
                                              : ''}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                    {order.shippingAddress && (
                                      <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                                          Delivery address
                                        </p>
                                        <p className="text-[12px] text-gray-700 leading-relaxed">
                                          {order.shippingAddress.name}
                                          {order.shippingAddress.phone
                                            ? ` · ${order.shippingAddress.phone}`
                                            : ''}
                                          <br />
                                          {[
                                            order.shippingAddress.street || order.shippingAddress.house,
                                            order.shippingAddress.city,
                                            order.shippingAddress.state,
                                            order.shippingAddress.pincode,
                                          ]
                                            .filter(Boolean)
                                            .join(', ')}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    )}
                  </motion.div>
                );
              })()}

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
