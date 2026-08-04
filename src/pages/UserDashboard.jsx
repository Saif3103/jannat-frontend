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
    { id: 'profile', label: 'Profile Information', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'addresses', label: 'Manage Addresses', icon: FiMapPin },
    { id: 'security', label: 'Password', icon: FiLock },
  ];

  return (
    <>
      <Helmet>
        <title>Account | Jannat Rugs Co.</title>
      </Helmet>

      <div className="pt-20 sm:pt-24 min-h-screen bg-[#f1f3f6] text-left pb-20">
        <Container className="py-5 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
            {/* Sidebar — Flipkart style */}
            <aside className="lg:col-span-3 bg-white shadow-sm">
              <div className="flex items-center gap-3.5 px-4 py-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#2874f0] text-white flex items-center justify-center font-semibold text-lg shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 leading-none mb-1">Hello,</p>
                  <p className="text-base font-semibold text-[#212121] truncate leading-tight">
                    {user?.name || 'User'}
                  </p>
                </div>
              </div>

              <nav className="py-2">
                <p className="px-4 pt-2 pb-1.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  My Orders
                </p>
                {TABS.filter((t) => t.id === 'orders').map(({ id, label, icon: Icon }) => {
                  const active = activeTab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => switchTab(id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-[15px] cursor-pointer border-l-4 ${
                        active
                          ? 'bg-[#f5f7ff] text-[#2874f0] font-medium border-[#2874f0]'
                          : 'text-[#212121] border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-[#2874f0]' : 'text-gray-500'} />
                      {label}
                      <FiChevronRight size={16} className="ml-auto text-gray-300" />
                    </button>
                  );
                })}

                <p className="px-4 pt-3 pb-1.5 text-xs font-semibold tracking-wide text-gray-400 uppercase border-t border-gray-100 mt-1">
                  Account Settings
                </p>
                {TABS.filter((t) => t.id !== 'orders').map(({ id, label, icon: Icon }) => {
                  const active = activeTab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => switchTab(id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-[15px] cursor-pointer border-l-4 ${
                        active
                          ? 'bg-[#f5f7ff] text-[#2874f0] font-medium border-[#2874f0]'
                          : 'text-[#212121] border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-[#2874f0]' : 'text-gray-500'} />
                      {label}
                      <FiChevronRight size={16} className="ml-auto text-gray-300" />
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main content */}
            <div className="lg:col-span-9 min-w-0 space-y-3">
              {/* PROFILE */}
              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {/* Personal Information */}
                  <div className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-xl font-medium text-[#212121]">
                        Personal Information
                      </h2>
                      <button
                        type="button"
                        onClick={() => setEditMode(!editMode)}
                        className="text-[15px] font-medium text-[#2874f0] hover:underline cursor-pointer"
                      >
                        {editMode ? 'Cancel' : 'Edit'}
                      </button>
                    </div>

                    <div className="px-5 sm:px-6 py-5 sm:py-6">
                      {editMode ? (
                        <form onSubmit={updateProfile} className="max-w-xl space-y-5">
                          <div>
                            <label className="text-sm text-gray-500 block mb-2">Full Name</label>
                            <input
                              value={formData.name}
                              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                              className="w-full h-12 border border-gray-300 px-3.5 text-[15px] text-[#212121] outline-none focus:border-[#2874f0]"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-500 block mb-2">Mobile Number</label>
                            <input
                              value={formData.phone}
                              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                              className="w-full h-12 border border-gray-300 px-3.5 text-[15px] text-[#212121] outline-none focus:border-[#2874f0]"
                              placeholder="Enter mobile number"
                            />
                          </div>
                          <div className="flex gap-3 pt-1">
                            <button
                              type="submit"
                              className="h-11 px-8 bg-[#2874f0] text-white text-[15px] font-medium hover:bg-[#1f63d4] cursor-pointer"
                            >
                              SAVE
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditMode(false);
                                setFormData({ name: user?.name || '', phone: user?.phone || '' });
                              }}
                              className="h-11 px-5 text-[15px] font-medium text-gray-600 hover:text-[#212121] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                          <div>
                            <p className="text-sm text-gray-500 mb-1.5">Full Name</p>
                            <p className="text-[16px] text-[#212121] font-medium break-words">
                              {user?.name || '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1.5">Email Address</p>
                            <p className="text-[16px] text-[#212121] font-medium break-all">
                              {user?.email || '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1.5">Mobile Number</p>
                            <p className="text-[16px] text-[#212121] font-medium">
                              {user?.phone || (
                                <button
                                  type="button"
                                  onClick={() => setEditMode(true)}
                                  className="text-[#2874f0] font-medium cursor-pointer"
                                >
                                  + Add number
                                </button>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email card (Flipkart-like separate row feel) */}
                  {!editMode && (
                    <div className="bg-white shadow-sm px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-[15px] text-[#212121]">{user?.email}</p>
                      </div>
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-100">
                        Verified
                      </span>
                    </div>
                  )}

                  {/* Quick shortcuts */}
                  <div className="bg-white shadow-sm">
                    <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-xl font-medium text-[#212121]">Shortcuts</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
                      {[
                        { id: 'orders', label: 'Orders', icon: FiPackage, sub: 'Track & manage' },
                        { id: 'wishlist', label: 'Wishlist', icon: FiHeart, sub: 'Saved items' },
                        { id: 'addresses', label: 'Addresses', icon: FiMapPin, sub: 'Delivery info' },
                        { id: 'security', label: 'Password', icon: FiLock, sub: 'Login & security' },
                      ].map(({ id, label, icon: Icon, sub }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => switchTab(id)}
                          className="flex flex-col items-start gap-2 px-5 py-5 text-left hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <Icon size={22} className="text-[#2874f0]" />
                          <div>
                            <p className="text-[15px] font-medium text-[#212121]">{label}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manage Addresses preview */}
                  <div className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-xl font-medium text-[#212121]">
                        Manage Addresses
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          switchTab('addresses');
                          setTimeout(openNewAddress, 0);
                        }}
                        className="text-[15px] font-medium text-[#2874f0] hover:underline cursor-pointer"
                      >
                        + Add New
                      </button>
                    </div>

                    <div className="px-5 sm:px-6 py-5">
                      {addresses.length === 0 ? (
                        <div className="py-8 text-center">
                          <FiMapPin size={32} className="text-gray-300 mx-auto mb-3" />
                          <p className="text-[15px] text-[#212121] font-medium mb-1">
                            No addresses found
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            Add an address for faster checkout
                          </p>
                          <button
                            type="button"
                            onClick={() => switchTab('addresses')}
                            className="h-10 px-5 border border-[#2874f0] text-[#2874f0] text-[14px] font-medium hover:bg-[#f5f7ff] cursor-pointer"
                          >
                            ADD ADDRESS
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {addresses.slice(0, 2).map((addr) => (
                            <div
                              key={addr._id}
                              className="border border-gray-200 p-4 sm:p-5 text-left"
                            >
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-[11px] font-semibold tracking-wide uppercase text-gray-600 border border-gray-300 px-2 py-0.5">
                                  {addr.addressType || addr.label || 'Home'}
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[11px] font-medium text-[#2874f0]">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-[15px] font-medium text-[#212121]">
                                {addr.name}
                                {addr.phone ? (
                                  <span className="font-normal text-gray-600">
                                    {' '}
                                    · {addr.phone}
                                  </span>
                                ) : null}
                              </p>
                              <p className="text-[14px] text-gray-600 mt-1.5 leading-relaxed max-w-2xl">
                                {formatAddressLine(addr)}
                              </p>
                              <div className="flex gap-4 mt-3 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    switchTab('addresses');
                                    setTimeout(() => openEditAddress(addr), 0);
                                  }}
                                  className="text-[14px] font-medium text-[#2874f0] cursor-pointer"
                                >
                                  EDIT
                                </button>
                                <button
                                  type="button"
                                  onClick={() => switchTab('addresses')}
                                  className="text-[14px] font-medium text-gray-500 hover:text-[#212121] cursor-pointer"
                                >
                                  VIEW ALL
                                </button>
                              </div>
                            </div>
                          ))}
                          {addresses.length > 2 && (
                            <button
                              type="button"
                              onClick={() => switchTab('addresses')}
                              className="text-[14px] font-medium text-[#2874f0] cursor-pointer"
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="bg-white shadow-sm px-5 sm:px-6 py-4">
                    <h2 className="text-lg sm:text-xl font-medium text-[#212121]">My Wishlist</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  {loading ? (
                    <div className="bg-white shadow-sm p-12 text-center text-[15px] text-gray-400">
                      Loading wishlist...
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="bg-white shadow-sm p-12 text-center">
                      <FiHeart size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-[16px] font-medium text-[#212121] mb-1">Your wishlist is empty</p>
                      <p className="text-sm text-gray-500 mb-5">Save items you like while shopping</p>
                      <Link
                        to="/shop"
                        className="inline-flex h-11 px-6 items-center bg-[#2874f0] text-white text-[15px] font-medium hover:bg-[#1f63d4]"
                      >
                        CONTINUE SHOPPING
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {wishlist.map((p) => (
                        <Link
                          key={p._id}
                          to={`/product/${p._id}`}
                          className="bg-white shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow"
                        >
                          <img
                            src={getImageUrl(p.images?.[0])}
                            alt={p.name}
                            className="w-24 h-24 object-cover border border-gray-100 shrink-0"
                          />
                          <div className="min-w-0 text-left flex flex-col justify-center">
                            <p className="text-[15px] text-[#212121] line-clamp-2 mb-1.5">{p.name}</p>
                            <p className="text-[16px] font-semibold text-[#212121]">
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="bg-white shadow-sm px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg sm:text-xl font-medium text-[#212121]">Manage Addresses</h2>
                      <p className="text-sm text-gray-500 mt-1">{addresses.length} saved</p>
                    </div>
                    {!showAddressForm && (
                      <button
                        type="button"
                        onClick={openNewAddress}
                        className="h-10 px-4 border border-[#2874f0] text-[#2874f0] text-[14px] font-medium hover:bg-[#f5f7ff] cursor-pointer"
                      >
                        + ADD A NEW ADDRESS
                      </button>
                    )}
                  </div>

                  {showAddressForm && (
                    <form
                      onSubmit={saveAddress}
                      className="bg-white shadow-sm p-5 sm:p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-medium text-[#212121]">
                          {editingAddressId ? 'Edit Address' : 'Add a new address'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddressId(null);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#212121] cursor-pointer"
                        >
                          <FiX size={18} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {['Home', 'Work', 'Other'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setAddressForm((p) => ({ ...p, addressType: t }))}
                            className={`h-9 px-4 text-[13px] font-medium border cursor-pointer ${
                              addressForm.addressType === t
                                ? 'border-[#2874f0] text-[#2874f0] bg-[#f5f7ff]'
                                : 'border-gray-300 text-gray-600'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: 'name', label: 'Name *', placeholder: 'Full name' },
                          { key: 'phone', label: '10-digit mobile number *', placeholder: 'Mobile number' },
                          { key: 'email', label: 'Email', placeholder: 'Email (optional)' },
                          { key: 'house', label: 'Flat, House no., Building *', placeholder: 'House / Flat' },
                          { key: 'street', label: 'Area, Street, Sector *', placeholder: 'Street / Area', full: true },
                          { key: 'landmark', label: 'Landmark', placeholder: 'Nearby landmark' },
                          { key: 'city', label: 'City / District *', placeholder: 'City' },
                          { key: 'state', label: 'State', placeholder: 'State' },
                          { key: 'pincode', label: 'Pincode *', placeholder: 'Pincode' },
                        ].map((f) => (
                          <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                            <label className="text-sm text-gray-500 block mb-1.5">{f.label}</label>
                            <input
                              value={addressForm[f.key]}
                              onChange={(e) => setAddressForm((p) => ({ ...p, [f.key]: e.target.value }))}
                              placeholder={f.placeholder}
                              className="w-full h-11 border border-gray-300 px-3 text-[15px] outline-none focus:border-[#2874f0]"
                            />
                          </div>
                        ))}
                      </div>

                      <label className="flex items-center gap-2.5 text-[14px] text-[#212121] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))}
                          className="w-4 h-4 accent-[#2874f0]"
                        />
                        Make this my default address
                      </label>

                      <div className="flex flex-wrap gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={addressSaving}
                          className="h-11 px-8 bg-[#2874f0] text-white text-[15px] font-medium hover:bg-[#1f63d4] disabled:opacity-60 cursor-pointer"
                        >
                          {addressSaving ? 'SAVING...' : 'SAVE'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddressId(null);
                          }}
                          className="h-11 px-5 text-[15px] font-medium text-gray-600 cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  )}

                  {!showAddressForm && addresses.length === 0 && (
                    <div className="bg-white shadow-sm p-12 text-center">
                      <FiMapPin size={36} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-[16px] font-medium text-[#212121] mb-1">No addresses available</p>
                      <p className="text-sm text-gray-500 mb-5">
                        Add an address to make checkout faster
                      </p>
                      <button
                        type="button"
                        onClick={openNewAddress}
                        className="h-11 px-6 bg-[#2874f0] text-white text-[15px] font-medium hover:bg-[#1f63d4] cursor-pointer"
                      >
                        ADD ADDRESS
                      </button>
                    </div>
                  )}

                  {!showAddressForm &&
                    addresses.map((addr) => (
                      <div key={addr._id} className="bg-white shadow-sm">
                        <div className="px-5 sm:px-6 py-5 text-left">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[11px] font-semibold tracking-wide uppercase text-gray-600 border border-gray-300 px-2 py-0.5">
                              {addr.addressType || addr.label || 'Home'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[12px] font-medium text-[#2874f0]">Default</span>
                            )}
                          </div>
                          <p className="text-[15px] font-medium text-[#212121]">
                            {addr.name || '—'}
                            {addr.phone ? (
                              <span className="font-normal text-gray-600"> · {addr.phone}</span>
                            ) : null}
                          </p>
                          <p className="text-[14px] text-gray-600 mt-1.5 leading-relaxed max-w-2xl">
                            {formatAddressLine(addr)}
                          </p>
                        </div>
                        <div className="px-5 sm:px-6 py-3 border-t border-gray-100 flex flex-wrap gap-5">
                          <button
                            type="button"
                            onClick={() => openEditAddress(addr)}
                            className="text-[14px] font-medium text-[#2874f0] cursor-pointer"
                          >
                            EDIT
                          </button>
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => makeDefaultAddress(addr._id)}
                              className="text-[14px] font-medium text-gray-600 hover:text-[#212121] cursor-pointer"
                            >
                              SET AS DEFAULT
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeAddress(addr._id)}
                            className="text-[14px] font-medium text-gray-600 hover:text-red-600 cursor-pointer"
                          >
                            REMOVE
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
      className="bg-white shadow-sm max-w-xl"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-medium text-[#212121]">Change Password</h2>
      </div>
      <form onSubmit={submit} className="px-5 sm:px-6 py-5 sm:py-6 space-y-5">
        {[
          { key: 'oldPassword', label: 'Current Password' },
          { key: 'newPassword', label: 'New Password' },
          { key: 'confirm', label: 'Confirm New Password' },
        ].map((f) => (
          <div key={f.key}>
            <label className="text-sm text-gray-500 block mb-2">{f.label}</label>
            <input
              type="password"
              value={form[f.key]}
              onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
              className="w-full h-12 border border-gray-300 px-3.5 text-[15px] text-[#212121] outline-none focus:border-[#2874f0]"
              required
              minLength={6}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="h-11 px-8 bg-[#2874f0] text-white text-[15px] font-medium hover:bg-[#1f63d4] disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'UPDATING...' : 'SAVE'}
        </button>
      </form>
    </motion.div>
  );
}
