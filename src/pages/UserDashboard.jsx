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
  FiChevronRight, FiCheck, FiPlus, FiTrash2, FiHome,
} from 'react-icons/fi';
import { generateInvoicePdf } from '../utils/generateInvoice';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800';
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
      // Keep checkout local cache in sync
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                              className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[12px] font-medium text-gray-600 block mb-1.5">Phone</label>
                            <input
                              value={formData.phone}
                              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                              className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15"
                            />
                          </div>
                          <button
                            type="submit"
                            className="h-11 px-6 rounded-lg bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640] transition-colors cursor-pointer"
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
                  </div>

                  {/* Addresses preview on profile */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
                      <div>
                        <h2 className="text-base font-semibold text-[#1A1A1A]">Delivery Addresses</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Saved for faster checkout</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          switchTab('addresses');
                          setTimeout(openNewAddress, 0);
                        }}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#C9A84C] text-[#1A1A1A] text-[12px] font-semibold hover:bg-[#B69640] cursor-pointer"
                      >
                        <FiPlus size={14} /> Add
                      </button>
                    </div>
                    <div className="p-4 sm:p-5">
                      {addresses.length === 0 ? (
                        <div className="text-center py-6">
                          <FiMapPin size={28} className="text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-3">No address saved yet</p>
                          <button
                            type="button"
                            onClick={() => switchTab('addresses')}
                            className="text-[13px] font-medium text-[#B69640] cursor-pointer"
                          >
                            Add your first address →
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {addresses.slice(0, 2).map((addr) => (
                            <div
                              key={addr._id}
                              className="rounded-xl border border-gray-100 bg-[#FAFAFA] px-4 py-3 text-left"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#B69640]">
                                  {addr.addressType || addr.label || 'Home'}
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-[13px] font-medium text-[#1A1A1A]">{addr.name}</p>
                              <p className="text-[12px] text-gray-600 mt-0.5 leading-relaxed">
                                {formatAddressLine(addr)}
                              </p>
                              {addr.phone && (
                                <p className="text-[12px] text-gray-500 mt-1">{addr.phone}</p>
                              )}
                            </div>
                          ))}
                          {addresses.length > 2 && (
                            <button
                              type="button"
                              onClick={() => switchTab('addresses')}
                              className="text-[12px] font-medium text-[#B69640] cursor-pointer"
                            >
                              View all {addresses.length} addresses →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ORDERS */}
              {activeTab === 'orders' && (
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 sm:px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">Saved Addresses</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Add, edit, or set a default delivery address</p>
                    </div>
                    {!showAddressForm && (
                      <button
                        type="button"
                        onClick={openNewAddress}
                        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640] cursor-pointer"
                      >
                        <FiPlus size={15} /> Add Address
                      </button>
                    )}
                  </div>

                  {showAddressForm && (
                    <form
                      onSubmit={saveAddress}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#1A1A1A]">
                          {editingAddressId ? 'Edit Address' : 'New Address'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddressId(null);
                          }}
                          className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 cursor-pointer"
                        >
                          <FiX size={16} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {['Home', 'Work', 'Other'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setAddressForm((p) => ({ ...p, addressType: t }))}
                            className={`h-9 px-3.5 rounded-lg text-[12px] font-medium border cursor-pointer ${
                              addressForm.addressType === t
                                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                : 'bg-white text-gray-600 border-gray-200'
                            }`}
                          >
                            {t === 'Home' ? <span className="inline-flex items-center gap-1"><FiHome size={12} /> Home</span> : t}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { key: 'name', label: 'Full Name *', placeholder: 'Receiver name' },
                          { key: 'phone', label: 'Phone *', placeholder: '10-digit mobile' },
                          { key: 'email', label: 'Email', placeholder: 'optional' },
                          { key: 'house', label: 'House / Flat', placeholder: 'Flat, floor, building' },
                          { key: 'street', label: 'Street / Area *', placeholder: 'Street, locality', full: true },
                          { key: 'landmark', label: 'Landmark', placeholder: 'Near…' },
                          { key: 'city', label: 'City *', placeholder: 'City' },
                          { key: 'state', label: 'State', placeholder: 'State' },
                          { key: 'pincode', label: 'Pincode *', placeholder: '6-digit PIN' },
                        ].map((f) => (
                          <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                            <label className="text-[12px] font-medium text-gray-600 block mb-1.5">{f.label}</label>
                            <input
                              value={addressForm[f.key]}
                              onChange={(e) => setAddressForm((p) => ({ ...p, [f.key]: e.target.value }))}
                              placeholder={f.placeholder}
                              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15"
                            />
                          </div>
                        ))}
                      </div>

                      <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))}
                          className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                        />
                        Set as default address
                      </label>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={addressSaving}
                          className="h-11 px-5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640] disabled:opacity-60 cursor-pointer"
                        >
                          {addressSaving ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddressId(null);
                          }}
                          className="h-11 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {!showAddressForm && addresses.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
                      <FiMapPin size={36} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-[#1A1A1A] mb-1">No saved addresses</p>
                      <p className="text-xs text-gray-500 mb-5 max-w-sm mx-auto">
                        Save your delivery address once — it will be ready at checkout.
                      </p>
                      <button
                        type="button"
                        onClick={openNewAddress}
                        className="inline-flex h-10 px-5 items-center gap-1.5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640] cursor-pointer"
                      >
                        <FiPlus size={15} /> Add Address
                      </button>
                    </div>
                  )}

                  {!showAddressForm &&
                    addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                          addr.isDefault ? 'border-[#C9A84C]/50' : 'border-gray-200'
                        }`}
                      >
                        <div className="px-4 sm:px-5 py-4 text-left">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[#B69640]">
                              <FiHome size={11} />
                              {addr.addressType || addr.label || 'Home'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[14px] font-semibold text-[#1A1A1A]">{addr.name || '—'}</p>
                          <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">{formatAddressLine(addr)}</p>
                          <p className="text-[12px] text-gray-500 mt-1.5">
                            {[addr.phone, addr.email].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 flex flex-wrap gap-2 bg-[#FAFAFA]">
                          <button
                            type="button"
                            onClick={() => openEditAddress(addr)}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 bg-white text-[12px] font-medium text-[#1A1A1A] cursor-pointer hover:border-[#C9A84C]/50"
                          >
                            <FiEdit2 size={12} /> Edit
                          </button>
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => makeDefaultAddress(addr._id)}
                              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 bg-white text-[12px] font-medium text-[#1A1A1A] cursor-pointer hover:border-[#C9A84C]/50"
                            >
                              <FiCheck size={12} /> Set Default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeAddress(addr._id)}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-red-100 bg-white text-[12px] font-medium text-red-600 cursor-pointer hover:bg-red-50"
                          >
                            <FiTrash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
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
