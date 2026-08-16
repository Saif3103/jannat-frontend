import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import api, { BASE_URL } from '../api/axios';
import { useAuthStore, useSettingsStore } from '../store';
import Container from '../components/layout/Container';
import OrderHistory from '../components/account/OrderHistory';
import toast from 'react-hot-toast';
import {
  FiUser, FiPackage, FiHeart, FiMapPin, FiLock, FiEdit2, FiStar, FiX,
  FiChevronRight, FiCheck, FiPlus, FiTrash2, FiHome, FiHeadphones, FiEye,
} from 'react-icons/fi';
import { LuCrown } from 'react-icons/lu';
import { generateInvoicePdf } from '../utils/generateInvoice';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

const EMPTY_ADDRESS = {
  name: '',
  phone: '',
  email: '',
  house: '',
  street: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  addressType: 'Home',
  isDefault: false,
};

function formatAddressLine(a) {
  return [a.house, a.street, a.landmark, a.city, a.state, a.pincode]
    .filter(Boolean)
    .join(', ');
}

// ─── Field + Label shared style ────────────────────────────────────────────
const inputCls =
  'w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all';
const labelCls = 'text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5';

export default function UserDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [addressSaving, setAddressSaving] = useState(false);
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

  // Member since
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
    : 'May 2024';

  useEffect(() => {
    const tab = searchParams.get('tab') || 'profile';
    setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'wishlist') fetchWishlist();
    if (activeTab === 'addresses' || activeTab === 'profile') fetchAddresses();
  }, [activeTab]);

  useEffect(() => {
    setFormData({ name: user?.name || '', phone: user?.phone || '' });
  }, [user]);

  const switchTab = (id) => {
    setActiveTab(id);
    setSearchParams(id === 'profile' ? {} : { tab: id });
    setEditMode(false);
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/my-orders');
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/profile');
      setWishlist(data.user.wishlist || []);
      if (data.user?.addresses) setAddresses(data.user.addresses);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setAddresses(data.user?.addresses || []);
      if (data.user) updateUser(data.user);
    } catch {
      /* ignore */
    }
  };

  const openNewAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      ...EMPTY_ADDRESS,
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      isDefault: addresses.length === 0,
    });
    setShowAddressForm(true);
  };

  const openEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      ...EMPTY_ADDRESS,
      name: addr.name || '',
      phone: addr.phone || '',
      email: addr.email || '',
      house: addr.house || '',
      street: addr.street || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      country: addr.country || 'India',
      addressType: addr.addressType || addr.label || 'Home',
      isDefault: Boolean(addr.isDefault),
    });
    setShowAddressForm(true);
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.pincode) {
      toast.error('Please fill name, phone, street, city and pincode');
      return;
    }
    setAddressSaving(true);
    try {
      let data;
      if (editingAddressId) {
        ({ data } = await api.put(`/users/address/${editingAddressId}`, addressForm));
      } else {
        ({ data } = await api.post('/users/address', addressForm));
      }
      setAddresses(data.addresses || []);
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm(EMPTY_ADDRESS);
      toast.success(editingAddressId ? 'Address updated' : 'Address saved');
      if (user?._id) {
        localStorage.setItem(
          `jannat_addresses_${user._id}`,
          JSON.stringify(
            (data.addresses || []).map((a) => ({
              ...a,
              id: a._id,
              addressType: a.addressType || a.label || 'Home',
            }))
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save address');
    } finally {
      setAddressSaving(false);
    }
  };

  const removeAddress = async (id) => {
    if (!window.confirm('Remove this address?')) return;
    try {
      const { data } = await api.delete(`/users/address/${id}`);
      setAddresses(data.addresses || []);
      toast.success('Address removed');
      if (user?._id) {
        localStorage.setItem(
          `jannat_addresses_${user._id}`,
          JSON.stringify((data.addresses || []).map((a) => ({ ...a, id: a._id })))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove address');
    }
  };

  const makeDefaultAddress = async (id) => {
    try {
      const { data } = await api.put(`/users/address/${id}/default`);
      setAddresses(data.addresses || []);
      toast.success('Default address updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update default');
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

  const MENU = [
    { id: 'orders',    label: 'Orders',             sub: 'Track, return or buy again',        icon: FiPackage },
    { id: 'profile',   label: 'Profile Information', sub: 'View and update your details',      icon: FiUser },
    { id: 'wishlist',  label: 'Wishlist',            sub: 'Your saved items',                  icon: FiHeart },
    { id: 'addresses', label: 'Manage Addresses',    sub: 'Add, edit or remove addresses',     icon: FiMapPin },
    { id: 'security',  label: 'Password & Security', sub: 'Change password and secure your account', icon: FiLock },
  ];

  const SHORTCUTS = [
    { id: 'orders',    label: 'Orders',          sub: 'Track & manage', icon: FiPackage },
    { id: 'wishlist',  label: 'Wishlist',         sub: 'Saved items',    icon: FiHeart },
    { id: 'recently',  label: 'Recently Viewed',  sub: 'Items you viewed', icon: FiEye },
    { id: 'support',   label: 'Help Center',      sub: 'Support & FAQs', icon: FiHeadphones },
  ];

  const avatar = user?.name?.[0]?.toUpperCase() || 'U';

  // ─── Shared section wrapper ───────────────────────────────────────────────
  const Section = ({ children, className = '' }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {children}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>My Account | Jannat Rugs Co.</title>
      </Helmet>

      <div className="pt-20 sm:pt-24 min-h-screen bg-[#F5F3EE] pb-28 text-left">
        <div className="max-w-lg mx-auto px-3 sm:px-4 py-4 space-y-3">

          {/* ── Hello Card ─────────────────────────────────────────────── */}
          <Section>
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3.5">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border-2 border-[#C9A84C]/30 flex items-center justify-center shrink-0 shadow-sm">
                  {getImageUrl(user?.avatar) ? (
                    <img src={getImageUrl(user.avatar)} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[#C9A84C]">{avatar}</span>
                  )}
                </div>
                {/* Name */}
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Hello,</p>
                  <p className="text-lg font-bold text-[#1A1A1A] leading-tight">{user?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Welcome back! 👋</p>
                </div>
              </div>
              {/* Member badge */}
              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  <LuCrown size={12} className="text-[#C9A84C]" />
                  Member
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">Since {memberSince}</p>
              </div>
            </div>
          </Section>

          {/* ── My Account Menu ─────────────────────────────────────────── */}
          <Section>
            <div className="px-4 pt-4 pb-1">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#C9A84C] mb-2">My Account</p>
            </div>
            <div>
              {MENU.map(({ id, label, sub, icon: Icon }, idx) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => switchTab(id)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 cursor-pointer transition-colors text-left ${
                      active ? 'bg-[#FAF7F2]' : 'hover:bg-gray-50/80'
                    } ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      active ? 'bg-[#C9A84C]/15' : 'bg-gray-100'
                    }`}>
                      <Icon size={17} className={active ? 'text-[#C9A84C]' : 'text-gray-500'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-semibold ${active ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>{label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                    </div>
                    <FiChevronRight size={16} className="text-gray-300 shrink-0" />
                  </button>
                );
              })}
            </div>
          </Section>

          {/* ── Profile Tab Content ─────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">

                {/* Personal Information */}
                <Section>
                  <div className="flex items-center justify-between px-4 pt-4 pb-1">
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#C9A84C]">Personal Information</p>
                    <button
                      type="button"
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#C9A84C] hover:text-[#B69640] cursor-pointer"
                    >
                      <FiEdit2 size={12} />
                      {editMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="px-4 pb-4 pt-2">
                    {editMode ? (
                      <form onSubmit={updateProfile} className="space-y-3">
                        <div>
                          <label className={labelCls}>Full Name</label>
                          <input
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            className={inputCls}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Mobile Number</label>
                          <input
                            value={formData.phone}
                            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                            className={inputCls}
                            placeholder="Enter mobile number"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="submit"
                            className="flex-1 h-10 bg-[#1A1A1A] text-white text-sm font-semibold rounded-xl hover:bg-black cursor-pointer"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEditMode(false); setFormData({ name: user?.name || '', phone: user?.phone || '' }); }}
                            className="flex-1 h-10 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        {/* Full Name */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <FiUser size={15} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-400">Full Name</p>
                            <p className="text-sm font-semibold text-[#1A1A1A]">{user?.name || '—'}</p>
                          </div>
                        </div>
                        {/* Email */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-400">Email Address</p>
                            <p className="text-sm font-semibold text-[#1A1A1A] break-all">{user?.email || '—'}</p>
                          </div>
                        </div>
                        {/* Phone */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-400">Mobile Number</p>
                            <p className="text-sm font-semibold text-[#1A1A1A]">
                              {user?.phone || (
                                <button type="button" onClick={() => setEditMode(true)} className="text-[#C9A84C] text-xs font-semibold cursor-pointer">
                                  + Add number
                                </button>
                              )}
                            </p>
                          </div>
                        </div>
                        {/* Email verified */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] text-gray-400">Email</p>
                            <p className="text-sm font-semibold text-[#1A1A1A] break-all">{user?.email || '—'}</p>
                          </div>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full shrink-0">
                            <FiCheck size={10} />
                            Verified
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Section>

                {/* Shortcuts */}
                <Section>
                  <div className="px-4 pt-4 pb-1">
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#C9A84C]">Shortcuts</p>
                  </div>
                  <div className="grid grid-cols-4 divide-x divide-gray-100 border-t border-gray-100 mt-2">
                    {SHORTCUTS.map(({ id, label, sub, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => id !== 'recently' && id !== 'support' ? switchTab(id) : undefined}
                        className="flex flex-col items-center gap-2 px-2 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center">
                          <Icon size={18} className="text-[#1A1A1A]" />
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] font-semibold text-[#1A1A1A] leading-tight">{label}</p>
                          <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </Section>

              </motion.div>
            )}

            {/* ── Orders Tab ────────────────────────────────────────────── */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <OrderHistory
                  orders={orders}
                  loading={loading}
                  orderFilter={orderFilter}
                  setOrderFilter={setOrderFilter}
                  onInvoice={handleDownloadInvoice}
                  onReview={(product) => {
                    setReviewProduct(product);
                    setReviewModal(true);
                  }}
                />
              </motion.div>
            )}

            {/* ── Wishlist Tab ───────────────────────────────────────────── */}
            {activeTab === 'wishlist' && (
              <motion.div key="wishlist" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <Section>
                  <div className="px-4 pt-4 pb-2">
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#C9A84C]">Wishlist</p>
                    <p className="text-xs text-gray-400 mt-0.5">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
                  </div>

                  {loading ? (
                    <div className="p-10 text-center text-sm text-gray-400">Loading...</div>
                  ) : wishlist.length === 0 ? (
                    <div className="p-10 text-center">
                      <FiHeart size={36} className="text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-[#1A1A1A] mb-1">Your wishlist is empty</p>
                      <p className="text-xs text-gray-400 mb-4">Save items you love while shopping</p>
                      <Link to="/shop" className="inline-flex h-10 px-5 items-center bg-[#1A1A1A] text-white text-sm font-semibold rounded-xl hover:bg-black">
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 border-t border-gray-100">
                      {wishlist.map((p) => (
                        <Link key={p._id} to={`/product/${p._id}`} className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <img src={getImageUrl(p.images?.[0]) || 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=200'} alt={p.name} className="w-16 h-16 object-cover rounded-xl border border-gray-100 shrink-0" />
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-sm font-semibold text-[#1A1A1A] line-clamp-2">{p.name}</p>
                            <p className="text-sm font-bold text-[#1A1A1A] mt-1">₹{(p.discountPrice || p.price)?.toLocaleString('en-IN')}</p>
                          </div>
                          <FiChevronRight size={16} className="text-gray-300 shrink-0 self-center" />
                        </Link>
                      ))}
                    </div>
                  )}
                </Section>
              </motion.div>
            )}

            {/* ── Addresses Tab ─────────────────────────────────────────── */}
            {activeTab === 'addresses' && (
              <motion.div key="addresses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <Section>
                  <div className="flex items-center justify-between px-4 pt-4 pb-1">
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#C9A84C]">Manage Addresses</p>
                    {!showAddressForm && (
                      <button
                        type="button"
                        onClick={openNewAddress}
                        className="flex items-center gap-1 text-xs font-semibold text-[#C9A84C] cursor-pointer"
                      >
                        <FiPlus size={12} /> Add New
                      </button>
                    )}
                  </div>

                  {showAddressForm && (
                    <form onSubmit={saveAddress} className="px-4 pb-4 pt-2 space-y-3 border-t border-gray-100 mt-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#1A1A1A]">{editingAddressId ? 'Edit Address' : 'New Address'}</p>
                        <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }} className="p-1 text-gray-400 hover:text-[#1A1A1A] cursor-pointer"><FiX size={16} /></button>
                      </div>
                      <div className="flex gap-2">
                        {['Home', 'Work', 'Other'].map((t) => (
                          <button key={t} type="button" onClick={() => setAddressForm((p) => ({ ...p, addressType: t }))}
                            className={`h-8 px-3.5 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${addressForm.addressType === t ? 'border-[#C9A84C] text-[#C9A84C] bg-[#FAF7F2]' : 'border-gray-200 text-gray-500'}`}>{t}</button>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { key: 'name', label: 'Full Name *', placeholder: 'Full name' },
                          { key: 'phone', label: 'Mobile Number *', placeholder: 'Mobile number' },
                          { key: 'email', label: 'Email', placeholder: 'Email (optional)' },
                          { key: 'house', label: 'House / Flat *', placeholder: 'Flat, House no.' },
                          { key: 'street', label: 'Street / Area *', placeholder: 'Street, Area', full: true },
                          { key: 'landmark', label: 'Landmark', placeholder: 'Nearby landmark' },
                          { key: 'city', label: 'City *', placeholder: 'City' },
                          { key: 'state', label: 'State', placeholder: 'State' },
                          { key: 'pincode', label: 'Pincode *', placeholder: 'Pincode' },
                        ].map((f) => (
                          <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                            <label className={labelCls}>{f.label}</label>
                            <input value={addressForm[f.key]} onChange={(e) => setAddressForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className={inputCls} />
                          </div>
                        ))}
                      </div>
                      <label className="flex items-center gap-2 text-xs text-[#1A1A1A] cursor-pointer">
                        <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))} className="w-4 h-4 accent-[#C9A84C]" />
                        Make default address
                      </label>
                      <div className="flex gap-2 pt-1">
                        <button type="submit" disabled={addressSaving} className="flex-1 h-10 bg-[#1A1A1A] text-white text-sm font-semibold rounded-xl hover:bg-black disabled:opacity-60 cursor-pointer">
                          {addressSaving ? 'Saving...' : 'Save Address'}
                        </button>
                        <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }} className="flex-1 h-10 border border-gray-200 text-sm font-semibold rounded-xl cursor-pointer">Cancel</button>
                      </div>
                    </form>
                  )}

                  {!showAddressForm && addresses.length === 0 && (
                    <div className="p-10 text-center border-t border-gray-100 mt-1">
                      <FiMapPin size={32} className="text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-[#1A1A1A] mb-1">No addresses saved</p>
                      <p className="text-xs text-gray-400 mb-4">Add one for faster checkout</p>
                      <button type="button" onClick={openNewAddress} className="h-10 px-5 bg-[#1A1A1A] text-white text-sm font-semibold rounded-xl cursor-pointer">Add Address</button>
                    </div>
                  )}

                  {!showAddressForm && addresses.length > 0 && (
                    <div className="divide-y divide-gray-100 border-t border-gray-100 mt-1">
                      {addresses.map((addr) => (
                        <div key={addr._id} className="px-4 py-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                              {addr.addressType || addr.label || 'Home'}
                            </span>
                            {addr.isDefault && <span className="text-[10px] font-semibold text-[#C9A84C]">Default</span>}
                          </div>
                          <p className="text-sm font-semibold text-[#1A1A1A]">{addr.name || '—'}{addr.phone ? <span className="font-normal text-gray-500"> · {addr.phone}</span> : null}</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{formatAddressLine(addr)}</p>
                          <div className="flex gap-4 mt-2.5">
                            <button type="button" onClick={() => openEditAddress(addr)} className="text-xs font-semibold text-[#C9A84C] cursor-pointer">Edit</button>
                            {!addr.isDefault && <button type="button" onClick={() => makeDefaultAddress(addr._id)} className="text-xs font-semibold text-gray-500 cursor-pointer">Set Default</button>}
                            <button type="button" onClick={() => removeAddress(addr._id)} className="text-xs font-semibold text-red-400 cursor-pointer">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>
              </motion.div>
            )}

            {/* ── Security Tab ──────────────────────────────────────────── */}
            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ChangePasswordForm />
              </motion.div>
            )}
          </AnimatePresence>
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

function ReviewModal({
  show, onClose, product,
  rating, setRating, comment, setComment,
  video, setVideo, images, setImages,
  saving, onSubmit,
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            className="bg-white w-full max-w-lg rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto shadow-2xl text-left"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">Write a Review</h2>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product?.name}</p>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer"><FiX size={18} /></button>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="flex justify-center gap-1.5 py-3 border-y border-gray-100">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)} className="p-1 cursor-pointer">
                    <FiStar size={28} className={s <= rating ? 'text-[#C9A84C]' : 'text-gray-300'} fill={s <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Your review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required rows={4}
                  placeholder="Share your experience with this rug..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 p-3 border border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#C9A84C]/50">
                  <div className="text-left min-w-0">
                    <p className="text-xs font-semibold text-[#1A1A1A] truncate">{video ? video.name : 'Add video'}</p>
                    <p className="text-[10px] text-gray-400">Optional · Max 50MB</p>
                  </div>
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideo(e.target.files[0])} />
                </label>
                <label className="flex items-center gap-2.5 p-3 border border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#C9A84C]/50">
                  <div className="text-left min-w-0">
                    <p className="text-xs font-semibold text-[#1A1A1A] truncate">{images.length > 0 ? `${images.length} photo(s)` : 'Add photos'}</p>
                    <p className="text-[10px] text-gray-400">Optional · Up to 5</p>
                  </div>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))} />
                </label>
              </div>

              <button type="submit" disabled={saving} className="w-full h-11 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-black disabled:opacity-60 cursor-pointer">
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 pt-4 pb-1">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#C9A84C]">Password & Security</p>
      </div>
      <form onSubmit={submit} className="px-4 pb-4 pt-2 space-y-3 border-t border-gray-100 mt-1">
        {[
          { key: 'oldPassword', label: 'Current Password' },
          { key: 'newPassword', label: 'New Password' },
          { key: 'confirm', label: 'Confirm New Password' },
        ].map((f) => (
          <div key={f.key}>
            <label className={labelCls}>{f.label}</label>
            <input
              type="password"
              value={form[f.key]}
              onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
              className={inputCls}
              required
              minLength={6}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#1A1A1A] text-white text-sm font-semibold rounded-xl hover:bg-black disabled:opacity-60 cursor-pointer mt-2"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
