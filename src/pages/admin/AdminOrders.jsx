import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FiShoppingBag, FiX, FiSearch, FiPackage, FiTruck, FiCheckCircle,
  FiClock, FiMapPin, FiPhone, FiMail, FiCopy, FiRefreshCw, FiChevronRight
} from 'react-icons/fi';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

const STATUS_META = {
  Pending: { color: '#C9A84C', bg: '#FFF8E8', text: 'text-amber-700', chip: 'bg-amber-50 text-amber-700 border-amber-100' },
  Confirmed: { color: '#3b82f6', bg: '#EFF6FF', text: 'text-blue-700', chip: 'bg-blue-50 text-blue-700 border-blue-100' },
  Processing: { color: '#8b5cf6', bg: '#F5F3FF', text: 'text-violet-700', chip: 'bg-violet-50 text-violet-700 border-violet-100' },
  Shipped: { color: '#f97316', bg: '#FFF7ED', text: 'text-orange-700', chip: 'bg-orange-50 text-orange-700 border-orange-100' },
  Delivered: { color: '#16a34a', bg: '#F0FDF4', text: 'text-green-700', chip: 'bg-green-50 text-green-700 border-green-100' },
  Cancelled: { color: '#ef4444', bg: '#FEF2F2', text: 'text-red-700', chip: 'bg-red-50 text-red-700 border-red-100' },
  Returned: { color: '#6b7280', bg: '#F9FAFB', text: 'text-gray-600', chip: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const FLOW = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;
  return (
    <span className={`inline-flex items-center text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full border ${meta.chip}`}>
      {status}
    </span>
  );
}

function StatusTimeline({ status }) {
  if (status === 'Cancelled' || status === 'Returned') {
    return (
      <div className={`rounded-xl px-3 py-2.5 text-[12px] font-medium border ${STATUS_META[status]?.chip}`}>
        Order {status.toLowerCase()}
      </div>
    );
  }

  const current = FLOW.indexOf(status);
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {FLOW.map((step, i) => {
        const done = i <= current;
        const active = i === current;
        return (
          <div key={step} className="flex items-center gap-1 shrink-0">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                done
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-gray-300 border-gray-200'
              } ${active ? 'ring-2 ring-[#C9A84C]/40' : ''}`}
            >
              {done ? <FiCheckCircle size={12} /> : i + 1}
            </div>
            {i < FLOW.length - 1 && (
              <div className={`w-4 sm:w-6 h-0.5 rounded ${i < current ? 'bg-[#1A1A1A]' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (isMobile) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [selected]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/admin/all');
      setOrders(data.orders || []);
    } catch {
      toast.error('Could not load orders');
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => {
    const c = { All: orders.length, Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach((o) => {
      if (c[o.orderStatus] !== undefined) c[o.orderStatus] += 1;
      if (o.orderStatus === 'Confirmed') c.Processing += 1;
    });
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchFilter =
        filter === 'All' ||
        o.orderStatus === filter ||
        (filter === 'Processing' && (o.orderStatus === 'Processing' || o.orderStatus === 'Confirmed'));

      if (!matchFilter) return false;
      if (!q) return true;

      const id = o._id?.slice(-8)?.toLowerCase() || '';
      const name = o.user?.name?.toLowerCase() || '';
      const email = o.user?.email?.toLowerCase() || '';
      const phone = o.shippingAddress?.phone?.toLowerCase() || '';
      const track = o.trackingNumber?.toLowerCase() || '';
      return id.includes(q) || name.includes(q) || email.includes(q) || phone.includes(q) || track.includes(q);
    });
  }, [orders, search, filter]);

  const selectOrder = (order) => {
    setSelected(order);
    setNewStatus(order.orderStatus);
  };

  const updateStatus = async () => {
    if (!newStatus || !selected) return;
    if (newStatus === selected.orderStatus) {
      toast('Status is already up to date');
      return;
    }
    setUpdating(true);
    try {
      await api.put(`/orders/${selected._id}/status`, { status: newStatus });
      toast.success('Order status updated');
      const { data } = await api.get('/orders/admin/all');
      const next = data.orders || [];
      setOrders(next);
      const refreshed = next.find((o) => o._id === selected._id);
      if (refreshed) {
        setSelected(refreshed);
        setNewStatus(refreshed.orderStatus);
      } else {
        setSelected(null);
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const copyText = async (text, label = 'Copied') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error('Copy failed');
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const DetailPanel = ({ mobile = false }) => {
    if (!selected) {
      return (
        <div className="text-center py-16 px-4">
          <div className="w-14 h-14 bg-[#FAF7F2] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#C9A84C]/15">
            <FiPackage className="text-[#C9A84C]" size={22} />
          </div>
          <p className="text-[#1A1A1A] text-sm font-semibold">No order selected</p>
          <p className="text-gray-400 text-xs mt-1">Tap an order to manage status & shipping</p>
        </div>
      );
    }

    const addr = selected.shippingAddress || {};
    const items = selected.orderItems || [];

    return (
      <div className={`flex flex-col ${mobile ? 'min-h-0' : ''}`}>
        {mobile && (
          <div className="sticky top-0 z-10 bg-white px-4 pt-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-3" />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 text-left">
                <p className="text-[11px] text-gray-400 font-medium">Order</p>
                <h3 className="font-bold text-base text-[#1A1A1A] truncate">
                  #{selected._id.slice(-8).toUpperCase()}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer shrink-0"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        )}

        <div className={`space-y-5 ${mobile ? 'p-4 pb-28' : ''}`}>
          {!mobile && (
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <p className="text-[11px] text-gray-400 font-medium mb-0.5">Order details</p>
                <h3 className="font-bold text-lg text-[#1A1A1A]">
                  #{selected._id.slice(-8).toUpperCase()}
                </h3>
              </div>
              <StatusPill status={selected.orderStatus} />
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Progress</p>
            <StatusTimeline status={selected.orderStatus} />
            <p className="text-[11px] text-gray-400">
              Placed {formatDate(selected.createdAt)} · {formatTime(selected.createdAt)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#C9A84C]/10 text-left">
              <p className="text-[10px] text-gray-400 font-medium mb-1">Total</p>
              <p className="text-base font-bold text-[#1A1A1A]">
                ₹{Number(selected.totalPrice || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-left">
              <p className="text-[10px] text-gray-400 font-medium mb-1">Payment</p>
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">{selected.paymentMethod || '—'}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-3.5 space-y-2.5 text-left">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer</p>
              <button
                type="button"
                onClick={() => copyText(selected._id, 'Order ID copied')}
                className="text-[11px] font-medium text-[#B69640] flex items-center gap-1 cursor-pointer"
              >
                <FiCopy size={12} /> Copy ID
              </button>
            </div>
            <p className="text-sm font-semibold text-[#1A1A1A]">{selected.user?.name || addr.name || 'Guest'}</p>
            {selected.user?.email && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5 break-all">
                <FiMail size={12} className="shrink-0 text-gray-400" />
                {selected.user.email}
              </p>
            )}
            {addr.phone && (
              <a href={`tel:${addr.phone}`} className="text-xs text-[#1A1A1A] font-medium flex items-center gap-1.5">
                <FiPhone size={12} className="text-[#B69640]" />
                {addr.phone}
              </a>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-3.5 text-left">
            <div className="flex items-center gap-1.5 mb-2">
              <FiMapPin size={13} className="text-[#B69640]" />
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Shipping</p>
            </div>
            <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{addr.name || '—'}</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {[addr.street, addr.city, addr.state].filter(Boolean).join(', ')}
              {addr.pincode ? ` — ${addr.pincode}` : ''}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2 bg-blue-50 rounded-lg px-2.5 py-2 border border-blue-100">
              <div className="min-w-0">
                <p className="text-[10px] text-blue-500 font-medium">Tracking</p>
                <p className="text-xs font-semibold text-blue-700 truncate">
                  {selected.trackingNumber || 'Not assigned yet'}
                </p>
              </div>
              {selected.trackingNumber && (
                <button
                  type="button"
                  onClick={() => copyText(selected.trackingNumber, 'Tracking copied')}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shrink-0 cursor-pointer"
                >
                  <FiCopy size={13} />
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Items ({items.length})
            </p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-3 items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=100'}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-semibold text-[#1A1A1A] line-clamp-2">{item.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Qty {item.quantity}
                      {item.size ? ` · ${item.size}` : ''}
                      {item.color ? ` · ${item.color}` : ''}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-[#1A1A1A] shrink-0">
                    ₹{Number(item.price || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={`pt-1 space-y-3 ${mobile ? '' : 'border-t border-gray-100 pt-4'}`}>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Update status</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewStatus(s)}
                  className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                    newStatus === s
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#C9A84C]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {!mobile && (
              <button
                type="button"
                onClick={updateStatus}
                disabled={updating || newStatus === selected.orderStatus}
                className="w-full bg-[#1A1A1A] text-white py-3 rounded-xl font-semibold text-sm hover:bg-black transition-all cursor-pointer disabled:opacity-50"
              >
                {updating ? 'Updating…' : 'Save status'}
              </button>
            )}
          </div>
        </div>

        {mobile && (
          <div className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-100 p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={updateStatus}
              disabled={updating || newStatus === selected.orderStatus}
              className="w-full h-12 bg-[#1A1A1A] text-white rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50"
            >
              {updating ? 'Updating…' : newStatus === selected.orderStatus ? 'Status up to date' : `Mark as ${newStatus}`}
            </button>
          </div>
        )}
      </div>
    );
  };

  const filterTabs = [
    { key: 'All', label: 'All', icon: FiShoppingBag },
    { key: 'Pending', label: 'Pending', icon: FiClock },
    { key: 'Processing', label: 'Active', icon: FiPackage },
    { key: 'Shipped', label: 'Shipped', icon: FiTruck },
    { key: 'Delivered', label: 'Done', icon: FiCheckCircle },
    { key: 'Cancelled', label: 'Cancelled', icon: FiX },
  ];

  return (
    <AdminLayout>
      <Helmet><title>Orders | Admin</title></Helmet>

      <div className="space-y-4 sm:space-y-5">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-left">
            <p className="text-sm text-gray-500">
              {loading ? 'Loading…' : `${orders.length} order${orders.length === 1 ? '' : 's'} total`}
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer self-start sm:self-auto"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: 'Pending', value: counts.Pending, color: '#C9A84C', bg: '#FFF8E8' },
            { label: 'Active', value: counts.Processing, color: '#8b5cf6', bg: '#F5F3FF' },
            { label: 'Shipped', value: counts.Shipped, color: '#f97316', bg: '#FFF7ED' },
            { label: 'Delivered', value: counts.Delivered, color: '#16a34a', bg: '#F0FDF4' },
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setFilter(s.label === 'Active' ? 'Processing' : s.label)}
              className="bg-white border border-gray-100 rounded-2xl p-3.5 sm:p-4 text-left shadow-sm hover:border-[#C9A84C]/40 transition-all cursor-pointer"
            >
              <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-1 tabular-nums">{s.value}</p>
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: `${s.color}22` }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: orders.length ? `${Math.min(100, (s.value / orders.length) * 100)}%` : '0%',
                    background: s.color,
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Search + filters */}
        <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, order ID…"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-[#1A1A1A] placeholder:text-gray-400 outline-none focus:bg-white focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/15"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {filterTabs.map(({ key, label, icon: Icon }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-[12px] font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon size={13} />
                  {label}
                  <span className={`text-[10px] ${active ? 'text-white/70' : 'text-gray-400'}`}>
                    {counts[key] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* List */}
          <div className="lg:col-span-3 space-y-2.5">
            {/* Mobile cards */}
            <div className="lg:hidden space-y-2.5">
              {loading
                ? [...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-gray-100" />
                  ))
                : filtered.length === 0
                  ? (
                    <div className="bg-white border border-gray-100 rounded-2xl py-14 text-center">
                      <FiShoppingBag className="mx-auto text-gray-300 mb-2" size={28} />
                      <p className="text-sm font-medium text-gray-500">No orders found</p>
                      <p className="text-xs text-gray-400 mt-1">Try another filter or search</p>
                    </div>
                  )
                  : filtered.map((order) => {
                      const thumb = order.orderItems?.[0]?.image;
                      return (
                        <button
                          key={order._id}
                          type="button"
                          onClick={() => selectOrder(order)}
                          className={`w-full text-left bg-white border rounded-2xl p-3.5 shadow-sm transition-all cursor-pointer ${
                            selected?._id === order._id
                              ? 'border-[#C9A84C] ring-2 ring-[#C9A84C]/15'
                              : 'border-gray-100 active:scale-[0.99]'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-gray-100">
                              {thumb ? (
                                <img src={thumb} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#C9A84C]">
                                  <FiPackage size={20} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-[#1A1A1A]">
                                    #{order._id.slice(-6).toUpperCase()}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {order.user?.name || order.shippingAddress?.name || 'Guest'}
                                  </p>
                                </div>
                                <StatusPill status={order.orderStatus} />
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[11px] text-gray-400">
                                  {formatDate(order.createdAt)} · {order.orderItems?.length || 0} item
                                  {(order.orderItems?.length || 0) === 1 ? '' : 's'}
                                </span>
                                <span className="flex items-center gap-1 text-sm font-bold text-[#1A1A1A]">
                                  ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                                  <FiChevronRight size={14} className="text-gray-300" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                        <th key={h} className="text-left px-4 py-3.5 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading
                      ? [...Array(6)].map((_, i) => (
                          <tr key={i}>
                            <td colSpan="6" className="px-4 py-4">
                              <div className="h-10 bg-gray-50 rounded-lg animate-pulse" />
                            </td>
                          </tr>
                        ))
                      : filtered.length === 0
                        ? (
                          <tr>
                            <td colSpan="6" className="px-4 py-16 text-center text-sm text-gray-400">
                              No orders match your filters
                            </td>
                          </tr>
                        )
                        : filtered.map((order) => {
                            const thumb = order.orderItems?.[0]?.image;
                            return (
                              <tr
                                key={order._id}
                                onClick={() => selectOrder(order)}
                                className={`cursor-pointer transition-colors ${
                                  selected?._id === order._id ? 'bg-[#FFFBF0]' : 'hover:bg-gray-50'
                                }`}
                              >
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#FAF7F2] border border-gray-100 shrink-0">
                                      {thumb ? (
                                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#C9A84C]">
                                          <FiPackage size={14} />
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-bold text-[#1A1A1A]">#{order._id.slice(-6).toUpperCase()}</p>
                                      <p className="text-[11px] text-gray-400">{order.paymentMethod || '—'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <p className="font-medium text-[#1A1A1A]">{order.user?.name || 'N/A'}</p>
                                  <p className="text-[11px] text-gray-400 truncate max-w-[160px]">{order.user?.email}</p>
                                </td>
                                <td className="px-4 py-3.5 text-gray-500 text-xs">
                                  {order.orderItems?.length || 0}
                                </td>
                                <td className="px-4 py-3.5 font-bold text-[#1A1A1A] tabular-nums">
                                  ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                                </td>
                                <td className="px-4 py-3.5">
                                  <StatusPill status={order.orderStatus} />
                                </td>
                                <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                                  {formatDate(order.createdAt)}
                                </td>
                              </tr>
                            );
                          })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Desktop detail */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <DetailPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile detail sheet */}
      {selected && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 border-0 cursor-pointer"
            onClick={() => setSelected(null)}
            aria-label="Close overlay"
          />
          <div className="relative bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <DetailPanel mobile />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
