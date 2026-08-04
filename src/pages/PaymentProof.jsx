import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuthStore } from '../store';

export default function PaymentProof() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [order, setOrder] = useState(state?.order || null);
  const [bank, setBank] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [bankName, setBankName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }
    api.get('/orders/bank-details').then((r) => setBank(r.data.bank)).catch(() => {});
    if (!order) {
      api
        .get(`/orders/${id}`)
        .then((r) => setOrder(r.data.order))
        .catch(() => toast.error('Order not found'));
    }
  }, [id, user, navigate, order]);

  const submit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error('Enter transaction ID');
      return;
    }
    if (!file) {
      toast.error('Upload payment screenshot');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('transactionId', transactionId.trim());
      fd.append('bankName', bankName.trim());
      fd.append('paymentProof', file);
      const { data } = await api.post(`/orders/${id}/payment-proof`, fd);
      setOrder(data.order);
      setSubmitted(true);
      toast.success('Payment proof submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const displayId = order?.orderIdDisplay || order?.trackingNumber || id;

  return (
    <>
      <Helmet>
        <title>Bank Transfer | Jannat Rugs Co.</title>
      </Helmet>
      <div className="pt-24 pb-28 min-h-screen bg-[#FAF7F2]">
        <div className="max-w-xl mx-auto px-4 py-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#B69640] font-semibold mb-2">
            Bank transfer
          </p>
          <h1 className="font-luxury text-3xl text-[#1A1A1A] mb-2">Complete Your Payment</h1>
          <p className="text-sm text-gray-500 mb-8">
            Order <span className="font-semibold text-[#1A1A1A]">{displayId}</span>
          </p>

          {bank && (
            <div className="rounded-[24px] bg-white border border-black/[0.06] p-6 mb-6 space-y-3">
              <h2 className="font-semibold text-[#1A1A1A]">Official bank details</h2>
              <div className="text-sm space-y-2 text-gray-600">
                <p>
                  <span className="text-gray-400">Account name:</span> {bank.accountName}
                </p>
                <p>
                  <span className="text-gray-400">Account number:</span> {bank.accountNumber || '—'}
                </p>
                <p>
                  <span className="text-gray-400">IFSC:</span> {bank.ifsc || '—'}
                </p>
                <p>
                  <span className="text-gray-400">Bank:</span> {bank.bankName || '—'}
                </p>
                {bank.upi && (
                  <p>
                    <span className="text-gray-400">UPI:</span> {bank.upi}
                  </p>
                )}
                <p className="text-xs text-[#B69640] pt-2">{bank.note}</p>
                <p className="text-xs text-gray-400">
                  Use Order ID <strong>{displayId}</strong> as transfer reference.
                </p>
              </div>
            </div>
          )}

          {submitted ? (
            <div className="rounded-[24px] bg-white border border-black/[0.06] p-6 text-center space-y-4">
              <p className="font-luxury text-2xl text-[#1A1A1A]">Proof received</p>
              <p className="text-sm text-gray-500">
                Our team will verify your payment shortly. You will be notified once approved.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link
                  to="/order-success"
                  state={{ order }}
                  className="h-11 px-5 rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold inline-flex items-center justify-center"
                >
                  View confirmation
                </Link>
                <Link
                  to="/dashboard?tab=orders"
                  className="h-11 px-5 rounded-xl border border-gray-200 text-sm font-medium inline-flex items-center justify-center"
                >
                  My orders
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="rounded-[24px] bg-white border border-black/[0.06] p-6 space-y-4"
            >
              <h2 className="font-semibold text-[#1A1A1A]">Upload payment proof</h2>
              <div>
                <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Order ID
                </label>
                <input
                  value={displayId}
                  readOnly
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Transaction number *
                </label>
                <input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Bank name
                </label>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Payment screenshot *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Submitting…' : 'Submit proof'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
