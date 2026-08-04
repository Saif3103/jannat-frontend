import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheck,
  FiPlus,
  FiMinus,
  FiTruck,
  FiShield,
  FiEdit2,
  FiTrash2,
  FiX,
  FiMapPin,
  FiPhone,
  FiMail,
  FiPackage,
  FiAward,
  FiHeart,
  FiLock,
} from 'react-icons/fi';
import { useAuthStore, useCartStore } from '../../store';
import api, { BASE_URL } from '../../api/axios';
import toast from 'react-hot-toast';

const PAYMENT_OPTIONS = [
  {
    id: 'COD',
    label: 'Cash on Delivery',
    desc: 'Pay only when your order is delivered.',
  },
  {
    id: 'BankTransfer',
    label: 'Bank Transfer',
    desc: 'After confirmation, our team will securely share official bank details for NEFT, RTGS, or IMPS.',
  },
  {
    id: 'PayAfterConfirm',
    label: 'Pay After Order Confirmation',
    desc: 'Place your order now. Our support team will contact you to verify and assist with payment.',
  },
  {
    id: 'DesignConsultation',
    label: 'Design Consultation',
    desc: 'Book a free consultation with our rug expert before making payment.',
  },
  {
    id: 'Showroom',
    label: 'Visit Our Showroom',
    desc: 'Reserve your rug online and complete your purchase at our showroom.',
  },
];

const TRUST = [
  { icon: FiAward, text: 'Handmade Luxury Rugs' },
  { icon: FiLock, text: 'Secure Order Processing' },
  { icon: FiCheck, text: 'Quality Checked' },
  { icon: FiHeart, text: 'Dedicated Customer Support' },
  { icon: FiPackage, text: 'Carefully Packed' },
  { icon: FiShield, text: 'Trusted by Customers' },
];

const emptyAddress = {
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
};

function imgUrl(url) {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400';
  if (typeof url === 'string' && url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
}

function loadAddresses(userId) {
  try {
    return JSON.parse(localStorage.getItem(`jannat_addresses_${userId}`) || '[]');
  } catch {
    return [];
  }
}

function saveAddresses(userId, list) {
  localStorage.setItem(`jannat_addresses_${userId}`, JSON.stringify(list));
}

/**
 * @param {{ variant?: 'modal' | 'page', onClose?: () => void }} props
 */
export default function CheckoutFlow({ variant = 'page', onClose }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, updateQuantity, clearCart } = useCartStore();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyAddress);
  const [contact, setContact] = useState({ phone: '', email: '' });
  const [delivery, setDelivery] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [notes, setNotes] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?._id) return;
    const list = loadAddresses(user._id);
    setAddresses(list);
    if (list.length) {
      setSelectedAddressId(list[0].id);
      setShowAddressForm(false);
      setContact({
        phone: list[0].phone || user.phone || '',
        email: list[0].email || user.email || '',
      });
    } else {
      setShowAddressForm(true);
      setForm({
        ...emptyAddress,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setContact({ phone: user.phone || '', email: user.email || '' });
    }
  }, [user]);

  const subtotal = useMemo(
    () => items.reduce((a, i) => a + (i.discountPrice || i.price || 0) * (i.quantity || 1), 0),
    [items]
  );

  const expressFee = delivery === 'express' ? 499 : 0;
  const baseShipping = subtotal > 5000 ? 0 : 299;
  const shipping = delivery === 'express' ? expressFee : baseShipping;

  const discount = useMemo(() => {
    if (!coupon) return 0;
    let d = Math.round((subtotal * (coupon.discountPercent || 0)) / 100);
    if (coupon.maxDiscount > 0) d = Math.min(d, coupon.maxDiscount);
    return d;
  }, [coupon, subtotal]);

  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * 0.05);
  const total = taxable + shipping + tax;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const persistAddresses = useCallback(
    (list) => {
      if (!user?._id) return;
      setAddresses(list);
      saveAddresses(user._id, list);
    },
    [user]
  );

  const saveAddressForm = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.street || !form.city || !form.pincode) {
      toast.error('Please fill required address fields');
      return;
    }
    const entry = {
      ...form,
      id: editingId || `addr_${Date.now()}`,
      email: form.email || contact.email || user?.email || '',
    };
    let next;
    if (editingId) {
      next = addresses.map((a) => (a.id === editingId ? entry : a));
    } else {
      next = [...addresses, entry];
    }
    persistAddresses(next);
    setSelectedAddressId(entry.id);
    setContact({ phone: entry.phone, email: entry.email });
    setShowAddressForm(false);
    setEditingId(null);
    setForm(emptyAddress);
    toast.success(editingId ? 'Address updated' : 'Address saved');
  };

  const editAddress = (addr) => {
    setEditingId(addr.id);
    setForm({ ...emptyAddress, ...addr });
    setShowAddressForm(true);
  };

  const deleteAddress = (id) => {
    const next = addresses.filter((a) => a.id !== id);
    persistAddresses(next);
    if (selectedAddressId === id) {
      setSelectedAddressId(next[0]?.id || null);
      if (!next.length) setShowAddressForm(true);
    }
  };

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    try {
      const { data } = await api.get('/offers');
      const offer = (data.offers || []).find(
        (o) => o.couponCode && o.couponCode.toUpperCase() === code && o.isActive
      );
      if (!offer) {
        setCoupon(null);
        setCouponMsg('Invalid or expired coupon code');
        return;
      }
      if (offer.minOrderAmount && subtotal < offer.minOrderAmount) {
        setCoupon(null);
        setCouponMsg(`Minimum order ₹${offer.minOrderAmount.toLocaleString('en-IN')} required`);
        return;
      }
      setCoupon(offer);
      setCouponMsg(`Coupon applied — ${offer.discountPercent}% off`);
    } catch {
      setCoupon(null);
      setCouponMsg('Could not validate coupon');
    }
  };

  const placeOrder = async () => {
    if (!items.length) {
      toast.error('Your cart is empty');
      return;
    }
    if (!selectedAddress && !showAddressForm) {
      toast.error('Please select a delivery address');
      return;
    }
    let address = selectedAddress;
    if (showAddressForm || !address) {
      toast.error('Please save your delivery address first');
      return;
    }
    if (!reviewed || !terms) {
      toast.error('Please confirm order review and accept Terms');
      return;
    }

    setLoading(true);
    try {
      const shippingAddress = {
        name: address.name,
        phone: contact.phone || address.phone,
        email: contact.email || address.email || user?.email || '',
        house: address.house || '',
        street: [address.house, address.street].filter(Boolean).join(', ') || address.street,
        landmark: address.landmark || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country || 'India',
        addressType: address.addressType || 'Home',
      };

      const orderData = {
        orderItems: items.map((i) => ({
          product: i._id,
          name: i.name,
          image: i.images?.[0],
          price: i.discountPrice || i.price,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        shippingAddress,
        paymentMethod,
        deliveryOption: delivery,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        discountAmount: discount,
        couponCode: coupon?.couponCode || '',
        totalPrice: total,
        notes,
      };

      const { data } = await api.post('/orders', orderData);
      clearCart();
      onClose?.();
      navigate('/order-success', { state: { order: data.order }, replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="text-center py-16 px-6">
        <p className="font-luxury text-2xl text-[#1A1A1A] mb-2">Your bag is empty</p>
        <p className="text-sm text-gray-500 mb-6">Add a rug to continue checkout.</p>
        <Link
          to="/shop"
          onClick={() => onClose?.()}
          className="inline-flex h-11 px-6 items-center rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const primaryItem = items[0];

  return (
    <div className={`text-left ${variant === 'page' ? 'max-w-5xl mx-auto' : ''}`}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#B69640] font-semibold mb-1">
              Secure checkout
            </p>
            <h2 className="font-luxury text-2xl sm:text-3xl text-[#1A1A1A]">
              Review Your Order
            </h2>
            <p className="text-sm text-gray-500 mt-1.5 max-w-md">
              Please review your order details before confirming your purchase.
            </p>
          </div>
          {variant === 'modal' && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] cursor-pointer shrink-0"
              aria-label="Close"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-8">
        <div className="space-y-5">
          {/* Product information */}
          <section className="rounded-3xl border border-black/[0.06] bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4">
              Product information
            </h3>
            <div className="space-y-4">
              {items.map((item) => {
                const unit = item.discountPrice || item.price || 0;
                return (
                  <div key={`${item._id}-${item.size}-${item.color}`} className="flex gap-4">
                    <img
                      src={imgUrl(item.images?.[0])}
                      alt={item.name}
                      className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl object-cover shrink-0 bg-[#FAF7F2]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-luxury text-lg sm:text-xl text-[#1A1A1A] leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#B69640] mt-1">
                        Collection: {item.category?.name || item.type || 'Jannat Rugs'}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] text-gray-600">
                        {item.material && (
                          <p>
                            <span className="text-gray-400">Material:</span> {item.material}
                          </p>
                        )}
                        {item.size && (
                          <p>
                            <span className="text-gray-400">Size:</span> {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p>
                            <span className="text-gray-400">Color:</span> {item.color}
                          </p>
                        )}
                        <p className="text-emerald-600 font-medium flex items-center gap-1">
                          <FiCheck size={12} /> In Stock
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 justify-between">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-9 bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item._id, item.size, item.color, Math.max(1, item.quantity - 1))
                            }
                            className="w-9 h-full flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item._id, item.size, item.color, item.quantity + 1)
                            }
                            className="w-9 h-full flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <p className="text-base font-bold text-[#1A1A1A]">
                          ₹{(unit * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-[12px]">
              <div>
                <p className="text-gray-400">Unit price</p>
                <p className="font-semibold text-[#1A1A1A]">
                  ₹{(primaryItem.discountPrice || primaryItem.price || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Shipping</p>
                <p className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-[#1A1A1A]'}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Estimated delivery</p>
                <p className="font-semibold text-[#1A1A1A]">
                  {delivery === 'express' ? '1–2 Business Days' : '4–7 Business Days'}
                </p>
              </div>
            </div>
          </section>

          {/* Delivery address */}
          <section className="rounded-3xl border border-black/[0.06] bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                Delivery address
              </h3>
              {!showAddressForm && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      ...emptyAddress,
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: contact.phone || '',
                    });
                    setShowAddressForm(true);
                  }}
                  className="text-xs font-semibold text-[#B69640] flex items-center gap-1 cursor-pointer"
                >
                  <FiPlus size={14} /> Add New Address
                </button>
              )}
            </div>

            {!showAddressForm && addresses.length > 0 && (
              <div className="space-y-2.5">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-2xl border p-3.5 transition-all cursor-pointer ${
                      selectedAddressId === addr.id
                        ? 'border-[#C9A84C] bg-[#FAF7F2] ring-1 ring-[#C9A84C]/40'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                    onClick={() => {
                      setSelectedAddressId(addr.id);
                      setContact({ phone: addr.phone, email: addr.email || user?.email || '' });
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span
                          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedAddressId === addr.id
                              ? 'border-[#C9A84C] bg-[#C9A84C]'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedAddressId === addr.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1A1A1A]">
                            {addr.name}{' '}
                            <span className="text-[10px] font-medium text-[#B69640] ml-1">
                              {addr.addressType || 'Home'}
                            </span>
                          </p>
                          <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">
                            {[addr.house, addr.street, addr.landmark, addr.city, addr.state, addr.pincode]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">{addr.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            editAddress(addr);
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-gray-400 hover:text-[#1A1A1A] cursor-pointer"
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAddress(addr.id);
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAddressForm && (
              <form onSubmit={saveAddressForm} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'name', label: 'Full Name', required: true },
                  { key: 'phone', label: 'Phone', required: true },
                  { key: 'email', label: 'Email', required: false, full: true },
                  { key: 'house', label: 'House Number', required: false },
                  { key: 'street', label: 'Street', required: true },
                  { key: 'landmark', label: 'Landmark', required: false, full: true },
                  { key: 'city', label: 'City', required: true },
                  { key: 'state', label: 'State', required: true },
                  { key: 'country', label: 'Country', required: false },
                  { key: 'pincode', label: 'Pincode', required: true },
                ].map((f) => (
                  <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                    <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                      {f.label}
                      {f.required && <span className="text-red-400"> *</span>}
                    </label>
                    <input
                      required={f.required}
                      value={form[f.key] || ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-medium text-gray-500 mb-1.5 block">
                    Address Type
                  </label>
                  <div className="flex gap-2">
                    {['Home', 'Office'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, addressType: t })}
                        className={`h-9 px-4 rounded-full text-xs font-semibold border cursor-pointer ${
                          form.addressType === t
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                            : 'bg-white text-gray-600 border-gray-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2 flex gap-2 pt-1">
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingId(null);
                      }}
                      className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold cursor-pointer"
                  >
                    {editingId ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Contact */}
          <section className="rounded-3xl border border-black/[0.06] bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4">
              Contact details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-500 mb-1 flex items-center gap-1.5">
                  <FiPhone size={12} /> Phone Number
                </label>
                <input
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 mb-1 flex items-center gap-1.5">
                  <FiMail size={12} /> Email Address
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>
          </section>

          {/* Delivery options */}
          <section className="rounded-3xl border border-black/[0.06] bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4">
              Delivery options
            </h3>
            <div className="space-y-2.5">
              {[
                {
                  id: 'standard',
                  title: 'Standard Delivery',
                  price: subtotal > 5000 ? 'FREE' : '₹299',
                  eta: '4–7 Days',
                },
                {
                  id: 'express',
                  title: 'Express Delivery',
                  price: '+₹499',
                  eta: '1–2 Days',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDelivery(opt.id)}
                  className={`w-full text-left rounded-2xl border p-4 flex items-center gap-3 transition-all cursor-pointer ${
                    delivery === opt.id
                      ? 'border-[#C9A84C] bg-[#FAF7F2]'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      delivery === opt.id ? 'border-[#C9A84C]' : 'border-gray-300'
                    }`}
                  >
                    {delivery === opt.id && (
                      <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                    )}
                  </span>
                  <FiTruck className="text-[#B69640] shrink-0" size={18} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A1A]">{opt.title}</p>
                    <p className="text-[11px] text-gray-500">Estimated: {opt.eta}</p>
                  </div>
                  <span className="text-sm font-bold text-[#1A1A1A]">{opt.price}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-3xl border border-black/[0.06] bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4">
              Payment options
            </h3>
            <div className="space-y-2.5">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                    paymentMethod === opt.id
                      ? 'border-[#C9A84C] bg-[#FAF7F2]'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === opt.id ? 'border-[#C9A84C]' : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === opt.id && (
                        <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A]">{opt.label}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{opt.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Coupon */}
          <section className="rounded-3xl border border-black/[0.06] bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-3">
              Coupon
            </h3>
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C] uppercase"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="h-11 px-5 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold cursor-pointer"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <p
                className={`text-xs mt-2 ${
                  coupon ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {couponMsg}
              </p>
            )}
          </section>

          {/* Special request */}
          <section className="rounded-3xl border border-black/[0.06] bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-3">
              Special request
            </h3>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Please call before delivery. Gift packing required. Deliver only after 5 PM."
              className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C] resize-none"
            />
          </section>

          {/* Trust */}
          <section className="rounded-3xl border border-[#C9A84C]/25 bg-gradient-to-br from-[#FAF7F2] to-white p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TRUST.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[11px] text-[#1A1A1A]/80">
                  <Icon className="text-[#B69640] shrink-0" size={14} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Checkboxes + actions (mobile) */}
          <section className="rounded-3xl border border-black/[0.06] bg-white/80 backdrop-blur-xl p-4 sm:p-5 space-y-3 lg:hidden">
            <label className="flex items-start gap-2.5 text-sm text-[#1A1A1A] cursor-pointer">
              <input
                type="checkbox"
                checked={reviewed}
                onChange={(e) => setReviewed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
              />
              I have reviewed my order details.
            </label>
            <label className="flex items-start gap-2.5 text-sm text-[#1A1A1A] cursor-pointer">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="text-[#B69640] underline" onClick={() => onClose?.()}>
                  Terms & Conditions
                </Link>
                .
              </span>
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={placeOrder}
              className="w-full h-12 rounded-xl bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm hover:bg-[#B69640] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Confirming…' : 'Confirm Order'}
            </button>
            <Link
              to="/shop"
              onClick={() => onClose?.()}
              className="w-full h-11 rounded-xl border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600"
            >
              Continue Shopping
            </Link>
          </section>
        </div>

        {/* Summary sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="rounded-3xl border border-black/[0.06] bg-white/90 backdrop-blur-xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            <h3 className="font-luxury text-xl text-[#1A1A1A] mb-4">Order Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-medium">−₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Tax (5%)</span>
                <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100 items-baseline">
                <span className="font-luxury text-lg text-[#1A1A1A]">Grand Total</span>
                <span className="font-luxury text-2xl text-[#1A1A1A]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="hidden lg:block space-y-3 mt-5 pt-4 border-t border-gray-100">
              <label className="flex items-start gap-2.5 text-[13px] text-[#1A1A1A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={reviewed}
                  onChange={(e) => setReviewed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                />
                I have reviewed my order details.
              </label>
              <label className="flex items-start gap-2.5 text-[13px] text-[#1A1A1A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#B69640] underline" onClick={() => onClose?.()}>
                    Terms & Conditions
                  </Link>
                  .
                </span>
              </label>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                onClick={placeOrder}
                className="w-full h-12 rounded-xl bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm hover:bg-[#B69640] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Confirming…' : 'Confirm Order'}
              </motion.button>
              <Link
                to="/shop"
                onClick={() => onClose?.()}
                className="w-full h-11 rounded-xl border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-[#FAF7F2] border border-[#C9A84C]/20 p-4 flex flex-wrap gap-2">
            {['Free Shipping*', '100% Handmade', 'Premium Quality', 'Secure Checkout'].map((b) => (
              <span
                key={b}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white border border-[#C9A84C]/25 text-[#1A1A1A]"
              >
                {b}
              </span>
            ))}
            <p className="w-full text-[10px] text-gray-400 mt-1">*On orders above ₹5,000 (standard)</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
