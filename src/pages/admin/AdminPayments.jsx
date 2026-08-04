import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api, { BASE_URL } from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';

function img(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
}

export default function AdminPayments() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('UnderReview');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/admin/all', {
        params: { paymentMethod: 'BankTransfer' },
      });
      setOrders(data.orders || []);
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'All') return orders;
    if (filter === 'PayAfter') {
      return orders.filter(() => false);
    }
    return orders.filter((o) => o.paymentStatus === filter || o.verificationStatus === filter);
  }, [orders, filter]);

  const [payAfter, setPayAfter] = useState([]);
  useEffect(() => {
    api
      .get('/orders/admin/all', { params: { paymentMethod: 'PayAfterConfirm' } })
      .then((r) => setPayAfter(r.data.orders || []))
      .catch(() => {});
  }, []);

  const act = async (id, action) => {
    try {
      await api.patch(`/orders/${id}/payment-status`, { action });
      toast.success(`Payment ${action}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success(`Status → ${status}`);
      const { data } = await api.get('/orders/admin/all', {
        params: { paymentMethod: 'PayAfterConfirm' },
      });
      setPayAfter(data.orders || []);
    } catch {
      toast.error('Status update failed');
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Payments | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <section>
          <h2 className="font-bold text-base mb-3">Bank transfers</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {['UnderReview', 'AwaitingProof', 'Approved', 'Rejected', 'RequestAgain', 'All'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`h-8 px-3 rounded-full text-[11px] font-semibold cursor-pointer ${
                  filter === f ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {loading ? (
              <p className="p-8 text-center text-gray-400 text-sm">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="p-8 text-center text-gray-400 text-sm">No payments</p>
            ) : (
              filtered.map((o) => (
                <div key={o._id} className="p-4 border-b border-gray-50 flex flex-col lg:flex-row gap-4 justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">
                      {o.orderIdDisplay || o.trackingNumber} · ₹{Number(o.totalPrice || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {o.user?.name} · Txn: {o.transactionId || '—'} · {o.paymentStatus} / {o.verificationStatus}
                    </p>
                    {o.paymentProof && (
                      <a
                        href={img(o.paymentProof)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2"
                      >
                        <img
                          src={img(o.paymentProof)}
                          alt="Proof"
                          className="h-20 rounded-lg border border-gray-100 object-cover"
                        />
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 items-start">
                    <button
                      type="button"
                      onClick={() => act(o._id, 'approve')}
                      className="h-9 px-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => act(o._id, 'reject')}
                      className="h-9 px-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => act(o._id, 'request_again')}
                      className="h-9 px-3 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold cursor-pointer"
                    >
                      Request Again
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="font-bold text-base mb-3">Pay after confirmation</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {payAfter.length === 0 ? (
              <p className="p-8 text-center text-gray-400 text-sm">No orders</p>
            ) : (
              payAfter.map((o) => (
                <div key={o._id} className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">
                      {o.orderIdDisplay} · {o.user?.name} · {o.user?.phone || o.shippingAddress?.phone}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: {o.orderStatus} · Payment: {o.paymentStatus}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Confirmed', 'Awaiting Payment', 'Payment Received', 'Shipped', 'Cancelled'].map(
                      (s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatus(o._id, s)}
                          className="h-8 px-2.5 rounded-lg text-[11px] border border-gray-200 cursor-pointer"
                        >
                          {s}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => act(o._id, 'mark_received')}
                      className="h-8 px-2.5 rounded-lg text-[11px] bg-[#C9A84C]/20 font-semibold cursor-pointer"
                    >
                      Mark Paid
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
