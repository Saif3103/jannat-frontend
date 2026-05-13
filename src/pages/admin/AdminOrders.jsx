import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
const STATUS_COLORS = { Pending: '#C9A84C', Confirmed: '#3b82f6', Processing: '#8b5cf6', Shipped: '#f97316', Delivered: '#22c55e', Cancelled: '#ef4444', Returned: '#6b7280' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/orders/admin/all'); setOrders(data.orders); }
    catch {} finally { setLoading(false); }
  };

  const updateStatus = async () => {
    if (!newStatus || !selected) return;
    setUpdating(true);
    try {
      await api.put(`/orders/${selected._id}/status`, { status: newStatus });
      toast.success('Status updated!');
      load(); setSelected(null);
    } catch { toast.error('Failed'); } finally { setUpdating(false); }
  };

  return (
    <AdminLayout>
      <Helmet><title>Orders | Admin</title></Helmet>
      <h1 className="font-bold text-2xl text-[#222] mb-6">Orders</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-4 text-gray-400 text-[11px] uppercase tracking-wider font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan="6" className="px-4 py-4"><div className="h-8 shimmer rounded" /></td></tr>
                )) : orders.map(order => (
                  <tr key={order._id} onClick={() => { setSelected(order); setNewStatus(order.orderStatus); }}
                    className={`cursor-pointer transition-colors ${selected?._id === order._id ? 'bg-[#FFF9E6]' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-4 text-[#1A1A1A] font-bold">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-4 text-gray-700 font-medium">{order.user?.name || 'N/A'}</td>
                    <td className="px-4 py-4 text-[#222] font-bold">₹{order.totalPrice?.toLocaleString()}</td>
                    <td className="px-4 py-4 text-gray-400 text-xs">{order.paymentMethod}</td>
                    <td className="px-4 py-4">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-tight" style={{ background: `${STATUS_COLORS[order.orderStatus]}15`, color: STATUS_COLORS[order.orderStatus] }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {selected ? (
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-[#222] border-b border-gray-100 pb-4">Order Details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center"><span className="text-gray-400 font-medium">Order ID</span> <span className="text-[#222] font-bold">#{selected._id.slice(-8).toUpperCase()}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 font-medium">Customer</span> <span className="text-[#222] font-medium">{selected.user?.name}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 font-medium">Email</span> <span className="text-gray-600 text-xs">{selected.user?.email}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 font-medium">Total</span> <span className="text-[#1A1A1A] font-bold text-lg">₹{selected.totalPrice?.toLocaleString()}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 font-medium">Tracking</span> <span className="text-blue-600 text-xs font-mono font-bold bg-blue-50 px-2 py-0.5 rounded">{selected.trackingNumber || 'PENDING'}</span></div>
                <div className="pt-2">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest block mb-2">Shipping To</span>
                  <div className="bg-gray-50 p-3 rounded-xl text-gray-600 text-xs leading-relaxed border border-gray-100">
                    <p className="font-bold text-[#222] mb-1">{selected.shippingAddress?.name}</p>
                    {selected.shippingAddress?.street}, {selected.shippingAddress?.city}<br />
                    {selected.shippingAddress?.state} - {selected.shippingAddress?.pincode}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Order Items</p>
                <div className="space-y-3">
                  {selected.orderItems?.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#222] truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">{item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update Status</p>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm font-bold text-[#222] outline-none focus:ring-1 focus:ring-[#C9A84C]/50">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={updateStatus} disabled={updating} className="w-full bg-[#222] text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-sm">
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag className="text-gray-300" size={24} />
              </div>
              <p className="text-gray-400 text-sm font-medium">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
