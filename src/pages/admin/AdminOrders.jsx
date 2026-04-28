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
      <h1 className="font-luxury text-2xl text-white mb-6">Orders</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  {['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-amber-100/40 text-xs uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-amber-900/10">
                    {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-8 shimmer rounded" /></td>)}
                  </tr>
                )) : orders.map(order => (
                  <tr key={order._id} onClick={() => { setSelected(order); setNewStatus(order.orderStatus); }}
                    className={`border-b border-amber-900/10 cursor-pointer transition-colors ${selected?._id === order._id ? 'bg-amber-500/10' : 'hover:bg-amber-500/5'}`}>
                    <td className="px-4 py-3 text-amber-400 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3 text-amber-100/70">{order.user?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-amber-100">₹{order.totalPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-amber-100/50 text-xs">{order.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${STATUS_COLORS[order.orderStatus]}20`, color: STATUS_COLORS[order.orderStatus] }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-amber-100/40 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="glass-card rounded-2xl p-5">
          {selected ? (
            <div>
              <h3 className="font-luxury text-lg text-amber-400 mb-4">Order Details</h3>
              <div className="space-y-3 mb-5 text-sm">
                <div><span className="text-amber-100/40">Order ID:</span> <span className="text-amber-100">#{selected._id.slice(-8).toUpperCase()}</span></div>
                <div><span className="text-amber-100/40">Customer:</span> <span className="text-amber-100">{selected.user?.name}</span></div>
                <div><span className="text-amber-100/40">Email:</span> <span className="text-amber-100/70 text-xs">{selected.user?.email}</span></div>
                <div><span className="text-amber-100/40">Total:</span> <span className="text-amber-400 font-bold">₹{selected.totalPrice?.toLocaleString()}</span></div>
                <div><span className="text-amber-100/40">Tracking:</span> <span className="text-amber-400 text-xs font-mono">{selected.trackingNumber}</span></div>
                <div>
                  <span className="text-amber-100/40">Shipping To:</span>
                  <p className="text-amber-100/70 text-xs mt-1 leading-relaxed">
                    {selected.shippingAddress?.name}<br />
                    {selected.shippingAddress?.street}, {selected.shippingAddress?.city}<br />
                    {selected.shippingAddress?.state} - {selected.shippingAddress?.pincode}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs text-amber-100/40 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {selected.orderItems?.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs text-amber-100 truncate">{item.name}</p>
                        <p className="text-xs text-amber-100/40">×{item.quantity} • ₹{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-amber-100/40 uppercase tracking-wider">Update Status</p>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-luxury text-sm">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#1a1008' }}>{s}</option>)}
                </select>
                <button onClick={updateStatus} disabled={updating} className="btn-gold w-full py-2.5 text-sm">
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-amber-100/30 text-sm">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
