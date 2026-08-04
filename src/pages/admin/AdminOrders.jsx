import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiShoppingBag, FiX } from 'react-icons/fi';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
const STATUS_COLORS = {
  Pending: '#C9A84C',
  Confirmed: '#3b82f6',
  Processing: '#8b5cf6',
  Shipped: '#f97316',
  Delivered: '#22c55e',
  Cancelled: '#ef4444',
  Returned: '#6b7280',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/admin/all');
      setOrders(data.orders);
    } catch {} finally {
      setLoading(false);
    }
  };

  const selectOrder = (order) => {
    setSelected(order);
    setNewStatus(order.orderStatus);
  };

  const updateStatus = async () => {
    if (!newStatus || !selected) return;
    setUpdating(true);
    try {
      await api.put(`/orders/${selected._id}/status`, { status: newStatus });
      toast.success('Status updated!');
      load();
      setSelected(null);
    } catch {
      toast.error('Failed');
    } finally {
      setUpdating(false);
    }
  };

  const StatusPill = ({ status }) => (
    <span
      className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: `${STATUS_COLORS[status]}18`, color: STATUS_COLORS[status] }}
    >
      {status}
    </span>
  );

  const DetailPanel = ({ mobile = false }) => (
    selected ? (
      <div className={`space-y-5 ${mobile ? 'p-4' : ''}`}>
        {mobile && (
          <div className="flex items-center justify-between sticky top-0 bg-white pb-3 border-b border-gray-100 -mx-4 px-4 pt-1">
            <h3 className="font-bold text-base text-[#1A1A1A]">Order details</h3>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>
        )}
        {!mobile && (
          <h3 className="font-bold text-base text-[#1A1A1A] border-b border-gray-100 pb-3">Order details</h3>
        )}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-3"><span className="text-gray-400">Order ID</span><span className="font-bold text-[#1A1A1A]">#{selected._id.slice(-8).toUpperCase()}</span></div>
          <div className="flex justify-between gap-3"><span className="text-gray-400">Customer</span><span className="font-medium text-[#1A1A1A] text-right">{selected.user?.name}</span></div>
          <div className="flex justify-between gap-3"><span className="text-gray-400">Email</span><span className="text-gray-600 text-xs text-right break-all">{selected.user?.email}</span></div>
          <div className="flex justify-between gap-3"><span className="text-gray-400">Total</span><span className="text-[#1A1A1A] font-bold text-lg">₹{selected.totalPrice?.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between gap-3 items-center"><span className="text-gray-400">Tracking</span><span className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-0.5 rounded">{selected.trackingNumber || 'Pending'}</span></div>
          <div className="pt-1">
            <span className="text-gray-400 text-xs font-medium block mb-2">Shipping to</span>
            <div className="bg-gray-50 p-3 rounded-xl text-gray-600 text-xs leading-relaxed border border-gray-100 text-left">
              <p className="font-semibold text-[#1A1A1A] mb-1">{selected.shippingAddress?.name}</p>
              {selected.shippingAddress?.street}, {selected.shippingAddress?.city}<br />
              {selected.shippingAddress?.state} - {selected.shippingAddress?.pincode}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 mb-2">Items</p>
          <div className="space-y-2">
            {selected.orderItems?.map((item, i) => (
              <div key={i} className="flex gap-3 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs font-semibold text-[#1A1A1A] truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 space-y-3">
          <p className="text-xs font-medium text-gray-400">Update status</p>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm font-semibold text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#C9A84C]/30"
          >
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            type="button"
            onClick={updateStatus}
            disabled={updating}
            className="w-full bg-[#1A1A1A] text-white py-3 rounded-xl font-semibold text-sm hover:bg-black transition-all cursor-pointer disabled:opacity-60"
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    ) : (
      <div className="text-center py-16 px-4">
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <FiShoppingBag className="text-gray-300" size={22} />
        </div>
        <p className="text-gray-400 text-sm">Select an order to view details</p>
      </div>
    )
  );

  return (
    <AdminLayout>
      <Helmet><title>Orders | Admin</title></Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {/* Mobile cards */}
          <div className="lg:hidden space-y-2.5">
            {loading
              ? [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />)
              : orders.map((order) => (
                  <button
                    key={order._id}
                    type="button"
                    onClick={() => selectOrder(order)}
                    className={`w-full text-left bg-white border rounded-2xl p-4 shadow-sm transition-all cursor-pointer ${
                      selected?._id === order._id ? 'border-[#C9A84C] bg-[#FFFBF0]' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-sm font-bold text-[#1A1A1A]">#{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.user?.name || 'N/A'}</p>
                      </div>
                      <StatusPill status={order.orderStatus} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                      <span className="font-bold text-[#1A1A1A]">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                  </button>
                ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left px-4 py-3.5 text-gray-400 text-[11px] font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading
                    ? [...Array(6)].map((_, i) => (
                        <tr key={i}><td colSpan="6" className="px-4 py-4"><div className="h-8 bg-gray-50 rounded animate-pulse" /></td></tr>
                      ))
                    : orders.map((order) => (
                        <tr
                          key={order._id}
                          onClick={() => selectOrder(order)}
                          className={`cursor-pointer transition-colors ${selected?._id === order._id ? 'bg-[#FFFBF0]' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-3.5 text-[#1A1A1A] font-bold">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="px-4 py-3.5 text-gray-700 font-medium">{order.user?.name || 'N/A'}</td>
                          <td className="px-4 py-3.5 text-[#1A1A1A] font-bold">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3.5 text-gray-400 text-xs">{order.paymentMethod}</td>
                          <td className="px-4 py-3.5"><StatusPill status={order.orderStatus} /></td>
                          <td className="px-4 py-3.5 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Desktop detail */}
        <div className="hidden lg:block bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit sticky top-24">
          <DetailPanel />
        </div>
      </div>

      {/* Mobile detail sheet */}
      {selected && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto shadow-2xl">
            <DetailPanel mobile />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
